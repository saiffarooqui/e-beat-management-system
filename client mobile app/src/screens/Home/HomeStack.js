import React from "react";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import MyProfile from "./Profile";
import Menu from "./Menu";
import BeatLocation from "./BeatLocation";
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Menu"
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#003249",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          height: 110,
        },
        headerTitleStyle: {
          color: "#FFFFFF",
          fontSize: 22,
          // fontFamily: "Inter",
          fontStyle: "normal",
          fontWeight: 900,
        },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="Menu"
        component={Menu}
        options={{ tabBarLabel: "Home" }}
      />

      <Stack.Screen
        name="Profile"
        component={MyProfile}
        options={{ tabBarLabel: "Profile" }}
        
      />
    {/* <Stack.Screen
        name="BeatLoca"
        component={BeatLocation}
        options={{ tabBarLabel: "Beat location", headerShown: true }}
      /> */}
    </Stack.Navigator>
  );
};

export default HomeStack;
