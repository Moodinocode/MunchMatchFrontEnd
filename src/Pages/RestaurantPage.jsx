import React, { useEffect, useState } from 'react'
import dummyData from '../assets/restaurantDummydata'
import RestaurantCard from '../Components/RestaurantComponents/RestaurantCard'
import Navbar from '../Components/Navbar'
import AddRestaurantButton from '../Components/RestaurantComponents/AddRestaurantButton'
import AddRestaurantModal from '../Components/RestaurantComponents/AddRestaurantModal'
import { getOptions } from '../Services/optionService'

const RestaurantPage = () => {
  const [isModalOpen,setIsModalOpen] = useState(false);
  const [options,setOptions] = useState([])

  useEffect(()=>{
    getOptions(sessionStorage.getItem("token")).then(response => setOptions(response.data)).catch(error => console.log(error))
  },[])

  return (
        <>
      <Navbar/>
      <div className='flex justify-end px-12 py-4'>
            <AddRestaurantButton setIsModalOpen={setIsModalOpen} />
            {isModalOpen && <AddRestaurantModal  setIsModalOpen={setIsModalOpen}/>}
      </div>

      

        <div className='flex flex-wrap mx-auto justify-around'>   
          {options.map((restaurant, index) => (
            <RestaurantCard key={index} {...restaurant} />
          ))}
        </div>
    </>
  )
}

export default RestaurantPage