import React from "react";

function FormField({ label, value, status, onChange }) {
  return (
    <div className={`field field--${status}`}>
      <label>{label}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={status === "not-available" ? "Not available" : ""}
      />
      {status === "flagged" && <span className="warn">⚠ Needs review</span>}
      {status === "not-available" && <span className="na">Not available</span>}
    </div>
  );
}

export default FormField;
