import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WebSocketDemo = () => {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('wss://echo.websocket.org');
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket("wss://0b3fc0f35ea3.ngrok-free.app/ws");

  useEffect(() => {

    if (lastMessage !== null) {
            console.log(lastMessage)
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

//   const handleClickChangeSocketUrl = useCallback(
//     () => setSocketUrl('wss://demos.kaazing.com/echo'),
//     []
//   );

  const handleClickSendMessage = useCallback(() => sendMessage(JSON.stringify(test)), []);

//   const connectionStatus = {
//     [ReadyState.CONNECTING]: 'Connecting',
//     [ReadyState.OPEN]: 'Open',
//     [ReadyState.CLOSING]: 'Closing',
//     [ReadyState.CLOSED]: 'Closed',
//     [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
//   }[readyState];

  return (
    <div>
      {/* <button className='btn btn-primary' onClick={handleClickChangeSocketUrl}>
        Click Me to change Socket Url
      </button> */}
      <button
        className='btn btn-primary'
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'Hello'
      </button>
      {/* <span>The WebSocket is currently {connectionStatus}</span> */}
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul>
    </div>
  );
};

// export default WebSocketDemo;


//    const vote = {
//         userId: 4,
//         type: "vote",
//         voteAction: "remove",
//         pollOptionId: 57,
//         previousOptionId: null
//     }
//      const handleClickSendMessage = useCallback(() => sendMessage(JSON.stringify(test)), []);
