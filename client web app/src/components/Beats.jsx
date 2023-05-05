import React, { useEffect, useState } from "react";
import { RxPerson } from "react-icons/rx";
import { LoadingScreen } from "./LoadingScreen";
import { useRouter } from "next/router";
import { userSelector, dismissToken } from "@/store/auth/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineLocationCity } from "react-icons/md";
import Link from "next/link";
import InfoButton from "./InfoButton";

import {
  addPoliceStation,
  addSubDivision,
  clearState,
  getAllPoliceStation,
  useractionSelector,
} from "@/store/userActions/userActionSlice";
import { BsPerson, BsPersonFill } from "react-icons/bs";

export const Beats = (props) => {
  function getDate(userDate) {
    var userTime = new Date(userDate).getTime();
    const date = new Date(userTime);
    return date.toDateString();
  }
  const [beatAreas, setbeatAreas] = useState([]);
  const { user, token, isError } = useSelector(userSelector);


  useEffect((props) => {
    const fetchUsers = async (token) => {
      try {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        };
        const url = "http://localhost:5000/";
        const fetchBeats =
          user?.designation !== "pi"? `${url}beat/beatarea/all`: `${url}beat/beatarea/all/${user.policeStation._id}`;

        const response = await fetch(fetchBeats, options);
        console.log(response, fetchBeats);
        const beatAreas = await response.json();

        setbeatAreas(beatAreas);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers(token);
  }, [props.updateBeats]);
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
          <div className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll mt-5">
            <h1 className="ml-4 mt-5">Beat Areas</h1>
            <ul>
              {beatAreas.map((beatArea, _id) =>(
                  <div className='p-4'>
                  <div className='w-full m-auto p-4 border rounded-lg bg-white'>
                      <div className='my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify between cursor-pointer'>
                          <span>Name</span>
                          <span className='hidden md:grid'>Jurisdiction</span>
                          <span className='hidden md:grid'>SubDivision</span>
                          <span className='sm:text-left text-right'>Placeholder</span>
                      </div>
                      <ul> 
                              <li key={beatArea._id} className='bg-gray hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2  cursor-pointer'>
                                  <div className='flex items-center'>
                                      <div className='bg-purple-100'>
                                          <MdOutlineLocationCity className='text-purple-800'/>
                                      </div>
                                      <p className='pl-2'>{beatArea.name}</p>
                                  </div>
                                  <p className='hidden md:grid'>
                                      {beatArea.policeStation.name}
                                  </p>
                                  <p className='hidden md:grid'>
                                  {beatArea.policeStation.subDivision.name}
                                  </p>
                                  <p className="lg:flex text-sm">
                                  <Link href={`/Dashboard/${user.designation}/BeatArea/${beatArea._id}`}>
                                    <InfoButton className="text-left sm:text-right">
                                        More
                                    </InfoButton>
                                  </Link>
                                  </p>
                              </li>
                      </ul>
                  </div>
              </div>
              ))}
            </ul>
          </div>
        </>
      )
      }
    </>
  )};



