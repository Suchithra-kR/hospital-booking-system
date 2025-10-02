import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors } = useContext(AdminContext)
   
  useEffect(()=>{
    if (aToken) {
      getAllDoctors()
    }
  },[aToken])

  return (
    <div>
      <h1>All Doctors</h1>
      <div>
        {
          doctors.map((item,index)=>(
            <div key={index}>

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsList
