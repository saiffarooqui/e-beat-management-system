import React from "react";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE, Polygon } from "react-native-maps";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import {cloudinaryURL,baseURL} from '@env'
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Switch,
  Image,
  Text,
  Dimensions,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Button,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { userSelector } from "../../toolkit/auth/UserSlice";
import { StatusBar } from "expo-status-bar";
import { getDistance, getPreciseDistance } from "geolib";
import { useSelector, useDispatch } from "react-redux";
import { Camera } from "expo-camera";
let camera;
import * as FaceDetector from "expo-face-detector";
export default function BeatLocation({ navigate, route, navigation }) {
  //console.log(route);
  const { user, token } = useSelector(userSelector);
  const [startCamera, setStartCamera] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState(null);
  const [cameraType, setCameraType] = React.useState(
    Camera.Constants.Type.back
  );
  const [archived, setArchived] = React.useState(false);
  const [faces, setFaces] = React.useState([]);
  const [flashMode, setFlashMode] = React.useState("off");

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log(status);
    if (status === "granted") {
      navigation.setOptions({ headerShown: false });
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };
  const [results, setResults] = React.useState([]);
  const [isListening, setIsListening] = React.useState(false);
  React.useEffect(() => {
    function onSpeechResults(e) {
      setResults(e.value ?? []);
      console.log(e)
    }
    function onSpeechError(e) {
      console.error(e);
    }
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    return function cleanup() {
      Voice?.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  async function toggleListening() {
    try {
      if (isListening) {
        await Voice.stop();
        setIsListening(false);
      } else {
        setResults([]);
        await Voice.start("en-US");
        setIsListening(true);
      }
    } catch (e) {
      console.error(e);
    }
  }
  const __takePicture = async () => {
    const options = { quality: 0.7, base64: true, exif: true };
    const photo = await camera.takePictureAsync(options);
    console.log(photo.location);
    // manipulatedImage.uri now contains the URI of the modified image with location watermark
    setPreviewVisible(true);
    //console.log("P",faces)
    //setStartCamera(false)
    setCapturedImage(photo);
  };

  const [radioButtons, setRadioButtons] = React.useState([
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "Safe",
      value: "safe",
      color: "#003249",
      size: 18,
    },
    {
      id: "2", // acts as primary key, should be unique and non-empty string
      label: "Suspect",
      value: "suspect",
      color: "#003249",
      size: 18,
    },
    {
      id: "3",
      label: "Danger",
      value: "danger",
      color: "#003249",
      size: 18,
    },
  ]);

  const [avt, setAv] = React.useState(null);
  const [load, setLoad] = React.useState(false);
  const __savePhoto = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("PermYission to access location was denied");
      Alert.alert(
        "Permission denied",
        "Allow Hawkeye to access your current position. Without it, you won't be able to find you the chosen one"
      );
      return;
    }
    console.log(status);
    let ulocation = await Location.getCurrentPositionAsync({});
    //console.log(ulocation);
    setuserLocation(ulocation.coords);
    var pdis = getPreciseDistance(
      {
        latitude: ulocation.coords.latitude,
        longitude: ulocation.coords.longitude,
      },
      {
        latitude: area.geometry.coordinates[1],
        longitude: area.geometry.coordinates[0],
      }
    );
    //alert(`Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`);
    console.log(pdis, faces);
    setLoad(true);

    if (faces.length === 0 || !faces[0]) {
      Alert.alert("Entry Failed", "No faces were detected", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      setLoad(false);
      return;
    } else if (false) {
      Alert.alert("Entry Failed", "You are not found at required location", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      setLoad(false);
      return;
    } else {
      //console.log(faces);
    }
    const source = capturedImage.base64;
    //console.log("Here", source, capturedImage);
    if (source) {
      let base64Img = `data:image/jpg;base64,${source}`;
      let apiUrl = `${cloudinaryURL}/`;
      //formData.append('transformation', 'your-watermark-transformation-url');

      let data = {
        file: base64Img,
        upload_preset: "inspirathon",
      };
      // console.log("Here");
      await fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      })
        .then(async (response) => {
          //  console.log(response);
          let data = await response.json();
          if (data.secure_url) {
            // console.log("Here uplad",data.secure_url);
            setAv(data.secure_url);
            // alert("Upload successful");
            //
            // console.log({
            //   image_url: data.secure_url,
            //   review: rep,
            //   status: v[bstatus],

            // });
            const url2 = `${baseURL}column/data/create`;
            const response2 = await fetch(url2, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: token,
              },
              body: JSON.stringify({
                image_url: data.secure_url,
                review: rep,
                status:  v[bstatus],
                geometry: {
                  coordinates: [
                    ulocation.coords.longitude,
                    ulocation.coords.latitude,
                  ],
                },
                columnInfo: area._id
              }),
            });
            //console.log(policeStation.status, subDivisions.status);
            console.log(response2);
            let data2 = await response2.json();
            console.log(response)
            console.log(data2);
            if (response2.status === 201) {
              alert("Upload successful");
              
              setLoad(false);

            } else {
              Alert.alert("Something went wrong", data.msg);
              setLoad(false);
              
              return;
            }
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Cannot upload");
        });
      // console.log("Here");
    }
    setLoad(false);
  };
  const v = ["safe", "suspect", "danger"];
  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    __startCamera();
  };
  const __handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("on");
    } else {
      setFlashMode("auto");
    }
  };
  const __switchCamera = () => {
    if (cameraType === "back") {
      setCameraType("front");
    } else {
      setCameraType("back");
    }
  };
  const handleFacesDetected = ({ faces }) => {
    setFaces(faces);
    console.log(faces);
  };
  const area = route.params.beatLocation;

  const [rep, setRep] = React.useState("");
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const [userLocation, setuserLocation] = React.useState(null);
  const [bstatus, setStatus] = React.useState(0);
  return load ? (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10,
        }}
      >
        <ActivityIndicator size="large" color="#003249" />
      </View>
    </>
  ) : (
    <>
      {startCamera ? (
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              width: "100%",
            }}
          >
            {previewVisible && capturedImage&&!load ? (
              <CameraPreview
                photo={capturedImage}
                savePhoto={__savePhoto}
                retakePicture={__retakePicture}
              />
            ) : (
              <Camera
                type={cameraType}
                flashMode={flashMode}
                style={{ flex: 1 }}
                onFacesDetected={handleFacesDetected}
                faceDetectorSettings={{
                  mode: FaceDetector.FaceDetectorMode.fast,
                  detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                  runClassifications:
                    FaceDetector.FaceDetectorClassifications.none,
                  minDetectionInterval: 100,
                  tracking: true,
                }}
                ref={(r) => {
                  camera = r;
                }}
              >
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: "transparent",
                    flexDirection: "row",
                    height: "100%",
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    {faces?.map((face) => (
                      <View
                        key={face.faceID}
                        style={[
                          styles.face,
                          {
                            borderWidth: 2,
                            borderColor: "#FFD700",
                            position: "absolute",
                            left: face.bounds.origin.x,
                            top: face.bounds.origin.y,
                            width: face.bounds.size.width,
                            height: face.bounds.size.height,
                          },
                        ]}
                      />
                    ))}
                    {faces[0] && (
                      <Text style={{ top: 200 }}>
                        {" "}
                        is {faces[0].rollAngle}{" "}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      left: "5%",
                      top: "10%",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={__handleFlashMode}
                        style={{
                          backgroundColor:
                            flashMode === "off" ? "#fff" : "#000",
                          borderRadius: 50,
                          height: 25,
                          width: 25,
                        }}
                      >
                        {flashMode === "off" ? (
                          <Ionicons name="flash-off" size={24} color="black" />
                        ) : (
                          <Ionicons name="flash" size={24} color="white" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      flexDirection: "row",
                      flex: 1,
                      width: "100%",
                      paddingVertical: 20,
                      paddingHorizontal: 60,
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity onPress={__switchCamera} style={{}}>
                      <Text
                        style={{
                          fontSize: 20,
                        }}
                      >
                        {cameraType === "front" ? "🤳" : "📷"}
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        alignSelf: "center",
                        flex: 1,
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={__takePicture}
                        style={{
                          width: 70,
                          height: 70,
                          top: 0,

                          borderRadius: 50,
                          backgroundColor: "#fff",
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.setOptions({ headerShown: true });
                        setStartCamera(false);
                      }}
                      style={{}}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                        }}
                      >
                        <Feather name="stop-circle" size={24} color="white" />
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Camera>
            )}
          </View>
        </View>
      ) : (
        <ScrollView>
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 60,
              paddingTop: 50,
            }}
          >
            <View
              style={{ borderBottomWidth: 1, borderColor: "#003249" }}
            ></View>
            <View style={{}}>
              <View vertical contentContainerStyle={{}}>
                {Object.entries(area)?.map(([key, value]) => {
                  if (
                    key.toLowerCase() !== "geometry" &&
                    key !== "_id" &&
                    key.toLowerCase() !== "archived" &&
                    key !== Object(key) &&
                    value !== Object(value) &&
                    key !== "__v"
                  )
                    return (
                      <View style={{ flexDirection: "row" }} key={key}>
                        <Text
                          style={{
                            borderColor: "#003249",
                            fontSize: 15,
                            width: "50%",
                            padding: 8,
                            fontWeight: 500,
                            color: "#003249",
                            borderLeftWidth: 1,
                            borderBottomWidth: 1,
                            borderRightWidth: 1,
                          }}
                        >
                          {capitalizeFirstLetter(key)}
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,

                            width: "50%",
                            padding: 12,
                            color: "#003249",
                            borderColor: "#003249",
                            borderBottomWidth: 1,
                            borderRightWidth: 1,
                          }}
                        >
                          {value}
                        </Text>
                      </View>
                    );
                })}
              </View>
              <SegmentedControl
                values={["safe", "suspect", "danger"]}
                selectedIndex={bstatus}
                onChange={(event) => {
                  setStatus(event.nativeEvent.selectedSegmentIndex);
                  console.log(event.nativeEvent.selectedSegmentIndex);
                }}
                activeFontStyle={{ color: "#003249" }}
                style={{ marginHorizontal: 15, marginBottom: 3, marginTop: 12 }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    fontWeight: "600",
                    fontSize: 18,
                    textAlign: "left",
                    paddingBottom: 4,
                    marginTop: 20,
                  }}
                >
                  Report
                </Text>
                <View style={{flexDirection:'row', columnGap:10, padding:10}}>
                  
                  <TouchableOpacity  onPress={()=>{console.log(isListening);toggleListening()}}>
                    {isListening===true?<Feather name="mic" size={24} color="black" />:<Feather name="mic-off" size={24} color="black" />}
                  </TouchableOpacity>
                  {/* {results&&<Text>{results[0]}</Text>} */}
                  <Switch
                    trackColor={{ false: "#767577", true: "#003249" }}
                    thumbColor={archived ? "#ffffff" : "#f4f3f4"}
                    onValueChange={() => {
                      setArchived(!archived);
                    }}
                    value={archived}
                    style={{
                      transform: [{ scaleX: 1.2 }, { scaleY: 1 }],
                    }}
                  />
                </View>
              </View>
            </View>

            <TextInput
              editable
              multiline
              numberOfLines={5}
              maxLength={10000}
              scrollEnabled
              style={styles.inputText}
              onChangeText={(v) => {
                setRep(v)
                setResults([])
              }}
              value={results.length!==0?rep+results[0]:rep}
              // placeholder={"Report"}
              placeholderTextColor={"#003249"}
            />

            <View style={{ marginTop: 20 }}>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{
                  alignSelf: "center",
                  width: "100%",
                  height: 80,
                  borderRadius: 10,
                }}
                initialRegion={{
                  latitude: area.geometry.coordinates[1],
                  longitude: area.geometry.coordinates[0],
                  latitudeDelta: 0.0001,
                  longitudeDelta: 0.0201,
                }}
                //  showsTraffic={true}
                minZoomLevel={2} // default => 0
                maxZoomLevel={40} // default => 20
                // onPress={(event) => {
                //   console.log(event.nativeEvent.coordinate);
                //   setLocation(event.nativeEvent.coordinate);
                // }}
              >
                <Marker
                  coordinate={{
                    latitude: area.geometry.coordinates[1],
                    longitude: area.geometry.coordinates[0],
                  }}
                  title={area.placeName}
                />
              </MapView>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                paddingVertical: 20,
              }}
            >
              <TouchableOpacity
                onPress={__startCamera}
                style={{
                  width: 130,
                  borderRadius: 4,
                  backgroundColor: "#14274e",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",

                  height: 40,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Take picture
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    color: "#003249",
    // fontFamily: FontFamily.poppinsRegular,
    fontSize: 15,
    width: "100%",
    //backgroundColor: "#d7edf7",
    borderWidth: 0.1,
    borderRadius: 1,

    padding: 10,
    textAlign: "left",
  },
  label: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "left",
    padding: 8,
  },
});

const CameraPreview = ({ photo, retakePicture, savePhoto }) => {
  //console.log("sdsfds", photo);
  return (
    <View
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            padding: 15,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              >
                Re-take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              >
                Save Entry
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
