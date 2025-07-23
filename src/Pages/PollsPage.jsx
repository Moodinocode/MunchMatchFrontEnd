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

const PollsPage = () => {
  //const location = useLocation()
  // const isMyPolls = location.pathname === '/mypolls'
  const isMyPolls = true;
  const [isModalOpen,setIsModalOpen] = useState(false)
  const [value,setvalue] = useState(false)
  const [polls,setPolls] = useState([]);

  const { user } = useContext(AuthContext);
  
  //query that gets the polls inside useEffect hook
  //incase isMyPolls is true then filter where created by user
  //query can be adjusted to add filter

  useEffect(()=> {
    getPolls(sessionStorage.getItem("token"))
      .then(response => setPolls(response.data.content))
        .catch(error => console.log("Error fetching polls:"+error))
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
        {polls.map((poll) => {
          
          //console.log(poll);
          return <PollCard sendMessage={sendMessage}  key={poll.id} poll={poll} isAuthor={user.id ===poll.createdById} />;
        })}
      </div>
      
      
    </div>
    
  )
}

export default PollsPage