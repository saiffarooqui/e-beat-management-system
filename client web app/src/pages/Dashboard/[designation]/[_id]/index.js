import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelector, dismissToken } from "@/store/auth/UserSlice";
import { useRouter } from "next/router";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  addPoliceStation,
  addSubDivision,
  clearState,
  getAllPoliceStation,
  useractionSelector,
} from "@/store/userActions/userActionSlice";
import Head from "next/head";
import Image from "next/image";
import Header from "@/components/Header";
import TopCards from "@/components/TopCards";
import { DoughnutChart } from "@/components/DoughnutChart";
import { RecentUsers } from "@/components/RecentUsers";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function ocn() {
  const router = useRouter();
  const { user, token } = useSelector(userSelector);
  const { isSuccess, isError, isFetching, errorMessage, policeStations } =
    useSelector(useractionSelector);
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
            <div>
              <Head>
                <title>Dashboard</title>
                <meta
                  name="description"
                  content="Generated by create next app"
                />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
              </Head>
              <main className="bg-gray-100 min-h-screen">
                <Header />
                <TopCards />
                <div className="p-4 grid md:grid-cols-2 grid-cols-1 gap-4">
                  <DoughnutChart />
                  <RecentUsers />
                </div>
              </main>
            </div>
          </Sidebar>
        </>
      )}
    </>
  );
}

//   const { isSuccess, isError, isFetching, errorMessage,policeStations } =
//     useSelector(useractionSelector);
//   useEffect(() => {
//     if (!user) router.push("/");
//   }, [user]);
//   console.log(user);
//   const dispatch = useDispatch();
//   const [namePS, setNamePS] = useState("M");
//   const [nameSD, setNameSD] = useState("");
//   const [districtPS, setdistrictPS] = useState("north");
//   const [districtSD, setdistrictSD] = useState("");
//   const addPS = async () => {
//     console.log("Add Police Station");
//     dispatch(
//       addPoliceStation({ name: namePS, district: districtPS, token: token })
//     );
//   };
//   const addSD = async () => {
//     console.log("Add Police Station");
//     dispatch(
//       addSubDivision({ name: namePS, district: districtPS, token: token })
//     );
//   };
//   const getPS = async () => {
//     console.log("Get All PS");
//     dispatch(getAllPoliceStation({token:token}));
//   };
//   useEffect(() => {
//     const errCheck = async () => {
//       console.log("SAY", isError, errorMessage);
//       if (isError) {
//         console.log("AK");
//         alert("Error: " + errorMessage);
//         if (errorMessage === "Invalid Authentication.") {
//           console.log("Deleting token");
//           localStorage.removeItem("ebeatToken");
//           dispatch(dismissToken());
//         }
//         dispatch(clearState());
//       }
//       if (isSuccess) {
//         console.log("Sucess")
//         dispatch(clearState());
//         console.log(policeStations)
//       }
//     };
//     errCheck();
//   }, [isError, isSuccess]);
//   return (
//     <div className="bg-white h-screen ">
//       {user && (
//         <>
//           {isFetching ? (
//             <>
//               <div className="h-screen flex flex-col justify-center align-middle items-center content-center bg-slate">
//                 <LoadingScreen />
//               </div>
//             </>
//           ) : (
//             <>
//               <h1>Name: {user?.fullName} </h1>
//               <h2>Designation: {user?.designation}</h2>
//               <button onClick={addPS}>Add Police station</button>
//               <br />
//               <button onClick={addSD}>Add SD</button>
//               <br />
//               <button onClick={getPS}>ALl PS</button>
//               {
//                 policeStations&&policeStations.map((p)=>{
//                   return <div key={p._id}>{p.name}</div>
//                 })
//               }
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// }