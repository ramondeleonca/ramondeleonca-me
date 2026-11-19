import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type Lenis from "lenis";
import Tx from "./Tx";
import { Lang, ui } from "../content";

type Props = { lang: Lang; setLang: (l: Lang) => void; lenis: React.MutableRefObject<Lenis | undefined>; revealed: boolean };

// each link scrolls to the sections tagged with its data-nav
// same order as the page
const items = [["about", ui.about], ["awards", ui.awards], ["work", ui.work], ["contact", ui.contactNav]] as const;
const spring = { type: "spring", stiffness: 500, damping: 38 } as const;

// Text that rolls up to a copy of itself on hover.
const Roll = ({ text }: { text: string }) => <span className="roll" data-text={text}><Tx>{text}</Tx></span>;

export default function Nav({ lang, setLang, lenis, revealed }: Props) {
    const [active, setActive] = useState<string>();
    const [open, setOpen] = useState(false);

    // the section crossing the middle of the screen is the active one (works sideways and downwards)
    useEffect(() => {
        const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive((e.target as HTMLElement).dataset.nav)),
            { rootMargin: "-49.9% -49.9% -49.9% -49.9%" });
        document.querySelectorAll("[data-nav], #top").forEach(s => io.observe(s));
        return () => io.disconnect();
    }, []);

    // the page stays put behind the open mobile menu
    useEffect(() => { if (open) { lenis.current?.stop(); return () => lenis.current?.start(); } }, [open, lenis]);

    const go = (id?: string) => {
        setOpen(false);
        lenis.current?.scrollTo(id ? (document.querySelector(`[data-nav="${id}"]`) as HTMLElement) : 0, { duration: 1.4 });
    };

    return (
        <motion.header className="bar" initial={false} animate={revealed ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: revealed ? 0.4 : 0 }}>
            <a className="pill brand" href="/" onClick={e => { e.preventDefault(); go(); }}>
                <Roll text="Ramón de León" />
            </a>

            <nav className="pill links" aria-label={ui.menu[lang]}>
                {items.map(([id, label]) => (
                    <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined} onClick={e => { e.preventDefault(); go(id); }}>
                        {active === id && <motion.span className="hl" layoutId="nav-hl" transition={spring} />}
                        <Roll text={label[lang]} />
                    </a>
                ))}
                <span className="progress" aria-hidden />
            </nav>

            <div className="pill langs">
                {(["es", "en"] as Lang[]).map(l => (
                    <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
                        {lang === l && <motion.span className="hl" layoutId="lang-hl" transition={spring} />}
                        <span>{l.toUpperCase()}</span>
                    </button>
                ))}
            </div>

            <button className="pill burger" aria-expanded={open} aria-label={ui.menu[lang]} onClick={() => setOpen(o => !o)}><i /><i /></button>

            <AnimatePresence>
                {open && (
                    <motion.nav className="drawer" aria-label={ui.menu[lang]} initial="out" animate="in" exit="out"
                        variants={{ out: { clipPath: "inset(0 0 100% 0)" }, in: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], staggerChildren: 0.05, delayChildren: 0.15 } } }}>
                        {items.map(([id, label], i) => (
                            // like a macOS menu: the chosen item blinks (main.tsx), then the menu closes
                            <motion.a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); setTimeout(() => go(id), 260); }}
                                variants={{ out: { y: "100%", opacity: 0 }, in: { y: 0, opacity: 1 } }}>
                                <small>0{i + 1}</small><Tx>{label[lang]}</Tx>
                            </motion.a>
                        ))}
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
