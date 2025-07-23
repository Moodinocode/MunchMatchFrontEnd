import PollVoters from './PollVoters';
import ViewRestaurantDetails from './ViewRestaurantDetails';
import ViewPollVoters from './ViewPollVoters';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import { useMultiWebSocket } from '../../../Context/MultiWebSocketContext';

const PollOption = ({ id, allowMultipleVotes = false, count, option, setSelected, selected ,sendMessage}) => {
  const [isVotersModalOpen, setIsVotersModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const {user} = useContext(AuthContext)
   const {
    sendMessage1,
    messageHistory1,
    isConnected1,
    sendMessage2,
    messageHistory2,
    isConnected2
  } = useMultiWebSocket();

   const submitVote = (obj) => {
    if (isConnected1) {
      sendMessage1(obj);
    }
  };

  const { title, Details, voters } = option;
  const ratio = count === 0 ? 0 : (voters.length / count) * 100;

  console.log(voters)

  // Check if this option is currently selected
  const isSelected = allowMultipleVotes 
    ? (selected || []).includes(option.id)
    : selected === option.id;

  const handleSelectionChange = (e) => {
    if (allowMultipleVotes) {
      // Multi-select logic (checkbox)
       if (selected.includes(option.id)) {
        submitVote(JSON.stringify({
          userId: user.id,
          type: "vote",
          voteAction: "remove",
          pollOptionId: option.id,
          previousOptionId: null
        }))} else {
          submitVote(JSON.stringify({
          userId: user.id,
          type: "vote",
          voteAction: "add",
          pollOptionId: option.id,
          previousOptionId: null
        }))
        }
      


      setSelected((prev) =>
        e.target.checked
          ? [...(prev || []), option.id] 
          : (prev || []).filter((id) => id !== option.id) 
      );
      
    } else {
      // Single-select logic (radio with deselection)
      if (selected === option.id) {
        submitVote(JSON.stringify({
          userId: user.id,
          type: "vote",
          voteAction: "remove",
          pollOptionId: option.id,
          previousOptionId: null
    }))
        
        setSelected(null);
      } else {
        if(selected === null) {
          submitVote(JSON.stringify({
          userId: user.id,
          type: "vote",
          voteAction: "add",
          pollOptionId: option.id,
          previousOptionId: null
      }))
        } else{
          submitVote(JSON.stringify({
          userId: user.id,
          type: "vote",
          voteAction: "update",
          pollOptionId: option.id,
          previousOptionId: selected
    }))
        }
        setSelected(option.id);
      }
    }
  };



  return (
    <div>
      <label className="input input-primary cursor-pointer flex flex-col items-start justify-start h-20 w-full">
        <div className="flex gap-2 mt-2 h-5 w-full">
         <input
  className={`${allowMultipleVotes ? 'checkbox' : 'radio'} ${allowMultipleVotes ? 'checkbox-primary' : 'radio-primary'} h-4 w-4 mt-1`}
  type={allowMultipleVotes ? 'checkbox' : 'radio'}
  name={allowMultipleVotes ? `poll-multi-${option.id}` : 'poll'}
  value={option.id}
  checked={isSelected}
  onClick={(e) => {
    // 👇 Custom logic to allow radio deselection
    if (!allowMultipleVotes && selected === option.id) {
      e.preventDefault(); // prevent default radio behavior
      handleSelectionChange(e); // call custom handler to deselect
    }
  }}
  onChange={(e) => {
    // Only trigger change if it's a new selection
    if (allowMultipleVotes || selected !== option.id) {
      handleSelectionChange(e);
    }
  }}
/>

          <div className="mt-[1.2px]">{title}</div>
          <button
            className="btn btn-success text-black h-4 text-[10px] p-1.5 mt-0.5 ml-auto hover:text-white"
            onClick={() => setIsDetailsModalOpen(true)}
          >
            View Details
          </button>
        </div>

        <button onClick={() => setIsVotersModalOpen(true)}>
          <PollVoters voters={voters} />
        </button>

        <div className="w-full relative h-[2px] bg-gray-200 rounded">
          <div
            className="absolute top-0 left-0 h-full bg-gray-500 rounded"
            style={{ width: `${ratio}%` }}
          />
          <span className="absolute -top-6 right-0 text-sm text-gray-500">
            {ratio.toFixed(1)}%
          </span>
        </div>
      </label>
      
      {isDetailsModalOpen && (
        <ViewRestaurantDetails 
          title={option.title} 
          description={option.description}
          imageUrls={option.imageUrls}
          tags={option.tags}
          setIsDetailsModalOpen={setIsDetailsModalOpen} 
        />
      )}
      {isVotersModalOpen && (
        <ViewPollVoters 
          voters={voters} 
          setIsVotersModalOpen={setIsVotersModalOpen} 
        />
      )}
    </div>
  );
};

export default PollOption;