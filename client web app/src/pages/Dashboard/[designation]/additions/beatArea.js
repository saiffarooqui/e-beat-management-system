import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import {
  LoadScript,
  GoogleMap,
  DrawingManager,
  Polygon,
} from "@react-google-maps/api";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import { userSelector, dismissToken } from "@/store/auth/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { LoadingScreen } from "@/components/LoadingScreen";
import { RecentUsers } from "@/components/RecentUsers";
import { Beats } from "@/components/Beats";
import { headers } from "next/dist/client/components/headers";
const API_KEY = "AIzaSyBawL8VbstJDdU5397SUX7pEt9DslAwWgQ";

export default function BeatArea() {
  const url = "http://localhost:5000/";
  const [name, setName] = React.useState("");
  const [path, setPath] = React.useState("");
  const { user, token, isError } = useSelector(userSelector);
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [updateBeats, setupdateBeats] = useState(0)
  const [state, setState] = React.useState({
    drawingMode: "polygon",
  });
  const [policeStation, setpoliceStation] = useState("");
  const [allsubdivisions, setallsubdivisions] = useState([]);
  const [allpolicestations, setallpolicestations] = useState([]);
  const [allbeats, setallbeats] = useState([])

  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  useEffect(()=>{
    const fetchBeats = async (token) =>{
      
      try{
        const url = 'http://localhost:5000/beat/beatarea/all'
        const options = {method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
          
          const resp = await fetch(url,options)
          console.log("response message= ",resp.status)

          const fetchedBeats = await resp.json()
          setallbeats(fetchedBeats)
      }
    catch(error)
    {
      console.log(error)
    }
  }
  fetchBeats(token)
  },[])


  const submit = async () => {
    
    try {
      console.log(`${url}beat/create`)
      const response2 = await fetch(`${url}beat/create`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          name: name,
          geometry: {
            coordinates: [path],
          },
        }),
      });
     
      console.log(response2)
      let data2 = await response2.json();
      
      if (response2.status === 200 || response2.status === 201) {
        setMessage('Beat Area added successfully!')
        setupdateBeats( updateBeats => updateBeats+1)
        await fetchBeats(token)
      }
    } catch (error) {
      console.log("Error", error);
      setMessage('There was an unexpected error!')
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
              Authorization: token,
            },
          });
          let data2 = await response2.json();
          if (response2.status === 200) {
            console.log(data2);
            setallpolicestations(data2);
          }
        } catch (error) {
          console.log("Error");
        }
      }
    })();
  }, []);
  
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

  setTimeout(()=>{
    setMessage(null)
  },4000)


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
            <div className="p-4 grid md:grid-cols-2 grid-cols-1 gap-4 ">
              <div className="App2">
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
                      lat: 15.4909,
                      lng: 73.8278,
                    }}
                    zoom={10}
                    version="weekly"
                  >
                    <DrawingManager
                      drawingMode={state.drawingMode}
                      options={{
                        drawingControl: true,
                        drawingControlOptions: {
                          drawingModes: ["polygon"],
                        },
                        polygonOptions: {
                          fillColor: "#003249",
                          strokeColor: "#003249",
                          fillOpacity: 0.5,
                          strokeWeight: 2,
                          clickable: true,
                          editable: true,
                          draggable: true,
                          zIndex: 1,
                        },
                      }}
                      onPolygonComplete={(poly) => {
                        const polyArray = poly.getPath().getArray();
                        let paths = [];
                        polyArray.forEach(function (path) {
                          paths.push([path.lng(), path.lat()]);
                          console.log(path.lat(), path.lng());
                        });
                        if(paths.length!==0)
                        paths.push([paths[0][0],paths[0][1]])
                        console.log("onPolygonComplete", polyArray);
                        console.log("onPolygonComplete", paths);
                        setPath(paths);
                        noDraw();
                      }}

                      /*onOverlayComplete={poly => {
              const polyArray = poly.getPath().getArray();
              let paths = [];
              polyArray.forEach(function(path) {
                paths.push({ latitude: path.lat(), longitude: path.lng() });
              });
              console.log("onOverlayComplete", polyArray);
            }}*/
                    />
                    {allbeats.map((b) => {
                      return (
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
                          path={b.geometry.coordinates[0].map((c)=>{ return {lat:c[1],lng:c[0]} })}
                          // Event used when manipulating and adding points
                        />
                      );
                    })}
                  </GoogleMap>
                  {console.log(allbeats)}
                </LoadScript>
              </div>

              <div style={{ height: "90%", zIndex: 999 }}>
                <div class=" bg-white rounded-lg shadow h-full">
                  <div class="flex">
                    <div class="flex-1 py-5 pl-5 overflow-hidden">
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
                        Beat Area
                      </h1>
                    </div>
                  </div>
                  <div class="px-5 pb-5">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      class=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                    />

                    <Select
                      className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                      value={policeStation}
                      onChange={(value) => {
                        setpoliceStation(value);
                      }}
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          boxShadow: "none",
                          borderWidth: 0,
                          border: state.isFocused && "none",
                          backgroundColor: "placeholder-gray-600",
                        }),

                        menu: (provided, state) => ({
                          ...provided,
                          zIndex: 9999,
                          boxShadow: "none",
                          borderWidth: 1,
                          backgroundColor: "white",
                          borderColor: "black",
                          width: "90%",
                          zIndex: 1,
                        }),

                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isFocused && "lightgray",
                          color: state.isFocused ? "#003249" : "black",
                        }),
                      }}
                      classNamePrefix="Station"
                      // defaultValue={colourOptions[0]}
                      // isDisabled={isDisabled}
                      // isLoading={isLoading}
                      // isClearable={isClearable}
                      // isRtl={isRtl}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option._id}
                      isSearchable={true}
                      options={allpolicestations}
                      name="policestation"
                    />
                    <div class="flex flex-col ">
                      <button
                        onClick={submit}
                        className="mt-2 items-center self-center  w-full text-white flex justify-center bg-gradient-to-r from-[#01364f] to-slate-700  hover:bg-gradient-to-l hover:from-[#01364f] hover:to-slate-700 p-2 rounded-md  tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                      >
                        Submit
                      </button>
                      {message && <div role="alert" className="fixed top-0 right-0 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded m-4">{message}!</div>} 
                    </div>

                    {/* <div class="flex"> */}
                    {/* <div  className=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                     >
                      <button
                        onClick={()=>{Draw(); console.log(state)}}
                        class=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blue Gray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                        >
                        Submit
                      </button> */}
                    {/* </div> */}
                    {/* <div class="flex-grow">
                        <input
                          placeholder="City"
                          class=" text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base   transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200  focus:border-blue Gray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
                        />
                      </div> */}
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
            <Beats updateBeats={updateBeats}/>
          </Sidebar>
        </>
      )}
    </>
  );
}


//   [
  //     { lat: 15.387207493822496, lng: 73.99671479492189 },
  //     { lat: 15.29317769691511, lng: 74.02280732421876 },
  //     { lat: 15.268007623752064, lng: 74.16288300781251 },
  //     { lat: 15.608208409653278, lng: 74.09696503906251 },
  //     { lat: 15.471930376140515, lng: 74.07499238281251 },
  //   ],
  //   [
  //     { lat: 15.66242986573064, lng: 73.90470429687501 },
  //     { lat: 15.62011191032568, lng: 73.88273164062501 },
  //     { lat: 15.54603446975961, lng: 73.90195771484376 },
  //     { lat: 15.522218197997551, lng: 73.976115429687511 },
  //     { lat: 15.608208409653278, lng: 74.09147187500001 },
  //     { lat: 15.70738309274487, lng: 73.97336884765626 },
  //   ],
  // ]);