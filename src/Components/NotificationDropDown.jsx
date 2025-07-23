import { Bell } from 'lucide-react'
import React from 'react'

const NotificationDropDown = () => {
  return (
    <div className="dropdown dropdown-center mr-16">
      <div tabIndex={0} role="button" className="btn m-1">
        <Bell />
      </div>
      <ul className="dropdown-content menu bg-base-100 rounded-box z-1 w-68 p-2 shadow-sm">
        <div className='p-2 m-1 flex flex-col bg-blue-100 rounded'>
            <p className='text-xs'>Mohamad El Chiekh Ali's  poll with Al Abdallah Chicken as a clear winner</p>
            <p className='text-[8px] text-gray-400 ml-auto'>Today 3:52</p>
        </div>
        <hr className='text-gray-400' />
        <div className='p-1 m-1 flex flex-col'>
            <p className='text-xs'>Mohamad El Chiekh Ali has created a poll titled: Todays's Lunch </p>
            <p className='text-[8px] text-gray-400 ml-auto'>Today 1:52</p>
        </div>
        <hr className='text-gray-400' />
        
      </ul>
    </div>
  )
}


export default NotificationDropDown