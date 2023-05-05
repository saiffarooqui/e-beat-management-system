import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import Link from "next/link";
import {
  LoadScript,
  GoogleMap,
  DrawingManager,
  Polygon,
  Marker,
  InfoWindow
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

const areaSupervisionDetails = () => {
  const url = "http://localhost:5000/";
  const [name, setName] = React.useState("");
  const [path, setPath] = React.useState("");
  const { user, token, isError } = useSelector(userSelector);
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [updateBeats, setupdateBeats] = useState(0);
  const [state, setState] = React.useState({
    drawingMode: "polygon",
  });
  const [markers, setMarkers] = useState([]);
  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };
  const [policeStation, setpoliceStation] = useState("");
  const [allsubdivisions, setallsubdivisions] = useState([]);
  const [allpolicestations, setallpolicestations] = useState([]);
  const [allbeats, setallbeats] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  console.log("USER IS", user);
  useEffect(() => {
    const fetchBeats = async (token) => {
      try {
        const url = "http://localhost:5000/beat/beatarea/all";
        const options = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        };

        const resp = await fetch(url, options);
        console.log("response message= ", resp.status);

        const fetchedBeats = await resp.json();
        setallbeats(fetchedBeats);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBeats(token);
  }, []);

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

  const [cols, setcols] = useState([]);
  const [coords, setBeatAreacoors] = useState(null);
  const [mapinfo, setMapInfo] = useState({});
  useEffect(() => {
    //getting all column info

    const getInfo = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            Authorization: token,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };

        const resp = await fetch(`${url}column/columninfo/all`, options);
        if (resp.status == 200 || resp.status == 201) {
          const columns = await resp.json();
          console.log("COLUMNINFO ISS:::", columns);
        }
      } catch (error) {
        console.log("Some error boi", error);
      }
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
        const url = `http://localhost:5000/column/columninfo/all`;
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
        console.log("cols", data);
        if (response.status === 200) {
          console.log("colshhj");
          setMarkers(data);
          // const bounds = new google.maps.LatLngBounds();
          // data.forEach(({ position }) => bounds.extend(position));
          // map.fitBounds(bounds);
        } else {
          alert("Something went wrong", data.msg);
        }

        const url2 = `http://localhost:5000/beat/beatarea/all`;
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

        // const url4 = `http://192.168.1.3:5000/column/data/beatarea/${ bid }`;
        // console.log(url4);
        // const response4 = await fetch(url4, {
        //   method: "GET",
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //     Authorization: token,
        //   },
        // });
        // let data4 = await response4.json();
        // console.log("PLO", data4);
        // if (response4.status === 200) {
        //   //setBeatAreacoors(data3);

        //   console.log("Here", data);
        //   let m = {};
        //   let allcols = [];
        //   //initializing count for each Id to 0
        //   for (let i in data) {
        //     console.log(data[i]._id);
        //     m[data[i]._id] = {};
        //     m[data[i]._id]["suspect"] = 0;
        //     m[data[i]._id]["danger"] = 0;
        //     m[data[i]._id]["safe"] = 0;
        //     allcols.push(data[i]._id);
        //   }
        //   data4.filter((i) => !allcols.includes(i.columnInfo._id));
        //   setFeeds(data4)
        //   console.log("Here",data4,allcols)
        //   for (let i in data4) {
        //     m[data4[i].columnInfo._id][data4[i].status] =
        //       m[data4[i].columnInfo._id][data4[i].status] + 1;
        //     console.log(data4[i]);
        //   }
        //   console.log("Here", m);
        //   setMapInfo(m);
        // } else {
        //  alert("Something went wrong", data.msg);
        // }
      } catch (error) {
        alert("Something went wrong", error);
      } finally {
      }
    };
    getInfo();
  }, []);

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
            {/* <div className="p-4 grid md:grid-cols-2 grid-cols-1 gap-4 "> */}
            <div className="App3">
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
                  {markers.filter((m)=>m.beatArea!==null).map((u) => (
                        <Marker
                          key={u._id}
                          position={{
                            lat: u.geometry.coordinates[1],
                            lng: u.geometry.coordinates[0],
                          }}
                          onClick={() => handleActiveMarker(u._id)}
                        >
                         {console.log("U",u.beatArea)}
                          {activeMarker ===u. _id ? (
                            <InfoWindow
                            onCloseClick={() => console.log(u.beatArea,markers.length)}
                            //ptions={{ maxWidth: 105, height: 100,padding:3, margin:2 }}
                            >
                              <div className="w-200 h-180 p-2">
                                <h1 className="text-lg  font-semibold leading-tight dark:opacity-60">
                                  {u.placeName}
                                </h1>
                                <h2 className="text-md  font-semibold leading-tight dark:opacity-60">
                                  {u.table.name}
                                </h2>
                                <h2 className="text-sm  font-semibold leading-tight dark:opacity-60">
                                  Creator: {u.user.fullName}
                                </h2>
                                {/* <div className="flex-row justify-between w-full">
                                <div>
                                  Safe: {mapinfo[user._id]["safe"]}
                                </div>
                                <div>
                                  Suspect: {mapinfo[user._id]["suspect"]}
                                </div>
                                <div>
                                  Danger: {mapinfo[user._id]["danger"]}
                                </div>
                                </div> */}
                                
                                
                                <Link href={`/Dashboard/${user.designation}/BeatArea/${u.beatArea._id}/location/${u._id}`}>
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
                       
                    
                  {allbeats.map((b) => {
                    {console.log(b)}
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
                        path={b.geometry.coordinates[0].map((c) => {
                          return { lat: c[1], lng: c[0] };
                        })}
                        // Event used when manipulating and adding points
                      />
                    );
                  })}
                </GoogleMap>
              </LoadScript>
            </div>

            {/* <div style={{ height: "90%", zIndex: 999 }}>
                
              </div> */}
            {/* </div> */}
          </Sidebar>
        </>
      )}
    </>
  );
};

export default areaSupervisionDetails;

// useEffect(()=>{
//     //getting all column info

//     const getInfo = async () =>{

//         try{
//             const options={
//               method: "GET",
//               headers:{
//                 "Authorization":token,
//                 Accept: "application/json",
//                 "Content-Type": "application/json",
//               }
//             }

//             const resp = await fetch(`${url}column/columninfo/all`,options)
//             if(resp.status == 200 || resp.status==201){
//                 const columns = await resp.json()
//                 console.log("COLUMNINFO ISS:::",columns)
//             }

//         }
//         catch(error){
//             console.log("Some error boi",error)
//         }
//       }
//       getInfo()

// },[])
