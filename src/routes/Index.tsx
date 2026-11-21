import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { useMedia } from "react-use";
import { AnimatePresence } from "motion/react";
import { Link, useMatch } from "react-router-dom";
import Nav from "../components/Nav";
import ProjectSheet from "../components/ProjectSheet";
import Preloader from "../components/Preloader";
import Tx from "../components/Tx";
import Media from "../components/Media";
import { Lang, about, allProjects, awards, collage, links, projects, slug, smallProjects, ui } from "../content";

export default function Index() {
    const [lang, setLang] = useState<Lang>("es");
    const horizontal = useMedia("(min-width: 900px)");
    const reduce = useMedia("(prefers-reduced-motion: reduce)");
    const [progress, setProgress] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const sheetSlug = useMatch("/proyecto/:slug")?.params.slug;
    const sheet = allProjects.find(p => slug(p.name) === sheetSlug);
    const track = useRef<HTMLElement>(null), hero = useRef<HTMLElement>(null), lenis = useRef<Lenis>();

    useEffect(() => { document.documentElement.lang = lang; }, [lang]);

    // smooth scroll: sideways on desktop, down on mobile; the page leans with scroll speed
    useEffect(() => {
        document.documentElement.classList.toggle("horizontal", horizontal);
        const l = new Lenis({ orientation: horizontal ? "horizontal" : "vertical", gestureOrientation: "both", lerp: 0.1 });
        lenis.current = l;
        const skew = horizontal ? "skewX" : "skewY", max = horizontal ? 6 : 1.5;
        l.on("scroll", ({ scroll, velocity, progress }: Lenis) => {
            document.documentElement.style.setProperty("--scroll", String(progress));
            hero.current?.style.setProperty("--p", String(Math.min(1, scroll / (horizontal ? innerWidth : innerHeight))));
            if (!reduce) gsap.to(track.current, { [skew]: gsap.utils.clamp(-max, max, velocity * 0.15), duration: 0.5, ease: "power3.out" });
        });
        const raf = (t: number) => l.raf(t * 1000);
        gsap.ticker.add(raf);
        return () => { gsap.ticker.remove(raf); l.destroy(); gsap.set(track.current, { clearProps: "transform" }); };
    }, [horizontal, reduce]);

    // no page scrolling under the preloader or an open project sheet
    useEffect(() => { if (revealed && !sheet) lenis.current?.start(); else lenis.current?.stop(); }, [revealed, sheet, horizontal, reduce]);

    // collage pieces float at different depths under the pointer
    useEffect(() => {
        if (reduce) return;
        const move = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            hero.current?.style.setProperty("--mx", String(e.clientX / innerWidth - 0.5));
            hero.current?.style.setProperty("--my", String(e.clientY / innerHeight - 0.5));
        };
        addEventListener("pointermove", move);
        return () => removeEventListener("pointermove", move);
    }, [reduce]);

    // after the wipe, the pieces settle and the name rises
    useEffect(() => {
        if (!revealed || reduce) return;
        const ctx = gsap.context(() => {
            gsap.from(".tile", { scale: 1.3, rotation: i => (i % 2 ? 12 : -12), duration: 1, stagger: 0.05, ease: "back.out(1.7)" });
            gsap.from(".line > span", { yPercent: 110, duration: 0.9, stagger: 0.08, delay: 0.15, ease: "power4.out" });
        }, hero);
        return () => ctx.revert();
    }, [revealed, reduce]);

    return (
        <>
            <Preloader reduce={reduce} onProgress={setProgress} onDone={() => setRevealed(true)} />

            <Nav lang={lang} setLang={setLang} lenis={lenis} revealed={revealed} />
            <AnimatePresence>{sheet && <ProjectSheet key="sheet" project={sheet} lang={lang} />}</AnimatePresence>

            <main ref={track} className="track">
                <section ref={hero} id="top" className="hero panel">
                    {collage.map((t, i) => (
                        <div key={i} className={t.accent ? "tile accent" : "tile"} style={{
                            "--x": t.x, "--y": t.y, "--w": t.w, "--h": t.h, "--r": t.r, "--d": t.d,
                            "--dx": t.x + t.w / 2 - 50, "--dy": t.y + t.h / 2 - 50,
                            // pieces fade in behind the preloader as the count rises
                            opacity: revealed || progress >= ((i + 1) / collage.length) * 85 ? 1 : 0,
                        } as React.CSSProperties}>{t.src ? <Media className="fill" src={t.src} alt={t.label[lang]} sizes="30vw" /> : <Tx>{t.label[lang]}</Tx>}</div>
                    ))}
                    <div className="name">
                        <h1><span className="line"><span>Ramón</span></span><span className="line"><span>de León</span></span></h1>
                        <p><Tx>{ui.tagline[lang]}</Tx></p>
                    </div>
                </section>

                <section className="about panel" data-nav="about">
                    <img src="/pfp.jpg" alt="Ramón de León" />
                    <div>
                        <h2><Tx>{ui.about[lang]}</Tx></h2>
                        <p><Tx>{about[lang]}</Tx></p>
                    </div>
                </section>

                <section className="awards panel" data-nav="awards">
                    <h2><Tx>{ui.awards[lang]}</Tx></h2>
                    <ul>{awards.map(a => <li key={a.year + a.name.en}><span><Tx>{a.name[lang]}</Tx></span><span>{a.year}</span></li>)}</ul>
                </section>

                {projects.map(p => (
                    <section key={p.name} className="project panel" data-nav="work">
                        <div className="media">{p.src ? <Media className={p.contain ? "fill contain" : "fill"} src={p.src} alt={p.media[lang]} /> : <Tx>{p.media[lang]}</Tx>}</div>
                        <div className="info">
                            <h2>{p.name}</h2>
                            {p.role && <p className="role"><Tx>{p.role[lang]}</Tx></p>}
                            <p><Tx>{p.text[lang]}</Tx></p>
                            <div className="actions">
                                <Link className="go" to={`/proyecto/${slug(p.name)}`} state={{ fromPage: true }}><Tx>{ui.info[lang]}</Tx> +</Link>
                                {p.href && <a className="go" href={p.href} target="_blank" rel="noreferrer"><Tx>{ui.visit[lang]}</Tx> ↗</a>}
                            </div>
                        </div>
                    </section>
                ))}

                <section className="strip" data-nav="work">
                    <h2><Tx>{ui.more[lang]}</Tx></h2>
                    <ul>
                        {smallProjects.map(p => (
                            <li key={p.name}>
                                <Link className="card" to={`/proyecto/${slug(p.name)}`} state={{ fromPage: true }}>
                                    <div className="media">{p.src && <Media className={p.contain ? "fill contain" : "fill"} src={p.src} alt={p.name} sizes="300px" />}</div>
                                    <h3>{p.name}</h3>
                                    <p><Tx>{p.text[lang]}</Tx></p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="contact panel" data-nav="contact">
                    <h2><Tx>{ui.contact[lang]}</Tx></h2>
                    <ul>{links.map(l => <li key={l.href}><a href={l.href} target="_blank" rel="noreferrer">{l.name}</a></li>)}</ul>
                </section>
            </main>
        </>
    );
}
