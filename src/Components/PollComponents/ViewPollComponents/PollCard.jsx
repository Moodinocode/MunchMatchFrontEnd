import React, { useContext } from 'react'
import PollOption from './PollOption'
import { deactivatePoll } from '../../../Services/pollsService';
import { AuthContext } from '../../../Context/AuthContext';

const PollCard = ({ poll }) => {
    const { id, title, createdBy, createdAt, endDate, active, allowMultipleVotes, options = [] } = poll;
    
    const count = options.reduce((sum, option) => sum + (option.voters?.length || 0), 0);
    const { user } = useContext(AuthContext);

    const getTimeRemaining = (endDateString) => {
        const now = new Date();
        const end = new Date(endDateString);
        const diff = end - now;

        if (diff <= 0) return <p className='text-xs text-red-600 ml-2'>Ended</p>;

        const totalMinutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return (
            <div>
                <p className='text-xs text-gray-400 ml-2'>
                    ends in: {`${hours > 0 ? `${hours}h ` : ""}${minutes}min`}
                </p>
                <div className='flex justify-end'>
                    {user?.id === poll.createdById && (
                        <button 
                            className='btn h-6 text-xs mt-1 bg-gray-300' 
                            onClick={() => {
                                deactivatePoll(id, sessionStorage.getItem("token"))
                            }}
                        >
                            end
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="card card-border border-3 m-3 bg-base-100 w-[425px]">
            <div className="card-body py-2 gap-0">
                <div className='flex justify-between'>
                    <div>
                        <h2 className="card-title">{title}</h2>
                        <p className='text-xs text-gray-400 ml-2'>{createdBy}</p>
                    </div>
                    <div>
                        {getTimeRemaining(endDate)}
                    </div>
                </div>
               
                <div>
                    <div className='flex flex-col gap-2 mt-2'>
                        {options.map(option => (
                            <PollOption 
                                key={option.id}
                                pollId={poll.id} 
                                count={count}
                                ended={true}
                                optionId={option.id}
                            />
                        ))}
                    </div>
                </div>      
            </div>
        </div>
    )
}

export default PollCard