"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Work", href: "#work" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
];

const WHATSAPP_LINK = "http://wa.me/7248197932";

export default function Navbar() {
    const [activeSection, setActiveSection] = useState("home");
    // Controls if the navbar is actually visible on screen (Logic for Spaceship reveal)
    const [isVisible, setIsVisible] = useState(false);

    // Smooth scroll handler
    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();

        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Scroll to very top (spaceship reveal)
    const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show navbar only after hero section (after spaceship reveal + hero)
            // Approximately 500px to ensure user has passed the intro
            if (currentScrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Active section detection
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -50% 0px",
            threshold: 0,
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = document.querySelectorAll("section[id]");
        sections.forEach((section) => observer.observe(section));

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                        duration: 0.5
                    }}
                    className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
                >
                    <div
                        className="pointer-events-auto flex items-center gap-2 md:gap-8 px-4 md:px-6 py-3 rounded-full 
                        bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl shadow-black/50
                        transition-all duration-300 hover:border-accent-orange/30 hover:shadow-accent-orange/10"
                    >
                        {/* Logo - scrolls to very top (spaceship reveal) */}
                        <a
                            href="#"
                            onClick={scrollToTop}
                            className="mr-2 group cursor-pointer"
                        >
                            <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:from-accent-orange group-hover:to-accent-gold transition-all duration-300">
                                RazeX
                            </span>
                        </a>

                        {/* Nav Links with smooth scroll */}
                        <ul className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => handleSmoothScroll(e, link.href)}
                                        className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer ${activeSection === link.href.slice(1)
                                            ? "text-white"
                                            : "text-white/60 hover:text-white"
                                            }`}
                                    >
                                        {link.name}

                                        {/* Active Indicator */}
                                        {activeSection === link.href.slice(1) && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-orange to-transparent shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        {/* Hover background */}
                                        {activeSection !== link.href.slice(1) && (
                                            <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10" />
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Mobile Links with smooth scroll */}
                        <ul className="flex md:hidden items-center gap-3 pr-2">
                            {navLinks.slice(0, 3).map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        onClick={(e) => handleSmoothScroll(e, link.href)}
                                        className={`text-xs font-medium cursor-pointer ${activeSection === link.href.slice(1) ? "text-accent-orange" : "text-white/60"
                                            }`}
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* Divider */}
                        <div className="w-[1px] h-6 bg-white/10 hidden md:block mx-2" />

                        {/* CTA Button - WhatsApp Link */}
                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative h-9 px-6 flex items-center justify-center text-xs md:text-sm font-bold rounded-full overflow-hidden group"
                        >
                            <span className="absolute inset-0 rounded-full border border-accent-orange/40 bg-accent-orange/10 group-hover:bg-accent-orange/20 transition-all duration-300" />

                            <span className="relative z-10 btn-text text-white group-hover:-translate-y-[150%] transition-transform duration-500 block">
                                Let&apos;s Talk
                            </span>
                            <span className="absolute z-10 btn-text-hover text-accent-orange translate-y-[150%] group-hover:translate-y-0 transition-transform duration-500 block">
                                Let&apos;s Talk
                            </span>
                        </a>
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}