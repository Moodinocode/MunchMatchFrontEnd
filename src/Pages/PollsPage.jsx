import Navbar from '../Components/Navbar'
import PollCard from '../Components/PollComponents/ViewPollComponents/PollCard'
import { useLocation } from 'react-router-dom'
import CreatePollButton from '../Components/PollComponents/CreatePollComponents/CreatePollButton'
import CreatePollModal from '../Components/PollComponents/CreatePollComponents/CreatePollModal'
import { useEffect, useState, useContext } from 'react'
// import polls from '../assets/pollsDummyData'
import { getPolls, isAuther } from '../Services/pollsService'
import { AuthContext } from '../Context/AuthContext'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import usePollStore from '../store/usePollStore'

const PollsPage = () => {
  const {polls, loading,error, fetchPolls} = usePollStore();
  const isMyPolls = true;
  const [isModalOpen,setIsModalOpen] = useState(false)
  const [value,setvalue] = useState(false)


  useEffect(()=> {
    fetchPolls(sessionStorage.getItem("token"))
  },[])




  const { sendMessage, lastMessage, readyState } = useWebSocket(import.meta.env.VITE_API_SOCKURL);
  useEffect(() => {
    if (lastMessage !== null) {
            console.log(lastMessage)
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  
  return (
    <div>
      <Navbar/>
      {/* <button className='btn btn-primary' onClick={()=> setvalue(!value)}></button> */}

      <div className='flex justify-end px-12 py-4'>
        {isMyPolls && <CreatePollButton setIsModalOpen={setIsModalOpen}/>}
        {isModalOpen && <CreatePollModal setIsModalOpen={setIsModalOpen}/>}
      </div>
      <div className='flex flex-wrap gap-6 justify-center'>
        { loading ? <p>Loading polls...</p>:
          error ? <p>Error: {error}</p> :
          <>
          {polls.map((poll) => {
            
            //console.log(poll);
            return <PollCard sendMessage={sendMessage}  key={poll.id} poll={poll}  />;
          })}
          </>
        
      }
      </div>
      
      
    </div>
    
  )
}

export default PollsPage