import { Microscope, Sun, Moon } from "lucide-react";

export default function Header({ dark, setDark }) {
  return (
    <div className="header">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Microscope size={18} color="#fff" strokeWidth={1.8} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Dermascope<span style={{ color: "var(--teal)" }}>·AI</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>Multimodal Skin Lesion Diagnostics</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid var(--border)`, borderRadius: 20, padding: "5px 12px" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--teal)", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 12, color: "var(--muted)" }}>Model v1.0</span>
        </div>
        <button onClick={() => setDark(!dark)} style={{ background: "transparent", border: `1px solid var(--border)`, borderRadius: 8, padding: "7px 9px", cursor: "pointer", color: "var(--muted)", display: "flex", alignItems: "center" }}>
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </div>
  );
}
