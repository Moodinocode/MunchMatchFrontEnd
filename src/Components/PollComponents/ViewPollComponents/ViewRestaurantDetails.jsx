import React from 'react'

const ViewRestaurantDetails = ({title,description,imageUrls,tags,setIsDetailsModalOpen}) => {
  return (
        <dialog id="my_modal_2" className="modal modal-open">
        <div className="modal-box w-11/12 max-w-5xl p-6 rounded-2xl shadow-xl">
        <form method="dialog">

            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setIsDetailsModalOpen(false)}>✕</button>
        </form>
        <div>resutarant Details</div>
        
        </div>


        <form method="dialog" className="modal-backdrop">
                <button onClick={() => setIsDetailsModalOpen(false)}>close</button>
        </form>

        

    </dialog>
  )
}

export default ViewRestaurantDetails