import { Brain } from "lucide-react";

export default function ArchitectureInfo() {
  return (
    <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <Brain size={15} color="var(--teal)" strokeWidth={1.8} />
        <span style={{ fontSize: 15, fontWeight: 600 }}>Architecture</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "var(--muted)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
          <div className="tooltip-container">
            <span style={{ fontWeight: 600, borderBottom: "1px dotted var(--muted)", cursor: "help" }}>Preprocessing</span>
            <span className="tooltip-text" style={{ bottom: "100%", left: 0, transform: "none", marginBottom: "5px", width: "250px", zIndex: 100 }}>Pipeline applies hair and artifact removal (telea inpainting) followed by Minkowski p-norm color constancy for illumination normalization.</span>
          </div>
          <span style={{ color: "var(--text)" }}>Inpainting & Constancy</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
          <div className="tooltip-container">
            <span style={{ fontWeight: 600, borderBottom: "1px dotted var(--muted)", cursor: "help" }}>Backbone</span>
            <span className="tooltip-text" style={{ bottom: "100%", left: 0, transform: "none", marginBottom: "5px", width: "230px", zIndex: 100 }}>EfficientNetV2-B0 is used as the core CNN for feature extraction, optimized for high parameter efficiency and speed.</span>
          </div>
          <span style={{ color: "var(--text)" }}>EfficientNetV2-B0</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
          <div className="tooltip-container">
            <span style={{ fontWeight: 600, borderBottom: "1px dotted var(--muted)", cursor: "help" }}>Integration</span>
            <span className="tooltip-text" style={{ bottom: "100%", left: 0, transform: "none", marginBottom: "5px", width: "240px", zIndex: 100 }}>Image features from the CNN backbone and clinical metadata are concatenated into a single vector before the final classification layers.</span>
          </div>
          <span style={{ color: "var(--text)" }}>Late Metadata Fusion</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
          <div className="tooltip-container">
            <span style={{ fontWeight: 600, borderBottom: "1px dotted var(--muted)", cursor: "help" }}>Inference</span>
            <span className="tooltip-text" style={{ bottom: "100%", left: 0, transform: "none", marginBottom: "5px", width: "230px", zIndex: 100 }}>TTA generates 4 image variants (flips/rotations). MC dropout runs 20 predictions per variant for robust uncertainty.</span>
          </div>
          <span style={{ color: "var(--text)" }}>MC-TTA (20 passes)</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
          <div className="tooltip-container">
            <span style={{ fontWeight: 600, borderBottom: "1px dotted var(--muted)", cursor: "help" }}>Explainability</span>
            <span className="tooltip-text" style={{ bottom: "100%", left: 0, transform: "none", marginBottom: "5px", width: "230px", zIndex: 100 }}>Score-CAM extracts visual explanations without relying on gradients, providing more reliable heatmaps of model focus areas.</span>
          </div>
          <span style={{ color: "var(--text)" }}>Score-CAM Heatmaps</span>
        </div>
      </div>
    </div>
  );
}
