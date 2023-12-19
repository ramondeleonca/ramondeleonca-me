import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMouseHovered } from "react-use";

export type WithHoverProps = { children: React.ReactNode };
export default function WithHover(props: WithHoverProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const cursorMockRef = useRef<HTMLDivElement>(null);
    const mouse = useMouseHovered(wrapperRef, { bound: true, whenHovered: true });
    const [hovered, setHovered] = useState(false);
    
    useEffect(() => {
        const handleMouseEnter = () => setHovered(true);
        const handleMouseLeave = () => setHovered(false);

        if (wrapperRef.current) {
            wrapperRef.current.addEventListener("mouseenter", handleMouseEnter);
            wrapperRef.current.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            if (wrapperRef.current) {
                wrapperRef.current.removeEventListener("mouseenter", handleMouseEnter);
                wrapperRef.current.removeEventListener("mouseleave", handleMouseLeave);
            }
        }
    }, [wrapperRef]);

    const kTransformWeight = 0.1;
    const kScale = 1.1;
    useEffect(() => {
        if (hovered) {
            gsap.to(wrapperRef.current, {
                duration: 0.5,
                scale: kScale,
                x: mouse.elX * kTransformWeight,
                y: mouse.elY * kTransformWeight,
                ease: "back.out",
                outline: "1px solid rgba(255, 255, 255, 0.5)"
            });
        } else {
            gsap.to(wrapperRef.current, {
                duration: 0.5,
                scale: 1,
                x: 0,
                y: 0,
                ease: "back.out",
                outline: "1px solid rgba(255, 255, 255, 0)"
            });
        }
        gsap.to(cursorMockRef.current, { x: mouse.elX, y: mouse.elY })
    }, [mouse, hovered]);

    return (
        <div ref={wrapperRef} className={`rounded-lg relative bg-white overflow-hidden transition-colors duration-500 ${hovered ? "bg-opacity-25" : "bg-opacity-0"}`}>
            <div ref={cursorMockRef} className={`cursor-mock w-8 h-8 -m-4 rounded-full bg-white blur-lg absolute transition-colors duration-500 pointer-events-none ${hovered ? "bg-opacity-75" : "bg-opacity-0"}`}></div>
            {props.children}
        </div>
    )
}