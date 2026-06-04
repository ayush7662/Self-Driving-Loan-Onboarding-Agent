import React from "react";
import MessageBubble from "./MessageBubble.jsx";
import ChatInput from "./ChatInput.jsx";
import TestDataHelper from "./TestDataHelper.jsx";

function ChatPanel({ messages, onSendMessage, isProcessing }) {
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h2>Loan Agent</h2>
        <div className="header-right">
          <TestDataHelper />
          <span className={`status-indicator ${isProcessing ? "processing" : ""}`}>
            {isProcessing ? "Processing..." : "Ready"}
          </span>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg.text} isUser={msg.isUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={onSendMessage} disabled={isProcessing} />
    </div>
  );
}

export default ChatPanel;
