import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import HomeStack from "./Home/HomeStack";
import { Text, View } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { userSelector } from "../toolkit/auth/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import NetworkError from "../components/NetworkError";
import Wait from "./Home/Wait";
import AddEntry from "./Home/AddEntry";
import BeatMap from "./Home/BeatMap";
import SnapEntry from "./Home/SnapEntry";
import Dashboard from "./Home/Dashboard";
const Tab = createBottomTabNavigator();
export default function BottomNavigation() {
  //const { state, dispatch } = React.useContext(AuthContext);
  //const profileCreated = state.userInfo.profileCreated
  //console.log(state)
  const { profileCreated, user, errorMessage, adminVerified } =
    useSelector(userSelector);
  console.log(errorMessage);

  return (
    <>
      <StatusBar />
      {adminVerified ? (
        <Tab.Navigator
          initialRouteName="HomeStack"
          backBehavior="initialRoute"
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: "true",
            tabBarStyle: {
              position: "absolute",
              bottom: -10,
              justifyContent: "center",
              alignItems: "center",
              background: "#FFFFFF",
              borderTopStartRadius: 30,
              borderTopEndRadius: 30,
              height: 85,
              elevation: 0,
              backgroundColor: "#ffffff",
              width: "100%",
            },
            tabBarActiveTintColor: "#003249",
            height: "100%",
          }}
        >
          <Tab.Screen
            name="HomeStack"
            component={HomeStack}
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={32} />
              ),
            }}
          />
          <Tab.Screen
            name="DashboardStack"
            component={Dashboard}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="view-grid-plus-outline"
                  color={color}
                  size={30}
                />
              ),

              tabBarStyle: {
               
              display:'none'
              },
            }}
          />

          {/* <Tab.Screen
            name="SnapShot"
            component={SnapEntry}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="image-marker-outline"
                  size={32}
                  color={color}
                />
              ),
            }}
          /> */}
          {/* <Tab.Screen
            name={"ActionButton"}
            component={BeatMap}
            options={{
              tabBarIcon: ({ color, size }) => (
                <View
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: color,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    marginBottom: Platform.OS == "android" ? 55 : 30,
                  }}
                >
                  <FontAwesome5 name="location-arrow" size={18} color="white" />
                </View>
              ),
            }}
            /> */}
          {/* // </Tab.Navigator>
          // <Tab.Screen
          //   name="AddEntry"
          //   component={AddEntry}
          //   options={{
          //     tabBarIcon: ({ color, size }) => (
          //       <MaterialCommunityIcons
          //         name="plus-circle"
          //         color={color}
          //         size={32}
          //       />
          //     ),
          //   }}
          // /> */}
          <Tab.Screen
            name="Inform"
            component={AddEntry}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="information"
                  size={32}
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      ) : errorMessage === "Network request failed" ? (
        <NetworkError />
      ) : (
        <Wait />
      )}
    </>
  );
}
