import React, { useState, useRef, useContext } from 'react';
import useConversationStore from "../../store/useConversationStore";
import { AuthContext } from "../../Context/AuthContext";
import ChatMessage from './ChatMessage'; // Import the new component
import TypingIndicator from './TypingIndicator'; // Import TypingIndicator component


const CoversationChatInterface = () => {
  const { activeConversation, sendMessage } = useConversationStore();
  const { user } = useContext(AuthContext);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-base-content/60">Join or create a conversation</p>
      </div>
    );
  }

  // Get other participants (excluding current user)
  const otherParticipants = activeConversation.participants?.filter(
    participant => participant.identity !== user?.username
  ) || [];

  const getParticipantNames = () => {
    if (otherParticipants.length === 0) return "No participants";
    if (otherParticipants.length === 1) return otherParticipants[0].identity;
    return otherParticipants.map(p => p.identity).join(", ");
  };

  const isCurrentUserMessage = (message) => {
    return message.author === user?.username;
  };

  // Function to get user profile image URL
  const getUserProfileImage = (username) => {
    if (username === user?.username) {
      return user?.profileImageUrl;
    }
    
    // Find the participant's profile image
    const participant = activeConversation.participants?.find(
      p => p.identity === username
    );
    return participant?.profileImageUrl;
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(activeConversation.conversation.sid, newMessage);
    setNewMessage("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* WhatsApp-style Header */}
      <div className="p-4 border-b bg-base-200 shadow-sm">
        <div className="flex items-center space-x-3">
          {/* Avatar placeholder */}
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {getParticipantNames().charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Conversation info */}
          <div className="flex-1">
            <h3 className="font-semibold text-base text-base-content">
              {activeConversation.conversation.friendlyName || getParticipantNames()}
            </h3>
            <p className="text-sm text-base-content/60">
              {otherParticipants.length > 0 
                ? `${getParticipantNames()}`
                : 'No other participants'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
        {activeConversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-base-content/60 text-center">No messages yet</p>
          </div>
        ) : (
          <>
            {activeConversation.messages.map((msg) => (
              <ChatMessage
                key={msg.sid}
                message={msg.body}
                isCurrentUser={isCurrentUserMessage(msg)}
                author={msg.author}
                profileImageUrl={getUserProfileImage(msg.author)}
                timestamp={msg.timestamp}
              />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      <TypingIndicator conversationSid={activeConversation.conversation.sid} />

      {/* Input */}
      <div className="border-t p-4 bg-base-200">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
           <input
  value={newMessage}
  onChange={async (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (value.length > 0) {
      const { client, activeConversation } = useConversationStore.getState();
      if (client && activeConversation) {
        const conv = await client.getConversationBySid(activeConversation.conversation.sid);
        conv.typing(); // ✅ this is the real Twilio conversation
      }
    }
  }}
  onKeyDown={(e) => e.key === "Enter" && handleSend()}
  className="input input-bordered w-full pr-12 rounded-full"
  placeholder="Type a message..."
/>

          </div>
          <button 
            onClick={handleSend} 
            className="btn btn-primary btn-circle"
            disabled={!newMessage.trim()}
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoversationChatInterface;