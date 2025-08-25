import useConversationStore from "../store/useConversationStore";

export const updateTypingIndicator = (participant, isTyping) => {
  const { activeConversation, setTypingStarted, setTypingEnded } = useConversationStore.getState();
  
  if (!activeConversation) return;

  const conversationSid = activeConversation.conversation.sid;

  if (isTyping) {
    setTypingStarted(conversationSid, participant);
  } else {
    setTypingEnded(conversationSid, participant);
  }
};
