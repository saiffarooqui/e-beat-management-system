import React, { useEffect, useState } from "react";
import { userSelector, dismissToken } from "@/store/auth/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
export default function Location() {
  const { user, token, isError } = useSelector(userSelector);
  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);
  const router = useRouter();
  const {bid, lid } = router.query;
  const [feeds, setFeeds] = React.useState([]);
  const [mapinfo, setMapInfo] = useState({});
  const [col,setCol] = useState({})
  const url = "http://localhost:5000/";
  useEffect(()=>{
    const get=async()=>{
      console.log(`${url}beat/columninfo/all`)
      try {
        const response2 = await fetch(`${url}column/columninfo/all`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          
            Authorization:token
          },
        });
        // console.log("res check", response2);
        let data2 = await response2.json();
        // console.log(data2);
        if (response2.status === 200) {
           console.log(data2);
           data2 = data2.filter((i)=>i._id===lid)
           setCol(data2)
           console.log("DATA@",data2)
          console.log(data2.filter((i)=>i._id===lid))
        }
        else{
          return
        }
        const url4 = `http://localhost:5000/column/data/columninfo/${lid}/beatarea/${data2[0].beatArea._id}/table/${data2[0].table._id}`;
          console.log(url4);
          const response4 = await fetch(url4, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
          let data4 = await response4.json();
          console.log("PLO", data4);
          if (response4.status === 200) {
            //setBeatAreacoors(data3);
            
            console.log("Here", data2);
            let m = {};
            let allcols = [];
            //initializing count for each Id to 0
            for (let i in data2) {
              console.log(data2[i]._id);
              m[data2[i]._id] = {};
              m[data2[i]._id]["suspect"] = 0;
              m[data2[i]._id]["danger"] = 0;
              m[data2[i]._id]["safe"] = 0;
              allcols.push(data2[i]._id);
            }
            data4.filter((i) => !allcols.includes(i.columnInfo._id));
            setFeeds(data4)
            console.log("Here",data2,allcols)
            for (let i in data4) {
              m[data4[i].columnInfo._id][data4[i].status] =
                m[data4[i].columnInfo._id][data4[i].status] + 1;
              console.log(data4[i]);
            }
            console.log("Here yes", m);
            setMapInfo(m);
          } else {
           alert("Something went wrong");
          }
      } catch (error) {
        console.log("Error",error);
      }
    }
    get()
  },[])
  return (
    <>
      <div className="p-16">
        <div className="p-8 bg-white shadow mt-24 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 w-full">
            <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            
              <div>
                <p className="font-bold text-gray-700 text-xl">{feeds.length}</p>
                <p className="text-gray-400">Total Reports</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-xl">{mapinfo[lid]&&mapinfo[lid]["safe"]}</p>
                <p className="text-gray-400">Safe</p>
              </div>
             
            </div>
            <div className="relative">
              <div className="w-48 h-48 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center ">
                <Image
                  src="/logo.png"
                  alt="Picture of the author"
                  width={300}
                  height={300}
                />
              </div>
            </div>

            <div className=" flex justify-between mt-32 md:mt-0 md:justify-center grid grid-cols-2 text-center">
            <div>
                <p className="font-bold text-gray-700 text-xl">{mapinfo[lid]&&mapinfo[lid]["suspect"]}</p>
                <p className="text-gray-400">Suspect</p>
              </div>
             
              <div>
                <p className="font-bold text-gray-700 text-xl">{mapinfo[lid]&&mapinfo[lid]["danger"]}</p>
                <p className="text-gray-400">Danger</p>
              </div>
              {/* <div>
                <p className="font-bold text-gray-700 text-xl">89</p>
                <p className="text-gray-400">Total Officers</p>
              </div> */}
              {/* <button className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                Connect
              </button>
              <button className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                Message
              </button> */}
            </div>
          </div>

          <div className="mt-20 text-center border-b pb-12">
            <h1 className="text-4xl font-medium text-gray-700">
              {col[0]?.placeName}
            </h1>
            {/* <p className="font-light text-gray-600 mt-3">Margao</p>

           
            <p className="mt-2 text-gray-500">Pure Veg Restaurant</p> */}
          </div>

          {/* <div className="mt-12 flex flex-col justify-center">
            <p className="text-gray-600 text-center font-light lg:px-16">
              An artist of considerable range, Ryan — the name taken by
              Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs
              and records all of his own music, giving it a warm, intimate feel
              with a solid groove structure. An artist of considerable range.
            </p>
            <button className="text-indigo-500 py-2 px-4  font-medium mt-4">
              Show more
            </button>
          </div> */}
        </div>
      </div>{" "}
      <header>
        <div className="flex content-center items-center px-40 relative z-10"></div>
      </header>
      <div className="flex items-start md:mx-20 relative z-10">
      <section className="ml-6 flex-1">
          <h2 className="font-semibold text-2xl">Location details</h2>
          <p className="text-gray-600">
            General information about this Beat Location
          </p>
          <div className="bg-white border border-gray-300 mb-5 rounded-lg shadow w-full">
            <h2 className="border-b-2 border-gray-200 font-semibold mt-4 mx-6 pb-1 text-xl">
              Beat information
            </h2>
            <ul className="mt-6">
            {col[0]&&Object.entries(col[0])?.map(([key, value]) => {
                  if (
                    key.toLowerCase() !== "geometry" &&
                    key !== "_id" &&
                    key.toLowerCase() !== "archived" &&
                    key !== Object(key) &&
                    value !== Object(value) &&
                    key !== "__v"
                  )
                return  <li className="flex px-6 py-2">
                <div className="text-gray-600 w-1/4">{key}:</div>
                <div className="font-semibold w-3/4">
              {value}
                </div>
              </li>
                })}
          
            
            </ul>
            {/* <button className="bg-white border font-medium mb-5 ml-5 mt-6 px-3 py-2 rounded shadow text-gray-700">
              Change site name
            </button> */}
          </div>
        </section>
      </div>
    </>
  );
}
