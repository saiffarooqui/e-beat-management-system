import React, { useEffect, useState } from "react";
import { RxPerson } from "react-icons/rx";
import { LoadingScreen } from "./LoadingScreen";
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

export const RecentUsers = () => {

  const [recentUsers, setrecentUsers] = useState([]);
  const {user,token,isError} = useSelector(userSelector)
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
        const recentUsers = await response.json();
        setrecentUsers(recentUsers.reverse());
      } catch (error) {
        console.log(error);
      }
    }
    fetchUsers(token);
  }, []);
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
          <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll">
            <h1>Recent Users</h1>
            <ul>
              {recentUsers.map((User, _id) => {
                
                var userTime = new Date(User.createdAt).getTime();
                var currentTime = new Date().getTime();
                const difference = currentTime - userTime;
                const differenceInSeconds = Math.floor(difference / 1000);
                const differenceInHours = Math.floor(differenceInSeconds / 3600);
                const differenceInDays = Math.floor(differenceInHours / 24);
                
                
                if(differenceInDays < 10)
                {
                    if(differenceInHours < 24)
                    {
                       return( <li
                        key={_id}
                        className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer"
                        >
                        <div className="bg-purple-100 rounded-lg p-3">
                          <RxPerson className="text-purple-800" />
                        </div>
                        <div className="pl-4">
                          <p>{User.fullName}</p>
                        </div>
                        <p className="lg:flex md:hidden absolute right-6 text-sm">
                          {differenceInHours > 1 ? differenceInHours+" hours ago":differenceInHours+" hour ago" }
                        </p>
                      </li>)
                    }

                    else
                    {
                        return(<li
                        key={_id}
                        className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer"
                      >
                        <div className="bg-purple-100 rounded-lg p-3">
                          <RxPerson className="text-purple-800" />
                        </div>
                        <div className="pl-4">
                          <p>{User.fullName}</p>
                        </div>
                        <p className="lg:flex md:hidden absolute right-6 text-sm">
                        {differenceInDays > 1 ? differenceInDays+" days ago":differenceInDays+" day ago" }
                        </p>
                      </li>)
                    }
  
                }
            })}
            </ul>
          </div>
        </>
      )}
    </>
  );
};