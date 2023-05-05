import { View, StyleSheet } from "react-native";
const Divider = () => {
  return (
    <View style={styles.outerView}>
      <View style={styles.innerView}></View>
    </View>
  );
};
export default Divider;
const styles = StyleSheet.create({
  innerView: {
    width: "95%",
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: 1,
  },
  outerView: {
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    marginTop: 15,
  },
});
