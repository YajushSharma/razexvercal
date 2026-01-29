"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [cursorState, setCursorState] = useState<"default" | "hover" | "video">("default");

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for video elements first (highest priority)
            if (
                target.tagName === "VIDEO" ||
                target.closest("video") ||
                target.closest(".glow-card-inner")
            ) {
                setCursorState("video");
                return;
            }

            // Check for clickable elements
            if (
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.hasAttribute("data-cursor-hover")
            ) {
                setCursorState("hover");
                return;
            }

            // Default state
            setCursorState("default");
        };

        const handleMouseOut = (e: MouseEvent) => {
            const relatedTarget = e.relatedTarget as HTMLElement;
            if (!relatedTarget) {
                setCursorState("default");
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
        };
    }, []);

    // Cursor styles based on state
    const getCursorStyles = () => {
        switch (cursorState) {
            case "video":
                return {
                    dot: { scale: 0.5, opacity: 0.5 },
                    ring: { scale: 2.5, opacity: 0.3, borderColor: "rgba(249, 115, 22, 0.6)" }
                };
            case "hover":
                return {
                    dot: { scale: 2, opacity: 1 },
                    ring: { scale: 1.2, opacity: 0 }
                };
            default:
                return {
                    dot: { scale: 1, opacity: 1 },
                    ring: { scale: 1, opacity: 0.5 }
                };
        }
    };

    const styles = getCursorStyles();

    return (
        <>
            {/* Main cursor dot - subtle glow effect */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
                animate={{
                    x: mousePosition.x - 6,
                    y: mousePosition.y - 6,
                    scale: styles.dot.scale,
                    opacity: styles.dot.opacity,
                }}
                transition={{
                    type: "spring",
                    stiffness: 600,
                    damping: 30,
                    mass: 0.3,
                }}
            >
                <div
                    className="w-3 h-3 rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(249, 115, 22, 1) 0%, rgba(249, 115, 22, 0.6) 50%, transparent 100%)",
                        boxShadow: "0 0 10px rgba(249, 115, 22, 0.5), 0 0 20px rgba(249, 115, 22, 0.3)"
                    }}
                />
            </motion.div>

            {/* Outer ring - ethereal glow */}
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] hidden md:block"
                style={{
                    border: "1px solid rgba(249, 115, 22, 0.3)",
                    background: "radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 70%)"
                }}
                animate={{
                    x: mousePosition.x - 20,
                    y: mousePosition.y - 20,
                    scale: styles.ring.scale,
                    opacity: styles.ring.opacity,
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    mass: 0.5,
                }}
            />
        </>
    );
}
