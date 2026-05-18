import { Activity } from "lucide-react";

export default function PatientMetadata({
  patientName,
  setPatientName,
  sex,
  setSex,
  age,
  setAge,
  site,
  setSite,
  errorMsg,
  setErrorMsg,
  SITES
}) {
  return (
    <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
        <Activity size={15} color="var(--teal)" strokeWidth={1.8} />
        <span style={{ fontSize: 15, fontWeight: 600 }}>Patient Metadata</span>
      </div>

      <div>
        <label className="label">Patient Name (Optional)</label>
        <input
          type="text"
          value={patientName}
          onChange={e => setPatientName(e.target.value)}
          placeholder="e.g. Jane Doe"
          className="input-field"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label className="label">Sex</label>
          <select value={sex} onChange={e => setSex(e.target.value)} className="input-field">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div>
          <label className="label">Age</label>
          <input
            type="number"
            min={1} max={120}
            value={age}
            onChange={e => { setAge(e.target.value); setErrorMsg(""); }}
            placeholder="e.g. 78"
            className={`input-field ${errorMsg.includes("age") ? "error" : ""}`}
          />
          {errorMsg.includes("age") && <span className="error-text">Required</span>}
        </div>
      </div>

      <div>
        <label className="label">Anatomical Site</label>
        <select value={site} onChange={e => setSite(e.target.value)} className="input-field">
          {SITES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}
