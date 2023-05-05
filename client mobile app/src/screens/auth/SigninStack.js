import VerifyOtp from "./VerifyOtp";
import {cloudinaryURL} from '@env'
import SignIn from "./SignIn";
import { createStackNavigator } from "@react-navigation/stack";
const SignInStack = createStackNavigator();
import { useSelector } from "react-redux";
import { userSelector } from "../../toolkit/auth/UserSlice";
import React from "react";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import AppButton from "../../components/AppButton";
import SignUp from "./Register";

const SigninStack = ({ navigation }) => {
  const { phone } = useSelector(userSelector);
  return (
    <SignInStack.Navigator
      initialRouteName={`${phone ? "Verify OTP" : "Auth"}`}
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: true,
       
      }}
    >
      <SignInStack.Screen name="Auth" component={AuthScreen} options={{ headerTransparent: true, headerTitle: "" }} />
      <SignInStack.Screen name="SignUp" component={SignUp}  options={{ headerTransparent: true, headerTitle: "" }}/>
      <SignInStack.Screen name="SignIn" component={SignIn}  options={{ headerTransparent: true, headerTitle: "" }}/>
      <SignInStack.Screen name="Verify OTP" component={VerifyOtp} />
    </SignInStack.Navigator>
  );
};

const AuthScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          alignContent: "center",
          alignItems: "center",
        }}
      >
       
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ height: 120, width: 120, resizeMode: "center" }}
        />
        <Text
          style={{
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: 16,
            color: "white",
          }}
        >
          
          E-Beat System
        </Text>
      </View>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          height: "20%",
          width: "100%",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.buttonOuterContainer}>
          <Pressable
            style={({ pressed }) =>
              pressed
                ? [styles.buttonInnerContainer, styles.pressed]
                : styles.buttonInnerContainer
            }
            onPress={() => navigation.navigate("SignIn")}
            android_ripple={{ color: "white" }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        </View>
        <View style={styles.buttonOuterContainer}>
          <Pressable
            style={({ pressed }) =>
              pressed
                ? [styles.buttonInnerContainer, styles.pressed]
                : styles.buttonInnerContainer
            }
            onPress={() => navigation.navigate("SignUp")}
            android_ripple={{ color: "white" }}
          >
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
export default SigninStack;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#003249",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 90,
    height: "100%",
  },
  buttonOuterContainer: {
    overflow: "hidden",
    width: "100%",
  },
  buttonInnerContainer: {
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  pressed: {
    opacity: 0.9,
  },
});
