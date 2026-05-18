import { X } from "lucide-react";

export default function ImageModal({ zoomImg, setZoomImg }) {
  if (!zoomImg) return null;
  return (
    <div className="modal-overlay" onClick={() => setZoomImg(null)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setZoomImg(null)}>
          <X size={20} />
        </button>
        <img src={zoomImg.src} alt={zoomImg.label} className="modal-img" />
        <div className="modal-footer">
          {zoomImg.label}
        </div>
      </div>
    </div>
  );
}
