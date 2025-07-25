import React from 'react'

const PollVoters = ({voters}) => {
  if (voters === null) return <div></div>
  return (
    <div className="avatar-group ml-1  -space-x-3 h-6">
      {voters.slice(0,3).map((voter)=>{
        return (
        <div key={voter.id} className="avatar">
        <div className="w-5 h-5">
          <img src={voter.profileImageUrl} />
        </div>
      </div>
        )
      })}
    

      {voters.length >3 &&
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-5">
            <span className="text-xs">+{(voters.length-3)>99 ? 99:voters.length-3 }</span>
          </div>
        </div>
      }
    </div>
  )
}

export default PollVoters
