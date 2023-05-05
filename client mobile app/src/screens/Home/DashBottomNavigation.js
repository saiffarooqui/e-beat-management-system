import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
const DashTab = createBottomTabNavigator();
import { Text, View } from "react-native";
import BeatMap from "./BeatMap";
import SnapEntry from "./SnapEntry";
import AddEntry from "./AddEntry";
import HomeStack from "./HomeStack";
import BeatLocation from "./BeatLocation";


export default function DashBottomNavigation({navigation}) {
  return (
    <View style={{flex:1}}>
      <DashTab.Navigator
        initialRouteName="Map"
        backBehavior="initialRoute"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: "true",
          tabBarStyle: {
            position: "absolute",
            left: 1,
            right: 1,
            bottom: -15,
            justifyContent: "center",
            alignItems: "center",
            background: "#FFFFFF",
            borderRadius: 30,
            height: 100,
            elevation: 0,
            backgroundColor: "#ffffff",
            width: "100%",
          },
          tabBarActiveTintColor: "#003249",
          height: "100%",
        }}
      >
         <DashTab.Screen
            name="HomeStack"
            component={HomeStack}
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={32} />
              ),
            }}
          />
        <DashTab.Screen
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
            tabBarStyle: {
               
              display:'none'
              },
          }}
          
        />
        <DashTab.Screen
          name={"Map"}
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
        />

        <DashTab.Screen
          name="AddEntry"
          component={AddEntry}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="plus-circle"
                color={color}
                size={32}
              />
            ),
          }}
        />
        <DashTab.Screen
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
       
      </DashTab.Navigator>
    </View>
  );
}
