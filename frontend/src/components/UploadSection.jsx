import { Upload, ImageIcon, X } from "lucide-react";

export default function UploadSection({
  imgSrc,
  drag,
  setDrag,
  fileRef,
  pickFile,
  setImgSrc,
  setImgFile,
  setResult,
  setErrorMsg,
  errorMsg,
  loadSample
}) {
  return (
    <div style={{ padding: "1.25rem 1.5rem" }}>
      {!imgSrc ? (
        <div
          className={`drop-zone ${drag ? 'drag-active' : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current.click()}
        >
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => pickFile(e.target.files[0])} />
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--teal-bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Upload size={22} color="var(--teal)" strokeWidth={1.8} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Upload lesion image</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Drag & drop or click to browse</div>
          <div style={{ fontSize: 12, color: "var(--hint)", marginTop: 4 }}>JPG, PNG · dermoscopy preferred</div>
        </div>
      ) : (
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: 260, background: "#000" }}>
          <img src={imgSrc} alt="Lesion preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(0,0,0,.55)", borderRadius: 8, padding: "5px 10px", display: "flex", alignItems: "center", gap: 6 }}>
            <ImageIcon size={12} color="#fff" />
            <span style={{ fontSize: 12, color: "#fff" }}>Lesion image loaded</span>
          </div>
          <button className="img-remove" onClick={() => { setImgSrc(null); setImgFile(null); setResult(null); setErrorMsg(""); }} title="Remove image">
            <X size={14} />
          </button>
        </div>
      )}
      {!imgSrc && errorMsg.includes("image") && <span className="error-text">{errorMsg}</span>}

      {!imgSrc && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
          <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>Try a sample:</span>
          <button onClick={() => loadSample('benign')} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "var(--text)" }}>
            <img src="/samples/benign.jpg" alt="Benign" style={{ width: 16, height: 16, borderRadius: 4, objectFit: "cover" }} />
            Benign
          </button>
          <button onClick={() => loadSample('malignant')} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontSize: 12, color: "var(--text)" }}>
            <img src="/samples/malignant.jpeg" alt="Malignant" style={{ width: 16, height: 16, borderRadius: 4, objectFit: "cover" }} />
            Malignant
          </button>
        </div>
      )}
    </div>
  );
}
