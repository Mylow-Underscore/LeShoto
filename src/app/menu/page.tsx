"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  MotionValue,
} from "motion/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/footer";


import { COLORS, MENU_ITEMS } from "@/constants";
import { HalftonePattern } from "@/components/ui/elements/HalftonePattern";


function useViewportWidth() {
  const [vw, setVw] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return vw;
}

function MenuSlide({ section, si, scrollYProgress }: { section: typeof MENU_ITEMS[0]; si: number; scrollYProgress: MotionValue<number> }) {
  const total = MENU_ITEMS.length;
  const slideProgress = useTransform(scrollYProgress, [si / total, (si + 1) / total], [0, 1]);
  const cardY = useTransform(slideProgress, [0, 0.3], [60, 0]);
  const CAT_ACCENTS = [COLORS.accent, "#5B8EFF", COLORS.gold];
  const catAccent = CAT_ACCENTS[si];
  return (
    <div style={{ width: "100vw", minWidth: "100vw", height: "100vh", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "160px 80px 80px", position: "relative" }}>
      <div style={{ position: "absolute", bottom: 60, left: 80, fontWeight: 900, fontSize: "20vw", lineHeight: 1, color: "transparent", WebkitTextStroke: `1px ${catAccent}`, opacity: 0.06, userSelect: "none", pointerEvents: "none" }}>{String(si + 1).padStart(2, "0")}</div>
      <motion.div style={{ width: "100%", maxWidth: 900, y: cardY }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
          <div style={{ width: 48, height: 3, background: catAccent }} />
          <h3 style={{ fontWeight: 900, fontSize: "clamp(32px, 4vw, 64px)", textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0, color: COLORS.white }}>{section.cat}</h3>
          <span style={{ color: COLORS.muted, fontSize: 13, letterSpacing: "0.3em" }}>{si + 1}/{total}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, background: COLORS.border }}>
          {section.items.map((item, ii) => (
            <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ii * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} whileHover={{ background: COLORS.panel }} style={{ background: COLORS.deepInk, padding: "28px 32px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, borderLeft: "3px solid transparent", transition: "border-color 0.2s" }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = catAccent; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = "transparent"; }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>{item.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.5 }}>{item.desc}</div>
              </div>
              <div style={{ fontWeight: 900, fontSize: 18, color: catAccent, whiteSpace: "nowrap", marginTop: 2 }}>{item.price}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      {si < total - 1 && (
        <div style={{ position: "absolute", bottom: 48, right: 80, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: COLORS.muted, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" }}>suivant</span>
          <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} style={{ color: catAccent, fontSize: 18 }}>→</motion.div>
        </div>
      )}
    </div>
  );
}

function MenuBoissons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const total = MENU_ITEMS.length;
  const vw = useViewportWidth();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -(total - 1) * vw]);

  return (
    <div className="max-md:hidden pt-16 md:flex relative" ref={containerRef} id="menu" style={{ height: `${total * 100}vh`, position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: COLORS.deepInk, isolation: "isolate" }}>
        <HalftonePattern />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "48px 80px 0", background: `linear-gradient(to bottom, ${COLORS.deepInk} 70%, transparent)` }}>
          <p style={{ color: COLORS.accent, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>— La carte </p>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 52px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>Ce qu'on sert chez Le Shoto.</h2>
        </div>
        <motion.div style={{ display: "flex", flexDirection: "row", width: `${total * 100}vw`, height: "100vh", x, alignItems: "center", willChange: "transform" }}>
          {MENU_ITEMS.map((section, si) => (
            <MenuSlide key={section.cat} section={section} si={si} scrollYProgress={scrollYProgress} />
          ))}
        </motion.div>
        <motion.div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 3, background: COLORS.accent, scaleX: scrollYProgress, transformOrigin: "left" }} />
      </div>
    </div>
  );
}

function MenuSlideMobile({ section, si }: { section: typeof MENU_ITEMS[0]; si: number; }) {
  const total = MENU_ITEMS.length;
  const CAT_ACCENTS = [COLORS.accent, "#5B8EFF", COLORS.gold];
  const catAccent = CAT_ACCENTS[si];

  return (
    <div className="w-full min-w-full flex-shrink-0 flex items-center justify-center p-10 relative">
      <div className="absolute bottom-0 left-20 font-bold text-[20vw] leading-none text-transparent border-[1px] border-accent opacity-6" style={{ WebkitTextStroke: `1px ${catAccent}` }}>{String(si + 1).padStart(2, "0")}</div>
        <motion.div className="h-full w-full max-w-full">
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
            <div style={{ width: 48, height: 3, background: catAccent }} />
            <h3 style={{ fontWeight: 900, fontSize: "clamp(28px, 4vw, 64px)", textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0, color: COLORS.white }}>{section.cat}</h3>
            <span style={{ color: COLORS.muted, fontSize: 13, letterSpacing: "0.3em" }}>{si + 1}/{total}</span>
          </div>
          <div className="grid grid-cols-1 gap-2 bg-border">
            {section.items.map((item, ii) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ii * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} whileHover={{ background: COLORS.panel }} style={{ background: COLORS.deepInk, padding: "14px 26px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, borderLeft: "3px solid transparent", transition: "border-color 0.2s" }} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = catAccent; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = "transparent"; }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 3 }}>{item.name}</div>
                  <div style={{ color: COLORS.muted, fontSize: 10, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
                <div style={{ fontWeight: 900, fontSize: 18, color: catAccent, whiteSpace: "nowrap", marginTop: 2 }}>{item.price}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
    </div>
  );
}

function MenuBoissonsMobile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const total = MENU_ITEMS.length;
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  return (
    <div className="max-md:flex pt-16 md:hidden" ref={containerRef} id="menu">
      <div style={{ position: "relative", height: `${total * 110}vh`, overflow: "hidden", background: COLORS.deepInk, isolation: "isolate" }}>
        <HalftonePattern />
        <div style={{ position: "relative", top: 0, left: 0, right: 0, zIndex: 10, padding: "12px 20px 0", background: `linear-gradient(to bottom, ${COLORS.deepInk} 70%, transparent)` }}>
          <p style={{ color: COLORS.accent, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 8px" }}>— La carte </p>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 52px)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>Ce qu'on sert chez Le Shoto.</h2>
        </div>
        <motion.div style={{ display: "flex", flexDirection: "column", alignItems: "center", willChange: "transform" }}>
          {MENU_ITEMS.map((section, si) => (
            <MenuSlideMobile key={section.cat} section={section} si={si} />
          ))}
        </motion.div>
        <motion.div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 3, background: COLORS.accent, scaleX: scrollYProgress, transformOrigin: "left" }} />
      </div>
    </div>
  );
}

export default function MenuPage() {
    return (
        <div className="MeuPage">
            <Navbar />
                <MenuBoissons />
                <MenuBoissonsMobile />
            <Footer />
        </div>
    );
  }