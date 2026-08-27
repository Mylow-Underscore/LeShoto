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
import { COLORS, UNIVERS_PANELS_DATA } from "@/constants";
import { HalftonePattern } from "@/components/ui/elements/HalftonePattern";
import WavingCharacter from "@/components/characters/wavingCharacter";
import WavingCharacter2 from "@/components/characters/wavingcharacter2";
import WavingCharacter3 from "@/components/characters/wavingcharacter3";

function SplitText({ text }: { text: string }) {
  return (
    <span style={{ display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <motion.span key={i} initial={{ opacity: 0, y: 60, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.04 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ display: "inline-block", transformOrigin: "bottom" }}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function SpeedLines() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900">
      {Array.from({ length: 24 }).map((_, i) => {
        const rad = (i / 24) * 2 * Math.PI;
        const x1 = Math.round((720 + Math.cos(rad) * 80) * 1000) / 1000;
        const y1 = Math.round((450 + Math.sin(rad) * 80) * 1000) / 1000;
        const x2 = Math.round((720 + Math.cos(rad) * 900) * 1000) / 1000;
        const y2 = Math.round((450 + Math.sin(rad) * 900) * 1000) / 1000;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.white} strokeWidth="1" />;
      })}
    </svg>
  );
}

function UniversPanel({ panel, i, totalSlides, scrollYProgress }: { panel: typeof UNIVERS_PANELS_DATA[0]; i: number; totalSlides: number; scrollYProgress: MotionValue<number> }) {
  const slideIdx = i + 1;
  const p = useTransform(scrollYProgress, [slideIdx / totalSlides, (slideIdx + 1) / totalSlides], [0, 1]);
  const panelScale = useTransform(p, [0, 1], [1, 0.94]);
  const panelOpacity = useTransform(p, [0.75, 1], [1, 0]);
  const barScaleX = useTransform(p, [0, 0.8], [0, 1]);

  return (
    <motion.div id={i === 0 ? "univers" : undefined} style={{ width: "100vw", height: "100vh", flexShrink: 0, background: panel.bg, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 80px 80px", position: "relative", overflow: "hidden", opacity: i < UNIVERS_PANELS_DATA.length - 2 ? panelOpacity : 1.9 }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id={`udots-${i}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="2" fill={panel.accent} /></pattern></defs>
        <rect width="100%" height="100%" fill={`url(#udots-${i})`} />
      </svg>
      <div style={{ position: "absolute", top: 60, left: 80, fontWeight: 900, fontSize: "22vw", lineHeight: 1, color: "transparent", WebkitTextStroke: `1px ${panel.accent}`, opacity: 0.1, userSelect: "none" }}>{panel.num}</div>
      <div style={{ position: "absolute", top: 60, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: COLORS.muted, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase" }}>— L'univers</span>
        <span style={{ color: COLORS.muted, fontSize: 11, letterSpacing: "0.3em" }}>{i + 1} / {UNIVERS_PANELS_DATA.length}</span>
      </div>
      <div style={{ width: 48, height: 3, background: panel.accent, marginBottom: 28 }} />
      <h2 style={{ fontWeight: 900, fontSize: "clamp(48px, 7vw, 100px)", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 0.9, margin: "0 0 12px", color: COLORS.white }}>{panel.title}</h2>
      <h3 style={{ fontWeight: 300, fontSize: "clamp(24px, 3vw, 48px)", textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 32px", color: panel.accent }}>{panel.sub}</h3>
      <p style={{ color: COLORS.muted, lineHeight: 1.8, fontSize: 18, margin: 0, maxWidth: 480 }}>{panel.text}</p>
      {i < UNIVERS_PANELS_DATA.length - 1 && (
        <div style={{ position: "absolute", bottom: 48, right: 80, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: COLORS.muted, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" }}>suivant</span>
          <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }} style={{ color: panel.accent, fontSize: 18 }}>→</motion.div>
        </div>
      )}
      <motion.div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 3, background: panel.accent, scaleX: barScaleX, transformOrigin: "left" }} />
    </motion.div>
  );
}

function ConceptSlide({ scrollYProgress, totalSlides }: { scrollYProgress: MotionValue<number>; totalSlides: number }) {
  const p = useTransform(scrollYProgress, [0, 1 / totalSlides], [0, 1]);
  const conceptScale = useTransform(p, [0, 1], [1, 0.92]);
  const conceptOpacity = useTransform(p, [0.7, 1], [1, 0]);
  return (
    <motion.div style={{ width: "100vw", height: "100vh", flexShrink: 0, background: COLORS.black, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", scale: conceptScale, opacity: conceptOpacity }}>
      <HalftonePattern />
      <WavingCharacter2 />
      <div style={{ maxWidth: 1200, width: "100%", padding: "0 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <p style={{ color: COLORS.accent, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 24px" }}>— Notre concept</p>
          <h2 style={{ fontSize: "clamp(40px, 5vw, 80px)", fontWeight: 900, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-0.03em", margin: 0 }}>
            Une bulle<br />
            <span style={{ WebkitTextStroke: `2px ${COLORS.white}`, color: "transparent" }}>japonaise</span>
            <br />à Carca.
          </h2>
        </div>
        <div style={{ borderLeft: `3px solid ${COLORS.accent}`, paddingLeft: 40 }}>
          <p style={{ color: COLORS.muted, lineHeight: 1.8, fontSize: 16, margin: "0 0 24px" }}>Le Shoto, c'est l'endroit où tu poses ton sac, tu attrapes un manga, et tu oublies le temps. Ambiance sombre, playlists lo-fi, étagères remplies des meilleures séries.</p>
          <p style={{ color: COLORS.muted, lineHeight: 1.8, fontSize: 16, margin: "0 0 40px" }}>Café, thé japonais ou granité frais : sip, lis, recommence. On t'attend à Carcassonne.</p>
          <div style={{ display: "flex", gap: 40 }}>
            {[["2000+", "Mangas"], ["3", "Univers"], ["∞", "Ambiance"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.gold }}>{n}</div>
                <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: "0.2em", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 40, right: 64, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: COLORS.muted, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll pour continuer</span>
        <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }} style={{ color: COLORS.accent, fontSize: 18 }}>→</motion.div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: COLORS.border }} />
    </motion.div>
  );
}

function ProgressDot({ i, totalSlides, scrollYProgress }: { i: number; totalSlides: number; scrollYProgress: MotionValue<number> }) {
  const width = useTransform(scrollYProgress, [Math.max(0, (i - 0.5) / totalSlides), i / totalSlides, (i + 0.5) / totalSlides, Math.min(1, (i + 1) / totalSlides)], [8, 24, 24, 8]);
  const opacity = useTransform(scrollYProgress, [Math.max(0, (i - 0.5) / totalSlides), i / totalSlides, Math.min(1, (i + 1) / totalSlides)], [0.3, 1, 0.3]);
  return <motion.div style={{ height: 3, borderRadius: 2, background: COLORS.accent, width, opacity }} />;
}

function ProgressDotMobile({ i, totalSlides, scrollYProgress }: { i: number; totalSlides: number; scrollYProgress: MotionValue<number> }) {
const height = useTransform(scrollYProgress, [Math.max(0, (i - 0.5) / totalSlides), i / totalSlides, (i + 0.5) / totalSlides, Math.min(1, (i + 1) / totalSlides)], [8, 24, 24, 8]);
const opacity = useTransform(scrollYProgress, [Math.max(0, (i - 0.5) / totalSlides), i / totalSlides, Math.min(1, (i + 1) / totalSlides)], [0.3, 1, 0.3]);
return <motion.div style={{ height, borderRadius: 2, background: COLORS.accent, opacity }} />;
}

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

function ConceptUnivers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = 1 + UNIVERS_PANELS_DATA.length;
  const vw = useViewportWidth();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -(totalSlides - 1) * vw]);

  return (
    <div className="max-md:hidden md:flex relative" ref={containerRef} id="concept" style={{ height: `${totalSlides * 100}vh`, position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", isolation: "isolate" }}>
        <motion.div style={{ display: "flex", flexDirection: "row", width: `${totalSlides * 100}vw`, height: "100vh", x, willChange: "transform" }}>
          <div style={{ width: "100vw", minWidth: "100vw", height: "100vh", overflow: "hidden" }}>
            <ConceptSlide scrollYProgress={scrollYProgress} totalSlides={totalSlides} />
          </div>
          {UNIVERS_PANELS_DATA.map((panel, i) => (
            <div key={panel.num} style={{ width: "100vw", minWidth: "100vw", height: "100vh", overflow: "hidden" }}>
              <UniversPanel panel={panel} i={i} totalSlides={totalSlides} scrollYProgress={scrollYProgress} />
            </div>
          ))}
        </motion.div>
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <ProgressDot key={i} i={i} totalSlides={totalSlides} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ConceptUniversMobile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = 1 + UNIVERS_PANELS_DATA.length;
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  return (
    <div className="max-md:flex md:hidden" ref={containerRef} id="concept">
      <div style={{ position: "sticky", top: 0, height: `${totalSlides * 100}vh`, overflow: "hidden", isolation: "isolate" }}>
        <motion.div style={{ display: "flex", flexDirection: "column", width: "100%", height: "auto", willChange: "transform" }}>
          <div style={{ width: "100%", minWidth: "100%", height: "100vh", overflow: "hidden" }}>
            <ConceptSlide scrollYProgress={scrollYProgress} totalSlides={totalSlides} />
          </div>
          {UNIVERS_PANELS_DATA.map((panel, i) => (
            <div key={panel.num} style={{ width: "100%", minWidth: "100%", height: "100vh", overflow: "hidden" }}>
              <UniversPanel panel={panel} i={i} totalSlides={totalSlides} scrollYProgress={scrollYProgress} />
            </div>
          ))}
        </motion.div>
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <ProgressDotMobile key={i} i={i} totalSlides={totalSlides} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Infos() {
  return (
    <div className="max-md:hidden md:flex relative" id="infos" style={{ background: COLORS.deepInk, padding: "120px 24px", position: "relative" }}>
          <HalftonePattern />
          <WavingCharacter3 />
          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
            <FadeUp>
              <p style={{ color: COLORS.accent, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>— Nous trouver</p>
              <h2 style={{ fontSize: "clamp(32px, 4vw, 60px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 64px" }}>Viens nous voir.</h2>
            </FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
              <FadeUp>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.25em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 24 }}>Horaires</h4>
                  {[["Lundi – Vendredi", "10h – 19h"], ["Samedi", "10h – 19h"], ["Dimanche", "Fermé"]].map(([day, hours]) => (
                    <div key={day} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ color: hours === "Fermé" ? COLORS.muted : COLORS.white, fontWeight: 600 }}>{day}</span>
                      <span style={{ color: hours === "Fermé" ? COLORS.muted : COLORS.gold, fontWeight: 700 }}>{hours}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 32, padding: "20px 24px", border: `1px solid ${COLORS.border}` }}>
                    <p style={{ color: COLORS.white, fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>📍 23 rue Georges Clémenceau</p>
                    <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>11000 Carcassonne</p>
                  </div>
                </div>
              </FadeUp>
              <FadeUp delay={0.15}>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.25em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 24 }}>Contact & Réseaux</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                    {[
                      { label: "📞 Téléphone", href: "tel:0633870964", handle: "06 33 87 09 64" },
                      { label: "✉️ Email", href: "mailto:leshotomangashop@gmail.com", handle: "leshotomangashop@gmail.com" },
                      { label: "Instagram", href: "https://www.instagram.com/leshoto_mangacafe/", handle: "@leshoto_mangacafe" },
                      { label: "TikTok", href: "https://www.tiktok.com/@leshoto_mangacafe", handle: "@leshoto_mangacafe" },
                      { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61586734014038", handle: "Le Shoto Manga Café" },
                    ].map((s) => (
                      <motion.a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" whileHover={{ x: 8, color: COLORS.accent }} transition={{ duration: 0.2 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", border: `1px solid ${COLORS.border}`, textDecoration: "none", color: COLORS.white }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</span>
                        <span style={{ color: COLORS.muted, fontSize: 13 }}>{s.handle} →</span>
                      </motion.a>
                    ))}
                  </div>
                  <a href="/boutique/coques" style={{ display: "block", background: COLORS.accent, color: COLORS.white, textAlign: "center", padding: "16px", textDecoration: "none", fontWeight: 800, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    Accéder à la boutique →
                  </a>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
  );
}

function InfosMobile() {
  return (
    <div className="max-md:flex md:hidden" id="infos" style={{ background: COLORS.deepInk, padding: "120px 24px", position: "relative" }}>
          <HalftonePattern />
          <WavingCharacter3 />
          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
            <FadeUp>
              <p style={{ color: COLORS.accent, fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>— Nous trouver</p>
              <h2 style={{ fontSize: "clamp(32px, 4vw, 60px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 64px" }}>Viens nous voir.</h2>
            </FadeUp>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 80 }}>
              <FadeUp>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.25em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 24 }}>Horaires</h4>
                  {[["Lundi – Vendredi", "10h – 19h"], ["Samedi", "10h – 19h"], ["Dimanche", "Fermé"]].map(([day, hours]) => (
                    <div key={day} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ color: hours === "Fermé" ? COLORS.muted : COLORS.white, fontWeight: 600 }}>{day}</span>
                      <span style={{ color: hours === "Fermé" ? COLORS.muted : COLORS.gold, fontWeight: 700 }}>{hours}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 32, padding: "20px 24px", border: `1px solid ${COLORS.border}` }}>
                    <p style={{ color: COLORS.white, fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>📍 23 rue Georges Clémenceau</p>
                    <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>11000 Carcassonne</p>
                  </div>
                </div>
              </FadeUp>
              <FadeUp delay={0.15}>
                <div>
                  <h4 style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.25em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 24 }}>Contact & Réseaux</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                    {[
                      { label: "📞 Téléphone", href: "tel:0633870964", handle: "06 33 87 09 64" },
                      { label: "✉️ Email", href: "mailto:leshotomangashop@gmail.com", handle: "leshotomangashop@gmail.com" },
                      { label: "Instagram", href: "https://www.instagram.com/leshoto_mangacafe/", handle: "@leshoto_mangacafe" },
                      { label: "TikTok", href: "https://www.tiktok.com/@leshoto_mangacafe", handle: "@leshoto_mangacafe" },
                      { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61586734014038", handle: "Le Shoto Manga Café" },
                    ].map((s) => (
                      <motion.a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" whileHover={{ x: 8, color: COLORS.accent }} transition={{ duration: 0.2 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", border: `1px solid ${COLORS.border}`, textDecoration: "none", color: COLORS.white }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{s.label}</span>
                        <span style={{ color: COLORS.muted, fontSize: 13 }}>{s.handle} →</span>
                      </motion.a>
                    ))}
                  </div>
                  <a href="/boutique/coques" style={{ display: "block", background: COLORS.accent, color: COLORS.white, textAlign: "center", padding: "16px", textDecoration: "none", fontWeight: 800, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    Accéder à la boutique →
                  </a>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 160]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => { document.body.style.overflowX = ""; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.title = "Le Shoto Manga Café — Carcassonne";
    const addMeta = (name: string, content: string) => { const m = document.createElement("meta"); m.name = name; m.content = content; document.head.appendChild(m); };
    const addOG = (prop: string, content: string) => { const m = document.createElement("meta"); m.setAttribute("property", prop); m.content = content; document.head.appendChild(m); };
    addMeta("description", "Le Shoto Manga Café — 23 rue Georges Clémenceau, Carcassonne 11000. Cafés, thés japonais, granités, mangas à lire sur place, gaming et boutique exclusive.");
    addOG("og:title", "Le Shoto Manga Café — Carcassonne");
    addOG("og:description", "Café manga & anime à Carcassonne. Boissons japonaises, mangas, gaming et boutique.");
    addOG("og:type", "website");
    const canonical = document.createElement("link"); canonical.rel = "canonical"; canonical.href = "https://leshoto-mangacafe.fr"; document.head.appendChild(canonical);
    const jsonLd = document.createElement("script"); jsonLd.type = "application/ld+json";
    jsonLd.text = JSON.stringify({
      "@context": "https://schema.org", "@type": "CafeOrCoffeeShop",
      name: "Le Shoto Manga Café",
      description: "Café manga & anime à Carcassonne. Cafés, thés japonais, granités, mangas, gaming et boutique exclusive.",
      url: "https://leshoto-mangacafe.fr",
      address: { "@type": "PostalAddress", streetAddress: "23 rue Georges Clémenceau", addressLocality: "Carcassonne", postalCode: "11000", addressCountry: "FR" },
      telephone: "+33633870964",
      email: "leshotomangashop@gmail.com",
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "11:00", closes: "21:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday"], opens: "12:00", closes: "19:00" },
      ],
      sameAs: ["https://www.instagram.com/leshoto_mangacafe/", "https://www.tiktok.com/@leshoto_mangacafe", "https://www.facebook.com/profile.php?id=61586734014038"],
    });
    document.head.appendChild(jsonLd);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div key="loader" exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ position: "fixed", inset: 0, zIndex: 9999, background: COLORS.black, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
            <HalftonePattern />
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} style={{ width: 220, height: 4, background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.gold})`, transformOrigin: "left", borderRadius: 2 }} />
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} style={{ color: COLORS.muted, fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase" }}>Le Shoto — Chargement…</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }} style={{ fontSize: 32 }}>⛩️</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ margin: 0, padding: 0, fontFamily: "'Helvetica Neue', Arial, sans-serif", background: COLORS.black, color: COLORS.white }}>

        <Navbar/>

        <section id="hero" style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          
          <motion.div style={{ position: "absolute", inset: 0, y: heroY, opacity: heroOpacity }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,102,196,0.12) 0%, transparent 70%), ${COLORS.black}` }} />
            <SpeedLines />
            <HalftonePattern />
            <WavingCharacter />
          </motion.div>
          <div style={{ position: "relative", textAlign: "center", padding: "0 24px", zIndex: 1 }}>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={!loading ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3, duration: 0.6 }} style={{ color: COLORS.accent, fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, marginBottom: 24 }}>
              ⛩️ Manga Café · Carcassonne
            </motion.p>
            <h1 style={{ fontSize: "clamp(56px, 12vw, 140px)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.03em", margin: "0 0 8px", textTransform: "uppercase" }}>
              {!loading && <SplitText text="LE SHOTO" />}
            </h1>
            <h2 style={{ fontSize: "clamp(18px, 3.5vw, 42px)", fontWeight: 300, letterSpacing: "0.25em", color: COLORS.muted, textTransform: "uppercase", margin: "0 0 40px" }}>
              {!loading && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>Manga Café</motion.span>}
            </h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={!loading ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.5, duration: 0.6 }} style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#concept" style={{ background: COLORS.accent, color: COLORS.white, padding: "14px 36px", textDecoration: "none", fontWeight: 800, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: 2, display: "inline-block" }}>Découvrir →</a>
              {/* <a href="/boutique/coques" style={{ border: `2px solid ${COLORS.border}`, color: COLORS.white, padding: "14px 36px", textDecoration: "none", fontWeight: 700, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: 2, display: "inline-block" }}>Boutique</a> */}
            </motion.div>
          </div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} style={{ position: "absolute", bottom: 32, left: "48%", transform: "translateX(-50%)", color: COLORS.muted, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll</motion.div>
        </section>

        <ConceptUnivers />
        <ConceptUniversMobile />
        
        

        <div style={{ background: COLORS.accent, overflow: "hidden", padding: "20px 0", position: "relative" }}>
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ display: "flex", whiteSpace: "nowrap" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} style={{ fontWeight: 900, fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", padding: "0 40px", color: COLORS.white }}>
                EVENTS MENSUELS ✦ COSPLAY ✦ GAMING ✦ CAFÉS & GRANITÉS ✦ BOUTIQUE EXCLUSIVE ✦
              </span>
            ))}
          </motion.div>
        </div>

        <Infos />
        <InfosMobile />

        <Footer />
      </div>
    </>
  );
}