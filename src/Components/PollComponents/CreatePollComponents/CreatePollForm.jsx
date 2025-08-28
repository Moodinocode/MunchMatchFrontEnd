import React, { useState, useEffect } from 'react';
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
  const [dateTimeError, setDateTimeError] = useState('');

  // Get current date and time for validation
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0].slice(0, 5);

  // Validate date/time whenever they change
  useEffect(() => {
    validateDateTime();
  }, [pollDetails.pollDate, pollDetails.pollTime]);

  const validateDateTime = () => {
    const selectedDate = pollDetails.pollDate || currentDate;
    const selectedTime = pollDetails.pollTime;
    
    if (!selectedTime) {
      setDateTimeError('');
      return true;
    }

    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    const currentDateTime = new Date();

    if (selectedDateTime <= currentDateTime) {
      setDateTimeError('Please select a future date and time');
      return false;
    }

    setDateTimeError('');
    return true;
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setPollDetails({...pollDetails, pollTime: newTime});
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setPollDetails({...pollDetails, pollDate: newDate});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate before submission
    if (!validateDateTime()) {
      return;
    }

    console.log(pollDetails);

    const now = new Date();
    const datePart = pollDetails.pollDate || now.toISOString().split('T')[0];
    const timePart = pollDetails.pollTime || new Date(now.getTime() + 60 * 60 * 1000).toTimeString().split(' ')[0].slice(0, 5);
    const combinedDateTime = new Date(`${datePart}T${timePart}:00`);
    
    // Final validation check
    if (combinedDateTime <= now) {
      setDateTimeError('Please select a future date and time');
      return;
    }

    console.log("Local end time:", combinedDateTime.toLocaleString());

    const timezoneOffsetMs = combinedDateTime.getTimezoneOffset() * 60 * 1000;
    const localTimeAsUtc = new Date(combinedDateTime.getTime() - timezoneOffsetMs);
    
    const finalPayload = {
      allowMultipleVotes: pollDetails.allowMultipleVotes,
      endDate: localTimeAsUtc.toISOString(),
      optionIds: pollDetails.optionIds,
      title: pollDetails.title,
      visibleUserIds: pollDetails.visibleUserIds
    };

    console.log(finalPayload);

    createPoll(finalPayload)
      .then((response) => addPoll(response.data))
      .catch((error) => console.log(error));
    setIsModalOpen(false);
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
        
        <input 
          type="checkbox" 
          value={pollDetails.allowMultipleVotes} 
          onChange={(e) => setPollDetails({...pollDetails, allowMultipleVotes: e.target.checked})}  
          defaultChecked 
          className="checkbox checkbox-accent mt-3 p-[2px] ml-2 w-[14px] h-[14px] rounded-sm" 
        /> 
        <p className='text-xs mt-2.5 '>Allow multiple Options</p>
      </div>

      {/* Row with Time, optional Date, and Toggle */}
      <div className="flex flex-col md:flex-row items-start gap-3 mb-2 ">
        {/* Time input */}
        <label className="input input-sm input-bordered flex items-center w-[120px] cursor-pointer px-2">
          <input
            type="time"
            value={pollDetails.pollTime}
            onChange={handleTimeChange}
            min={showDate ? undefined : currentTime}
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
              onChange={handleDateChange}
              min={currentDate}
              className="input input-sm input-bordered text-xs max-w-[140px]"
            />
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
          {!showUsers && <span className="ml-1 text-[10px] text-gray-500">private poll?</span>}
        </div>
      </div>

      {/* Error message */}
      {dateTimeError && (
        <div className="text-red-500 text-xs mb-4">
          {dateTimeError}
        </div>
      )}
        
      {showUsers && <UserSelect setPollDetails={setPollDetails}/>}

      <MultiSelectFilter setPollDetails={setPollDetails}/>

      <div className="flex items-center gap-3">
        <div className="w-4/12">
          <button 
            onClick={(e) => handleSubmit(e)} 
            disabled={pollDetails.optionIds.length < 1 || dateTimeError} 
            className='btn btn-success w-full mt-6 shadow-md hover:scale-105 transition-transform duration-200 mb-12 md:mb-0'
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePollForm;