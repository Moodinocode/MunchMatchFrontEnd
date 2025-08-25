import { useEffect, useState, useContext } from 'react';
import Select from "react-select";

import { getAllUsers } from '../../Services/userService';
import { AuthContext } from '../../Context/AuthContext';

const ConversationUserSelect = ({ setSelectedUsers }) => {
  const [selectedOption, setSelectedOption] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const { user } = useContext(AuthContext);

  const handleChange = (selectedOptions) => {
    setSelectedOption(selectedOptions);

    const selectedUserIds = [
      user?.id, // always include logged-in user
      ...(selectedOptions?.map(option => option.value) || [])
    ];

    setSelectedUsers(selectedUserIds);
  };

  useEffect(() => {
    getAllUsers()
      .then(response => {
        const userData = response.data;

        const options = userData.map(u => ({
          value: u.id,
          label: u.username,
        }));

        // Exclude current logged-in user (from dropdown)
        setUserOptions(options.filter(option => option.value !== user?.id));

        // Pre-select current user in state
        if (user) {
          setSelectedOption([{ value: user.id, label: user.username }]);
          setSelectedUsers([user.id]);
        }
      })
      .catch(error => console.log(error));
  }, [user, setSelectedUsers]);

  return (
    <div className='m-3 gap-3 items-center'>
      <p className='p-3'>Add Participants:</p>
      <Select
        isMulti
        hideSelectedOptions={false}
        value={selectedOption.filter(opt => opt.value !== user?.id)} 
        onChange={handleChange}
        options={userOptions}
        className='w-full'
      />
    </div>
  );
};

export default ConversationUserSelect;
