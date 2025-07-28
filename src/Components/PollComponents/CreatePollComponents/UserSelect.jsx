import { useEffect, useState } from 'react';
import Select from "react-select";
import { getAllUsers } from '../../../Services/userService';

const UserSelect = ({ setPollDetails }) => {
  const [selectedOption, setSelectedOption] = useState([]);
  const [userOptions, setUserOptions] = useState([]);


  const handleChange = (selectedOptions) => {
    setSelectedOption(selectedOptions);

    const selectedUserIds = selectedOptions?.map(option => option.value) || [];

    setPollDetails(prev => ({
      ...prev,
      visibleUserIds: selectedUserIds,
    }));
  };

  useEffect(() => {
    getAllUsers()
      .then(response => {
        const userData = response.data;
        console.log(response.data)
        console.log(userData)

        const options = userData.map(user => ({
          value: user.id,
          label: user.username,
        }));

        setUserOptions(options);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <div className='m-3 flex gap-3 items-center'>
      <p className='w-24'>Visible To:</p>
      <Select
        isMulti
        hideSelectedOptions={false}
        value={selectedOption}
        onChange={handleChange}
        options={userOptions}
        className='w-full'
      />
    </div>
  );
};

export default UserSelect;
