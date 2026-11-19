// Compresses the raw files in media/ into public/media/ at build time and writes src/media.json.
// Images -> WebP at 1600 and 800 px wide. Videos -> short muted loops as WebM (VP9) plus an MP4 (H.264)
// fallback for older iOS Safari, and a WebP poster. Outputs newer than their source are skipped, so only
// the first run is slow.
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);
const SRC = "media", OUT = "public/media", MANIFEST = "src/media.json";
const IMG = /\.(jpe?g|png|heic|tiff?|webp)$/i, VID = /\.(mp4|mov|m4v|webm|gif)$/i; // GIFs become clips: far smaller
const MAX_CLIP = 10; // seconds kept from each video
// clips that read better sped up than cut (the whole scroll of a website, for example)
const SPEED = { "soulofmexico/vid/soulofmexico-scroll": 6 };

const walk = d => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);
// a clone without `git lfs pull` has tiny text pointers instead of the real files: keep what was compressed before
const pointer = f => statSync(f).size < 1024 && readFileSync(f, "utf8").startsWith("version https://git-lfs");
const fresh = (out, src) => existsSync(out) && (pointer(src) || statSync(out).mtimeMs >= statSync(src).mtimeMs);
const ff = args => run("ffmpeg", ["-y", "-loglevel", "error", ...args], { maxBuffer: 1 << 28 });
// write to a temp name and rename when done: a run that is cut off, or two runs at once
// (Vite restarting while it encodes), never leave a half-written file that looks fresh
const atomic = async (file, write) => {
    const tmp = file.replace(/(\.\w+)$/, `.tmp${Math.random().toString(36).slice(2)}$1`);
    try { await write(tmp); renameSync(tmp, file); } finally { rmSync(tmp, { force: true }); }
};

// Vite restarts in the same process when its config changes: queue the runs instead of overlapping them
// (a failed run already showed its error; the next one still runs)
export default function media() { return globalThis.__mediaRun = (globalThis.__mediaRun ?? Promise.resolve()).catch(() => {}).then(compress); }

async function compress() {
    // deploys (Vercel sets CI) ship the committed public/media and src/media.json: no ffmpeg or LFS needed there
    if (!existsSync(SRC) || process.env.CI) return;
    const files = walk(SRC).filter(f => IMG.test(f) || VID.test(f))
        // full-page screenshots are thousands of px tall: useless as a card or gallery image
        .filter(f => !/-full\.\w+$/.test(f));
    const manifest = {};

    // images: libvips is fast and multi-threaded, a few at a time is enough
    const imgs = files.filter(f => IMG.test(f));
    for (let i = 0; i < imgs.length; i += 4) await Promise.all(imgs.slice(i, i + 4).map(async f => {
        const key = relative(SRC, f).slice(0, -extname(f).length), out = join(OUT, key);
        if (pointer(f) && !existsSync(`${out}.webp`)) return; // a pointer that was never compressed
        mkdirSync(dirname(out), { recursive: true });
        // .rotate() applies the camera's EXIF orientation before resizing
        const img = () => sharp(f).rotate();
        for (const [w, suffix] of [[1600, ""], [800, "-sm"]])
            if (!fresh(`${out}${suffix}.webp`, f)) await atomic(`${out}${suffix}.webp`, t => img().resize({ width: w, withoutEnlargement: true }).webp({ quality: 70, effort: 6 }).toFile(t));
        const { width, height } = await sharp(`${out}.webp`).metadata();
        manifest[key] = { type: "image", w: width, h: height };
    }));

    // videos: one at a time, ffmpeg already uses every core
    for (const f of files.filter(f => VID.test(f))) {
        const key = relative(SRC, f).slice(0, -extname(f).length), out = join(OUT, key);
        mkdirSync(dirname(out), { recursive: true });
        const speed = SPEED[key] ?? 1;
        const trim = ["-t", String(MAX_CLIP * speed)];
        const vf = `${speed > 1 ? `setpts=PTS/${speed},` : ""}scale='min(1280,iw)':-2,fps=30`;
        // the .webp poster is written last, so it is what marks the clip as done
        if (pointer(f) && !existsSync(`${out}.webp`)) continue; // a pointer that was never compressed
        if (!fresh(`${out}.webp`, f)) {
            console.log(`media: encoding ${key}`);
            await atomic(`${out}.webm`, t => ff(["-i", f, ...trim, "-vf", vf, "-an", "-c:v", "libvpx-vp9", "-crf", "40", "-b:v", "0", "-pix_fmt", "yuv420p", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", t]));
            await atomic(`${out}.mp4`, t => ff(["-i", f, ...trim, "-vf", vf, "-an", "-c:v", "libx264", "-crf", "28", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", t]));
            const { stdout } = await run("ffmpeg", ["-loglevel", "error", "-i", `${out}.mp4`, "-frames:v", "1", "-f", "image2pipe", "-c:v", "png", "-"], { encoding: "buffer", maxBuffer: 1 << 28 });
            await atomic(`${out}.webp`, t => sharp(stdout).webp({ quality: 70, effort: 6 }).toFile(t));
        }
        const { width, height } = await sharp(`${out}.webp`).metadata();
        manifest[key] = { type: "video", w: width, h: height };
    }

    const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
    writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");
}

if (import.meta.url === `file://${process.argv[1]}`) await media();
