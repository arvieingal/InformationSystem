import React from 'react'

const AddForm = () => {
  return (
    <div className='w-full px-[4rem]'>
      <div className='border mt-[4rem] border-black outline-none rounded-[5px]  w-[50rem] '>
        <p className='font-inter font-medium text-[15px] italic'>Fill-out required information. DO NOT leave an item blank (indicate N/A if item is not applicable)</p>
      </div>
      <div className='flex flex-row items-center'>
  <p className='mr-4'>HEAD OF FAMILY:</p>
  <div className='flex items-center space-x-4'>
    <label className='flex items-center'>
      <input type='checkbox' className='mr-2' name='headOfFamily' value='yes' />
      <span>Yes</span>
    </label>
    <label className='flex items-center'>
      <input type='checkbox' className='mr-2' name='headOfFamily' value='no' />
      <span>No</span>
    </label>
  </div>
</div>
<div className='flex flex-row gap-8'>
    <div className='flex flex-col '>
    <p className='text-[#A9A9A9]'>Family name</p>
    <input className='border border-black rounded-[5px] outline-none'
     type="text" /> 
    </div>
    <div className='flex flex-col'>
    <p className='text-[#A9A9A9]'>Given name</p>
    <input className='border border-black rounded-[5px] outline-none'
     type="text" /> 
    </div>
    <div className='flex flex-col'>
    <p className='text-[#A9A9A9]'>Middle name</p>
    <input className='border border-black rounded-[5px] outline-none'
     type="text" /> 
    </div>
    <div className='flex flex-col'>
    <p className='text-[#A9A9A9]'>Extension</p>
    <input className='border border-black rounded-[5px] outline-none'
     type="text" /> 
    </div>
  </div>
   <div className='flex flex-col'>
    <p>Sex</p>
    <div className='flex flex-row gap-4'>
    <label className='flex items-center'>
      <input type='checkbox' className='mr-2' name='sex' value='male' />
      <span>Male</span>
    </label>
    <label className='flex items-center'>
      <input type='checkbox' className='mr-2' name='sex' value='female' />
      <span>Female</span>
    </label>  
    </div>
   <div>
    <p>Date of Birth</p>
   </div>
    </div>
    </div>
  )
}

export default AddForm
