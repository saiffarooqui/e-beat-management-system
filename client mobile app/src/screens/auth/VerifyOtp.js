import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useContext } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import { MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useSelector, useDispatch } from "react-redux";
import { userSelector, verifyUser,loginUser} from "../../toolkit/auth/UserSlice";
const CELL_COUNT = 6;

const { width, height } = Dimensions.get("screen");

const VerifyOtp = ({ route, navigation }) => {
  const [value, setValue] = useState("");
  console.log(route)
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const dispatch = useDispatch();
  const { isSuccess, phone } = useSelector(userSelector);
  const VerifyOTPHandler = async ({ navigate }) => {
    if (value.length != 6) {
      Alert.alert("Error", "OTP needs to be atleast of 6 digits", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]);
    } else {
      dispatch(verifyUser({ phone: phone, value: value }));
    }
  };
  const resend = async ({ navigate }) => {
    dispatch(loginUser({ phone: phone }));
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.inputTitleContainer}>
          <Text style={styles.inputTextTitle}>Enter OTP</Text>
          <View style={styles.borderContainer}></View>
          <Text style={styles.inputText}>
            Please enter the OTP sent to your phone number {phone}
          </Text>
        </View>
        <View style={styles.otpContainer}>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFiledRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[styles.cellRoot, isFocused && styles.focusCell]}
              >
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton onPress={VerifyOTPHandler}>Verify</PrimaryButton>
        </View>
        <View style={{width:'50%',alignSelf:'center'}}>
          <PrimaryButton onPress={resend} >Resend</PrimaryButton>
        </View>
        <View style={{width:'50%',alignSelf:'center'}}>
        <MaterialCommunityIcons name="cancel" size={24} color="black" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    marginTop: -height / 4,
    backgroundColor: "white",
    height: height / 2.5,
    width: width / 1.1,
    color: "white",
    // elevation: 8,
    // shadowColor: "blue",
    // borderRadius: 20,
  },
  inputTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "grey",
    marginTop: 20,
  },
  inputTextTitle: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#000000",
  },
  inputText: {
    fontSize: 20,
    padding: "1%",
    fontWeight: 400,
  },
  borderContainer: {
    width: width/2.8,
    height: 7,
    backgroundColor: "#003249",
    borderRadius: 20,
    marginVertical: 5,
  },
  otpContainer: {
    padding: 5,
    // backgroundColor: "grey",
  },
  codeFiledRoot: {
    justifyContent: "space-between",
    margin: 20,
  },
  cellRoot: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 5,
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 2,
  },
  buttonContainer: {
    padding: 20,
  },
});
