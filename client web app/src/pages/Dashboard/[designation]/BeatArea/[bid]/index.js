import React, { useEffect, useState,useRef } from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import {GrUserPolice} from 'react-icons/gr'
import InfoButton from "@/components/InfoButton";
import {
  LoadScript,
  GoogleMap,
  DrawingManager,
  Polygon,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import { userSelector, dismissToken } from "@/store/auth/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { LoadingScreen } from "@/components/LoadingScreen";
import { RecentUsers } from "@/components/RecentUsers";
import { Beats } from "@/components/Beats";
import Link from "next/link";
import { BsExclamationOctagon } from "react-icons/bs";
import { Arapey } from "next/font/google";

const API_KEY = "AIzaSyBawL8VbstJDdU5397SUX7pEt9DslAwWgQ";

export default function BeatAreaDetail() {
  const router = useRouter();
  const { bid } = router.query;
  const [activeMarker, setActiveMarker] = useState(null);
  const [beatOfficers, setbeatOfficers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eligibleBeatOfficers, seteligibleBeatOfficers] = useState([]);
  const [message, setMessage] = useState(null);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };
  const [markers,setMarkers] =useState([])
  const [onmapmark,setonmapmark] = useState([])
  const handleOnLoad = (map) => {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  };
  const [cols, setcols] = useState([]);
  const [coords, setBeatAreacoors] = useState(null);
  const [mapinfo, setMapInfo] = useState({});
  const url = "http://localhost:5000/";
  const [name, setName] = React.useState("");
  const [path, setPath] = React.useState("");
  const { user, token, isError } = useSelector(userSelector);
  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);
  const [feeds, setFeeds] = React.useState([]);
  const submit = async () => {
    console.log(
      path,
      name,
      policeStation,
      `${url}beat/create`,
      JSON.stringify({
        name: name,
        geometry: path,
      })
    );
    try {
      const response2 = await fetch(`${url}beat/create`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          name: name,
          geometry: path,
        }),
      });
      console.log("res check", response2);
      let data2 = await response2.json();
      console.log(data2);
      if (response2.status === 200) {
        console.log(data2);
        setallpolicestations(data2);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    (async () => {
      console.log("Fetching");
      if (user?.designation === "pi") {
        setallpolicestations([
          { _id: user?.policeStation._id, name: user?.policeStation.name },
        ]);
      } else {
        try {
          const response2 = await fetch(`${url}user/getAllPoliceStations`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          // console.log("res check", response2);
          let data2 = await response2.json();
          // console.log(data2);
          if (response2.status === 200) {
            // console.log(data2);
            setallpolicestations(data2);
          }
        } catch (error) {
          console.log("Error");
        }
        try {
          const url = `http://localhost:5000/column/columninfo/beatarea/${ bid }`;
          console.log(url);
          const response = await fetch(url, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
          let data = await response.json();
           console.log("cols",data)
          if (response.status === 200) {
            console.log("colshhj")
            setMarkers(data);
            // const bounds = new google.maps.LatLngBounds();
            // data.forEach(({ position }) => bounds.extend(position));
            // map.fitBounds(bounds);
          } else {
           alert("Something went wrong", data.msg);
          }
  
          const url2 = `http://localhost:5000/beat/beatarea/beatAreaId/${ bid }`;
          console.log(url2);
          const response2 = await fetch(url2, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
          let data2 = await response2.json();
          //console.log("PLO",data2)
          if (response2.status === 200) {
            setBeatAreacoors(data2);
          } else {
           alert("Something went wrong", data.msg);
          }
  
          const url4 = `http://localhost:5000/column/data/beatarea/${ bid }`;
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
            
            console.log("Here", data);
            let m = {};
            let allcols = [];
            //initializing count for each Id to 0
            for (let i in data) {
              console.log(data[i]._id);
              m[data[i]._id] = {};
              m[data[i]._id]["suspect"] = 0;
              m[data[i]._id]["danger"] = 0;
              m[data[i]._id]["safe"] = 0;
              allcols.push(data[i]._id);
            }
            data4.filter((i) => !allcols.includes(i.columnInfo._id));
            setFeeds(data4)
            console.log("Here",data4,allcols)
            for (let i in data4) {
              m[data4[i].columnInfo._id][data4[i].status] =
                m[data4[i].columnInfo._id][data4[i].status] + 1;
              console.log(data4[i]);
            }
            console.log("Here", m);
            setMapInfo(m);
          } else {
           alert("Something went wrong", data.msg);
          }
        } catch (error) {
         alert("Something went wrong", error);
        } finally {
          
        }
      }
    })();
  }, []);

  React.useEffect(() => {
    console.log("USER", user);
    if (!user) router.push("/");
  }, [user]);

  const [state, setState] = React.useState({
    drawingMode: "polygon",
  });
  const [policeStation, setpoliceStation] = useState("");
  const [allsubdivisions, setallsubdivisions] = useState([]);
  const [allpolicestations, setallpolicestations] = useState([]);
  const [allbeats, setallbeats] = React.useState([
    [
      { lat: 15.387207493822496, lng: 73.99671479492189 },
      { lat: 15.29317769691511, lng: 74.02280732421876 },
      { lat: 15.268007623752064, lng: 74.16288300781251 },
      { lat: 15.608208409653278, lng: 74.09696503906251 },
      { lat: 15.471930376140515, lng: 74.07499238281251 },
    ],
  ]);
  const noDraw = () => {
    setState(function set(prevState) {
      return Object.assign({}, prevState, {
        drawingMode: "maker",
      });
    });
  };
  const Draw = () => {
    setState(function set(prevState) {
      return Object.assign({}, prevState, {
        drawingMode: "polygon",
      });
    });
  };

  //Fetching all the officers in the respective beat area

  useEffect(()=>{
    const getOfficers = async (token) =>{

      try{
          const options={
            method: "GET",
            headers:{
              "Authorization":token,
              Accept: "application/json",
              "Content-Type": "application/json",
            }
          }
          
          //http://localhost:5000/beat/beatofficer/beatArea/644fb2e23389ca2c9165566e
        
          const resp = await fetch(`${url}beat/beatofficer/beatArea/${bid}`,options)
          if(resp.status == 200 || resp.status==201){
            const BeatOfficers = await resp.json()
            console.log("BEAT OFFICERSD ARE...:"+BeatOfficers.assignedBeatOfficers)
            setbeatOfficers(BeatOfficers.assignedBeatOfficers)
          }
          
      }
      catch(error){
          console.log("Some error boi",error)
      }
    }
    getOfficers(token)
  },[])

const openModal = async()=>{
  setIsModalOpen(true);

  //Fetch all the eligible officers for assignment
  //user.policeStation._id
  
  const policeStnID = user.policeStation._id
  console.log("POLCIE STSTS:",policeStnID)
  try{
    const options={
      method: "GET",
      headers:{
        "Authorization":token,
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    } 
    // /assignableUsers/:policeStationId
    
    const resp = await fetch(`${url}user/assignableUsers/${policeStnID}`,options)
    if(resp.status == 200 || resp.status==201){
      const EligBeatOfficers = await resp.json()
      console.log("THE RESPONSERSEFWEFWEF: ",EligBeatOfficers)
      seteligibleBeatOfficers(EligBeatOfficers) //eligible beat officers array
    } 
}
catch(error){
    console.log("Some error boi",error)
}
}

function closeModal() {
  setIsModalOpen(false);
};

const handleAssign = async (userId) =>{
  
  console.log("CLICKEDED")
  console.log("userId is: "+userId)
  console.log("ENTERED ASSIGNHANDLE")
      try {
          const options = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Accept:"application/json",
              Authorization:token,
          },
          body: JSON.stringify({
              assignedUserId: userId,
              beatAreaId: bid
            })
          };
          console.log("ASSIGNED USER AND BEAT AREA",JSON.stringify({
            assignedUserId: userId,
            beatAreaId: bid
          }))
          
          const response = await fetch(`${url}beat/beatarea/assign`, options);

          if(response.status === 200 || response.status==201){
            const AssignedOfficer = await response.json();
            const updatedUser = {
              '_id':AssignedOfficer.populatedAssign._id,
              'assignedUser':{
                '_id':AssignedOfficer.populatedAssign.assignedUser._id,
                'fullName': AssignedOfficer.populatedAssign.assignedUser.fullName,
                'phoneNumber':AssignedOfficer.populatedAssign.assignedUser.phoneNumber,
                'district':AssignedOfficer.populatedAssign.assignedUser.district,
                'designation':AssignedOfficer.populatedAssign.assignedUser.designation
              },
              'beatArea':{
                'name':AssignedOfficer.populatedAssign.beatArea.name,
                '_id':AssignedOfficer.populatedAssign.beatArea._id
              },
              "assignedBy": {
                '_id': AssignedOfficer.populatedAssign.assignedBy._id,
                'fullName': AssignedOfficer.populatedAssign.assignedBy.fullName,
                'phoneNumber': AssignedOfficer.populatedAssign.assignedBy.phoneNumber,
              }
            }
            console.log("ASSIGNED OFFICER: ",AssignedOfficer)
            setMessage('Officer has been assigned to this beat area')
            console.log(message)
            setbeatOfficers(prevState => [...prevState,updatedUser])
          }
          else{
            console.log("ENTERED ELSE BLOCK")
           
          }

      } catch (error) {
          console.log(error)
      }
       
  }

const handleUnassign = async (AssignedUserId) =>{

  try {
    const options = {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
        Accept:"application/json",
        Authorization:token,
    },
    };
    
  const response = await fetch(`${url}beat/beatofficer/unassign/${AssignedUserId}`, options);
  if(response.status == 200 || response.status==201)
  {
    const UnassignedUSer = await response.json()
    console.log("USER UNASSIGNED: ",UnassignedUSer) 
    setMessage('Officer has been unassigned from this beat area')
    console.log(message)
    const updatedOfficers = beatOfficers.filter(officer => officer._id !== AssignedUserId);
    setbeatOfficers(updatedOfficers)
  }

  else{
    console.log("AssignedUserIdIS: ",AssignedUserId)
    }
  }
  catch(error)
  {
    console.log(error)
  }
  
}


setTimeout(()=>{
  setMessage(null)
  console.log("SDLSDMLSDMFSLD")
},5000)


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
        {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                  <div className="w-[70%] h-[70%] bg-white rounded-lg p-4 relative overflow-scroll">
                    <button className="absolute top-4 right-4" onClick={closeModal}>
                      X
                    </button>
                      <h2 className="text-center mt-5 mb-5">Beat Officers in your police station</h2>
                      <div className='w-full m-auto p-4 border rounded-lg bg-white'>
                        <div className='my-3 p-2 grid md:grid-cols-3 grid-cols-2 items-center justify between cursor-pointer'>
                            <span>Name</span>
                            <span className='hidden md:grid'>Phone</span>
                            <span className='hidden md:grid'>Designation</span>
                        </div>
                        <ul>
                          {eligibleBeatOfficers.map((officer,_id)=>{
                            return(
                            <li key={officer._id} className='bg-gray hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-3 grid-cols-2 items-center  cursor-pointer'>
                                <div className='flex items-center w-full'>
                                    <div className='bg-purple-100 p-3 '>
                                        <GrUserPolice className='text-purple-800'/>
                                    </div>
                                    <p className="pl-4">{officer.fullName}</p>
                                </div>
                                <p className='hidden md:grid'>
                                {officer.phoneNumber}
                                </p>
                                <div className='sm:flex justify-between items-center'>
                                    <p className='hidden md:grid'>
                                    {officer.designation}
                                    </p>
                                    {/* <BsThreeDotsVertical onClick={()=>toggleopenDropDown(officer._id) } className='hover:bg-gray-300 rounded-lg'/>
                                    {openDropDown === officer._id && 
                                        (<div ref={dropdownRef} className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                                            <button className="w-full block px-4 py-2 text-gray-800 hover:bg-purple-500 hover:text-white" onClick={()=>handleAssign(openDropDown)}>Assign</button>
                                            <button className="w-full block px-4 py-2 text-gray-800 hover:bg-purple-500 hover:text-white" onClick={()=>handleUnassign(openDropDown)}>Unassign</button>
                                        </div>)} */}
                                    <InfoButton onClick={()=>handleAssign(officer._id)}>
                                        Assign
                                    </InfoButton>
                                </div>
                            </li>)
                          })}
                        </ul>
                      </div>
                  </div>
                </div>
              )}
          <Sidebar>
          {message && <div role="alert" className="fixed top-0 right-0 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded m-4 z-20">{message}!</div>} 
            <div className="p-4 grid md:grid-cols-2 grid-cols-1 gap-4 ">
              <div className="flex-col">
                <div className="App">
                
                  <LoadScript
                    id="script-loader"
                    googleMapsApiKey={API_KEY}
                    libraries={["drawing"]}
                    language="en"
                    region="us"
                  >
                    <GoogleMap
                      mapContainerClassName="App-map"
                      
                      center={{
                        lat: 15.486402860588887,
                        lng: 73.81770931184292,
                        
                      

                      }}

                      zoom={40}
                      version="weekly"
                    >
                      {markers.map((user) => (
                        <Marker
                          key={user._id}
                          position={{
                            lat: user.geometry.coordinates[1],
                            lng: user.geometry.coordinates[0],
                          }}
                          onClick={() => handleActiveMarker(user._id)}
                        >
                         {console.log(user)}
                          {activeMarker ===user. _id ? (
                            <InfoWindow
                            onCloseClick={() => console.log(user,markers.length)}
                            //options={{ maxWidth: 105, height: 100,padding:3, margin:2 }}
                            >
                              <div className="w-200 h-180 p-6">
                                <h1 className="text-lg  font-semibold leading-tight dark:opacity-60">
                                  {user.placeName}
                                </h1>
                                <h1 className="text-md  font-semibold leading-tight dark:opacity-60">
                                  {user.table.name}
                                </h1>
                                <div className="flex-row justify-between w-full">
                                <div>
                                  Safe: {mapinfo[user._id]["safe"]}
                                </div>
                                <div>
                                  Suspect: {mapinfo[user._id]["suspect"]}
                                </div>
                                <div>
                                  Danger: {mapinfo[user._id]["danger"]}
                                </div>
                                </div>
                                
                                <Link href={`/Dashboard/${user.designation}/BeatArea/${bid}/location/${user._id}`}>
                                  <a
                                    href="#"
                                    class="inline-flex items-center mt-1 justify-center p-1 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                                  >
                                    <span class="w-full">
                                      Visit
                                    </span>
                                    <svg
                                      aria-hidden="true"
                                      class="w-6 h-6 ml-3"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fill-rule="evenodd"
                                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                      ></path>
                                    </svg>
                                  </a>{" "}
                                </Link>
                              </div>
                            </InfoWindow>
                          ) : null}
                        </Marker>
                      ))}
                       
                      { 
                      coords&&(
                          <Polygon
                            // Make the Polygon editable / draggable

                            options={{
                              strokeOpacity: 0.4,
                              strokeColor: "#2A2A57",
                              fillColor: "#000",
                              fillColor: "#003249",
                              strokeColor: "#003249",
                              fillOpacity: 0.3,
                              strokeWeight: 3,
                            }}
                            // path={?.geometry?.coordinates[0].map((c) => {
                            //   return { latitude: c[1], longitude: c[0] };
                            // })}
                            path={coords.geometry.coordinates[0].map((c)=>{ return {lat:c[1],lng:c[0]} })}
                            // Event used when manipulating and adding points
                          />
                        )
                      }
                    </GoogleMap>
                  </LoadScript>
                </div>

                <div class="w-full invisible lg:visible px-6 mx-auto max-w-screen-2xl rounded-xl">
                  <div class="flex flex-wrap mt-0 -mx-3">
                    <div class="flex-none w-1/4 max-w-full py-4 pl-0 pr-3 mt-0">
                      <div class="flex mb-2">
                        <div class="flex items-center justify-center w-5 h-5 mr-2 text-center bg-center rounded fill-current shadow-soft-2xl bg-gradient-to-tl from-blue-600 to-cyan-400 text-neutral-900">
                          <svg
                            width="10px"
                            height="10px"
                            viewBox="0 0 40 40"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                          >
                            <title>spaceship</title>
                            <g
                              stroke="none"
                              stroke-width="1"
                              fill="none"
                              fill-rule="evenodd"
                            >
                              <g
                                transform="translate(-1720.000000, -592.000000)"
                                fill="#FFFFFF"
                                fill-rule="nonzero"
                              >
                                <g transform="translate(1716.000000, 291.000000)">
                                  <g transform="translate(4.000000, 301.000000)">
                                    <path
                                      class="color-background"
                                      d="M39.3,0.706666667 C38.9660984,0.370464027 38.5048767,0.192278529 38.0316667,0.216666667 C14.6516667,1.43666667 6.015,22.2633333 5.93166667,22.4733333 C5.68236407,23.0926189 5.82664679,23.8009159 6.29833333,24.2733333 L15.7266667,33.7016667 C16.2013871,34.1756798 16.9140329,34.3188658 17.535,34.065 C17.7433333,33.98 38.4583333,25.2466667 39.7816667,1.97666667 C39.8087196,1.50414529 39.6335979,1.04240574 39.3,0.706666667 Z M25.69,19.0233333 C24.7367525,19.9768687 23.3029475,20.2622391 22.0572426,19.7463614 C20.8115377,19.2304837 19.9992882,18.0149658 19.9992882,16.6666667 C19.9992882,15.3183676 20.8115377,14.1028496 22.0572426,13.5869719 C23.3029475,13.0710943 24.7367525,13.3564646 25.69,14.31 C26.9912731,15.6116662 26.9912731,17.7216672 25.69,19.0233333 L25.69,19.0233333 Z"
                                    ></path>
                                    <path
                                      class="color-background"
                                      d="M1.855,31.4066667 C3.05106558,30.2024182 4.79973884,29.7296005 6.43969145,30.1670277 C8.07964407,30.6044549 9.36054508,31.8853559 9.7979723,33.5253085 C10.2353995,35.1652612 9.76258177,36.9139344 8.55833333,38.11 C6.70666667,39.9616667 0,40 0,40 C0,40 0,33.2566667 1.855,31.4066667 Z"
                                    ></path>
                                    <path
                                      class="color-background"
                                      d="M17.2616667,3.90166667 C12.4943643,3.07192755 7.62174065,4.61673894 4.20333333,8.04166667 C3.31200265,8.94126033 2.53706177,9.94913142 1.89666667,11.0416667 C1.5109569,11.6966059 1.61721591,12.5295394 2.155,13.0666667 L5.47,16.3833333 C8.55036617,11.4946947 12.5559074,7.25476565 17.2616667,3.90166667 L17.2616667,3.90166667 Z"
                                      opacity="0.598539807"
                                    ></path>
                                    <path
                                      class="color-background"
                                      d="M36.0983333,22.7383333 C36.9280725,27.5056357 35.3832611,32.3782594 31.9583333,35.7966667 C31.0587397,36.6879974 30.0508686,37.4629382 28.9583333,38.1033333 C28.3033941,38.4890431 27.4704606,38.3827841 26.9333333,37.845 L23.6166667,34.53 C28.5053053,31.4496338 32.7452344,27.4440926 36.0983333,22.7383333 L36.0983333,22.7383333 Z"
                                      opacity="0.598539807"
                                    ></path>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </div>
                        <p class="mt-1 mb-0 font-semibold leading-tight text-xs dark:opacity-60">
                          Total Spots
                        </p>
                      </div>
                      <h4 class="font-bold dark:text-white">{markers.length}</h4>
                      <div class="text-xs h-0.75 flex w-3/4 overflow-visible rounded-lg bg-gray-200">
                        <div
                          class="duration-600 ease-soft -mt-0.4 w-9/10 -ml-px flex h-1.5 flex-col justify-center overflow-hidden whitespace-nowrap rounded-lg bg-slate-700 text-center text-white transition-all"
                          role="progressbar"
                          aria-valuenow="100"
                          aria-valuemin="100"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>

                    <div class="flex-none w-1/4 max-w-full py-4 pl-0 pr-3 mt-0">
                      <div class="flex mb-2">
                        <div class="flex items-center justify-center w-5 h-5 mr-2 text-center bg-center rounded fill-current shadow-soft-2xl bg-gradient-to-tl from-purple-700 to-pink-500 text-neutral-900">
                          <svg
                            width="10px"
                            height="10px"
                            viewBox="0 0 40 44"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                          >
                            <title>document</title>
                            <g
                              stroke="none"
                              stroke-width="1"
                              fill="none"
                              fill-rule="evenodd"
                            >
                              <g
                                transform="translate(-1870.000000, -591.000000)"
                                fill="#FFFFFF"
                                fill-rule="nonzero"
                              >
                                <g transform="translate(1716.000000, 291.000000)">
                                  <g transform="translate(154.000000, 300.000000)">
                                    <path
                                      class="color-background"
                                      d="M40,40 L36.3636364,40 L36.3636364,3.63636364 L5.45454545,3.63636364 L5.45454545,0 L38.1818182,0 C39.1854545,0 40,0.814545455 40,1.81818182 L40,40 Z"
                                      opacity="0.603585379"
                                    ></path>
                                    <path
                                      class="color-background"
                                      d="M30.9090909,7.27272727 L1.81818182,7.27272727 C0.814545455,7.27272727 0,8.08727273 0,9.09090909 L0,41.8181818 C0,42.8218182 0.814545455,43.6363636 1.81818182,43.6363636 L30.9090909,43.6363636 C31.9127273,43.6363636 32.7272727,42.8218182 32.7272727,41.8181818 L32.7272727,9.09090909 C32.7272727,8.08727273 31.9127273,7.27272727 30.9090909,7.27272727 Z M18.1818182,34.5454545 L7.27272727,34.5454545 L7.27272727,30.9090909 L18.1818182,30.9090909 L18.1818182,34.5454545 Z M25.4545455,27.2727273 L7.27272727,27.2727273 L7.27272727,23.6363636 L25.4545455,23.6363636 L25.4545455,27.2727273 Z M25.4545455,20 L7.27272727,20 L7.27272727,16.3636364 L25.4545455,16.3636364 L25.4545455,20 Z"
                                    ></path>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </div>
                        <p class="mt-1 mb-0 font-semibold leading-tight text-xs dark:opacity-60">
                          Total Reports
                        </p>
                      </div>
                      <h4 class="font-bold dark:text-white">{Object.keys(mapinfo).length}</h4>
                      <div class="text-xs h-0.75 flex w-3/4 overflow-visible rounded-lg bg-gray-200">
                        <div
                          class="duration-600 ease-soft -mt-0.4 -ml-px flex h-1.5 w-3/5 flex-col justify-center overflow-hidden whitespace-nowrap rounded-lg bg-slate-700 text-center text-white transition-all"
                          role="progressbar"
                          aria-valuenow="60"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>

                    <div class="flex-none w-1/4 max-w-full py-4 pl-0 pr-3 mt-0">
                      <div class="flex mb-2">
                        <div class="flex items-center justify-center w-5 h-5 mr-2 text-center bg-center rounded fill-current shadow-soft-2xl bg-gradient-to-tl from-red-500 to-yellow-400 text-neutral-900">
                          <svg
                            width="10px"
                            height="10px"
                            viewBox="0 0 43 36"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                          >
                            <title>credit-card</title>
                            <g
                              stroke="none"
                              stroke-width="1"
                              fill="none"
                              fill-rule="evenodd"
                            >
                              <g
                                transform="translate(-2169.000000, -745.000000)"
                                fill="#FFFFFF"
                                fill-rule="nonzero"
                              >
                                <g transform="translate(1716.000000, 291.000000)">
                                  <g transform="translate(453.000000, 454.000000)">
                                    <path
                                      class="color-background"
                                      d="M43,10.7482083 L43,3.58333333 C43,1.60354167 41.3964583,0 39.4166667,0 L3.58333333,0 C1.60354167,0 0,1.60354167 0,3.58333333 L0,10.7482083 L43,10.7482083 Z"
                                      opacity="0.593633743"
                                    ></path>
                                    <path
                                      class="color-background"
                                      d="M0,16.125 L0,32.25 C0,34.2297917 1.60354167,35.8333333 3.58333333,35.8333333 L39.4166667,35.8333333 C41.3964583,35.8333333 43,34.2297917 43,32.25 L43,16.125 L0,16.125 Z M19.7083333,26.875 L7.16666667,26.875 L7.16666667,23.2916667 L19.7083333,23.2916667 L19.7083333,26.875 Z M35.8333333,26.875 L28.6666667,26.875 L28.6666667,23.2916667 L35.8333333,23.2916667 L35.8333333,26.875 Z"
                                    ></path>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </div>
                        <p class="mt-1 mb-0 font-semibold leading-tight text-xs dark:opacity-60">
                          Suspects
                        </p>
                      </div>
                      <h4 class="font-bold dark:text-white">{markers.filter((i)=>mapinfo[i._id]&&mapinfo[i._id]["suspect"]>0).length}</h4>
                      <div class="text-xs h-0.75 flex w-3/4 overflow-visible rounded-lg bg-gray-200">
                        <div
                          class="duration-600 ease-soft -mt-0.4 w-3/10 -ml-px flex h-1.5 flex-col justify-center overflow-hidden whitespace-nowrap rounded-lg bg-slate-700 text-center text-white transition-all"
                          role="progressbar"
                          aria-valuenow="30"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>

                    <div class="flex-none w-1/4 max-w-full py-4 pl-0 pr-3 mt-0">
                      <div class="flex mb-2">
                        <div class="flex items-center justify-center w-5 h-5 mr-2 text-center bg-center rounded fill-current shadow-soft-2xl bg-gradient-to-tl from-red-600 to-rose-400 text-neutral-900">
                          <svg
                            width="10px"
                            height="10px"
                            viewBox="0 0 40 40"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                          >
                            <title>settings</title>
                            <g
                              stroke="none"
                              stroke-width="1"
                              fill="none"
                              fill-rule="evenodd"
                            >
                              <g
                                transform="translate(-2020.000000, -442.000000)"
                                fill="#FFFFFF"
                                fill-rule="nonzero"
                              >
                                <g transform="translate(1716.000000, 291.000000)">
                                  <g transform="translate(304.000000, 151.000000)">
                                    <polygon
                                      class="color-background"
                                      opacity="0.596981957"
                                      points="18.0883333 15.7316667 11.1783333 8.82166667 13.3333333 6.66666667 6.66666667 0 0 6.66666667 6.66666667 13.3333333 8.82166667 11.1783333 15.315 17.6716667"
                                    ></polygon>
                                    <path
                                      class="color-background"
                                      d="M31.5666667,23.2333333 C31.0516667,23.2933333 30.53,23.3333333 30,23.3333333 C29.4916667,23.3333333 28.9866667,23.3033333 28.48,23.245 L22.4116667,30.7433333 L29.9416667,38.2733333 C32.2433333,40.575 35.9733333,40.575 38.275,38.2733333 L38.275,38.2733333 C40.5766667,35.9716667 40.5766667,32.2416667 38.275,29.94 L31.5666667,23.2333333 Z"
                                      opacity="0.596981957"
                                    ></path>
                                    <path
                                      class="color-background"
                                      d="M33.785,11.285 L28.715,6.215 L34.0616667,0.868333333 C32.82,0.315 31.4483333,0 30,0 C24.4766667,0 20,4.47666667 20,10 C20,10.99 20.1483333,11.9433333 20.4166667,12.8466667 L2.435,27.3966667 C0.95,28.7083333 0.0633333333,30.595 0.00333333333,32.5733333 C-0.0583333333,34.5533333 0.71,36.4916667 2.11,37.89 C3.47,39.2516667 5.27833333,40 7.20166667,40 C9.26666667,40 11.2366667,39.1133333 12.6033333,37.565 L27.1533333,19.5833333 C28.0566667,19.8516667 29.01,20 30,20 C35.5233333,20 40,15.5233333 40,10 C40,8.55166667 39.685,7.18 39.1316667,5.93666667 L33.785,11.285 Z"
                                    ></path>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </div>
                        <p class="mt-1 mb-0 font-semibold leading-tight text-xs dark:opacity-60">
                          Danger
                        </p>
                      </div>
                      <h4 class="font-bold dark:text-white">{markers.filter((i)=>mapinfo[i._id]&&mapinfo[i._id]["danger"]>0).length}</h4>
                      <div class="text-xs h-0.75 flex w-3/4 overflow-visible rounded-lg bg-gray-200">
                        <div
                          class=" -mt-0.4 -ml-px flex h-1.5 w-1/2 flex-col justify-center overflow-hidden whitespace-nowrap rounded-lg bg-slate-700 text-center text-white transition-all"
                          role="progressbar"
                         
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class=" bg-white rounded-lg shadow  overflow-y-auto h-80">
                <div class="flex">
                  <div class="flex-1 py-5 pl-5">
                    <svg
                      class="inline align-text-top"
                      height="24px"
                      viewBox="0 0 24 24"
                      width="24px"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#000000"
                    >
                      <g>
                        <path
                          d="m4.88889,2.07407l14.22222,0l0,20l-14.22222,0l0,-20z"
                          fill="none"
                          id="svg_1"
                          stroke="null"
                        ></path>
                        <path
                          d="m7.07935,0.05664c-3.87,0 -7,3.13 -7,7c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zm-5,7c0,-2.76 2.24,-5 5,-5s5,2.24 5,5c0,2.88 -2.88,7.19 -5,9.88c-2.08,-2.67 -5,-7.03 -5,-9.88z"
                          id="svg_2"
                        ></path>
                        <circle
                          cx="7.04807"
                          cy="6.97256"
                          r="2.5"
                          id="svg_3"
                        ></circle>
                      </g>
                    </svg>
                    <h1 class="inline text-2xl font-semibold leading-none">
                      Feed On Beat Area
                    </h1>
                  </div>
                </div>
                <div class="px-5 pb-5 overflow-y-scroll h-50">
                  {feeds.map((f) => {
                    return (
                      <div key={f}>
                        <button class="flex items-center w-full px-5 mt-2 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
                          <img
                            class="object-cover w-8 h-8 rounded-full"
                            src={f.image_url}
                            alt=""
                          />

                          <div class="text-left rtl:text-right">
                            <h1 class="text-sm font-medium text-gray-700 capitalize dark:text-white">
                              {f.user.fullName}
                            </h1>

                            <p class="text-xs text-gray-500 dark:text-gray-400">
                              {f.status}
                            </p>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="p-4 grid md:grid-cols-1 grid-cols-1 gap-4 ">
             
             <div className="ml-5">
                <div className="flex justify-between mr-5 items-center">
                      <h2 className="mb-4 ml-3">Officers assigned to this Beat area</h2>
                      <InfoButton onClick={openModal}>
                        Assign Officer
                      </InfoButton>
                </div>
                
                <ul>
                  {beatOfficers.map((beatOfficer,_id)=>{
                    return(
                      <li key={beatOfficer._id} className='bg-gray-50 hover:bg-gray-100 p-3 rounded-lg my-3 flex items-center cursor-pointer'>
                        <div className='w-full flex justify-between mr-5 items-center'>
                          <h2 className="ml-3">
                            {beatOfficer.assignedUser.fullName}
                          </h2>
                          <InfoButton onClick={()=>handleUnassign(beatOfficer._id)}>
                              Unassign
                          </InfoButton>
                        </div>
                      </li>
                    )
                  })}
                </ul>
             </div>
            </div>
          </Sidebar>
        </>
      )}
    </>
  );
}


// Things to do:
// 1.Get all beat areas
// 2. Mark them
// 3. Hover and show info on markers