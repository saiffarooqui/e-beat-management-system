import React from "react";
import { Button } from "react-native";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";
import { fetchUserBytoken, fetchUserBytokenAgain, userSelector } from "../../toolkit/auth/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import AppButton from "../../components/AppButton";
const { width, height } = Dimensions.get("screen");
export default function Wait() {
  const dispatch = useDispatch();
  const { token } = useSelector(userSelector);
  console.log(token)
  return (
    <>
    
      <View style={styles.container}>
        <View style={[styles.logoContainer, styles.centerAlign]}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
        <>
          <Text style={{ fontSize: 18, fontWeight: 600, color: "#003249", padding:60,textAlign:'center' }}>
            You are in a queue for verification by your admin.. Please stay in tune.
          </Text>
          {token && (
            <AppButton
              onPress={() => {
                dispatch(fetchUserBytokenAgain({token:token}))
              }}
              title={"Re-check"}
              width={"60%"}
              paddingVertical={8}
            />
          )}
        </>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingBottom: 50,
  },
  logoContainer: {
    backgroundColor: "#003249",
    width: "100%",
    height: height / 2.5,
  },
  centerAlign: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width / 3,
    height: height / 5,
    borderRadius: 20,
  },
  inputContainer: {
    padding: 20,
    marginTop: -height / 1.3,
    borderRadius: 20,
    width: width / 1.2,
    height: height / 3.4,
    backgroundColor: "rgba(255,255,255,1)",
    elevation: 8,
    shadowColor: "blue",
  },
  textStyle: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#003249",
  },
  outerInputContainer: {
    marginTop: 2,
    backgroundColor: "rgba(230,230,230,0.9)",
    height: height,
  },
  phoneNumberView: {
    width: "100%",
    height: 50,
    backgroundColor: "#F0EFFF",
    marginVertical: 25,
  },
  titleContainer: {
    alignItems: "center",
    marginVertical: 5,
  },
  textContainerStyle: {
    paddingVertical: 0,
    backgroundColor: "#F0EFFF",
    borderWidth: 1,
    borderColor: "#F0EFFF",
  },
  phoneInputStyle: {
    color: "#003249",
    fontWeight: "bold",
  },
});
