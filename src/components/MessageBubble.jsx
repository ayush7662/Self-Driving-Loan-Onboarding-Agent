import React from "react";

function MessageBubble({ message, isUser }) {
  return (
    <div className={`message-bubble ${isUser ? "user" : "agent"}`}>
      <div className="message-content">{message}</div>
    </div>
  );
}

export default MessageBubble;
