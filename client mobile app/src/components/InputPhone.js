import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import PhoneInput from "react-native-phone-number-input";
const InputPhone = ({ ref, defaultValue, onChangeFormattedText }) => {
  return (
    <PhoneInput
      defaultValue={defaultValue}
      defaultCode="IN"
      layout="first"
      // withShadow
      // autoFocus
      containerStyle={styles.phoneNumberView}
      textInputStyle={styles.phoneInputStyle}
      codeTextStyle={styles.phoneInputStyle}
      textContainerStyle={styles.textContainerStyle}
      onChangeFormattedText={(text) => {
        onChangeFormattedText(text);
      }}
    />
  );
};

export default InputPhone;
const styles = StyleSheet.create({
  phoneInputStyle: {
    color: "#003249",
    fontWeight: "bold",
  },
  phoneNumberView: {
    width: "100%",
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F0EFFF",
  },
  titleContainer: {
    alignItems: "center",
  },
  textContainerStyle: {
    paddingVertical: 0,
    backgroundColor: "#F0EFFF",
    borderWidth: 1,
    borderColor: "#F0EFFF",
  },
});
