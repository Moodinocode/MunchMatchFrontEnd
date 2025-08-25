import { createContext, useContext, useRef, useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import usePollStore from '../store/usePollStore';
import useNotificationStore from '../store/useNotificationStore';
import { AuthContext } from './AuthContext';
import { ToastContainer,toast } from 'react-toastify';

const notify = (message) => {
  console.log(message)
  toast.info( `New Notification: ${message.title}`, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        //transition: Bounce,
                    });;
                  }

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const clientRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const {handleVoteChange, addPoll} = usePollStore();
    const {addNotification} = useNotificationStore()
    const {user} = useContext(AuthContext)

  useEffect(() => {
    const client = new Client({
      brokerURL: import.meta.env.VITE_API_SOCKURL+'?token='+ sessionStorage.getItem("token"),
      // brokerURL: import.meta.env.VITE_API_SOCKURL,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: 'Bearer '+sessionStorage.getItem("token"),
        'ngrok-skip-browser-warning': 'true'
      },
      onConnect: () => {
        // client.publish({
        //   destination: '/app/auth',
        //   headers: {
        //     Authorization: 'Bearer '+sessionStorage.getItem("token")
        //   }
        // })


        setConnected(true);
        console.log("connected")
        client.subscribe('/topic/vote', (message) => {

          const body = JSON.parse(message.body);
  
          console.log('Parsed body:', body);

          handleVoteChange(body)
          setMessages((prev) => [...prev, body.content]);
        });
        client.subscribe(`/user/queue/poll`, (message) => {
          console.log(message)
          const body = JSON.parse(message.body);
          addPoll(body)
          console.log(body+ 'from sock 3333')
          setMessages((prev) => [...prev, body.content]);
        });
        client.subscribe('/topic/notification', (message) => {
          const body = JSON.parse(message.body);
          console.log(body+ 'from not sock')
          console.log(body+ 'from not sock')
          addNotification(body);
          notify(body)
        });

        // client.subscribe(`/topic/notification/${user.id}`, (message) => {
        //   const body = JSON.parse(message.body);
        //   addNotification(body);
        //   notify(body)
        // });
        client.subscribe(`/user/queue/notification`, (message) => {
          const body = JSON.parse(message.body);
          console.log("notification has arrivaed")
          console.log(message + " from sock 333")

          console.log("user notification: " , body)
          addNotification(body);
          notify(body)
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      setConnected(false);
    };
  }, []);

  const sendMessage = (destination, body) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body),
      });
  
    }
  };
  const disconnect = () => {
  if (clientRef.current) {
    clientRef.current.deactivate();
    clientRef.current = null;
    setConnected(false);
    console.log("WebSocket disconnected manually");
  }
  } ;


  return (
    <WebSocketContext.Provider value={{ connected, messages, sendMessage,disconnect  }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
// import { createContext, useContext, useRef, useState, useEffect } from 'react';
// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client'; 
// import usePollStore from '../store/usePollStore';
// import useNotificationStore from '../store/useNotificationStore';
// import { AuthContext } from './AuthContext';
// import { ToastContainer, toast } from 'react-toastify';

// const notify = (message) => {
//   toast.info(`New Notification: ${message.title}`, {
//     position: "bottom-right",
//     autoClose: 5000,
//     hideProgressBar: false,
//     closeOnClick: false,
//     pauseOnHover: true,
//     draggable: true,
//     theme: "colored",
//   });
// };

// const WebSocketContext = createContext();

// export const WebSocketProvider = ({ children }) => {
//   const clientRef = useRef(null);
//   const [connected, setConnected] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const { handleVoteChange, addPoll } = usePollStore();
//   const { addNotification } = useNotificationStore();
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     const client = new Client({
//       // webSocketFactory: () => new SockJS("/ws"),
//       webSocketFactory: () => new SockJS(import.meta.env.VITE_API_SOCKURL),
//       reconnectDelay: 5000,
//       connectHeaders: {
//         Authorization: 'Bearer ' + sessionStorage.getItem("token"),
//         'ngrok-skip-browser-warning': 'true'
//       },
//       onConnect: () => {
//         setConnected(true);
//         console.log("connected");

//         client.subscribe('/topic/vote', (message) => {
    
//           const body = JSON.parse(message.body);
//            console.log(body)
//           handleVoteChange(body);
//           setMessages((prev) => [...prev, body.content]);
//         });

//         // client.subscribe(`/topic/poll/${user.id}`, (message) => {
//         //   const body = JSON.parse(message.body);
//         //   addPoll(body);
//         //   setMessages((prev) => [...prev, body.content]);
//         // });
        
//         client.subscribe(`/user/queue/poll`, (message) => {
//           const body = JSON.parse(message.body);
//           addPoll(body);
//           setMessages((prev) => [...prev, body.content]);
//         });

//         client.subscribe('/topic/notification', (message) => {
//           const body = JSON.parse(message.body);
//           addNotification(body);
//           notify(body);
//         });

//         client.subscribe(`/user/queue/notification`, (message) => {
//           const body = JSON.parse(message.body);
//           console.log("user notification:", body);
//           addNotification(body);
//           notify(body);
//         });
//       },
//       onStompError: (frame) => {
//         console.error('STOMP error:', frame.headers['message']);
//       },
//     });

//     client.activate();
//     clientRef.current = client;

//     return () => {
//       client.deactivate();
//       setConnected(false);
//     };
//   }, []);

//   const sendMessage = (destination, body) => {
//     if (clientRef.current && connected) {
//       clientRef.current.publish({
//         destination,
//         body: JSON.stringify(body),
//       });
//     }
//   };

//   const disconnect = () => {
//     if (clientRef.current) {
//       clientRef.current.deactivate();
//       clientRef.current = null;
//       setConnected(false);
//       console.log("WebSocket disconnected manually");
//     }
//   };

//   return (
//     <WebSocketContext.Provider value={{ connected, messages, sendMessage, disconnect }}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// export const useWebSocket = () => useContext(WebSocketContext);
