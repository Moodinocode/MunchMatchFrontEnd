import React from 'react'

const ViewPollVoters = ({voters = [],title, isOpen =false,setIsVotersModalOpen}) => {
  

  return (

    <dialog id="my_modal_3" className="modal modal-open">
        <div className="modal-box w-11/12 max-w-5xl p-6 rounded-2xl shadow-xl">
        <form method="dialog">

            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setIsVotersModalOpen(false)}>✕</button>
        </form>
         <h1 className='text-xl font-bold pb-2'>{title}</h1>

          <div className='mt-3'>
            {voters.map(voter => 

            <div key={voter.id}>
              <div className='flex items-center gap-4'>
                {/* <div className="avatar avatar-online"> */}
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img src={voter.profileImageUrl || "https://img.daisyui.com/images/profile/demo/gordon@192.webp"} alt={voter.name} />
                  </div>
                </div>
                <p>{voter.username}</p>
              </div>
              <hr className='text-gray-500 my-2' />
            </div>
            
            )}

          </div>
        </div>


        <form method="dialog" className="modal-backdrop">
                <button onClick={() => setIsVotersModalOpen(false)}>close</button>
        </form>

      
    </dialog>

  )
}

export default ViewPollVoters