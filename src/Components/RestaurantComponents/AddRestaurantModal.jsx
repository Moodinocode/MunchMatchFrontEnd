import React from 'react'
import AddRestaurantForm from './AddRestaurantForm'

const AddRestaurantModal = ({setIsModalOpen}) => {
  return (
    <dialog id="my_modal_4" className="modal modal-open">
  <div className="modal-box w-11/12 max-w-5xl p-6 rounded-2xl shadow-xl">
  <form method="dialog">

      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setIsModalOpen(false)}>✕</button>
    </form>
    <AddRestaurantForm/>
    </div>


      <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsModalOpen(false)}>close</button>
    </form>

    

</dialog>
  )
}

export default AddRestaurantModal 
