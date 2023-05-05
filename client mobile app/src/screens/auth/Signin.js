import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from "react-native";
const { width, height } = Dimensions.get("screen");
import PhoneInput from "react-native-phone-number-input";
import PrimaryButton from "../../components/PrimaryButton";
import { useSelector, useDispatch } from "react-redux";
import {
  userSelector,
  loginUser,
  clearState,
} from "../../toolkit/auth/UserSlice";
const SignIn = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneInput = useRef(null);
  const { isSuccess, phone } = useSelector(userSelector);
  const dispatch = useDispatch();
  const SendOTPHandler = async () => {
    //check for valid phone number
    if (!phoneInput.current?.isValidNumber(phoneNumber)) {
      Alert.alert("Error", "Please provide a valid phone number", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }
    dispatch(loginUser({ phone: phoneNumber }));
  };
  React.useEffect(() => {
    //if sucessfully otp is sent, the phone number is set
    //in user state and sent to verify screen
    if (isSuccess && phone) {
      dispatch(clearState());
      navigation.navigate("Verify OTP");
    }
  }, [isSuccess]);

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.logoContainer, styles.centerAlign]}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
        <View style={[styles.centerAlign, styles.outerInputContainer]}>
          <View style={[styles.inputContainer]}>
            <View style={styles.titleContainer}>
              <Text style={styles.textStyle}>SIGN IN</Text>
            </View>
            <PhoneInput
              ref={phoneInput}
              defaultValue={phoneNumber}
              initialCountry={"in"}
              layout="first"
              flagButtonStyle={{width:'20%',paddingLeft:10}}
              // withShadow
              // autoFocus
              countryPickerProps={{
                countryCodes: ["IN"],
              }}
              disableArrowIcon
              containerStyle={styles.phoneNumberView}
              textInputStyle={styles.phoneInputStyle}
              codeTextStyle={styles.phoneInputStyle}
              textContainerStyle={styles.textContainerStyle}
              onChangeFormattedText={(text) => {
                setPhoneNumber(text);
              }}
            />
            <PrimaryButton onPress={SendOTPHandler}>Get OTP</PrimaryButton>
          </View>
        </View>
      </View>
    </>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: -height / 1.3,
    borderRadius: 20,
    padding: 40,
    width: width / 1.2,
    height: height / 2.8,
    backgroundColor: "rgba(255,255,255,1)",
    elevation: 8,
    shadowColor: "#003249",
  },

  textStyle: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#003249",
  },
  outerInputContainer: {
    marginTop: 2,
    backgroundColor: "rgba(230,230,230,0.9)",
    height: height,
  },
  phoneNumberView: {
    height: 50,
    borderColor: "#003249",
    borderWidth: 1,
    width: "100%",
    // backgroundColor: "#003249",
    // marginLeft:-5,
    marginVertical: 25,
    borderRadius: 3,
  },
  titleContainer: {
    alignItems: "center",
    marginVertical: 5,
  },
  textContainerStyle: {
    paddingVertical: 1,
    width: "90%",
    borderWidth: 1,
    borderColor: "#F0EFFF",
  },
  phoneInputStyle: {
    color: "#003249",
    fontWeight: "bold",
    paddingVertical: 1,
    fontSize: 16,
   
  },
});
