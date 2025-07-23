import React from 'react'

const CreatePollButton = ({setIsModalOpen}) => {
  return (
    <button className="btn btn-warning text-black" onClick={()=>setIsModalOpen(true)}>Create Poll</button>
  )
}

export default CreatePollButton