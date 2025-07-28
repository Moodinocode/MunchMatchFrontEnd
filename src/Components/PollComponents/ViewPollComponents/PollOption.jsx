import PollVoters from './PollVoters';
import ViewRestaurantDetails from './ViewRestaurantDetails';
import ViewPollVoters from './ViewPollVoters';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import usePollStore from '../../../store/usePollStore';
import { useWebSocket } from '../../../Context/WebSocketContext'

const PollOption = ({ pollId, optionId, ended = false, count, isWinner = false }) => {
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
    // Prevent voting if poll has ended
    if (ended) return;
    
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

  // Dynamic classes based on poll state
  const getContainerClasses = () => {
    let baseClasses = "input input-primary flex flex-col items-start justify-start h-20 w-full relative transition-all duration-300";
    
    if (ended) {
      if (isWinner) {
        baseClasses += " bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 shadow-md shadow-yellow-100";
      } else {
        baseClasses += " bg-gray-50/50";
      }
    } else {
      baseClasses += " cursor-pointer hover:bg-gray-50";
    }
    
    return baseClasses;
  };

  const getProgressBarClasses = () => {
    if (ended && isWinner) {
      return "absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded animate-pulse";
    }
    return "absolute top-0 left-0 h-full bg-gray-500 rounded";
  };

  const getPercentageClasses = () => {
    if (ended && isWinner) {
      return "absolute -top-6 right-0 text-sm font-bold text-yellow-600";
    }
    return "absolute -top-6 right-0 text-sm text-gray-500";
  };

  return (
    <div className="relative">
      {/* Winner Crown Icon */}
      {ended && isWinner && (
        <div className="absolute -top-2 -right-2 z-10 bg-yellow-400 rounded-full p-1 shadow-lg">
          <svg className="w-4 h-4 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      <label className={getContainerClasses()}>
        <div className="flex gap-2 mt-2 h-5 w-full">
          <input
            className={`${allowMultipleVotes ? 'checkbox' : 'radio'} ${allowMultipleVotes ? 'checkbox-primary' : 'radio-primary'} h-4 w-4 mt-1 ${ended ? 'opacity-60' : ''}`}
            type={allowMultipleVotes ? 'checkbox' : 'radio'}
            name={allowMultipleVotes ? `poll-multi-${option.id}` : `poll-${pollId}`}
            value={option.id}
            defaultChecked={selected}
            onChange={allowMultipleVotes ? handleVote : undefined}
            onClick={allowMultipleVotes ? undefined : handleVote}
            disabled={ended}
          />

          <div className={`mt-[1.2px] ${ended && isWinner ? 'font-semibold text-yellow-800' : ''} ${ended && !isWinner ? 'text-gray-700' : ''}`}>
            {title}
            {ended && isWinner && <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">Winner</span>}
          </div>
          
          <button
            className={`btn btn-success text-black h-4 text-[10px] p-1.5 mt-0.5 ml-auto hover:text-white ${ended ? 'opacity-80' : ''}`}
            onClick={() => setIsDetailsModalOpen(true)}
          >
            View Details
          </button>
        </div>

        <button 
          onClick={() => setIsVotersModalOpen(true)}
          className={ended ? '' : ''}
        >
          <PollVoters voters={voters} />
        </button>

        <div className="w-full relative h-[2px] bg-gray-200 rounded">
          <div
            className={getProgressBarClasses()}
            style={{ width: `${ratio}%` }}
          />
          <span className={getPercentageClasses()}>
            {ratio.toFixed(1)}%
          </span>
        </div>
      </label>
      
      {/* Ended Poll Overlay - Removed the overlay that was blocking visibility */}
      
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
          voters={option.voters} 
          title={option.title}
          setIsVotersModalOpen={setIsVotersModalOpen} 
        />
      )}
    </div>
  );
};

export default PollOption;