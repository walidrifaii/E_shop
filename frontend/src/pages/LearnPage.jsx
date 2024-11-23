import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { BiMenuAltLeft } from 'react-icons/bi'
import { IoIosArrowForward } from 'react-icons/io'

const LearnPage = () => {
  return (
    <nav>
    <div className="flex justify-between items-center my-[20px] mx-auto w-[90%]">
      <div className="">
        <img
          src="https://shopo.quomodothemes.website/assets/images/logo.svg"
          className="cursor-pointer"
          alt=""
        />
        
      </div>
      <div className="relative">
        <input type="search" name="" id="" className="w-[700px] h-[40px] rounded-[6px] p-2 focus:border-[2px] border-blue-600" placeholder="search product"/>
        <AiOutlineSearch
              size={30}
              className="absolute top-1 right-3 cursor-pointer"
            />
      </div>
      <div className="">
        <button className="w-[150px] text-white bg-black p-3 rounded-[10px]">
          Dashboard
        </button>
      </div>
    </div>
    <div className="w-[100%] bg-blue-800 h-[70px] flex justify-between items-center ">
   
   <div className='relative flex items-center w-[200px] h-[60px] mt-3 pl-2 bg-white  ml-5  font-Poppins rounded-t-[10px]'>
   
   <BiMenuAltLeft size={30}  />
    
     
      <h3>Categories</h3>
      
    
    <IoIosArrowForward size={25} />
   
     </div>
   
   
     <div className='flex items-center justify-center '>
      <h5 className='text-[#fff] px-4'>Home</h5>
      <h5 className='text-[#fff] px-4'>Best Selling</h5>
      <h5 className='text-[#fff] px-4'>Products</h5>
      <h5 className='text-[#fff] px-4'>Events</h5>
      <h5 className='text-[#fff] px-4'>FAQ</h5>
     </div>
     <div>

     </div>
     </div>
    
  </nav>
  )
}

export default LearnPage