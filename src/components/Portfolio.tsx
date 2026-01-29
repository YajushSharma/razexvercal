"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// --- STAR BACKGROUND COMPONENT ---
const StarBackground = ({ y }: { y: MotionValue<string> }) => {
    const smallShadows = useMemo(() => generateBoxShadow(700), []);
    const mediumShadows = useMemo(() => generateBoxShadow(200), []);
    const bigShadows = useMemo(() => generateBoxShadow(100), []);

    return (
        // 1. STATIC WRAPPER: Holds the mask and positioning
        // The mask stays fixed so the fade effect doesn't move with the stars
        <div
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
            style={{
                maskImage: `
    linear-gradient(
      to bottom,
      transparent 0%,
      black 15%,
      black 85%,
      transparent 100%
    )
  `,
                WebkitMaskImage: `
    linear-gradient(
      to bottom,
      transparent 0%,
      black 15%,
      black 85%,
      transparent 100%
    )
  `
            }}
        >
            {/* 2. MOVING LAYER: This applies the Parallax */}
            {/* We make it taller (150%) and shift it up (-25%) to prevent gaps when it moves */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true }}
                style={{ y: y }}
                className="absolute -top-[25%] -left-[10%] w-[120%] h-[150%] opacity-60"
            >
                <style jsx global>{`
                    @keyframes animStar {
                        from { transform: translateY(0px); }
                        to { transform: translateY(-2000px); }
                    }
                `}</style>

                {/* Small Stars */}
                <div
                    className="absolute w-[1px] h-[1px] bg-transparent animate-[animStar_50s_linear_infinite]"
                    style={{ boxShadow: smallShadows }}
                />
                <div
                    className="absolute w-[1px] h-[1px] bg-transparent animate-[animStar_50s_linear_infinite]"
                    style={{ boxShadow: smallShadows, top: '2000px' }}
                />

                {/* Medium Stars */}
                <div
                    className="absolute w-[2px] h-[2px] bg-transparent animate-[animStar_100s_linear_infinite]"
                    style={{ boxShadow: mediumShadows }}
                />
                <div
                    className="absolute w-[2px] h-[2px] bg-transparent animate-[animStar_100s_linear_infinite]"
                    style={{ boxShadow: mediumShadows, top: '2000px' }}
                />

                {/* Big Stars */}
                <div
                    className="absolute w-[3px] h-[3px] bg-transparent animate-[animStar_150s_linear_infinite]"
                    style={{ boxShadow: bigShadows }}
                />
                <div
                    className="absolute w-[3px] h-[3px] bg-transparent animate-[animStar_150s_linear_infinite]"
                    style={{ boxShadow: bigShadows, top: '2000px' }}
                />
            </motion.div>
        </div>
    );
};

// ORANGE STARS LOGIC
const generateBoxShadow = (n: number) => {
    let value = "";
    for (let i = 1; i <= n; i++) {
        const isOrange = Math.random() < 0.033;
        const color = isOrange ? "rgba(249, 115, 22, 0.8)" : "#FFF";
        const x = Math.floor(Math.random() * 3000); // Increased spread for wider container
        const y = Math.floor(Math.random() * 3000); // Increased spread
        value += `${x}px ${y}px ${color}, `;
    }
    return value.slice(0, -2);
};

interface VideoCardProps {
    index: number;
    title: string;
    category: string;
    videoUrl: string; // Add this back if you are using TypeScript strictly
}

const videos = [
    {
        title: "Feature Showcase",
        category: "Feature Showcase",
        videoUrl: "/SaaS 1.mp4",
    },
    {
        title: "Product Launch",
        category: "Launch Video",
        videoUrl: "/SaaS 2.mp4",
    },
    {
        title: "Product Promo",
        category: "Motion Graphics",
        videoUrl: "/SaaS 3.mp4",
    },
    {
        title: "Product Explainer",
        category: "Explainer Video",
        videoUrl: "/SaaS 4.mp4",
    },
];

function VideoCard({ index, title, category }: VideoCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        videoRef.current?.play();
                    } else {
                        setIsVisible(false);
                        videoRef.current?.pause();
                    }
                });
            },
            {
                root: null,
                // Tighter zone: video must be in center 30% of screen to be "active"
                rootMargin: "-35% 0px -35% 0px",
                // Trigger when 50% of the video is visible in the zone
                threshold: 0.5
            }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    // Click to scroll video to center
    const handleVideoClick = () => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-center px-4 md:px-8 py-4 z-10 cursor-pointer"
            onClick={handleVideoClick}
        >
            <div
                className={`relative w-full max-w-6xl rounded-2xl transition-all duration-700 ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-60"
                    }`}
                style={{ aspectRatio: "16 / 9" }}
            >
                <div className="glow-card-inner absolute inset-[2px] rounded-2xl overflow-hidden bg-black z-10">
                    <video
                        ref={videoRef}
                        src={videos[index].videoUrl}
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60 z-10" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20">
                        <span className="text-accent-orange text-xs md:text-sm font-medium tracking-wider uppercase mb-1 md:mb-2 block">
                            {category}
                        </span>
                        <h3 className="text-xl md:text-3xl lg:text-4xl font-bold text-white">
                            {title}
                        </h3>
                    </div>
                    <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-opacity duration-300 ${isVisible ? "opacity-0" : "opacity-100"
                            }`}
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <svg className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default function Portfolio() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        // Adjusted offset to start tracking slightly earlier for smoother entry
        offset: ["start end", "end start"]
    });

    // 3. STRONG PARALLAX:
    // Move from 0% to 50% down. This "drags" the background down as you scroll,
    // creating a strong depth effect where stars feel far away.
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <section
            id="work"
            ref={sectionRef}
            className="py-12 md:py-20 bg-black relative overflow-hidden"
        >
            <StarBackground y={backgroundY} />

            <div className="text-center mb-8 md:mb-16 px-4 relative z-10">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-accent-orange text-sm font-medium tracking-[0.3em] uppercase mb-4 block"
                >
                    Featured Work
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
                >
                    Selected <span className="text-gradient">Projects</span>
                </motion.h2>
            </div>

            <div className="space-y-2 md:space-y-6 relative z-10">
                {videos.map((video, index) => (
                    <VideoCard
                        key={index}
                        index={index}
                        title={video.title}
                        category={video.category}
                        videoUrl={video.videoUrl}
                    />
                ))}
            </div>
        </section>
    );
}