import React,{useEffect} from "react";
import { StyleSheet, View, Image, Text, ScrollView } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import MenuTab from "../../components/MenuTab";
import { Switch } from "react-native-gesture-handler";
import * as Location from "expo-location";
import { useSelector, useDispatch } from "react-redux";
import * as TaskManager from "expo-task-manager";
import db from "../../config/firebaseConfig";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { GeoPoint, deleteDoc } from "firebase/firestore";
import {
  userSelector,
  clearState,
  dismissToken,
} from "../../toolkit/auth/UserSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
const LOCATION_TRACKING = "location-tracking";
const Menu = ({ navigation }) => {
  const [isLocationTrackEnabled, setIsLocationTrackEnabled] =
    React.useState(false);

  //const { state, dispatch } = React.useContext(AuthContext);
  const dispatch = useDispatch();
  const [locationStarted, setLocationStarted] = React.useState(false);
  const tracker = (value) => {
    setLocationStarted(value);
    if (value) startTracking();
    else stopTracking();
  };
  React.useEffect(() => {
    const start = async () => {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TRACKING
      );
      if (hasStarted) {
        TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then(
          (tracking) => {
            if (tracking) {
              console.log("Yes in background");
              setLocationStarted(true);
            }
          }
        );
      } else {
        console.log("Tracking not available in background");
      }
    };
    start();
    return () => {};
  }, []);
  const stopTracking = () => {
    console.log("Stop Tracking");
    setLocationStarted(false);
    TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then((tracking) => {
      if (tracking) {
        Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
      }
    });
  };
  const startTracking = async () => {
    console.log("Start Tracking");
    let foregroundPermission =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundPermission.status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Allow Hawkeye to access your current position. Without it, you won't be able to track you"
      );
      return;
    }
    let backgroundPermission =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundPermission.status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Allow Hawkeye to access your current position. Without it, you won't be able to track you"
      );
      return;
    }
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 2000,
      distanceInterval: 0,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    setLocationStarted(hasStarted);
    console.log("tracking started?", hasStarted);
  };

  const { user } = useSelector(userSelector);
  return (
    <ScrollView contentContainerStyle={styles.ScrollV}>
      <View
        style={{
          width: "100%",
          paddingVertical: 20,
          paddingHorizontal: 20,
          flexDirection: "column",
          gap: 20,
          marginBottom: 90,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
       {
        user?.avatar&&( 
        <Image
          resizeMode="cover"
          source={{ uri: user?.avatar }}
          style={{ width: 180, height: 180, borderRadius: 200 }}
        />)
       }
        <View
          style={{
            width: "100%",
            padding: 20,
            flexDirection: "column",
            alignContent: "center",
            rowGap: 25,
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            shadowColor: "#003249" ,
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowRadius: 20,
            elevation: 20,
            shadowOpacity: 1,
          }}
        >
          {/*Vendor name */}
          <View
            style={{
              flexDirection: "row",
              columnGap: 10,
              justifyContent: "flex-start",
            }}
          >
            {
              user?.avatar&&(<Image
                width={40}
                height={40}
                source={{ uri: user?.avatar }}
                borderRadius={5}
              />)
            }
            {/* <Text>{user.avatar}</Text> */}
            <View style={{ padding: 4, flexDirection: "column", rowGap: 1 }}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 14,
                  textAlign: "left",
                  color: "#242d38",
                }}
              >
                {user?.fullName}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  // fontFamily: FontFamily.interRegular,
                  color: "#7b8491",
                }}
              >
                {user?.designation}
              </Text>
            </View>
          </View>

          {/*My profile */}

          <MenuTab
            leftIconComp={
              <MaterialCommunityIcons
                name={"account-circle"}
                size={22}
                color="#003249"
              />
            }
            title="My Profile"
            rightIconComp={
              <View
                onStartShouldSetResponder={() => navigation.navigate("Profile")}
              >
                <MaterialIcons name="navigate-next" size={24} color="#7B8491" />
              </View>
            }
            navigation={navigation}
            screen="Profile"
          />
       
          <MenuTab
            leftIconComp={<Ionicons name="log-out" size={22} color="#003249" />}
            title="Sign Out"
            rightIconComp={
              <View
                onStartShouldSetResponder={async () => {
                  console.log("log out");
                  const keys = await AsyncStorage.getItem('userToken');
                  try {
                   // await AsyncStorage.multiRemove(keys);
                   await AsyncStorage.removeItem('userToken').then(()=>{
                    console.log("Log out from device")
                   })
                   await db.doc(keys).delete().then(()=>{
                    console.log("Deleted from db")
                   })
                  } catch (error) {
                    console.log(error)
                  }
                  dispatch(dismissToken());
                  dispatch(clearState());
                }}
              >
                <MaterialIcons name="navigate-next" size={24} color="#7B8491" />
              </View>
            }
          />

       
          <MenuTab
          leftIconComp={
            <MaterialIcons name="edit-location" size={22} color="#003249" />
          }
          title="Tracking Status"
          rightIconComp={
            <Switch
              trackColor={{ false: "#767577", true: "#003249" }}
              thumbColor={locationStarted ? "#ffffff" : "#f4f3f4"}
              onValueChange={(value) => tracker(value)}
              value={locationStarted}
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1 }] }}
            />
          }
        />
       
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ScrollV: {
    justifyContent: "center",
    alignItems: "center",
  },
});

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log("LOCATION_TRACKING task ERROR:", error);
    return;
  }
 // console.log("LOCATION_TRACKING task");
  if (data) {
    const { locations } = data;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;
    l1 = lat;
    l2 = long;
    console.log(`${new Date(Date.now()).toLocaleString()}: ${lat},${long}`);
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      await db.doc(userToken).set({
        coordinates: new GeoPoint(lat, long),
      });
    } catch (error) {
      console.log("User not logged in",error);
    }
  }
});

export default Menu;
