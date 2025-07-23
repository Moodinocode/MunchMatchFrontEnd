import React, { useContext, useEffect, useState } from 'react'
import ViewPollVoters from './ViewPollVoters';
import PollOption from './PollOption'
import { deactivatePoll } from '../../../Services/pollsService';
import { AuthContext } from '../../../Context/AuthContext';

const PollCard = ({sendMessage,poll, isAuthor}) => {
    const { id, title, CreatedBy, createdAt, endDate, active, allowMultipleVotes, options = [] } = poll;
    const [selected, setSelected] = allowMultipleVotes ? useState([]) : useState(null);
    const [prevSelected, setPrevSelected] = useState(allowMultipleVotes ? [] : null);

    let count = options.reduce((sum, option) => sum + (option.voters?.length || 0), 0);

    const {user} = useContext(AuthContext);

    const getTimeRemaining = (endDateString) => {
    const now = new Date();
    const end = new Date(endDateString);
    const diff = end - now;

    if (diff <= 0) return <p className='text-xs text-red-600 ml-2'>Ended </p>;

    const totalMinutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return(
    <div>
         
    <p className='text-xs text-gray-400 ml-2'>ends in: {`${hours > 0 ? `${hours}h ` : ""}${minutes}min`}</p>
                            <div className='flex justify-end'>
                            {isAuthor && 
                                <button 
                                    className='btn h-6 text-xs mt-1 bg-gray-300' 
                                    onClick={() => {
                                        deactivatePoll(id, sessionStorage.getItem("token"))
                                    }}
                                >
                                    end
                                </button>
                            }
                        </div>
                        </div>
    )
};

    // useEffect(() => {
    //     if (allowMultipleVotes) {
    //         // allowMultipleVotes-select logic
    //         const currentSelected = selected || [];
    //         const previousSelected = prevSelected || [];
            
    //         // Find newly selected options (in current but not in previous)
    //         const newlySelected = currentSelected.filter(optionId => !previousSelected.includes(optionId));
            
    //         // Find deselected options (in previous but not in current)
    //         const deselected = previousSelected.filter(optionId => !currentSelected.includes(optionId));
            
    //         // Handle newly selected options
    //         newlySelected.forEach(optionId => {
    //             vote("add", user.id, optionId, sessionStorage.getItem("token"));
    //         });
            
    //         // Handle deselected options
    //         deselected.forEach(optionId => {
    //             vote("delete", user.id, optionId, sessionStorage.getItem("token"));
    //         });
            
    //     } else {
    //         // Single-select logic
    //         if (selected !== null && selected !== prevSelected) {
    //             if (prevSelected !== null) {
    //                 // Update: user had a previous selection, now selecting a different one
    //                 vote("update", user.id, selected, sessionStorage.getItem("token"), prevSelected);
    //             } else {
    //                 // Add: user selecting for the first time
    //                 vote("add", user.id, selected, sessionStorage.getItem("token"));
    //             }
    //         } else if (selected === null && prevSelected !== null) {
    //             // Delete: user deselected their choice
    //             vote("delete", user.id, prevSelected, sessionStorage.getItem("token"));
    //         }
    //     }
        
    //     // Update previous selection after processing
    //     setPrevSelected(allowMultipleVotes ? [...(selected || [])] : selected);
        
    // }, [selected, user.id, allowMultipleVotes, prevSelected]);

    return (
        <div className="card card-border border-3 m-3 bg-base-100 w-[425px]">
            <div className="card-body py-2 gap-0">
                <div className='flex justify-between'>
                    <div>
                        <h2 className="card-title">{title}</h2>
                        <p className='text-xs text-gray-400 ml-2'>{CreatedBy}</p>
                    </div>
                    <div>
                        {getTimeRemaining(endDate)}

                    </div>
                </div>
               
                <div>
                    <div className='flex flex-col gap-2 mt-2'>
                        {options.map(option =>{
                            console.log(allowMultipleVotes)
                            return (
                            <PollOption 
                                key={option.id} 
                                allowMultipleVotes={allowMultipleVotes} 
                                count={count} 
                                option={option} 
                                setSelected={setSelected}
                                selected={selected}
                                sendMessage={sendMessage}
                            />
                            )}
                        )}
                    </div>
                </div>      
            </div>
        </div>
    )
}

export default PollCard