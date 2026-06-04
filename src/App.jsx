import React, { useState, useEffect } from "react";
import ChatPanel from "./components/ChatPanel.jsx";
import ApplicationForm from "./components/ApplicationForm.jsx";
import { STATES, getInitialState } from "./agent/agentEngine.js";

function App() {
  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    mobile: "",
    gstin: "",
    businessName: "",
    businessType: "",
    businessAddress: "",
    gstRegDate: "",
    itrIncome: "",
    itrFilingYear: "",
    bankInferredIncome: "",
    bankAccountName: "",
    averageBalance: "",
  });

  // Field status state (filled, not-available, flagged, empty)
  const [fieldStatus, setFieldStatus] = useState({});

  // Agent state
  const [agentState, setAgentState] = useState(getInitialState());
  const [messages, setMessages] = useState([
    { text: agentState.prompt, isUser: false },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to update a single field
  const setField = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Helper to update a single field status
  const setFieldStatusHelper = (fieldName, status) => {
    setFieldStatus((prev) => ({ ...prev, [fieldName]: status }));
  };


  const handleSendMessage = async (userMessage) => {
    if (isProcessing) return;

    // Add user message
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsProcessing(true);

    // Get current state handler
    const currentState = STATES[agentState.currentState];
    if (!currentState) {
      setIsProcessing(false);
      return;
    }

    // Process the reply
    try {
      const result = await currentState.onReply(
        userMessage,
        setField,
        setFieldStatusHelper,
        agentState.context
      );

      // Update agent state
      setAgentState({
        currentState: result.next,
        prompt: STATES[result.next].prompt,
        context: result.context,
      });

      // Add agent response
      setMessages((prev) => [...prev, { text: result.say, isUser: false }]);
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong. Please try again.", isUser: false },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle field change from form
  const handleFieldChange = (fieldName, value) => {
    setField(fieldName, value);
    // When user manually edits, mark as filled
    setFieldStatusHelper(fieldName, "filled");
  };

  return (
    <div className="app">
      <div className="split-screen">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
        />
        <ApplicationForm
          formData={formData}
          fieldStatus={fieldStatus}
          onFieldChange={handleFieldChange}
        />
      </div>
    </div>
  );
}

export default App;
