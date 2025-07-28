import React, { useState } from 'react';
import MultiSelectFilter from './MultiSelectFilter';
import { createPoll } from '../../../Services/pollsService';
import UserSelect from './UserSelect';
import usePollStore from '../../../store/usePollStore';

const CreatePollForm = ({setIsModalOpen}) => {
  const {polls,addPoll} = usePollStore();
  const [pollDetails, setPollDetails] = useState({
    title: '',
    pollDate: '',
    pollTime: '',
    allowMultipleVotes: true,
    optionIds: [],
    visibleUserIds: []
  })
  const [showDate, setShowDate] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  

 const handleSubmit = (e) => {
  e.preventDefault();
  console.log(pollDetails)
  

  const now = new Date();
  let combinedDateTime;

  const hasDate = !!pollDetails.pollDate;
  const hasTime = !!pollDetails.pollTime;

  if (!hasDate && !hasTime) {
    // Neither set: use current time + 1 hour
    combinedDateTime = new Date(now.getTime() + 60 * 60 * 1000);
  } else {
    // Either date or time is set: use provided or fallback
    const datePart = pollDetails.pollDate || now.toISOString().split("T")[0];
    const timePart = pollDetails.pollTime || "23:59";
    combinedDateTime = new Date(`${datePart}T${timePart}`);
  }

  const finalPayload = {
    allowMultipleVotes: pollDetails.allowMultipleVotes,
    endDate: combinedDateTime.toISOString(),
    optionIds: pollDetails.optionIds,
    title: pollDetails.title,
    visibleUserIds: pollDetails.visibleUserIds

  };
  //console.log(finalPayload)

  console.log(finalPayload)

  createPoll(finalPayload)
    .then((response) => console.log(response, " from http"))
    .catch((error) => console.log(error));
   setIsModalOpen(false)
};


  return (
    <div className="block ">
      <h2 className="text-2xl font-semibold mb-6">Create Poll</h2>

      <div className="flex gap-2">
      <input
        type="text"
        placeholder="Title"
        value={pollDetails.title}
        onChange={(e) => setPollDetails({...pollDetails, title: e.target.value})}
        className="input input-bordered  mb-4 w-3/12"
      />
      
<input type="checkbox" value={pollDetails.allowMultipleVotes} onChange={(e) => setPollDetails({...pollDetails, allowMultipleVotes: e.target.checked})}  defaultChecked className="checkbox checkbox-accent mt-3 p-[2px] ml-2 w-[14px] h-[14px] rounded-sm" /> <p className='text-xs mt-2.5 '>Allow mulitple Options</p>
    </div>
      {/* Row with Time, optional Date, and Toggle */}
      <div className="flex items-center gap-3 mb-6">
        {/* Time input */}
        <label className= "input input-sm input-bordered flex items-center w-fit cursor-pointer px-2">
          <input
            type="time"
            value={pollDetails.pollTime}
            onChange={(e) => setPollDetails({...pollDetails, pollTime: e.target.value})}
            className="bg-transparent outline-none text-sm cursor-pointer"
            required
          />
        </label>

        {/* Conditionally show date */}
        {showDate && (
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={pollDetails.pollDate}
              onChange={(e) => setPollDetails({...pollDetails, pollDate: e.target.value})}
              className="input input-sm input-bordered text-xs max-w-[140px]"
            />
            {/* <span className="text-xs text-gray-500">📅 Day selected</span> */}
          </div>
        )}

        {/* Toggle and label */}
        <div className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={showDate}
            onChange={() => setShowDate(!showDate)}
            className="toggle toggle-warning"
          />
          {!showDate && <span className="ml-1 text-[10px] text-gray-500">Schedule for another day?</span>}
        </div>
        <div className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={showUsers}
            onChange={() => setShowUsers(!showUsers)}
            className="toggle toggle-warning"
          />
          {!showUsers && <span className="ml-1 text-[10px] text-gray-500">priavte poll?</span>}
        </div>
      </div>
        
        {showUsers && <UserSelect setPollDetails={setPollDetails}/>}





      <MultiSelectFilter  setPollDetails={setPollDetails}/>



      <div className="flex items-center gap-3">
        <div className="w-4/12">


          <button onClick={(e) => handleSubmit(e)} className="btn btn-success w-full mt-6 shadow-md hover:scale-105 transition-transform duration-200">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePollForm;
