import React, { createContext, useContext, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const MultiWebSocketContext = createContext();

export const MultiWebSocketProvider = ({ children }) => {
  // First WebSocket connection
  const {
    sendMessage: sendMessage1,
    lastMessage: lastMessage1,
    readyState: readyState1
  } = useWebSocket(import.meta.env.VITE_API_SOCKURL_1, {
    onOpen: () => console.log('WebSocket 1 opened'),
    onClose: () => console.log('WebSocket 1 closed'),
    shouldReconnect: () => true,
  });

  // Second WebSocket connection
  const {
    sendMessage: sendMessage2,
    lastMessage: lastMessage2,
    readyState: readyState2
  } = useWebSocket(import.meta.env.VITE_API_SOCKURL_2, {
    onOpen: () => console.log('WebSocket 2 opened'),
    onClose: () => console.log('WebSocket 2 closed'),
    shouldReconnect: () => true,
  });

  const [messageHistory1, setMessageHistory1] = useState([]);
  const [messageHistory2, setMessageHistory2] = useState([]);

  // Handle messages from first WebSocket
  useEffect(() => {
    if (lastMessage1 !== null) {
      console.log('Message from WS1:', lastMessage1);
      setMessageHistory1((prev) => [...prev, lastMessage1]);
    }
  }, [lastMessage1]);

  // Handle messages from second WebSocket
  useEffect(() => {
    if (lastMessage2 !== null) {
      console.log('Message from WS2:', lastMessage2);
      setMessageHistory2((prev) => [...prev, lastMessage2]);
    }
  }, [lastMessage2]);

  const value = {
    // WebSocket 1
    sendMessage1,
    messageHistory1,
    readyState1,
    isConnected1: readyState1 === ReadyState.OPEN,
    
    // WebSocket 2
    sendMessage2,
    messageHistory2,
    readyState2,
    isConnected2: readyState2 === ReadyState.OPEN,
  };

  return (
    <MultiWebSocketContext.Provider value={value}>
      {children}
    </MultiWebSocketContext.Provider>
  );
};

export const useMultiWebSocket = () => {
  const context = useContext(MultiWebSocketContext);
  if (!context) {
    throw new Error('useMultiWebSocket must be used within MultiWebSocketProvider');
  }
  return context;
};
