import React, { useState } from "react";

function TestDataHelper() {
  const [isOpen, setIsOpen] = useState(false);

  const testData = {
    panNumbers: {
      "ABCDE1234F": "Happy Path - Complete data",
      "ZZZZZ9999Z": "No GST Case - Missing GST data",
      "MISMATCH5A": "Income Mismatch - ITR ₹20L vs Bank ₹12L",
    },
    otp: "Check browser console for OTP (appears when sent)",
    commands: {
      upload: "Simulate document upload",
      confirmed: "Confirm flagged data is correct",
    },
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <div className="test-data-helper">
      <button 
        className="test-data-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        📋 Test Data 
      </button>

      {isOpen && (
        <div className="test-data-popup">
          <div className="test-data-header">
            <h3>Test Data Helper</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="test-data-section">
            <h4>PAN Numbers (Click to Copy)</h4>
            {Object.entries(testData.panNumbers).map(([pan, description]) => (
              <div key={pan} className="test-data-item">
                <button 
                  className="copy-button"
                  onClick={() => copyToClipboard(pan)}
                >
                  📋
                </button>
                <span className="test-data-value">{pan}</span>
                <span className="test-data-description">- {description}</span>
              </div>
            ))}
          </div>

          <div className="test-data-section">
            <h4>OTP</h4>
            <div className="test-data-item">
              <span className="test-data-description">{testData.otp}</span>
            </div>
          </div>

          <div className="test-data-section">
            <h4>Commands (Click to Copy)</h4>
            {Object.entries(testData.commands).map(([cmd, description]) => (
              <div key={cmd} className="test-data-item">
                <button 
                  className="copy-button"
                  onClick={() => copyToClipboard(cmd)}
                >
                  📋
                </button>
                <span className="test-data-value">{cmd}</span>
                <span className="test-data-description">- {description}</span>
              </div>
            ))}
          </div>

          <div className="test-data-section">
            <h4>Test Scenarios</h4>
            <ul className="test-data-list">
              <li><strong>Happy Path:</strong> Use ABCDE1234F, follow all prompts</li>
              <li><strong>No GST:</strong> Use ZZZZZ9999Z, GST will show "Not available"</li>
              <li><strong>Income Mismatch:</strong> Use MISMATCH5A, income flag will appear</li>
              <li><strong>Wrong OTP:</strong> Enter incorrect OTP, must retry</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestDataHelper;
