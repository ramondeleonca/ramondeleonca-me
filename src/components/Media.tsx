import { useEffect, useRef } from "react";
import manifest from "../media.json";

export type MediaKey = keyof typeof manifest;
type Props = { src: string; alt?: string; sizes?: string; className?: string };

// An image or muted looping clip compressed at build time by scripts/media.mjs.
// Clips only download and play while on screen, so a page full of them stays light.
export default function Media({ src, alt = "", sizes = "(min-width: 900px) 50vw, 100vw", className }: Props) {
    const m = manifest[src as MediaKey], url = `/media/${src}`;
    const video = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const v = video.current;
        if (!v) return;
        const io = new IntersectionObserver(([e]) => e.isIntersecting ? v.play().catch(() => {}) : v.pause());
        io.observe(v);
        return () => io.disconnect();
    }, [src]);

    if (!m) return null;
    return m.type === "video"
        ? <video ref={video} className={className} muted loop playsInline preload="none" poster={`${url}.webp`} width={m.w} height={m.h} aria-label={alt || undefined}>
            <source src={`${url}.webm`} type='video/webm; codecs="vp9"' />
            <source src={`${url}.mp4`} type="video/mp4" />
        </video>
        : <img className={className} src={`${url}.webp`} srcSet={`${url}-sm.webp 800w, ${url}.webp ${m.w}w`} sizes={sizes}
            width={m.w} height={m.h} alt={alt} loading="lazy" decoding="async" />;
}

// every compressed file under a folder, e.g. all of "mechaleague/"
export const mediaIn = (dir: string) => Object.keys(manifest).filter(k => k.startsWith(dir));
