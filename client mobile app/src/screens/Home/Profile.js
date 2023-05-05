import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  // Modal,
  Pressable,
} from "react-native";
import Modal from "react-native-modal";
import * as DocumentPicker from "expo-document-picker";
import InputText from "../../components/InputText";
import InputTextMultiLine from "../../components/InputTextMultiLine";
import DropDown from "../../components/DropDown";
import AppButton from "../../components/AppButton";
import {
  createUser,
  userSelector,
  updateUser,
  clearState,
} from "../../toolkit/auth/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
const MyProfile = () => {
  const { profileCreated, token, user } = useSelector(userSelector);
  console.log(user);
  const [name, setName] = React.useState(user?.name || "");
  const [address, setAddress] = React.useState(user?.address || "");
  const [gender, setGender] = React.useState(user?.gender || "");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [vendor, setVendor] = React.useState(false);
  const [imageLoader, setImageLoader] = React.useState(false);
  const [avatar, setAvatar] = React.useState(
    user?.avatar ||
      "https://res.cloudinary.com/drfsgcpng/image/upload/v1679583656/MyUploads/yq6okjnbfeszzjwerhnd.png"
  );

  const dispatch = useDispatch();
  const update = () => {
    dispatch(
      updateUser({
        token: token,
        name: name,
        address: address,
        gender: gender,
        avatar: avatar,
      })
    );
  };
  const submit = () => {
    dispatch(
      createUser({
        token: token,
        name: name,
        address: address,
        gender: gender,
        avatar: avatar,
        isVendor: vendor,
      })
    );
  };
  //console.log(process.env.cloudinaryURL)
  const handleDocumentSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
      });
      const data = new FormData();
      const uri = result.uri;
      const type = result.mimeType;
      const name = result.name;
      const source = {
        uri,
        type,
        name,
      };
      console.log(result, result.size, result.size > 6000000);
      3200160;
      if (result.size > 6000000) {
        alert("Choose a pic with max size of 6 mb");
        return;
      }
      data.append("file", source);
      data.append("upload_preset", "inspirathon");
      setImageLoader(true);

      fetch("https://api.cloudinary.com/v1_1/drfsgcpng/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.secure_url);
          setAvatar(data.secure_url);
          setImageLoader(false);
        })
        .catch((err) => {
          console.log(err);
          setImageLoader(false);
          alert("An Error Occured While Uploading");
        });
    } catch (error) {
      setImageLoader(false);
      alert("An Error Occured While Uploading");
      console.log(error);
    }
  };
  return (
    <>
      <ScrollView contentContainerStyle={[styles.ScrollV, ,]}>
        <Modal
          animationType="slide"
          transparent={true}
          isVisible={modalVisible}
          hasBackdrop={true}
          backdropOpacity={0.7}
          //        backdropColor="black"
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={{
                  fontStyle: "normal",
                  fontWeight: 700,
                  fontSize: 17,
                  lineHeight: 21,

                  color: "#4D47C3",
                }}
              >
                Are you a vendor?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 20,
                  width: 150,
                }}
              >
                <Pressable
                  style={{
                    padding: 8,
                    width: 50,
                    elevation: 8,
                    backgroundColor: "#4D47C3",
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    setVendor(true);
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text
                    style={{
                      fontStyle: "normal",
                      fontWeight: 700,
                      fontSize: 17,
                      lineHeight: 21,
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    Yes
                  </Text>
                </Pressable>
                <Pressable
                  style={{
                    padding: 8,
                    width: 50,
                    elevation: 8,
                    backgroundColor: "#4D47C3",
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    setVendor(false);
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text
                    style={{
                      fontStyle: "normal",
                      fontWeight: 700,
                      fontSize: 17,
                      lineHeight: 21,
                      textAlign: "center",
                      color: "white",
                    }}
                  >
                    No
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={{
            width: "100%",
            paddingVertical: 20,
            paddingHorizontal: 30,
            flexDirection: "column",
            gap: 20,
            marginBottom: 90,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            marginTop: 30,
          }}
        >
          {imageLoader ? (
            <ActivityIndicator />
          ) : (
            <View onStartShouldSetResponder={handleDocumentSelection}>
              {avatar && (
                <Image
                  resizeMode="cover"
                  source={{ uri: avatar }}
                  style={{ width: 200, height: 200, borderRadius: 200 }}
                />
              )}
            </View>
          )}
          <InputText
            onChangeText={setName}
            value={name}
            placeholder="Name"
            width={"100%"}
            height={60}
          />
          {/* <InputPhone
          defaultValue={phoneNumber}
          onChangeFormattedText={(text) => {
            setPhoneNumber(text);
          }}
        /> */}
          <InputTextMultiLine
            numberOfLines={7}
            maxLength={40}
            onChangeText={setAddress}
            value={address}
            placeholder="Address"
            label={false}
          />
          <DropDown
            value={gender}
            func={setGender}
            placeholder="Gender"
            searchPlaceholder="Search..."
            data={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" },
            ]}
            search={false}
          />
          {!profileCreated && (
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.textStyle}>Are you a vendor?</Text>
            </Pressable>
          )}
          <AppButton
            onPress={profileCreated ? update : submit}
            title={`${profileCreated ? "Update" : "Submit"}`}
            size="sm"
            backgroundColor="#007bff"
            paddingVertical={10}
            width="70%"
            disabled={imageLoader}
          />
        </View>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  ScrollV: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "80%",
    gap: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {},
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "black",
    textAlign: "center",
    fontWeight: 500,
    fontSize: 15,
    lineHeight: 18,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
export default MyProfile;
