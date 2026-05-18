import { Brain, Microscope, AlertTriangle, CheckCircle, Layers, Info, Activity, Shield } from "lucide-react";

export default function RightPanel({
  loading,
  result,
  phase,
  imgSrc,
  patientName,
  age,
  sex,
  site,
  setZoomImg,
  PHASES
}) {
  const isMal = result?.is_malignant;

  let confColor = "var(--muted)";
  let confBg = "var(--surface)";
  let confSubtext = null;
  if (result?.uncertainty_std > 0.10) {
    confSubtext = <div style={{ display: "flex", alignItems: "center", gap: 4 }}><AlertTriangle size={12} />Requires human review</div>;
  } else if (result?.uncertainty_std !== undefined) {
    confSubtext = <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--green)" }}><CheckCircle size={12} color="var(--green)" />Model is highly certain</div>;
  }
  const labelLower = result?.uncertainty_label?.toLowerCase() || "";
  if (labelLower.includes("high")) {
    confColor = "var(--green)";
    confBg = "var(--green-bg)";
  } else if (labelLower.includes("medium") || labelLower.includes("moderate")) {
    confColor = "var(--amber)";
    confBg = "var(--amber-bg)";
  } else if (labelLower.includes("low")) {
    confColor = "var(--red)";
    confBg = "var(--red-bg)";
  }

  return (
    <div className="right-panel">
      {/* Print-only Header */}
      <div className="print-only-header" style={{ display: "none", marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, margin: "0 0 10px 0" }}>Diagnostic Report</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, fontSize: 14, color: "#333", borderBottom: "1px solid #ccc", paddingBottom: 15 }}>
          <span><strong>Name:</strong> {patientName || "Not specified"}</span>
          <span><strong>Age:</strong> {age}</span>
          <span><strong>Sex:</strong> {sex}</span>
          <span><strong>Site:</strong> {site}</span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, minHeight: 400, gap: 28, animation: "fadeUp .3s ease" }}>
          <div style={{ position: "relative", width: 72, height: 72 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" fill="none" stroke="var(--border)" strokeWidth="5" />
              <circle cx="36" cy="36" r="30" fill="none" stroke="var(--teal)" strokeWidth="5" strokeDasharray="188" strokeDashoffset="140" strokeLinecap="round" style={{ transformOrigin: "center", animation: "spin 1.1s linear infinite" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Brain size={20} color="var(--teal)" strokeWidth={1.8} />
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{PHASES[phase]}</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>Multimodal inference pipeline running</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {PHASES.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, border: `1px solid ${i === phase ? "var(--teal)" : "var(--border)"}`, background: i === phase ? "var(--teal-bg)" : "transparent", transition: "all .3s" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: i < phase ? "var(--teal)" : i === phase ? "var(--teal)" : "var(--hint)" }} />
                <span style={{ fontSize: 11, color: i === phase ? "var(--teal)" : "var(--muted)" }}>{p.replace("...", "")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !result && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, minHeight: 400, gap: 14, animation: "fadeUp .3s ease" }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "var(--teal-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Microscope size={28} color="var(--teal)" strokeWidth={1.6} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
              {imgSrc ? "Awaiting analysis" : "Awaiting diagnostic data"}
            </div>
            <div style={{ fontSize: 14, color: "var(--muted)", maxWidth: 320, lineHeight: 1.6 }}>
              {imgSrc
                ? "All inputs are ready. Run the analysis to generate the diagnostic report and XAI overlay."
                : "Upload a dermoscopy image and provide patient metadata to begin multimodal analysis."}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp .4s ease" }}>

          {/* Verdict */}
          <div className={`card ${isMal ? "print-force-bg-red" : "print-force-bg-green"}`} style={{ background: isMal ? "var(--red-bg)" : "var(--green-bg)", border: `1px solid ${isMal ? "#fca5a5" : "#86efac"}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: isMal ? "#fee2e2" : "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {isMal ? <AlertTriangle size={24} color="var(--red)" strokeWidth={2} /> : <CheckCircle size={24} color="var(--green)" strokeWidth={2} />}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span className={isMal ? "print-force-text-red" : "print-force-text-green"} style={{ fontSize: 26, fontWeight: 700, color: isMal ? "var(--red)" : "var(--green)", letterSpacing: "-0.02em" }}>{result.prediction}</span>
                    {result.urgent && (
                      <span style={{ background: "var(--red)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6, letterSpacing: ".06em" }}>URGENT</span>
                    )}
                    {result.requires_review && (
                      <span style={{ background: "var(--amber)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6, letterSpacing: ".06em" }}>REVIEW</span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>
                    {result.probability?.toFixed(1)}% probability · threshold {(result.threshold_used * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
              {/* Probability circle */}
              <div style={{ position: "relative", width: 80, height: 80 }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="7" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke={isMal ? "var(--red)" : "var(--green)"} strokeWidth="7"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={2 * Math.PI * 32 * (1 - result.probability / 100)}
                    strokeLinecap="round" transform="rotate(-90 40 40)"
                    style={{ transition: "stroke-dashoffset 1s ease" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span className={isMal ? "print-force-text-red" : "print-force-text-green"} style={{ fontSize: 15, fontWeight: 700, color: isMal ? "var(--red)" : "var(--green)", lineHeight: 1 }}>{result.probability?.toFixed(0)}%</span>
                  <span style={{ fontSize: 10, color: "var(--muted)" }}>prob</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Explainability */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Layers size={16} color="var(--teal)" strokeWidth={1.8} />
              <span style={{ fontSize: 15, fontWeight: 600 }}>AI Focus Regions</span>

              <div className="tooltip-container">
                <Info size={14} color="var(--hint)" />
                <span className="tooltip-text">Score-CAM heatmaps show regions the model focused on. Red areas indicate high importance for the final prediction.</span>
              </div>
            </div>

            <div className="result-images">
              {[
                { label: "Original", badge: null, src: result.original_image_b64 },
                { label: "Heatmap Overlay", badge: "XAI", src: result.heatmap_overlay_b64 },
              ].map(({ label, badge, src }) => (
                <div key={label} style={{ border: `1px solid var(--border)`, borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid var(--border)` }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{label}</span>
                    {badge && <span style={{ fontSize: 11, fontWeight: 600, background: "var(--teal-bg)", color: "var(--teal)", padding: "2px 7px", borderRadius: 5 }}>{badge}</span>}
                  </div>
                  {src
                    ? <img
                      src={src}
                      alt={label}
                      className="clickable-image"
                      onClick={() => setZoomImg({ src, label })}
                      style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }}
                      title="Click to zoom"
                    />
                    : <div style={{ aspectRatio: "1", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 12, color: "#555" }}>Processing...</span>
                    </div>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* MC-TTA Confidence */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Activity size={16} color="var(--teal)" strokeWidth={1.8} />
              <span style={{ fontSize: 15, fontWeight: 600 }}>AI Certainty</span>

              <div className="tooltip-container">
                <Info size={14} color="var(--hint)" />
                <span className="tooltip-text">Monte Carlo Test-Time Augmentation runs the image through the model 20 times with slight variations to calculate confidence.</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                {
                  label: "Confidence Level",
                  value: result.uncertainty_label,
                  icon: <CheckCircle size={14} color={confColor} strokeWidth={1.8} />,
                  tooltip: "How sure the AI is about its prediction.",
                  vColor: confColor,
                  bgColor: confBg
                },
                {
                  label: "Uncertainty Score",
                  value: result.uncertainty_std?.toFixed(4),
                  icon: <Activity size={14} color="var(--muted)" strokeWidth={1.8} />,
                  tooltip: "A score closer to 0 means the AI is extremely certain. A score > 0.10 means the AI is guessing and requires human review.",
                  vColor: "var(--text)",
                  bgColor: "var(--surface)",
                  subtext: confSubtext
                },
              ].map(({ label, value, icon, tooltip, vColor, bgColor, subtext }) => (
                <div key={label} style={{ background: bgColor, border: `1px solid var(--border)`, borderRadius: 12, padding: "1rem 1.1rem", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    {icon}
                    <div className="tooltip-container">
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--muted)", cursor: "help" }}>{label}</span>
                      <span className="tooltip-text" style={{ bottom: "100%", marginBottom: "5px", width: "200px", zIndex: 100 }}>{tooltip}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: vColor, fontVariantNumeric: "tabular-nums" }}>{value}</div>
                  {subtext && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>{subtext}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 14px", background: "var(--surface)", border: `1px solid var(--border)`, borderRadius: 10 }}>
            <Shield size={14} color="var(--hint)" style={{ flexShrink: 0, marginTop: 1 }} strokeWidth={1.8} />
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>
              <strong style={{ color: "var(--text)" }}>Disclaimer. </strong>{result.disclaimer}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
