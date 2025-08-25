import {useState} from 'react'
import ConversationUserSelect from './addParticipantsUserSelect';
import useConversationStore from '../../store/useConversationStore';

const CreateConversationForm = ({setIsModalOpen}) => {
    const {createConversation} = useConversationStore();
    const [newConversationName, setNewConversationName] = useState('');
     const [selectedUsers, setSelectedUsers] = useState([]);
  return (
    <div className="p-4">
        <div>Create Conversation Form</div>
        <input type="text" placeholder='Group Name' className='m-3 border-1 p-3 rounded-xl' onChange={(e) => setNewConversationName(e.target.value)} />
        <ConversationUserSelect type="text" placeholder="Add Participant" className="input input-bordered input-sm flex-1 text-xs" setSelectedUsers={setSelectedUsers} />
        <button className="btn btn-success mt-2" onClick={()=> {
            console.log("Creating conversation with name:", newConversationName, "and users:", selectedUsers);
            createConversation(newConversationName, selectedUsers);
            setIsModalOpen(false)
        }

        }>Create Conversation</button>
    </div>
    )
  
}

export default CreateConversationForm