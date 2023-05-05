import React from "react";
import { View, Text, TextInput,StyleSheet } from "react-native";
const InputTextMultiLine = ({
  label,
  maxLength,
  numberOfLines,
  placeholder,
  value,
  onChangeText,
}) => {
  return (
    <View style={{ width: "100%" }}>
      {label && <Text style={styles.label}>{placeholder}</Text>}
      <TextInput
        editable
        multiline
        numberOfLines={numberOfLines}
        maxLength={10000}
        scrollEnabled
        style={styles.inputText}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={"#a7a3ff"}
      />
    </View>
  );
};

export default InputTextMultiLine;
const styles = StyleSheet.create({
  inputText: {
    color: "#a7a3ff",
    // fontFamily: FontFamily.poppinsRegular,
    fontSize: 15,
    width: "100%",
    backgroundColor: "#f0efff",
    borderRadius: 8,
    height:100,
    padding: 20,
  },
  label: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "left",
    padding: 8,
  },
});
