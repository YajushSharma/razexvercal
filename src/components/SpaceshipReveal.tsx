"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Image from "next/image";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

interface SpaceshipRevealProps {
    children: React.ReactNode;
}

export default function SpaceshipReveal({ children }: SpaceshipRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const vignetteRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=150%",
                    pin: true,
                    scrub: 1,
                    // markers: true, // Uncomment for debugging
                },
            });

            // Fade out scroll indicator and start text first
            tl.to([scrollIndicatorRef.current, ".start-text-container"], {
                opacity: 0,
                y: -20,
                duration: 0.15,
            })
                // Phase 1: Zoom spaceship window, animate circle down, clear blur (0% - 50%)
                .to(windowRef.current, {
                    scale: 12,
                    transformOrigin: "center center",
                    ease: "power1.inOut",
                    duration: 0.5,
                }, "<0.1")
                // Animate glowing circle down to final position
                .to(
                    ".glowing-circle-layer",
                    {
                        top: "65%",
                        ease: "power1.inOut",
                        duration: 0.5,
                    },
                    "<"
                )
                // Fade out vignette during zoom
                .to(
                    vignetteRef.current,
                    {
                        opacity: 0,
                        ease: "power1.inOut",
                        duration: 0.4,
                    },
                    "<"
                )
                // Clear blur on hero content
                .to(
                    contentRef.current,
                    {
                        filter: "blur(0px) brightness(1)",
                        scale: 1,
                        ease: "power1.inOut",
                        duration: 0.5,
                    },
                    "<"
                )
                // Fade out window completely
                .to(
                    windowRef.current,
                    {
                        opacity: 0,
                        duration: 0.15,
                    },
                    "-=0.15"
                )
                // Phase 2: Fade in hero text elements - starts 25% earlier
                .to(
                    ".hero-reveal-content",
                    {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        stagger: 0.05,
                        duration: 0.4,
                        ease: "power2.out",
                    },
                    "-=0.45"
                );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="spaceship-container relative">
            {/* Hero Content Layer - starts blurred */}
            <div
                ref={contentRef}
                className="spaceship-hero-content"
                style={{
                    filter: "blur(8px) brightness(1.2)",
                    transform: "scale(1.05)",
                }}
            >
                {children}
            </div>

            {/* Radial Vignette Overlay */}
            <div
                ref={vignetteRef}
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(0,0,0,0) 15%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,1) 80%)",
                }}
            />

            {/* Initial Scroll Indicator - visible at very start */}
            <div
                ref={scrollIndicatorRef}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3"
            >
                <span className="text-white/50 text-xs tracking-[0.2em] uppercase font-light">
                    Scroll to explore
                </span>
                <div className="relative w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                    <div className="w-1 h-2 bg-accent-orange/70 rounded-full animate-bounce" />
                </div>
                <svg
                    className="w-4 h-4 text-white/40 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ animationDelay: "0.2s" }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>

            {/* Centered Start Text - clickable to jump to hero */}
            <div className="start-text-container absolute inset-0 z-[45] flex items-center justify-center pointer-events-none">
                <a
                    href="#home"
                    onClick={(e) => {
                        e.preventDefault();
                        gsap.to(window, {
                            scrollTo: { y: window.innerHeight * 1.5, autoKill: false },
                            duration: 2.5,
                            ease: "power2.inOut"
                        });
                    }}
                    // CHANGE: Increased -translate-y-6 to -translate-y-32
                    className="pointer-events-auto group flex flex-col items-center gap-2 cursor-pointer -translate-y-32"
                >
                    <span className="text-white/40 text-xs tracking-[0.3em] uppercase font-light group-hover:text-white/70 transition-colors duration-300">
                        Click to
                    </span>
                    <span className="text-white/60 text-sm md:text-base tracking-[0.2em] uppercase font-medium group-hover:text-accent-orange transition-colors duration-300">
                        Begin Journey
                    </span>
                    <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-accent-orange/50 transition-all duration-300" />
                </a>
            </div>
            {/* Spaceship Window Overlay */}
            <div
                ref={windowRef}
                className="absolute inset-0 z-30 pointer-events-none"
                style={{
                    transformOrigin: "center center",
                }}
            >
                <Image
                    src="/Space-window.png"
                    alt="Spaceship Window"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={100}
                />
            </div>
        </div>
    );
}
