import React, {useEffect} from "react";
import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import { userSelector, dismissToken } from "@/store/auth/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";



const newTable = () => {
    const router = useRouter();
    const { user, token, isError } = useSelector(userSelector);
    useEffect(() => {
      if (!user) router.push("/");
    }, [user]);


  return (
    <div>newTable</div>
  )
}

export default newTable