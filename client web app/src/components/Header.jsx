import React, { useEffect } from 'react'
import { LoadingScreen } from './LoadingScreen';
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


const Header = () => {

  const router = useRouter();
  const { user, token } = useSelector(userSelector);
  const { isSuccess, isError, isFetching, errorMessage, policeStations } =
    useSelector(useractionSelector);
  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);


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
         <div className='flex justify-between px-4 pt-4'>
        <h2>Dashboard</h2>
        <h2>Welcome Back {user.fullName}</h2>
    </div>
      </>
    )}
  </>
  )
}

export default Header