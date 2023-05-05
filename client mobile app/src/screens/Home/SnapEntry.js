import React, { useEffect, useState } from "react";
import {cloudinaryURL,baseURL,access_token} from '@env'
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome5,
  Fontisto,
} from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
const SnapStack = createStackNavigator();

import {
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  View,
  Pressable,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  ImageBackground,
  Alert,
} from "react-native";
const { width, height } = Dimensions.get("screen");
import { useSelector, useDispatch } from "react-redux";
import MenuTab from "../../components/MenuTab";
import {
  beatSelector,
  clearState,
  findMyBeat,
  setBeatArea,
} from "../../toolkit/beat/BeatAreaSlice";
import { userSelector } from "../../toolkit/auth/UserSlice";
import Report from "./Report";
import ScannerMap from "./ScannerMap";
import BeatLocation from "./BeatLocation";
import NearByPolicr from "./NearByPolice";
export default function SnapEntry({navigation}) {
  return (
    <SnapStack.Navigator
      initialRouteName="SnapMenu"
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
          fontStyle: "normal",
          fontWeight: 900,
        },
        headerTintColor: "white",
      }}
    >
      <SnapStack.Screen
        name="Report"
        component={Report}
        options={{ tabBarLabel: "Product", headerShown: true }}
      />
      <SnapStack.Screen
        name="SnapMenu"
        component={SnapMenu}
        options={{ tabBarLabel: "Product" , headerShown: false,}}
      />
      <SnapStack.Screen
        name="ScannerMap"
        component={ScannerMap}
        options={{ tabBarLabel: "Product" }}
      />
        <SnapStack.Screen
        name="PoliceNearBy"
        component={NearByPolicr}
        options={{ tabBarLabel: "Product" }}
      />
      <SnapStack.Screen
        name="BeatLocation"
        component={BeatLocation}
        options={{ tabBarLabel: "Beat", headerShown: true }}
      />
    </SnapStack.Navigator>
  );
}

const SnapMenu = ({ navigation }) => {
  const { user, token } = useSelector(userSelector);
  const today = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options)
  // navigation.setOptions({ headerShown: false });
  return (
    <>
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <View
          style={{
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#003249",
            paddingBottom: 30,
          }}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={{
              width: width / 5,
              height: height / 5,
              borderRadius: 20,
              resizeMode: "contain",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              columnGap: 1,
              width: "94%",

              justifyContent: "space-between",
            }}
          >
            <View style={{}}>
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 2,
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="police-station"
                  size={30}
                  color="white"
                />
                <Text style={{ fontSize: 30, fontWeight: 600, color: "white" }}>
                  {user?.policeStation?.name}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "white",
                alignSelf: "flex-end",
              }}
            >
              {user?.subDivision?.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "94%",

              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                alignSelf: "flex-start",
                fontWeight: 400,
                color: "white",
              }}
            >
              {user?.district.toUpperCase()}
            </Text>
            <Text
              style={{
                alignSelf: "flex-end",

                fontWeight: 400,
                color: "#003249",
              }}
            >
              {formattedDate}
            </Text>
          </View>
        </View>
        <View
          style={{
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              columnGap: 20,
              width: "100%",
              justifyContent: "space-between",
              padding: 20,
            }}
          >
            <Pressable
              style={({ pressed }) =>
                pressed
                  ? [styles.buttonInnerContainer, styles.pressed]
                  : styles.buttonInnerContainer
              }
              android_ripple={{ color: "white" }}
              onPress={() => {
                navigation.navigate("Report");
              }}
            >
              <View
                style={{
                  padding: 20,

                  width: width / 2.7,
                  height: height / 5,
                  borderRadius: 12,
                  shadowColor: "#003249",
                  shadowOffset: {
                    width: 1,
                    height: 1,
                  },
                  justifyContent: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 8,
                  shadowRadius: 20,
                  elevation: 10,
                  shadowOpacity: 1,
                  padding: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome5 name="map-marked-alt" size={45} color="#003249" />
                <Text
                  style={{
                    textAlign: "center",
                    color: "#003249",
                    fontSize: 18,
                  }}
                >
                  Mark Visit
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) =>
                pressed
                  ? [styles.buttonInnerContainer, styles.pressed]
                  : styles.buttonInnerContainer
              }
              android_ripple={{ color: "white" }}
              onPress={() => {
                navigation.navigate("ScannerMap");
              }}
            >
              <View
                style={{
                  padding: 20,

                  width: width / 2.7,
                  height: height / 5,
                  borderRadius: 12,
                  shadowColor: "#003249",
                  shadowOffset: {
                    width: 1,
                    height: 1,
                  },
                  justifyContent: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 8,
                  shadowRadius: 20,
                  elevation: 10,
                  shadowOpacity: 1,
                  padding: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="report" size={45} color="#003249" />
                <Text
                  style={{
                    textAlign: "center",
                    color: "#003249",
                    fontSize: 18,
                  }}
                >
                  Check Alerts
                </Text>
              </View>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              columnGap: 20,
              width: "100%",
              justifyContent: "space-between",
              padding: 20,
            }}
          >
            <Pressable
              style={({ pressed }) =>
                pressed
                  ? [styles.buttonInnerContainer, styles.pressed]
                  : styles.buttonInnerContainer
              }
              android_ripple={{ color: "white" }}
              onPress={() => {
                navigation.navigate("PoliceNearBy");
              }}
            >
              <View
                style={{
                  padding: 20,

                  width: width / 2.7,
                  height: height / 5,
                  borderRadius: 12,
                  shadowColor: "#003249",
                  shadowOffset: {
                    width: 1,
                    height: 1,
                  },
                  justifyContent: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 8,
                  shadowRadius: 20,
                  elevation: 10,
                  shadowOpacity: 1,
                  padding: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="local-police" size={45} color="#003249" />
                <Text
                  style={{
                    textAlign: "center",
                    color: "#003249",
                    fontSize: 18,
                  }}
                >
                  NearBy Officers
                </Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) =>
                pressed
                  ? [styles.buttonInnerContainer, styles.pressed]
                  : styles.buttonInnerContainer
              }
              android_ripple={{ color: "white" }}
              onPress={() => {
                navigation.navigate("Emergency");
              }}
            >
              <View
                style={{
                  padding: 20,

                  width: width / 2.7,
                  height: height / 5,
                  borderRadius: 12,
                  shadowColor: "#003249",
                  shadowOffset: {
                    width: 1,
                    height: 1,
                  },
                  justifyContent: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 8,
                  shadowRadius: 20,
                  elevation: 10,
                  shadowOpacity: 1,
                  padding: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Fontisto name="travis" size={45} color="#003249" />

                <Text
                  style={{
                    textAlign: "center",
                    color: "#003249",
                    fontSize: 18,
                  }}
                >
                  Emergency
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 15,
    overflow: "hidden",
  },
  buttonInnerContainer: {
    elevation: 2,
    borderRadius: 16,
  },

  pressed: {
    opacity: 0.9,
    borderRadius: 16,
  },
});
