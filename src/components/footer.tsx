import { COLORS } from "@/constants";


export function Footer() {
  return (
    <footer style={{ background: COLORS.black, padding: "48px 24px", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: "0.05em" }}>THE SHOTO<span style={{ color: COLORS.accent }}>.</span></span>
            <span style={{ color: COLORS.muted, fontSize: 12 }}>23 rue Georges Clémenceau · 11000 Carcassonne · leshotomangashop@gmail.com · 06 33 87 09 64</span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Instagram", "TikTok", "Facebook"].map((r, i) => (
                <a key={r} href={["https://www.instagram.com/leshoto_mangacafe/", "https://www.tiktok.com/@leshoto_mangacafe", "https://www.facebook.com/profile.php?id=61586734014038"][i]} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.muted, fontSize: 13, textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = COLORS.accent)} onMouseLeave={e => (e.currentTarget.style.color = COLORS.muted)}>{r}</a>
              ))}
            </div>
          </div>
          <div style={{ maxWidth: 1200, margin: "15px auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <span style={{ color: COLORS.muted, fontSize: 12 }}>© {new Date().getFullYear()} Le Shoto Manga Café. Tous droits réservés.</span>
            <span style={{ color: COLORS.muted, fontSize: 12 }}>Site par <a href="https://www.instagram.com/wyloz._/" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.accent, textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = COLORS.gold)} onMouseLeave={e => (e.currentTarget.style.color = COLORS.accent)}>Wyloz.</a></span>
          </div>
    </footer>
  );
}