import CreateConversationForm from "./CreateConversationForm"

const CreateConversationModal = ({setIsModalOpen}) => {

  return (
    <dialog id="my_modal_1" className="modal modal-open">
      <div className="modal-box w-11/12 max-w-6xl p-6 rounded-2xl shadow-xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={()=> setIsModalOpen(false)}>✕</button>
        </form>
        <CreateConversationForm setIsModalOpen={setIsModalOpen}/>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={()=> setIsModalOpen(false)}>close</button>
      </form>
    </dialog>
  )
}

export default CreateConversationModal