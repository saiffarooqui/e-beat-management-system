import {BsPersonFill, BsThreeDotsVertical} from 'react-icons/bs'
import Sidebar from '@/components/Sidebar.jsx'
import React, { useEffect, useState, useRef } from "react";
import { LoadingScreen } from '@/components/LoadingScreen';
import { useRouter } from "next/router";
import { userSelector, dismissToken } from "@/store/auth/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import InfoButton from '@/components/InfoButton';

import {
  addPoliceStation,
  addSubDivision,
  clearState,
  getAllPoliceStation,
  useractionSelector,
} from "@/store/userActions/userActionSlice";




const policeStation = () => {
    const router = useRouter();
    const url = "http://localhost:5000/";
    const {user,token,isError} = useSelector(userSelector)
    const [allPoliceStations, setallPoliceStations] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!user) router.push("/");
      }, [user]);

      useEffect(() => {
        (async () => {
            try {
                const options={
                    method: "GET",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                }
              const resp = await fetch(`${url}user/getAllPoliceStations`, options);
              let data2 = await resp.json();
        
              if (resp.status === 200) {
                console.log("THE RESPONSE IS:::",data2)
                setallPoliceStations(data2);
              }
            } catch (error) {
              console.log("Error");
            }
          
        })();
      }, []);

      React.useEffect(() => {
        console.log("USER", user);
        if (!user) router.push("/");
      }, [user]);


      const openModal = async() =>{
        setIsModalOpen(true)

        try{
            const options={
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
            }
          const resp = await fetch(`${url}user/addPoliceStation`, options);
          let data2 = await resp.json();
    
          if (resp.status === 200 || resp.status === 200) {
                console.log("TPOLICE STATION ADDED::",data2)
            
        }
        else{
            console.log("SOMe error")
            }
        }
        catch(error)
        {
            console.log("Error is:",error)
        }

      }

      function closeModal(){
        setIsModalOpen(false)
      }

  return (
    <>
    {!user ? (
      <>
        <div className="h-screen flex flex-col justify-center align-middle items-center content-center bg-slate">
          <LoadingScreen />
        </div>
      </>
    ) : (
      <>
      {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                  <div className="w-[70%] h-[70%] bg-white rounded-lg p-4 relative overflow-scroll">
                    <button className="absolute top-4 right-4" onClick={closeModal}>
                      X
                    </button>
                      <h2 className="text-center mt-5 mb-5">Please fill in the details</h2>
                     
                  </div>
                </div>
              )}
        <Sidebar>
        <div className='bg-gray-100 min-h-screen'>
            <div className='flex justify-between p-4'>
                <h2>Police Stations</h2>
                <h2>Welcome Back {user.fullName}</h2>
            </div>
            <div className='p-4'>
                <div className='w-full m-auto p-4 border rounded-lg bg-white'>
                    <div className='my-3 p-2 grid grid-cols-3 items-center justify between cursor-pointer'>
                        <span>Name</span>
                        <span className='hidden md:grid'>Phone</span>
                        <InfoButton onClick={openModal} className='sm:text-left text-right'>Add Police Station</InfoButton>
                    </div>
                    <ul>
                        {allPoliceStations.map((policeStation,_id)=>{
                            
                            return(
                                
                                <li key={_id} className='bg-gray hover:bg-gray-100 rounded-lg my-3 p-2 grid grid-cols-3 items-center justify-between cursor-pointer'>
                                    <p>{policeStation.name}</p>
                                    <p>{policeStation.subDivision.name}</p>
                                </li>
                            )
                            })}
                    </ul>
                </div>
            </div>
        </div>
    </Sidebar> 
      </>
    )}
  </>
  )
}

export default policeStation