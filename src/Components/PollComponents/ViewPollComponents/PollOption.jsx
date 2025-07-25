import PollVoters from './PollVoters';
import ViewRestaurantDetails from './ViewRestaurantDetails';
import ViewPollVoters from './ViewPollVoters';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
// import { useMultiWebSocket } from '../../../Context/MultiWebSocketContext';
import usePollStore from '../../../store/usePollStore';
import { useWebSocket } from '../../../Context/WebSocketContext'

const PollOption = ({ pollId, optionId,ended = false, count }) => {
  const { updateVote } = usePollStore();
  const { user } = useContext(AuthContext);
  const { messages, sendMessage, connected} = useWebSocket();
  
  // Get the specific option and poll from store
  const option = usePollStore((state) =>
    state.polls
      .find((p) => p.id === pollId)
      ?.options.find((o) => o.id === optionId)
  );
  
  const poll = usePollStore((state) =>
    state.polls.find((p) => p.id === pollId)
  );

  const [isVotersModalOpen, setIsVotersModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Early return if option or poll not found
  if (!option || !poll) {
    return <div>Option not found</div>;
  }

  const allowMultipleVotes = poll.allowMultipleVotes;

  // Calculate if this option is selected - ADD NULL CHECKS FOR VOTERS
let selected = false;

if (user) {
  if (allowMultipleVotes) {
    selected = (option.voters || []).some((v) => v.id === user.id);
  } else {
    const selectedOption = poll.options.find((o) =>
      (o.voters || []).some((v) => v.id === user.id)
    );
    selected = selectedOption?.id === option.id;
  }
}




  const { title, Details, voters = [] } = option; // Default voters to empty array
  const ratio = count === 0 ? 0 : (voters.length / count) * 100;

  const handleVote = () => {
    console.log("test")
    if (allowMultipleVotes) {
      if (connected) {
         console.log("after connect")
      sendMessage('/app/vote',{
          userId: user.id,
          pollOptionId: option.id,
          voteAction: selected ? "remove" : "add",
          previousOptionId: null
        });

        console.log("after send")
    
      updateVote({
        userId: user.id,
        pollOptionId: option.id,
        voteAction: selected ? "remove" : "add",
      });
    }
    } else {
      if (selected) {
        if (connected) {
          sendMessage('/app/vote',{
              userId: user.id,
              pollOptionId: option.id,
              voteAction: "remove",
              previousOptionId: null
          });
        
          updateVote({
            userId: user.id,
            pollOptionId: option.id,
            voteAction: "remove",
          });
        }
      } else {
        // If not selected, update vote (remove from previous, add to current)
        const previousOption = poll.options.find((o) =>
          (o.voters || []).some((v) => v.id === user.id) // Add null check here too
        );
        if (connected) {
          sendMessage('/app/vote', previousOption ? {
              userId: user.id,
              pollOptionId: option.id,
              voteAction: "update",
  
              previousOptionId: previousOption?.id,
          }: {
              userId: user.id,
              pollOptionId: option.id,
              voteAction: "add",
       
              previousOptionId: null,
          });
          
        
          updateVote( previousOption ? {
            userId: user.id,
            pollOptionId: option.id,
            voteAction: "update",
            previousOptionId: previousOption?.id ,
          }: {
              userId: user.id,
              pollOptionId: option.id,
              voteAction: "add",
              previousOptionId: null,
          });
        }
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
            name={allowMultipleVotes ? `poll-multi-${option.id}` : `poll-${pollId}`}
            value={option.id}
            defaultChecked={selected}
            onChange={allowMultipleVotes ? handleVote : undefined}
            onClick={allowMultipleVotes ? undefined : handleVote}
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