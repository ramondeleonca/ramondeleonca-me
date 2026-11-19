import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Props = { reduce: boolean; onProgress: (pct: number) => void; onDone: () => void };

// Counts to 100 while the page loads, then an orange wipe reveals what assembled behind it.
export default function Preloader({ reduce, onProgress, onDone }: Props) {
    const root = useRef<HTMLDivElement>(null), wipe = useRef<HTMLDivElement>(null), num = useRef<HTMLParagraphElement>(null);
    const [pct, setPct] = useState(0);
    const [gone, setGone] = useState(false);
    const cb = useRef({ onProgress, onDone });
    cb.current = { onProgress, onDone };

    useEffect(() => {
        // already loaded (cache, back/forward): no fake count, show the page now
        if (document.readyState === "complete" && document.fonts.status === "loaded") { cb.current.onProgress(100); cb.current.onDone(); setGone(true); return; }
        let ready = false, p = 0, raf = 0;
        const loaded = new Promise(r => document.readyState === "complete" ? r(0) : addEventListener("load", () => r(0), { once: true }));
        Promise.all([loaded, document.fonts.ready]).then(() => { ready = true; });

        const reveal = () => {
            if (reduce) { cb.current.onDone(); setGone(true); return; }
            gsap.timeline({ onComplete: () => setGone(true) })
                .to(wipe.current, { scaleX: 1, duration: 0.4, ease: "power3.in" })
                .set([root.current, num.current], { background: "transparent", opacity: (i: number) => (i ? 0 : 1) })
                .add(() => cb.current.onDone())
                .to(wipe.current, { scaleX: 0, transformOrigin: "right", duration: 0.5, ease: "power3.out" });
        };

        const tick = () => {
            // creep toward 90 while loading; once loaded, rush to 100 so the count never holds the page back
            p = reduce && ready ? 100 : p + ((ready ? 100 : 90) - p) * (ready ? 0.25 : 0.035);
            if (ready && p > 99.5) p = 100;
            setPct(p); cb.current.onProgress(p);
            if (p < 100) raf = requestAnimationFrame(tick); else reveal();
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [reduce]);

    if (gone) return null;
    return (
        <div ref={root} className="preloader" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
            <p ref={num} className="pct" style={{ transform: `translateY(calc((-100svh + 100% + 48px) * ${pct / 100}))` }}>{Math.round(pct)}%</p>
            <div ref={wipe} className="wipe" />
        </div>
    );
}
