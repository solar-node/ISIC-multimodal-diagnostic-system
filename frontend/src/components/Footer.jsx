import { Globe, Code, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-col">
        <h4>About Dermascope AI</h4>
        <p>An advanced multimodal diagnostic support system designed to assist dermatologists. It fuses visual CNN features with patient metadata to provide highly accurate, explainable melanoma predictions.</p>
      </div>
      <div className="footer-col">
        <h4>Clinical Scope</h4>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          <li>• Supports 6 distinct anatomical sites</li>
          <li>• Integrates patient age & biological sex</li>
          <li>• Optimized for dermoscopy imagery</li>
          <li>• Automatic high-uncertainty flagging</li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Developer</h4>
        <p>Explore the project source code or view more related work below.</p>
        <div className="footer-socials">
          <a href="https://aditya-solar-node.vercel.app/" target="_blank" rel="noreferrer" title="Portfolio"><Globe size={14} /> Portfolio</a>
          <a href="https://github.com/solar-node" target="_blank" rel="noreferrer" title="GitHub"><Code size={14} /> GitHub</a>
          <a href="mailto:vishusingh212301@gmail.com" target="_blank" rel="noreferrer" title="Email"><Mail size={14} /> Email</a>
        </div>
      </div>
    </footer>
  );
}
