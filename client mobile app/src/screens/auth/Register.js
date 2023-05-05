import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
  ImageBackground,
  ScrollView,
} from "react-native";
import {cloudinaryURL,baseURL} from '@env'
import * as DocumentPicker from "expo-document-picker";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import InputText from "../../components/InputText";
import PhoneInput from "react-native-phone-number-input";
import DropDown from "../../components/DropDown";
import PrimaryButton from "../../components/PrimaryButton";
const { width, height } = Dimensions.get("screen");
import { useSelector, useDispatch } from "react-redux";
import {
  userSelector,
  clearState,
  registerUser,
} from "../../toolkit/auth/UserSlice";
export default function SignUp() {
  const [fullName, setFullName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneInput = useRef(null);
  const [district, setdistrict] = React.useState("");
  const [designation, setdesignation] = React.useState("");
  const [subDivision, setsubDivision] = React.useState("");
  const [policeStation, setpoliceStation] = React.useState("");
  const [allsubdivisions, setallsubdivisions] = React.useState([]);
  const [avatar, setavatar] = React.useState([]);

  const [images, setImages] = React.useState();
  const handleDocumentSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });
      console.log(result);
      const newId =
        new Date().getTime().toString(36) +
        Math.random().toString(36).substr(2, 5);

      setImages({
        id: newId,
        src: result.uri,
        type: result.mimeType,
        name: result.name,
      });
      console.log(images);
    } catch (error) {
      alert("An Error Occured While Uploading");
      console.log(error);
    } finally {
    }
  };

  const [allpolicestations, setallpolicestations] = React.useState([]);

  const dispatch = useDispatch();
  const { isSuccess, phone } = useSelector(userSelector);
  useEffect(() => {
    //if sucessfully otp is sent, the phone number is set
    //in user state and sent to verify screen
    console.log("HERE", isSuccess, phone);
    if (isSuccess && phone) {
      console.log("Ho gaya");
      dispatch(clearState());
      navigation.navigate("Verify OTP");
    }
  }, [isSuccess]);
  const url = baseURL;
  useEffect(() => {
    (async () => {
      console.log("Fetching",`${url}user/getAllSubDivisions`);
      try {
        const response = await fetch(`${url}user/getAllSubDivisions`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
         console.log("res check", response);
        let data = await response.json();
        //  console.log(data);
        if (response.status === 200) {
          //console.log(data);
          setallsubdivisions(data);
          //console.log("set");
        }
        const response2 = await fetch(`${url}user/getAllPoliceStations`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        console.log("res check", response2);
        let data2 = await response2.json();

        if (response2.status === 200) {
          setallpolicestations(data2);
        }
      } catch (error) {
        console.log("Error",error);
      }
    })();
  }, []);
  const SendOTPHandler = async () => {
   // check for valid phone number
   console.log(phoneNumber)
    if (!phoneInput.current?.isValidNumber(phoneNumber)) {
      Alert.alert("Error", "Please provide a valid phone number", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }
    if (!images) {
      Alert.alert("Error", "Pleaser provide a profile pic", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }
      dispatch(
          registerUser({
            fullName: fullName,
            phoneNumber: phoneNumber,
            district: district,
            designation: designation,
            subDivision: subDivision,
            policeStation: policeStation,
            images:images
            
          })
        );
  };
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text
          style={{
            color: "#003249",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: 18,
          }}
        >
          Enter Your Details
        </Text>
        <InputText
          onChangeText={setFullName}
          value={fullName}
          width={"100%"}
          height={60}
          placeholder="Full Name"
        />
        <PhoneInput
          ref={phoneInput}
          defaultValue={phoneNumber}
          initialCountry={"in"}
          layout="first"
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
        <DropDown
          value={designation}
          func={setdesignation}
          placeholder="Designation"
          searchPlaceholder="Search..."
          data={[
            { label: "Constable", value: "constable" },
            { label: "Hawaldar", value: "hawaldar" },
          ]}
          search={false}
          labelField={"label"}
          valueField={"value"}
        />
        <DropDown
          value={district}
          func={setdistrict}
          placeholder="District"
          searchPlaceholder="Search..."
          data={[
            { label: "North", value: "north" },
            { label: "South", value: "south" },
          ]}
          search={false}
          disable={false}
          labelField={"label"}
          valueField={"value"}
        />

        <DropDown
          value={subDivision}
          func={setsubDivision}
          placeholder="Sub Division"
          searchPlaceholder="Search..."
          data={allsubdivisions.filter((i) => i.district === district)}
          search={true}
          disable={district?.length === 0 ? true : false}
          labelField={"name"}
          valueField={"_id"}
        />
        {/* <Text>J{JSON.stringify(subDivision)}</Text> */}
        {/*  'Panaji', 'Old Goa', 'Agacaim', 'Mapusa', 'Anjuna', 'Pernem', 'Colvale', 'Porvorim', 'Calangute', 'Saligao', 'Bicholim', 'Valpoi'*/}
        <DropDown
          value={policeStation}
          func={setpoliceStation}
          placeholder="Police Station"
          searchPlaceholder="Search..."
          data={allpolicestations.filter((i) => i.subDivision._id=== subDivision)}
          search={true}
          disable={subDivision?.length === 0 ? true : false}
          labelField={"name"}
          valueField={"_id"}
        />
        <View style={{ alignItems: "center" }}>
          {images && (
            <View
              style={{
                borderRadius: 10,
                overflow: "hidden",
                elevation: 5,
                margin: 5,
                width: 70,
              }}
            >
              <ImageBackground
                source={{ uri: images?.src||"https://res.cloudinary.com/drfsgcpng/image/upload/v1679583656/MyUploads/yq6okjnbfeszzjwerhnd.png"}}
                style={styles.imageBackgroundStyle}
              >
                <>
                  <View
                    style={{
                      flexDirection: "column",
                      alignSelf: "flex-end",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => {
                        Alert.alert("This is your thumbnail and title image");
                      }}
                    >
                      <MaterialIcons name="stars" size={15} color={"#FFD700"} />
                    </TouchableWithoutFeedback>
                  </View>
                </>
              </ImageBackground>
            </View>
          )}
          <View
            style={{
              columnGap: 8,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableWithoutFeedback onPress={handleDocumentSelection}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={20}
                color="black"
              />
            </TouchableWithoutFeedback>
            <Text style={styles.textItem}>
              {images ? "Change" : "Upload"} Picture
            </Text>
          </View>
        </View>
        <PrimaryButton onPress={SendOTPHandler}>Get OTP</PrimaryButton>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    height: "100%",
    padding: 50,
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

  imageBackgroundStyle: {
    width: 70,
    height: 70,
    padding: 1,
    borderRadius: 50,
  },
});
