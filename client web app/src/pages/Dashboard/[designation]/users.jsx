import {BsPersonFill, BsThreeDotsVertical} from 'react-icons/bs'
import Sidebar from '@/components/Sidebar.jsx'
import React, { useEffect, useState, useRef } from "react";
import { LoadingScreen } from "../../../components/LoadingScreen.js";
import { useRouter } from "next/router";
import { userSelector, dismissToken } from "@/store/auth/UserSlice";
import { useSelector, useDispatch } from "react-redux";

import {
  addPoliceStation,
  addSubDivision,
  clearState,
  getAllPoliceStation,
  useractionSelector,
} from "@/store/userActions/userActionSlice";



function getDate(userDate){
    var userTime = new Date(userDate).getTime()
    const date = new Date(userTime);
    return date.toDateString();
}


const users = () => {
  const router = useRouter();
    const [allUsers, setallUsers] = useState([]);
    const {user,token,isError} = useSelector(userSelector)
    const [openDropDown, setopenDropDown] = useState(-1);
    const dropdownRef = useRef(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
      if (!user) router.push("/");
    }, [user]);

    
    useEffect(() => {
        const fetchUsers = async(token)=>{

        try {
            const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            };
            const url = "http://localhost:5000/user/all";
            
            
            const response = await fetch(url, options);
            const allUsers = await response.json();
            setallUsers(allUsers);
            console.log(allUsers)
        } catch (error) {
            console.log(error);
        }
        }
        fetchUsers(token);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
          ) {
            setopenDropDown(null);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    const handleApprove = async (userId) =>{
        
        console.log("userId is: "+userId)
            try {
                const options = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:token,
                },
                };
                const url = `http://localhost:5000/user/verify/${userId}`
               
                const response = await fetch(url, options);
                if(response.status === 200){
                  console.log(response)
                  const VerifiedUser = await response.json();
                  setMessage('User has been approved')
                  console.log(VerifiedUser)
  
                  const index = allUsers.findIndex(
                    (item) => item._id === userId
                  );
                  // Replace the old object with the new one
                  allUsers[index] = VerifiedUser;
                }
                
                else{
                  alert(response.message)
                }

            } catch (error) {
                setMessage('An error occurred while approving user');
                console.log(error)
                alert(error);
            }
            setopenDropDown(-1)    
        }

    const handleReject = async (userId) =>{
      console.log("userId is: "+userId)
      try {
          const options = {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
              Authorization:token,
          },
          };
          const url = `http://localhost:5000/user/reject/${userId}`
         
          const response = await fetch(url, options);
          if(response.status === 200){
            console.log(response)
            const DeletedUser = await response.json();
            setMessage('User has been Denied and deleted')
            console.log(DeletedUser)

            const index = allUsers.findIndex(
              (item) => item._id === userId
            );
            // Replace the old object with the new one
            allUsers[index] = VerifiedUser;
          }
          
          else{
            alert(response.message)
          }

      } catch (error) {
          setMessage('An error occurred while approving user');
          console.log(error)
          alert(error);
      }
      setopenDropDown(-1)  
    }

    const toggleopenDropDown = (userId)=> {
        setopenDropDown((openDropDown) =>{
            return(openDropDown === userId? -1 : userId)
        })
        

      setTimeout(()=>{
        setMessage(null)
      },4000)
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
        <Sidebar>
        <div className='bg-gray-100 min-h-screen'>
            <div className='flex justify-between p-4'>
                <h2>Users</h2>
                <h2>Welcome Back {user.fullName}</h2>
            </div>
            <div className='p-4'>
                <div className='w-full m-auto p-4 border rounded-lg bg-white'>
                    <div className='my-3 p-2 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 items-center justify between cursor-pointer'>
                        <span>Name</span>
                        <span className='sm:text-left text-right'>Phone</span>
                        <span className='hidden md:grid'>Date</span>
                        <span className='hidden md:grid'>Designation</span>
                        <span className='hidden sm:grid'>Status</span>
                    </div>
                    <ul>
                    {message && <div role="alert" className="fixed top-0 right-0 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded m-4">{message}!</div>} 
                        {allUsers.map((user,_id) =>(
                            <li key={user._id} className='bg-gray hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer'>
                                <div className='flex items-center'>
                                    <div className='bg-purple-100 p-3 '>
                                        <BsPersonFill className='text-purple-800'/>
                                    </div>
                                    <p className='pl-4'>{user.fullName}</p>
                                </div>
                                <p className='text-gray-600 sm:text-left text-right'>
                                    {user.phoneNumber}
                                </p>
                                <p className='hidden md:flex'>
                                    {getDate(user.createdAt)}
                                </p>
                                <p className='hidden md:flex'>
                                    {user.designation}
                                </p>
                                <div className='sm:flex hidden justify-between items-center'>
                                    <p>
                                        {user.verified ? <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:text-green-400 border border-green-400">Approved</span> :<span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:text-red-400 border border-red-400">Pending Approval</span>}
                                    </p>
                                    <BsThreeDotsVertical onClick={()=>toggleopenDropDown(user._id) } className='hover:bg-gray-300 rounded-lg'/>
                                    {openDropDown === user._id && 
                                        (<div ref={dropdownRef} className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                                            <button className="w-full block px-4 py-2 text-gray-800 hover:bg-purple-500 hover:text-white" onClick={()=>handleApprove(openDropDown)}>Approve</button>
                                            <button className="w-full block px-4 py-2 text-gray-800 hover:bg-purple-500 hover:text-white" onClick={()=>handleReject(openDropDown)}>Reject</button>
                                        </div>)}
                                </div>
                            
                            </li>
                        ))}
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


export default users



//