import React from "react";
import { View,Text,TextInput,StyleSheet } from "react-native";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";
const InputText = ({
  label,
  width,
  height,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  more
}) => {
  return (
    <View style={{width: width }}>
      {label && (
        <Text
          style={styles.label}
        >
          {placeholder}
        </Text>
      )}
      <TextInput
        style={[styles.inputText,more]}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={"#003249"}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default InputText;
const styles = StyleSheet.create({
  inputText: {
    color: "#003249",
    // fontFamily: FontFamily.poppinsRegular,
    fontSize: 15,
    width: "100%",
    // borderRadius: 5,
    justifyContent: "center",
    padding: 10,
    borderBottomColor:'black',
    borderBottomWidth:1,
    
  },
  label: {
    color: "#000",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "left",
    padding: 6,
  },
});
