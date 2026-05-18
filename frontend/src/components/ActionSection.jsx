import { Zap, ChevronRight, Download } from "lucide-react";

export default function ActionSection({
  loading,
  errorMsg,
  result,
  analyze,
  handlePrint,
  setResult
}) {
  return (
    <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: 12 }}>
      {errorMsg && !errorMsg.includes("age") && !errorMsg.includes("image") && (
        <div style={{ color: "var(--red)", fontSize: 13, background: "var(--red-bg)", padding: 10, borderRadius: 8, border: "1px solid var(--red)" }}>
          {errorMsg}
        </div>
      )}
      <button className="analyze-btn" onClick={analyze} disabled={loading}>
        {loading
          ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.35)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin .75s linear infinite" }} />Analyzing...</>
          : <><Zap size={16} strokeWidth={2} />Analyze Lesion <ChevronRight size={16} /></>}
      </button>
      {result && !loading && (
        <button
          onClick={handlePrint}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "var(--surface)", border: "1px solid var(--border)",
            padding: "13px", borderRadius: 12, cursor: "pointer",
            fontSize: 14, fontWeight: 600, color: "var(--text)", transition: "all 0.2s",
            width: "100%"
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--teal)"}
          onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <Download size={16} /> Download PDF Report
        </button>
      )}
      {result && (
        <button onClick={() => { setResult(null); }} style={{ background: "transparent", border: "none", fontSize: 13, color: "var(--muted)", cursor: "pointer", padding: "4px" }}>
          Clear results
        </button>
      )}
    </div>
  );
}
