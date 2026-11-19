import { AnimatePresence, motion } from "motion/react";

const hidden = { opacity: 0, filter: "blur(8px)" };

// When the text changes (the language switch), the old text fades and blurs out, then the new one fades in sharp.
export default function Tx({ children }: { children: string }) {
    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.span
                key={children}
                style={{ display: "inline-block" }}
                initial={hidden}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={hidden}
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                {children}
            </motion.span>
        </AnimatePresence>
    );
}
