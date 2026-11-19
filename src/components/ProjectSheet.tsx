import { useEffect, useRef } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Tx from "./Tx";
import Media, { mediaIn } from "./Media";
import { NumberFlipSegment } from "../lib/numberflip";
import { Lang, allProjects, slug, ui } from "../content";

type Props = { project: (typeof allProjects)[number]; lang: Lang };

// ease-out: starts fast so open and close react instantly, then settles
const ease = [0.16, 1, 0.3, 1] as const;
const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Full-screen sheet for any project. It lives at /proyecto/:slug, so Back, links and reloads all work.
export default function ProjectSheet({ project, lang }: Props) {
    const navigate = useNavigate(), location = useLocation();
    const closeBtn = useRef<HTMLButtonElement>(null);
    const n = allProjects.length, i = allProjects.indexOf(project);
    const to = (d: number) => `/proyecto/${slug(allProjects[(i + d + n) % n].name)}`;

    // opened from the page: pop our own history entry; landed here from a shared link: go home without leaving the site
    const { fromPage, dir = 1 } = (location.state as { fromPage?: boolean; dir?: number } | null) ?? {};
    // replace: stepping through projects should not pile up history, Back still closes the sheet
    const step = (d: number) => navigate(to(d), { replace: true, state: { fromPage, dir: d } });
    const close = () => (fromPage ? navigate(-1) : navigate("/", { replace: true }));

    // the first content rises in under the wipe; later ones (Previous / Next) slide in from the side
    const first = useRef(true);
    useEffect(() => { closeBtn.current?.focus(); first.current = false; }, []);
    useEffect(() => {
        const key = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
        };
        addEventListener("keydown", key);
        return () => removeEventListener("keydown", key);
    });

    const rise1 = first.current ? rise : undefined;
    return (
        <motion.div
            className="sheet" role="dialog" aria-modal="true" aria-label={project.name} data-lenis-prevent
            initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.45, ease } }}
            transition={{ duration: 0.6, ease }}
        >
            <div className="sheet-top">
                <span className="sheet-count" aria-label={`${i + 1} / ${n}`}>
                    <NumberFlipSegment itemArray={digits} number={Math.floor((i + 1) / 10)} />
                    <NumberFlipSegment itemArray={digits} number={(i + 1) % 10} />
                    <span>&nbsp;/ {String(n).padStart(2, "0")}</span>
                </span>
                <button ref={closeBtn} className="sheet-close" onClick={close}><Tx>{ui.close[lang]}</Tx><span aria-hidden>×</span></button>
            </div>

            {/* only the content swaps: the old one blurs out to one side, the new one blurs in from the other */}
            <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.div key={project.name} className="sheet-body"
                    custom={dir} initial="out" animate="in" exit="leave" variants={first.current ? opening : swap}>
                    <motion.div className={project.dir ? "media gallery" : "media"} variants={rise1}>
                        {/* the main photo or clip first, then the rest of the project's folder */}
                        {project.dir && [...(project.src ? [project.src] : []), ...mediaIn(project.dir).filter(k => k !== project.src)].map(k =>
                            <Media key={k} src={k} sizes="60vw" alt={k === project.src ? project.media?.[lang] : ""} />)}
                    </motion.div>
                    <div>
                        <motion.h2 variants={rise1}>{project.name}</motion.h2>
                        {project.role && <motion.p className="role" variants={rise1}><Tx>{project.role[lang]}</Tx></motion.p>}
                        <motion.p variants={rise1}><Tx>{project.text[lang]}</Tx></motion.p>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="sheet-foot">
                <nav>
                    <Link className="go" to={to(-1)} replace state={{ fromPage, dir: -1 }}>← <Tx>{ui.prev[lang]}</Tx></Link>
                    <Link className="go" to={to(1)} replace state={{ fromPage, dir: 1 }}><Tx>{ui.next[lang]}</Tx> →</Link>
                    {project.href && <a className="go" href={project.href} target="_blank" rel="noreferrer"><Tx>{ui.visit[lang]}</Tx> ↗</a>}
                </nav>
            </div>
        </motion.div>
    );
}

const blur = (x: number) => ({ opacity: 0, x, filter: "blur(10px)" });
const opening: Variants = { in: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } };
// dir 1 (next): old leaves left, new enters from the right; dir -1 (previous): the mirror
const swap: Variants = {
    out: (dir: number) => blur(48 * dir),
    in: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } },
    leave: (dir: number) => ({ ...blur(-48 * dir), transition: { duration: 0.14, ease: [0.7, 0, 0.84, 0] } }),
};
const rise: Variants = { out: { opacity: 0, y: 40 }, in: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };
