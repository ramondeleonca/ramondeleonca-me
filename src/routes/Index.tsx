import { ReactLenis, ReactLenisOptions, useLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import NumberFlip from '../lib/numberflip';
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import useLoaded from "../hooks/useLoaded";
import useWindowMouse from "../hooks/useWIndowMouse";
import { usePageLeave, useWindowSize } from "react-use";
import styles from "./index.module.scss";
import ReactCurvedText from "react-curved-text";
import WithHover from "../components/WithHover";

export default function Index() {
    // GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Refs
    const lenisRef = useRef<typeof ReactLenis>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    // Preloader
    const preloaderRef = useRef<HTMLDivElement>(null);
    const [loadedPercent, setLoadedPercent] = useState(0);
    const loaded = useLoaded(1000);

    // Mouse handlers
    const kMaxMouseMovement = 25;
    const kMouseMovementWeight = 0.05;
    const {width: windowWidth, height: windowHeight} = useWindowSize();
    const { x: mouseX, y: mouseY } = useWindowMouse({ x: windowWidth / 2, y: windowHeight / 2 });
    const [mouseOutside, setMouseOutside] = useState(false);
    usePageLeave(() => setMouseOutside(true));

    useEffect(() => {
        setMouseOutside(false);
        const ctx = gsap.context(() => {
            gsap.to(".mouse-transform-wrapper", {
                duration: 0.5,
                x: gsap.utils.clamp(-kMaxMouseMovement, kMaxMouseMovement, (mouseX - (windowWidth / 2)) * kMouseMovementWeight),
                y: gsap.utils.clamp(-kMaxMouseMovement, kMaxMouseMovement, (mouseY - (windowHeight / 2)) * kMouseMovementWeight)
            });

            gsap.to(cursorRef.current, {
                duration: 0.75,
                x: mouseX,
                y: mouseY,
                scale: 1,
                ease: "power3.out"
            });
        });
        return () => ctx.kill();
    }, [mouseX, mouseY, windowWidth, windowHeight]);

    useEffect(() => {
        if (mouseOutside) gsap.to(cursorRef.current, { duration: 0.5, opacity: 0, scale: 0 });
        else gsap.to(cursorRef.current, { duration: 0.5, opacity: 1, scale: 1 });
    }, [mouseOutside]);

    // Links
    const [hoveredLink, setHoveredLink] = useState<HTMLAnchorElement | null>(null);
    useEffect(() => {
        const aElements = document.querySelectorAll("a");
        aElements.forEach(a => {
            a.addEventListener("mouseenter", () => setHoveredLink(a));
            a.addEventListener("mouseleave", () => setHoveredLink(null));
        });
        return () => {
            aElements.forEach(a => {
                a.removeEventListener("mouseenter", () => setHoveredLink(a));
                a.removeEventListener("mouseleave", () => setHoveredLink(null));
            });
        }
    }, []);
    
    // Preloader
    useEffect(() => {
        if (loaded) {
            setLoadedPercent(100);
            const ctx = gsap.context(() => {
                const tl = gsap.timeline();
                tl.to(preloaderRef.current, { duration: 1, x: "150vw", skewX: -30, ease: "power3.in" }, 0);
                tl.to(".preloader-white", { duration: 1, x: "-50%", ease: "power3.in" }, 0);
                tl.to(".preloader-white", { duration: 1, x: 0, ease: "power3.in" }, 1);
                tl.set(preloaderRef.current, { display: "none", pointerEvents: "none", skewX: 0 }, 1);
                tl.fromTo("#name-letter", { translateY: "110%" }, { translateY: "0%", duration: 1, stagger: 0.025, ease: "power3.out" }, 0.75);
                tl.fromTo("#pfp", { translateY: "100%", scale: 0 }, { translateY: "0%", scale: 1, duration: 0.75, stagger: 0.025, ease: "power3.out" }, 0.75);
                tl.fromTo("#name-link", { translateY: "100%", scale: 0 }, { translateY: "0%", scale: 1, duration: 0.75, stagger: 0.025, ease: "power3.out" }, 0.75);
                tl.play();
            });
            return () => ctx.revert();
        } else {
            const interval = setInterval(() => {
                if (loadedPercent < 87) setLoadedPercent(val => gsap.utils.clamp(0, 87, val + Math.floor(Math.random() * 20)));
                else clearInterval(interval);
            }, 500);
            return () => clearInterval(interval);
        }
    }, [loaded]);

    // Scrolling framework (Lenis) update with gsap ticker
    useEffect(() => {
        const update = (time: number) => lenisRef.current?.raf(time * 1000);
        gsap.ticker.add(update);
        return () => gsap.ticker.remove(update);
    }, []);

    // When scrolling, update page skew
    const kSkew = 0.1;
    const kMaxSkew = 30;
    useLenis(lenis => {
        gsap.to(".skew-wrapper", {
            duration: 0.5,
            skewX: gsap.utils.clamp(-kMaxSkew, kMaxSkew, kSkew * lenis.velocity),
            ease: "power3.out"
        });
    });

    return (
        // <MacScrollbar>
            <ReactLenis ref={lenisRef} root options={{lerp: 0.05, smoothTouch: false, orientation: "horizontal", gestureOrientation: "both"} as ReactLenisOptions}>

                <div ref={preloaderRef} className="fixed w-full h-full top-0 left-0 z-[100000000]">
                    <div className="preloader-white absolute w-full h-full top-0 left-0 bg-white z-10"></div>
                    <div className="absolute w-full h-full top-0 left-0 bg-black z-20">
                        <div className="loaded-percent-container left-1 bottom-0 absolute transition-transform duration-700 ease-out-cubic" style={{ transform: `translateY(calc(calc(-100vh + 100%) * ${loadedPercent / 100}))` }}>
                            <NumberFlip className="text-white" number={loadedPercent} suffix="%"></NumberFlip>
                        </div>
                    </div>
                </div>

                <div ref={cursorRef} className={`fixed rounded-full ease-out-back ${!hoveredLink ? "w-8 -m-4" : "w-32 -m-16"} transition-[width,margin] ease-out-back duration-200 origin-center aspect-square backdrop-invert z-[100000000] pointer-events-none`}>
                    <p className={`${!hoveredLink ? "scale-0" : "scale-100"} transition-transform duration-1000 ${styles.cursor_text} text-black origin-center`}>
                        {hoveredLink && <ReactCurvedText cx={64} cy={64} height={128} width={128} rx={56} ry={56} text={hoveredLink?.ariaLabel ?? ""}></ReactCurvedText>}
                    </p>
                </div>

                <div className="skew-wrapper origin-center flex">
                    <div className="mouse-transform-wrapper flex">
                        <section id="home" className="hero flex items-center justify-center">
                            <div className="w-1/3 h-full flex items-center justify-center px-4">
                                <div id="pfp" className="w-full aspect-square overflow-hidden">
                                    <img className="w-full aspect-square object-center object-cover" src="/pfp.jpg" alt="" />
                                </div>
                            </div>

                            <div className="w-2/3 h-full flex items-start justify-center flex-col px-4 relative">
                                <a href="https://github.com/ramondeleonca" aria-label="Visit my Github Profile">
                                    <h1 className="flex-grow text-justify text-[12rem] leading-none whitespace-normal break-normal flex flex-wrap">
                                        {"RAMÓN DE LEÓN".split("").map((char, i) => <div key={i} className="overflow-hidden"><div id={`name-letter`} style={{ padding: char === " " ? "2rem" : "" }}>{char}</div></div>)}
                                    </h1>
                                </a>
                                <div className="other-stuff flex items-center py-4 justify-evenly w-full">
                                    <WithHover><a className="font-bold font-mono text-xl p-4" id="name-link" href="#webdev" aria-label="Check out my projects">&lt;Web Developer /&gt;</a></WithHover>
                                    <WithHover><a className="font-bold font-mono text-xl p-4" id="name-link" href="#frcdev" aria-label="Check out my projects">class FRCProgrammer</a></WithHover>
                                    <WithHover><a className="font-bold font-mono text-xl p-4" id="name-link" href="#ocvdev" aria-label="Check out my projects">cv2.ComputerVisionEngineer</a></WithHover>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </ReactLenis>
        // </MacScrollbar>
    );
}