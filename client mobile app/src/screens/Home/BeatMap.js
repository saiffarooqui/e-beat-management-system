import React, { useEffect, useState } from "react";
const { width, height } = Dimensions.get("screen");
import Divider from "../../components/Divider";
import {cloudinaryURL,baseURL,access_token} from '@env'

import { Ionicons } from "@expo/vector-icons";
import {
  FontAwesome5,
  Entypo,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { useSelector, useDispatch } from "react-redux";
import MapView, { Marker, PROVIDER_GOOGLE, Polygon } from "react-native-maps";
import { beatSelector, clearState } from "../../toolkit/beat/BeatAreaSlice";
import { userSelector } from "../../toolkit/auth/UserSlice";
export default function BeatMap({ navigation }) {
  const [location, setLocation] = useState(null);
  const [userlocation, setuserLocation] = useState(null);
  const { beatArea, isError, isSuccess, isFetching } =
    useSelector(beatSelector);
  const { user, token } = useSelector(userSelector);
  const dispatch = useDispatch();
  const [route, setRoute] = React.useState(null);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [track, setTrack] = React.useState(false);
  const [destinationPoint, setDestintionPoint] = React.useState(null);
  const [cols, setcols] = useState([]);
  const [coords, setBeatAreacoors] = useState(null);
  const stopTracking = () => {
    setDestintionPoint(null);
    setTrack(false);
  };
  const call = () => {};
  const [load, setLoad] = React.useState(false);
  React.useEffect(() => {
    const getData = async () => {
      setLoad(true);
      try {
        const url = `${baseURL}column/columninfo/beatarea/${beatArea._id}`;
        console.log(url)
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        let data = await response.json();
        // console.log(data)
        if (response.status === 200) {
          setcols(data);
        } else {
          Alert.alert("Something went wrong", data.msg);
        }

        const url2 = `${baseURL}beat/beatarea/beatAreaId/${beatArea._id}`;
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
          Alert.alert("Something went wrong", data.msg);
        }
      } catch (error) {
        Alert.alert("Something went wrong", error);
      } finally {
        setLoad(false);
      }
    };
    getData();
  }, [beatArea]);
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
          console.log(responseJson.features[0].text, {
            ...coords,
            address: responseJson.features[0].place_name,
            nameLoc: responseJson.features[0].text,
          });
          setStatefn({
            ...coords,
            address: responseJson.features[0].place_name,
            nameLoc: responseJson.features[0].text,
          });
        });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Kuch toh hua");
    }
  };

  const setDest = async (user) => {
    await reverseGeoCoding(user, setDestintionPoint);
    setShowTooltip(true);
    setTrack(true);
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("PermYission to access location was denied");
      Alert.alert(
        "Permission denied",
        "Allow Hawkeye to access your current position. Without it, you won't be able to find you the chosen one"
      );
      return;
    }
    let ulocation = await Location.getCurrentPositionAsync({});
    reverseGeoCoding(ulocation.coords, setuserLocation);
    let k = await Location.getCurrentPositionAsync({});
    console.log(k, ulocation);
  };

  useEffect(() => {
    getLocation();
    dispatch(clearState());
  }, []);
  return (
    <>
   
      {(load || isFetching)&&!userlocation ? (
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
      ) : (
        userlocation &&
        coords && (
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{ ...StyleSheet.absoluteFillObject }}
            initialRegion={{
              latitude:
                coords?.geometry.coordinates[0][
                  parseInt(coords?.geometry?.coordinates[0].length / 2)
                ][1] || userlocation.latitude,
              longitude:
                coords?.geometry.coordinates[0][
                  parseInt(coords?.geometry?.coordinates[0].length / 2)
                ][0] || userlocation.longitude,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}
            // showsTraffic={true}
            minZoomLevel={2} // default => 0
            maxZoomLevel={20} // default => 20
            // onPress={(event) => {
            //   console.log(event.nativeEvent.coordinate);
            //   setLocation(event.nativeEvent.coordinate);
            // }}
          >
            <Marker coordinate={userlocation} title="You are here" />
            {!destinationPoint &&
              cols.map((user) => (
                <Marker
                  key={user._id}
                  coordinate={{
                    latitude: user.geometry.coordinates[1],
                    longitude: user.geometry.coordinates[0],
                  }}
                  title={user?.name || user?.placeName}
                  onPress={() => {
                    console.log("Here");

                    setDest({
                      beatloc: user,
                      latitude: user.geometry.coordinates[1],
                      longitude: user.geometry.coordinates[0],
                    });
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
                title={destinationPoint.beatloc.beatArea.name}
              />
            )}

            {beatArea && coords && (
              <Polygon
                coordinates={coords?.geometry?.coordinates[0].map((c) => {
                  return { latitude: c[1], longitude: c[0] };
                })}
                strokeColor={"red"}
                fillColor="#aabdbf"
                strokeWidth={1}
              />
            )}

            {location && <Marker coordinate={location} title="Mark This" />}
          </MapView>
        )
      )}

      {destinationPoint && (
        <ScrollView
          style={{
            position: "absolute",
            bottom: 62,
            alignSelf: "center",
            width: "100%",
            padding: 20,
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
                padding: 4,
                borderTopLeftRadius: 25,
                borderTopRightRadius: 25,
                borderBottomColor: "black",
                borderBottomWidth: 1,
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
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <FontAwesome5
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                  }}
                  name="location-arrow"
                  size={24}
                  color="black"
                />

                <Text
                  style={{ color: "#242E42", fontWeight: 900, fontSize: 17 }}
                >
                  {destinationPoint.nameLoc}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  columnGap: 10,
                  paddingVertical: 20,
                }}
              >
                <View>
                  <TouchableOpacity onPress={stopTracking}>
                    <Ionicons
                      name={`${"md-stop-circle-sharp"}`}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      console.log(destinationPoint.beatloc);
                      navigation.navigate("Beat Area", {
                        beatLocation: destinationPoint.beatloc,
                      });
                    }}
                  >
                    <FontAwesome name="edit" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {showTooltip && (
              <>
                <View
                  style={{
                    backgroundColor: "white",
                    paddingHorizontal: 25,
                    paddingVertical: 25,
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
                    {userlocation.address}
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
        </ScrollView>
      )}
    </>
  );
}
