import { useEffect, useState } from "react";

export default function useLoaded(timeout?: number) {
    const [loaded, setLoaded] = useState(false);
    const handleLoad = () => {
        const now = performance.now();
        if (!timeout || now >= timeout) setLoaded(true);
        else setTimeout(() => setLoaded(true), timeout - now);
    };
    useEffect(() => document.readyState === "complete" ? handleLoad() : window.addEventListener("load", handleLoad), []);
    return loaded;
}