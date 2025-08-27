import Navbar from '../Components/Navbar'
import PollCard from '../Components/PollComponents/ViewPollComponents/PollCard'
import { useLocation } from 'react-router-dom'
import CreatePollButton from '../Components/PollComponents/CreatePollComponents/CreatePollButton'
import CreatePollModal from '../Components/PollComponents/CreatePollComponents/CreatePollModal'
import { useEffect, useState, useContext } from 'react'
// import polls from '../assets/pollsDummyData'
import { getPolls, isAuther } from '../Services/pollsService'
import { AuthContext } from '../Context/AuthContext'
import { useWebSocket } from '../Context/WebSocketContext'
import usePollStore from '../store/usePollStore'
import Spinner from '../Components/Spinner'
import SlidingPagination from '../Components/SlidingPagination'

const PollsPage = () => {
  const {polls, loading,error, fetchPolls} = usePollStore();
  const isMyPolls = true;
  const [isModalOpen,setIsModalOpen] = useState(false)
  const [value,setvalue] = useState(false)
  const[onlyActive,setOnlyActive] = useState(false)

  const [currentPage, setCurrentPage] = useState(1);
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
  };


  useEffect(()=> {
    fetchPolls(onlyActive,currentPage-1);
  },[onlyActive,fetchPolls,currentPage])




  const { sendMessage } = useWebSocket();

  return (
    <div>
      <Navbar/>
      {/* <button className='btn btn-primary' onClick={()=> setvalue(!value)}></button> */}
          {loading ? (
                <div className="flex justify-center items-center h-full p-4">
               <Spinner />
               </div>
              ):(
                <>
      <div className='flex justify-end px-12 py-4'>

        <div className="flex items-center gap-2 mr-4">
          <input 
            type="checkbox" 
            id="onlyActive" 
            checked={onlyActive}
            onChange={() => setOnlyActive(!onlyActive)}
            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" 
          />
          <label htmlFor="onlyActive" className="text-gray-700 font-medium">
            Only Active
          </label>
        </div>

        {isMyPolls && <CreatePollButton setIsModalOpen={setIsModalOpen}/>}
        {isModalOpen && <CreatePollModal setIsModalOpen={setIsModalOpen}/>}
      </div>
      <div className='flex flex-wrap gap-6 justify-center'>

          {polls.map((poll) => {
            
            //console.log(poll);
            return <PollCard sendMessage={sendMessage}  key={poll.id} poll={poll}  />;
          })}


      </div>
                <SlidingPagination
      currentPage={currentPage}
      totalPages={50}
      onPageChange={handlePageChange}
    />
      </>
  )}
      
      
    </div>
    
  )
}

export default PollsPage