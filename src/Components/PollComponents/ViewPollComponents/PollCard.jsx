import React, { useContext } from 'react'
import PollOption from './PollOption'
import { deactivatePoll } from '../../../Services/pollsService';
import { AuthContext } from '../../../Context/AuthContext';

const PollCard = ({ poll }) => {
    const { id, title, createdBy, createdAt, endDate, active, allowMultipleVotes, options = [] } = poll;
    
    const count = options.reduce((sum, option) => sum + (option.voters?.length || 0), 0);
    const { user } = useContext(AuthContext);

    // Check if poll has ended
    const now = new Date();
    const end = new Date(endDate);
    const hasEnded = end <= now || !active;

    // Find winner(s) - option(s) with the most votes
    const getWinners = () => {
        if (options.length === 0) return [];
        
        const maxVotes = Math.max(...options.map(option => option.voters?.length || 0));
        if (maxVotes === 0) return []; // No votes cast
        
        return options.filter(option => (option.voters?.length || 0) === maxVotes);
    };

    const winners = hasEnded ? getWinners() : [];

    const getTimeRemaining = (endDateString,act) => {
        const now = new Date();
        const end = new Date(endDateString);
        const diff = end - now;

        if (diff <= 0 || !act) return <p className='text-xs text-red-600 ml-2 font-semibold'>Ended</p>;

        const totalMinutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return (
            <div>
                <p className='text-xs text-gray-400 ml-2'>
                    ends in: {`${hours > 0 ? `${hours}h ` : ""}${minutes}min`}
                </p>
                <div className='flex justify-end'>
                    {user?.id === poll.createdById && !hasEnded && (
                        <button 
                            className='btn h-6 text-xs mt-1 bg-gray-300 hover:bg-red-400 hover:text-white transition-colors' 
                            onClick={() => {
                                deactivatePoll(id)
                            }}
                        >
                            end
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // Dynamic card classes based on poll state
    const getCardClasses = () => {
        let baseClasses = "card card-border border-3 m-3 bg-base-100 w-[425px] transition-all duration-300 shadow-md";
        
        if (hasEnded) {
            if (winners.length > 0) {
                baseClasses += " ring-1 ring-yellow-200";
            }
        } else {
            baseClasses += " hover:shadow-lg ring-1 ring-blue-100";
        }
        
        return baseClasses;
    };

    const getTitleClasses = () => {
        if (hasEnded) {
            return "card-title text-gray-800";
        }
        return "card-title";
    };

    return (
        <div className={getCardClasses()}>
            {/* Active Poll Banner */}
            {!hasEnded && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 border-b border-blue-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-600">Active Poll</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">Voting Open</span>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Ended Poll Banner */}
            {hasEnded && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-600">Poll Ended</span>
                        </div>
                        {winners.length > 0 && (
                            <div className="flex items-center gap-1 text-yellow-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">
                                    {winners.length === 1 ? 'Winner declared' : 'Tie result'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="card-body py-2 gap-0">
                <div className='flex justify-between'>
                    <div>
                        <h2 className={getTitleClasses()}>{title}</h2>
                        <p className='text-xs text-gray-400 ml-2'>{createdBy}</p>
                        
                        {/* Vote count display */}
                        <p className='text-xs text-gray-500 ml-2 mt-1'>
                            {count} {count === 1 ? 'vote' : 'votes'} cast
                        </p>
                    </div>
                    <div>
                        {getTimeRemaining(endDate,active)}
                    </div>
                </div>
               
                <div className="relative">
                    <div className='flex flex-col gap-2 mt-2'>
                        {options.map(option => (
                            <PollOption 
                                key={option.id}
                                pollId={poll.id} 
                                count={count}
                                ended={hasEnded}
                                optionId={option.id}
                                isWinner={winners.some(winner => winner.id === option.id)}
                            />
                        ))}
                    </div>
                    
                    {/* Vote Progress Summary for active polls */}
                    {/* {!hasEnded && count > 0 && (
                        <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Current Progress:</h4>
                            <div className="text-xs text-gray-600">
                                <span className="text-blue-700 font-medium">
                                    {count} {count === 1 ? 'vote' : 'votes'} cast so far
                                </span>
                            </div>
                        </div>
                    )} */}
                    
                    {/* Results Summary for ended polls */}
                    {/* {hasEnded && count > 0 && (
                        <div className="mt-3 p-2 bg-gray-50 rounded-lg border">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Final Results:</h4>
                            {winners.length > 0 ? (
                                <div className="text-xs text-gray-600">
                                    {winners.length === 1 ? (
                                        <span className="text-yellow-700 font-medium">
                                            "{winners[0].title}" won with {winners[0].voters?.length || 0} votes
                                        </span>
                                    ) : (
                                        <span className="text-yellow-700 font-medium">
                                            Tie between {winners.length} options with {winners[0].voters?.length || 0} votes each
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-xs text-gray-500">No votes were cast</span>
                            )}
                        </div>
                    )} */}
                </div>      
            </div>
        </div>
    )
}

export default PollCard