import { useEffect, useState } from "react";

export default function useWindowMouse(initialValue?: { x: number, y: number }) {
    const [mousePosition, setMousePosition] = useState({ x: initialValue?.x ?? 0, y: initialValue?.y ?? 0 });
    useEffect(() => {
        const handlePosition = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", handlePosition);
        return () => window.removeEventListener("mousemove", handlePosition);
    }, []);

    return mousePosition;
}