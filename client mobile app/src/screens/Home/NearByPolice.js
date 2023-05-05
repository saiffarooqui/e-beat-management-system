import React, { useEffect } from "react";
import {cloudinaryURL,baseURL,access_token} from '@env'
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import db from "../../config/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { GeoPoint } from "firebase/firestore";

import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Linking,Platform
} from "react-native";
import Divider from "../../components/Divider";

export default function NearByPolicr() {
  const [route, setRoute] = React.useState(null);
  const [userLocation, setUserLocation] = React.useState(null);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [destinationPoint, setDestintionPoint] = React.useState(null);
  const [track,setTrack] = React.useState(false)
  const [nearByVendors,setNearByVendors] = React.useState([])
  const dispatch = useDispatch();
  const getNearByPolice= async(coords)=>{

    let vendorsData = [];
    console.log("Find polices")
    try {
      const { latitude, longitude } = coords;

      const query = await db.near({
        center: new GeoPoint(latitude, longitude),
        radius: 100000,
      });
      console.log("Find polices 2")
      const value = await query.get();
      // All GeoDocument returned by GeoQuery, like the GeoDocument added above
      const url = baseURL;
     // console.log(value)
      await Promise.all(
        value.docs.map(async (doc) => {
       //  console.log(doc.id)
          const response = await fetch(`${url}user/userinfo`, {
            method: "GET",
            headers: {
              Authorization: doc.id,
            },
          });
          let data = await response.json();
          if (response.status === 200) {
            console.log(data)
            vendorsData.push({
              name: data.fullName,
              id: data._id,
              avatar: data.avatar,
              latitude: doc.data().coordinates.latitude,
              longitude: doc.data().coordinates.longitude,
              tokenId: doc.id,
              designation:data.designation,
              phoneNumber:data.phoneNumber
            });
          } else {
            return 
          }
        })
      );
      console.log(vendorsData)
   setNearByVendors(vendorsData)
      return 
    } catch (err) {
        console.log("Error",err)
      const data = {
        msg: "Network request failed",
      };
    }

  }
  const stopTracking = () => {
    setDestintionPoint(null);
    setTrack(false);
  };
  const call = () => { 

    console.log('callNumber ----> ', destinationPoint.phoneNumber,destinationPoint);
    let phone= destinationPoint.phoneNumber;
    let phoneNumber = destinationPoint.phoneNumber;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    }
    else  {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
    .then(supported => {
      if (!supported) {
        Alert.alert('Phone number is not available');
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch(err => console.log(err));
  };
  const reverseGeoCoding = async (coords, setStatefn) => {
    try {
      await fetch(
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        coords.longitude +
        ", " +
        coords.latitude +
        ".json?access_token=" +
        access_token
      )
        .then((response) => response.json())
        .then((responseJson) => {
          setStatefn({
            ...coords,
            address: responseJson.features[0].place_name,
          });
        });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Kuch toh hua");
    }
  };
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      Alert.alert(
        "Permission denied",
        "Allow us to access your current position. Without it, you won't be able to find you."
      );
      return;
    }
    let location = await Location.getLastKnownPositionAsync({});
    reverseGeoCoding(location.coords, setUserLocation);
    getNearByPolice(location.coords)
    
  };
  const setDestVendor = async (user) => {
    await reverseGeoCoding(user, setDestintionPoint);
    setShowTooltip(true);
    setTrack(true);
  };
  useEffect(() => {
    getLocation();
    
  }, []);

  return (
    <>
      {userLocation && (
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{ ...StyleSheet.absoluteFillObject }}
          initialRegion={{
            ...userLocation,
            latitudeDelta: 0.4,
            longitudeDelta: 1,
          }}
          minZoomLevel={2} // default => 0
          maxZoomLevel={20} // default => 20
        >
          <Marker coordinate={userLocation} title="You are here" />
          {!destinationPoint &&
            nearByVendors.map((user) => (
              <Marker
                key={user.tokenId}
                coordinate={{
                  latitude: user.latitude,
                  longitude: user.longitude,
                }}
                title={user.name}
                onPress={() => {
                  setDestVendor(user);
                }}
              ></Marker>
            ))}
          {destinationPoint && (
            <Marker
              // key={user.id}
              coordinate={{
                latitude: destinationPoint.latitude,
                longitude: destinationPoint.longitude,
              }}
              title={destinationPoint.name}
            />
          )}
          {destinationPoint && route && (
            <Polyline
              coordinates={route}
              strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
              strokeColors={[
                "#7F0000",
                "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
                "#B24112",
                "#E5845C",
                "#238C23",
                "#7F0000",
              ]}
              strokeWidth={3}
            />
          )}
        </MapView>
      )}
      {destinationPoint && (
        <View
          style={{
            justifyContent:'flex-end',
            alignSelf: "flex-end",
            width: "100%",
            padding: 20,
            height:'100%'
          }}
        >
          <View
            style={[
              {
                flexDirection: "column",
                backgroundColor: "white",
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
              },
              showTooltip && { minHeight: 300 },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#F7F7F7",
                justifyContent: "center",
                padding: 3,
                borderRadius: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowTooltip(!showTooltip);
                }}
              >
                <FontAwesome5
                  name={`${showTooltip ? "caret-down" : "caret-up"}`}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            <Divider />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 30,
                paddingVertical: 20,
                width: "100%",
                backgroundColor: "#F7F7F7",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    resizeMode: "cover",
                    marginHorizontal: 10,
                  }}
                  source={{ uri: destinationPoint.avatar }}
                />
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={{ color: "#242E42", fontWeight: 900, fontSize: 17 }}
                  >
                    {destinationPoint.name}
                  </Text>
                  <Text>{destinationPoint.designation}</Text>
                </View>
              </View>
              <View
                style={{
                  paddingVertical: 10,
                }}
              >
                <TouchableOpacity onPress={showTooltip ? call : stopTracking}>
                  <Ionicons
                    name={`${showTooltip ? "call" : "md-stop-circle-sharp"}`}
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {showTooltip && (
              <>
                <View
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 25,
                   
                    flexDirection: "row",
                    width: "80%",
                  }}
                >
                  <Entypo
                    name="location"
                    size={24}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={{ fontWeight: 400, fontSize: 17 }}>
                    {userLocation.address}
                  </Text>
                </View>
                <Divider />
                <View
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 25,
                    paddingVertical: 25,
                    width: "80%",
                    flexDirection: "row",
                  }}
                >
                  <MaterialCommunityIcons
                    name="circle-slice-8"
                    size={24}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={{ fontWeight: 400, fontSize: 17 }}>
                    {destinationPoint.address}
                  </Text>
                </View>
                <Divider />
              </>
            )}
          </View>
        </View>
      )}
    
    </>
  );
}
