import React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { StyleSheet } from "react-native";
const DropDown = ({ func, search, data, value, placeholder,disable,labelField,valueField}) => {
  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      search={search}
      maxHeight={300}
      disable={disable}
      labelField={labelField}
      valueField={valueField}
      placeholder={placeholder}
      searchPlaceholder="Search..."
      value={value}
      onChange={(item) => {
        if(valueField==="value")
        func(item.value);
        else if(valueField==="collectionName") func(item);
        else func(item._id)

      }}
    />
  );
};

export default DropDown;
const styles = StyleSheet.create({
  dropdown: {
    color: "#003249",
    // fontFamily: FontFamily.poppinsRegular,
    fontSize: 15,
    height: 60,
    width: "100%",
    backgroundColor: "white",
    borderBottomColor:'#003249',
    borderBottomWidth:1,
    // borderRadius: 8,
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  placeholderStyle: {
    color: "#003249",
    fontSize: 15,
  },
  selectedTextStyle: {
    color: "#003249",
    // fontFamily: FontFamily.poppinsRegular,
    fontSize: 15,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
