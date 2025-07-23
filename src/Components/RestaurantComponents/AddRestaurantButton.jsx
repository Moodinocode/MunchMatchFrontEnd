import React from 'react'

const AddRestaurantButton = ({setIsModalOpen}) => {
  return (
    <button className="btn btn-warning text-black" onClick={()=>setIsModalOpen(true)}>Add Restaurant</button>
  )
}

export default AddRestaurantButton