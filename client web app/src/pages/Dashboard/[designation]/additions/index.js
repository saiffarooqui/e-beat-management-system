import Cards from '@/components/Cards'
import Sidebar from '@/components/Sidebar'

import React, { useEffect, useState, useRef } from "react";
import { LoadingScreen } from '@/components/LoadingScreen.js';
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



const additions = () => {

    const router = useRouter();
    const {user,token,isError} = useSelector(userSelector)
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
        <Sidebar>
      <div className='m-auto'>
        <Cards/>
      </div>
      </Sidebar> 
      </>
    )}
  </>
  )
}

export default additions

