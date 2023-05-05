import React, {useEffect} from "react";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import { userSelector, dismissToken } from "@/store/auth/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";


const Cards = () => {
  const router = useRouter();
  const { user, token, isError } = useSelector(userSelector);
  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);
  return (
    <div className="grid lg:grid-cols-4 gap-4 lg:p-20 p-4">
      <Link
        href={`/Dashboard/${user.designation}/additions/beatArea`}
        className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border-4 p-4 rounded-lg"
      >
        <div className="flex items-center justify-between w-full p-2">
          <p className="text-2xl font-bold">Add Beat Area</p>
          <FiPlus className="text-2xl" />
        </div>
      </Link>

      <Link
        href={`/Dashboard/${user.designation}/additions/policeStation`}
        className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border-4 p-4 rounded-lg">
        <div className="flex items-center justify-between w-full p-2">
          <p className="text-2xl font-bold">Add Police Station</p>
          <FiPlus className="text-2xl" />
        </div>
      </Link>
      <Link
        href=""
        className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border-4 p-4 rounded-lg"
      >
        <div className="flex items-center justify-between w-full p-2">
          <p className="text-2xl font-bold">Add Subdivision</p>
          <FiPlus className="text-2xl" />
        </div>
      </Link>
      { user.designation === 'admin' &&
      <Link
        href={`/Dashboard/${user.designation}/additions/newTable`}
        className="lg:col-span-2 col-span-1 bg-white flex justify-between w-full border-4 p-4 rounded-lg">
        <div className="flex items-center justify-between w-full p-2 ">
          <p className="text-2xl font-bold">Add tables</p>
          <FiPlus className="text-2xl" />
        </div>
      </Link>
              }

      {/* <div className='lg:col-span-2 col-span-1 bg-white flex justify-between w-full border-4 p-4 rounded-lg'>
                <div className='flex flex-col w-full pb-4'>
                    <p className='text-2xl font-bold'>$69696</p>
                </div>
            </div> */}
    </div>
  );
};

export default Cards;
