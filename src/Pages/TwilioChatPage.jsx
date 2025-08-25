import React, { useEffect } from 'react'
import ConversationSidebar from '../Components/ChatComponents/ConversationSidebar'
import CoversationChatInterface from '../Components/ChatComponents/CoversationChatInterface'
import useConversationStore from '../store/useConversationStore'
import Navbar from '../Components/Navbar'
const TwilioChatPage = () => {
  const {initClient} = useConversationStore();

  useEffect(() => {
    initClient();
  }
  , [initClient]);
  return (
    <div className='flex flex-col h-screen'>
        <Navbar/>
        <div className='flex overflow-hidden border-t-2 border-gray-400'>
          <ConversationSidebar />
          <CoversationChatInterface/>
        </div>
    
    </div>
  )
}

export default TwilioChatPage