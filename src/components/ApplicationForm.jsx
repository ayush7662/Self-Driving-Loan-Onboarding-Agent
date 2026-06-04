import React from "react";
import FormField from "./FormField.jsx";

function ApplicationForm({ formData, fieldStatus, onFieldChange }) {
  return (
    <div className="application-form">
      <h2>Loan Application</h2>
      
      <div className="form-section">
        <h3>Personal Information</h3>
        <FormField
          label="Full Name"
          value={formData.fullName}
          status={fieldStatus.fullName || "empty"}
          onChange={(value) => onFieldChange("fullName", value)}
        />
        <FormField
          label="Date of Birth"
          value={formData.dob}
          status={fieldStatus.dob || "empty"}
          onChange={(value) => onFieldChange("dob", value)}
        />
        <FormField
          label="Mobile Number"
          value={formData.mobile}
          status={fieldStatus.mobile || "empty"}
          onChange={(value) => onFieldChange("mobile", value)}
        />
      </div>

      <div className="form-section">
        <h3>Business Information</h3>
        <FormField
          label="GSTIN"
          value={formData.gstin}
          status={fieldStatus.gstin || "empty"}
          onChange={(value) => onFieldChange("gstin", value)}
        />
        <FormField
          label="Business Name"
          value={formData.businessName}
          status={fieldStatus.businessName || "empty"}
          onChange={(value) => onFieldChange("businessName", value)}
        />
        <FormField
          label="Business Type"
          value={formData.businessType}
          status={fieldStatus.businessType || "empty"}
          onChange={(value) => onFieldChange("businessType", value)}
        />
        <FormField
          label="Business Address"
          value={formData.businessAddress}
          status={fieldStatus.businessAddress || "empty"}
          onChange={(value) => onFieldChange("businessAddress", value)}
        />
        <FormField
          label="GST Registration Date"
          value={formData.gstRegDate}
          status={fieldStatus.gstRegDate || "empty"}
          onChange={(value) => onFieldChange("gstRegDate", value)}
        />
      </div>

      <div className="form-section">
        <h3>Financial Information</h3>
        <FormField
          label="ITR Annual Income (₹)"
          value={formData.itrIncome}
          status={fieldStatus.itrIncome || "empty"}
          onChange={(value) => onFieldChange("itrIncome", value)}
        />
        <FormField
          label="ITR Filing Year"
          value={formData.itrFilingYear}
          status={fieldStatus.itrFilingYear || "empty"}
          onChange={(value) => onFieldChange("itrFilingYear", value)}
        />
        <FormField
          label="Bank Inferred Income (₹)"
          value={formData.bankInferredIncome}
          status={fieldStatus.bankInferredIncome || "empty"}
          onChange={(value) => onFieldChange("bankInferredIncome", value)}
        />
        <FormField
          label="Bank Account Name"
          value={formData.bankAccountName}
          status={fieldStatus.bankAccountName || "empty"}
          onChange={(value) => onFieldChange("bankAccountName", value)}
        />
        <FormField
          label="Average Balance (₹)"
          value={formData.averageBalance}
          status={fieldStatus.averageBalance || "empty"}
          onChange={(value) => onFieldChange("averageBalance", value)}
        />
      </div>

      <div className="form-legend">
        <h4>Status Legend:</h4>
        <div className="legend-item">
          <span className="legend-dot filled"></span>
          <span>Filled from verified source</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot not-available"></span>
          <span>Not available (data not found)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot flagged"></span>
          <span>Flagged (needs review)</span>
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;
