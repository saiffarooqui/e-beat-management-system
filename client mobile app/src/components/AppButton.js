import React from "react";
import { Text, TouchableOpacity,StyleSheet } from "react-native";
const AppButton = ({ onPress, title, width, paddingVertical,disabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.touch,
        {
          paddingVertical: paddingVertical,
          width: width,
        },
      ]}
      disabled = {disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AppButton;
const styles = StyleSheet.create({
  touch: { elevation: 8, backgroundColor: "#003249", borderRadius: 10 },
  text: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
