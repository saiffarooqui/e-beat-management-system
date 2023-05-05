import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  Button,
} from "react-native";
import Divider from "./Divider"
import {
    FontAwesome,
    MaterialCommunityIcons,
    MaterialIcons,
  } from "@expo/vector-icons";
const MenuTab = ({leftIconComp,title,rightIconComp}) => {
  return (
    <View style={{ flexDirection: "column", rowGap: 4 }} >
      <View
        style={{
          flexDirection: "row",
          columnGap: 20,
          justifyContent: "flex-start",
        }}
      >
        {/* <MaterialCommunityIcons
          name={iconName}
          size={22}
          color="#4D47C3"
        /> */}
        {leftIconComp}
        <View
          style={{
            flexGrow: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: "#242d38",
              // fontFamily: FontFamily.interMedium,
              fontWeight: "500",
              fontSize: 14,
              letterSpacing: 1,
            }}
          >
            {title}
          </Text>
          {rightIconComp}
        </View>
      </View>
      <Divider />
    </View>
  );
};

export default MenuTab;
