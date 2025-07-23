import React, { useState } from 'react'

import UploadImage from './UploadImage'
import { createOption } from '../../Services/optionService'

const AddRestaurantForm = () => {
  const [option,setOption] = useState({
    title: '',
    description: '',
    imageUrls: ["https://business.cbxcdn.net/storage/businessunits/9d75de2d-b7f8-47e4-a870-b5d925859eb4/300/barbar-restaurant-logo.png"],
    tags: ["Burgers","Medium"]
  })
  return (
    <div className='block w-11/12 '>
        <h2 className="text-2xl font-semibold mb-6">Add New Restaurant</h2>
        <input type="text" placeholder="Name" value={option.title} onChange={(e)=> setOption({...option,title:e.target.value})} className="input input-bordered w-full mb-4" />
        <br/>
        <textarea className="textarea w-full mb-3" value={option.description} onChange={(e)=> setOption({...option,description:e.target.value})} placeholder="Description"></textarea>
        <div className='flex items-center gap-3'>
            <UploadImage/>
            <div className='w-4/12 ml-2'>
                {/* <input type="text" placeholder="Adress" className="input input-bordered w-full mb-4" /> */}
        
                <button onClick={
                  (e) => {
                    e.preventDefault();
                    console.log(option)
                    createOption(sessionStorage.getItem("token"),option).then(response => console.log(response)).catch(error => console.log(error)
                    )
                  }
                } className="btn btn-success w-full mt-6 shadow-md hover:scale-105 transition-transform duration-200">
                  Add
                </button>

            </div>
        </div>
    </div>
  )
}

export default AddRestaurantForm