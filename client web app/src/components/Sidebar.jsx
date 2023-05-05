import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {RxSketchLogo, RxDashboard, RxPerson} from 'react-icons/rx'
import {FiSettings,FiPlus} from 'react-icons/fi'
import { useSelector, useDispatch } from "react-redux";
import { userSelector, dismissToken } from "@/store/auth/UserSlice";
import { useRouter } from "next/router";
import {MdAssignmentInd} from 'react-icons/md'

const Sidebar = ({children}) => {

    const router = useRouter();
    const { user, token } = useSelector(userSelector);
    

  return (
    <div className='flex'>
        <div className='fixed w-20 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between'>
            <div className='flex flex-col items-center'>
                <Link href={`/Dashboard/${user.designation}/${user._id}`}>
                <div className='bg-purple-800 text-white p-3 rounded-lg inline-block'>
                    <RxSketchLogo size={20} />
                </div>
                </Link>
                <span className='border-b-[1px] border-gray-200 w-full p-2'></span>
                <Link href={`/Dashboard/${user.designation}/${user._id}`}>
                <div className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
                    <RxDashboard size={20} />
                </div>
                </Link>
                <Link href={`/Dashboard/${user.designation}/users`}>
                <div className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
                    <RxPerson size={20} />
                </div>
                </Link>
                <Link href={`/Dashboard/${user.designation}/areaSupervision`}>
                <div className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
                    <MdAssignmentInd size={26} />
                </div>
                </Link>
                <Link href={`/Dashboard/${user.designation}/additions`}>
                <div className='bg-gray-100 hover:bg-gray-200 cursor-pointer my-4 p-3 rounded-lg inline-block'>
                    <FiPlus size={20} />
                </div>
                </Link>
               
            </div>
        </div>
        <main className='ml-20 w-full'>{children}</main>
    </div>
  )
}

export default Sidebar