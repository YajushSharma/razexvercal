"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import LightRays from "./LightRays";
import Particles from "./Particles";

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollY } = useScroll();
    const [pinOffset, setPinOffset] = useState(0);

    // Calculate pin offset after mount (GSAP pins for ~150vh)
    useEffect(() => {
        setPinOffset(window.innerHeight * 1.5);
    }, []);

    // Parallax transforms - adjusted for GSAP pin offset
    // Text/buttons move at HALF speed (150 instead of 300)
    const bgY = useTransform(scrollY, [pinOffset, pinOffset + 1000], [0, 1000]);
    const circleY = useTransform(scrollY, [pinOffset, pinOffset + 1000], [0, -150]);
    const textY = useTransform(scrollY, [pinOffset, pinOffset + 800], [0, 650]); // Half speed
    const textOpacity = useTransform(scrollY, [pinOffset, pinOffset + 800], [1, 0]);

    return (
        <section
            ref={sectionRef}
            id="home"
            className="relative min-h-screen w-full flex items-center justify-center overflow-visible"
        >
            {/* Layer 1: Star Background - extended above and below to prevent clipping */}
            <motion.div
                className="absolute z-0 w-full"
                style={{
                    y: bgY,
                    top: "0", // Give it more "room" to move down without showing a gap at the top
                    left: 0,
                    right: 0,
                    height: "140%",
                    willChange: "transform", // Forces GPU acceleration
                }}
            >
                <Image
                    src="/hero-bg-bg.png"
                    alt="Star Background"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={100}
                />
            </motion.div>

            {/* Layer 2: Glowing Circle - starts higher, visible through window, animates down */}
            <motion.div
                className="absolute left-0 right-0 z-[5] pointer-events-none w-screen glowing-circle-layer"
                style={{
                    y: circleY,
                }}

            >
                {/* NEW: Black Horizon Block */}
                {/* 1. top-1/2: Starts exactly at the middle of the circle */}
                {/* 2. -z-10: Sits BEHIND the circle image */}
                {/* 3. h-[200vh]: extends way down to cover the gap to the next section */}
                <div className="absolute top-1/2 left-0 right-0 h-[200vh] bg-black -z-10" />

                <Image
                    src="/hero-bg-circle.png"
                    alt="Glowing Circle"
                    width={1920}
                    height={1920}
                    className="w-full h-auto object-contain"
                    priority
                />
            </motion.div>

            {/* WebGL Light Rays Effect */}
            <LightRays />

            {/* Floating Particles - visible due to light rays */}
            <Particles />

            {/* Content - moved UP by adding negative margin-top */}
            <motion.div
                className="relative z-[3] w-full flex flex-col items-center text-center px-4 max-w-5xl mx-auto -mt-48 md:-mt-72"
                style={{ y: textY, opacity: textOpacity }}
            >
                <div className="mb-6 hero-reveal-content">
                    <span className="text-cinematic-label-orange text-sm md:text-base">
                        Motion Graphics Studio
                    </span>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cinematic-heading tracking-tight mb-8 hero-reveal-content">
                    <span>Complex Ideas</span>
                    <br />
                    <span className="text-gradient">Clear Motion.</span>
                </h1>

                <p className="text-cinematic-body text-lg md:text-xl max-w-2xl mx-auto mb-8 md:mb-12 hero-reveal-content">
                    I craft cinematic motion visuals and high-converting video content that help brands stand out, tell better stories, and convert viewers into customers.
                </p>

                <div className="hero-reveal-content">
                    <a
                        href="http://wa.me/7248197932"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center h-14 px-8 text-lg font-semibold overflow-hidden btn-gradient-border btn-slide-up"
                    >
                        <span className="btn-text text-white transition-colors duration-300">
                            Start Your Project
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                        <span className="btn-text-hover text-white">
                            Contact Now
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </a>
                </div>
            </motion.div>

            {/* Scroll Indicator - moved to SpaceshipReveal for initial visibility */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] hero-reveal-content"
                style={{ opacity: textOpacity }}
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
                >
                    <motion.div
                        animate={{ height: ["20%", "40%", "20%"] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1 bg-accent-orange/70 rounded-full"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
