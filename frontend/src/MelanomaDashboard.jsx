import { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ImageModal from "./components/ImageModal";
import UploadSection from "./components/UploadSection";
import PatientMetadata from "./components/PatientMetadata";
import ActionSection from "./components/ActionSection";
import ArchitectureInfo from "./components/ArchitectureInfo";
import RightPanel from "./components/RightPanel";

const PHASES = [
  "Preprocessing & cleaning image...",
  "Processing clinical metadata...",
  "Running MC-TTA (20 passes)...",
  "Generating Score-CAM heatmap...",
  "Finalizing diagnostic report..."
];

const SITES = [
  "Torso", "Lower Extremity", "Upper Extremity",
  "Head / Neck", "Palms / Soles", "Oral / Genital", "Unknown",
];

export default function App() {
  // Try to load theme from local storage or default to system preference
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [imgFile, setImgFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState("");
  const [site, setSite] = useState("Upper Extremity");
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [zoomImg, setZoomImg] = useState(null);

  const fileRef = useRef();
  const timerRef = useRef();

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    document.documentElement.className = dark ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    if (!loading) { clearInterval(timerRef.current); return; }
    setPhase(0);
    timerRef.current = setInterval(() => {
      setPhase(p => p < PHASES.length - 1 ? p + 1 : p);
    }, 2000);
    return () => clearInterval(timerRef.current);
  }, [loading]);

  function pickFile(f) {
    if (!f || !f.type.startsWith("image/")) return;
    setImgFile(f);
    setImgSrc(URL.createObjectURL(f));
    setResult(null);
    setErrorMsg("");
  }

  async function loadSample(type) {
    try {
      const filename = type === "benign" ? "benign.jpg" : "malignant.jpeg";
      const response = await fetch(`/samples/${filename}`);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: "image/jpeg" });
      pickFile(file);

      if (type === "benign") {
        setAge("35");
        setSex("female");
        setSite("lower extremity");
      } else {
        setAge("65");
        setSex("male");
        setSite("torso");
      }
    } catch (e) {
      console.error("Failed to load sample image", e);
    }
  }

  function validate() {
    if (!imgFile) return "Please upload an image.";
    if (!age || age < 1 || age > 120) return "Please enter a valid age (1-120).";
    return null;
  }

  async function analyze() {
    const vError = validate();
    if (vError) {
      setErrorMsg(vError);
      return;
    }
    setErrorMsg("");
    if (loading) return;

    setLoading(true);
    setResult(null);

    const fd = new FormData();
    fd.append("image", imgFile);
    fd.append("sex", sex);
    fd.append("age", age);
    fd.append("anatom_site", site.toLowerCase());

    try {
      console.log("Sending request to:", API);
      const r = await fetch(API, { method: "POST", body: fd });

      if (!r.ok) {
        const errText = await r.text();
        throw new Error(`HTTP Error ${r.status}: ${errText.substring(0, 100)}`);
      }

      const d = await r.json();

      if (d.error) {
        setErrorMsg("API Error: " + d.error);
        setResult(null);
      } else {
        if (d.original_image_b64 && !d.original_image_b64.startsWith('data:image')) {
          d.original_image_b64 = `data:image/png;base64,${d.original_image_b64}`;
        }
        if (d.heatmap_overlay_b64 && !d.heatmap_overlay_b64.startsWith('data:image')) {
          d.heatmap_overlay_b64 = `data:image/png;base64,${d.heatmap_overlay_b64}`;
        }
        setResult(d);
      }
    } catch (e) {
      setErrorMsg(e.message || "Failed to connect to the backend server.");
      console.error("Full error:", e);
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="app-container">
      <Header dark={dark} setDark={setDark} />

      <div className="dash-grid">
        <div className="left-panel">
          <UploadSection 
            imgSrc={imgSrc} 
            drag={drag} 
            setDrag={setDrag} 
            fileRef={fileRef} 
            pickFile={pickFile} 
            setImgSrc={setImgSrc} 
            setImgFile={setImgFile} 
            setResult={setResult} 
            setErrorMsg={setErrorMsg} 
            errorMsg={errorMsg} 
            loadSample={loadSample} 
          />
          <div style={{ height: 1, background: "var(--border)", margin: "0 1.5rem" }} />
          <PatientMetadata 
            patientName={patientName} setPatientName={setPatientName}
            sex={sex} setSex={setSex}
            age={age} setAge={setAge}
            site={site} setSite={setSite}
            errorMsg={errorMsg} setErrorMsg={setErrorMsg}
            SITES={SITES}
          />
          <div style={{ height: 1, background: "var(--border)", margin: "0 1.5rem" }} />
          <ActionSection 
            loading={loading} errorMsg={errorMsg} result={result} 
            analyze={analyze} handlePrint={handlePrint} setResult={setResult} 
          />
          <div style={{ height: 1, background: "var(--border)", margin: "0 1.5rem" }} />
          <ArchitectureInfo />
        </div>

        <RightPanel 
          loading={loading} result={result} phase={phase} imgSrc={imgSrc} 
          patientName={patientName} age={age} sex={sex} site={site} 
          setZoomImg={setZoomImg} PHASES={PHASES}
        />
      </div>

      <Footer />
      <ImageModal zoomImg={zoomImg} setZoomImg={setZoomImg} />
    </div>
  );
}
