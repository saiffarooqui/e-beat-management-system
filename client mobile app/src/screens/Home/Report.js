import React, { useState } from "react";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome5,
  Fontisto,
} from "@expo/vector-icons";
import {cloudinaryURL,baseURL,access_token} from '@env'
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-native-element-dropdown";
import {
  StyleSheet,
  Alert,
  View,
  Image,
  Text,
  Dimensions,
  ScrollView,
  FlatList,
  TextInput,
} from "react-native";
import { userSelector } from "../../toolkit/auth/UserSlice";
const { width, height } = Dimensions.get("screen");
import MenuTab from "../../components/MenuTab";
import SearchBar from "../../components/SearchBar";
import { beatSelector, setColumnInfos } from "../../toolkit/beat/BeatAreaSlice";
const renderSeparator = () => {
  return (
    <View
      style={{
        height: 10,
        width: "86%",
        backgroundColor: "#CED0CE",
        alignSelf: "center",
      }}
    />
  );
};
export default function Report({ navigation }) {
  const [TableNames, setTableNames] = useState([]);
 // const [cols, setcols] = useState([]);
  const {columnInfos} = useSelector(beatSelector)
  const [fields, setfields] = useState([]);
  const [pld, setpld] = useState([]);
  const [load, setLoad] = React.useState(false);
  const [table, setTable] = useState("");
  React.useEffect(() => {
    ///columninfo/beatarea/:beatAreaId
    const getTables = async () => {
      setLoad(true);
      try {
        const url = `${baseURL}column/columninfo/beatarea/${beatArea._id}`;
        // console.log(url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        //console.log(policeStation.status,subDivisions.status)
        // console.log(response);
        let data = await response.json();

        if (response.status === 200) {
          //setcols(data);
          dispatch(setColumnInfos(data));
        } else {
          Alert.alert("Something went wrong", data.msg);
        }

        const url2 = `${baseURL}beat/table/all`;
        const response2 = await fetch(url2, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        //console.log(policeStation.status,subDivisions.status)
        // console.log(response2);
        let data2 = await response2.json();

        //console.log(data2);
        if (response2.status === 200) {
          setTableNames(data2);
          setLoad(false);
        } else {
          return thunkAPI.rejectWithValue(data);
        }
      } catch (error) {
        Alert.alert("Something went wrong", error);
      } finally {
        setLoad(false);
      }
    };
    getTables();
  }, []);
  React.useEffect(() => {
    //console.log(table, ";");
    if (table) {
      setfields(columnInfos.filter((i) => i.table._id === table._id));
     setpld(columnInfos.filter((i) => i.table._id === table._id))
      console.log(table._id,columnInfos[0].table._id)
    }
  }, [table]);

  const { user, token } = useSelector(userSelector);
  const { beatArea } = useSelector(beatSelector);
  const today = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);
  const [searchPhrase, setSearchPhrase] = React.useState("");
  const [clicked, setClicked] = React.useState(false);
  const dispatch = useDispatch();
  return (
    <>
      <View style={{}}>
        <View style={{ padding: 20,height:'99%' }}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={TableNames}
            search={true}
            maxHeight={300}
            labelField={"name"}
            valueField={"_id"}
            placeholder={"Table"}
            searchPlaceholder="Search..."
            value={table}
            onChange={(item) => {
              setTable(item);
              //setCols(cols.filter)
            }}
          />
          {table && (
            <>
             
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  alignSelf: "center",
                }}
              >
                <View style={styles.container}>
                  <View
                    style={
                      clicked
                        ? styles.searchBar__clicked
                        : styles.searchBar__unclicked
                    }
                  >
                    {/* search Icon */}
                    <Feather
                      name="search"
                      size={14}
                      color="#003249"
                      style={{ marginLeft: 1 }}
                    />
                    {/* Input field */}
                    <TextInput
                      style={styles.input}
                      placeholder="Search"
                      value={searchPhrase}
                      onChangeText={(v) => {
                        setSearchPhrase(v);
                       
                        if (v.length != 0) {
                          setfields(
                            fields.filter((i) =>
                              i.placeName
                                .toLowerCase()
                                .includes(
                                  v?.toLowerCase().trim().replace(/\s/g, "")
                                )
                            )
                          );
                        } else setfields(pld);
                        console.log(TableNames, v);
                      }}
                      placeholderTextColor={"#003249"}
                      onFocus={() => {
                        setClicked(true);
                      }}
                    />
                    {/* cross Icon, depending on whether the search bar is clicked or not */}
                    {clicked && (
                      <Entypo
                        name="cross"
                        size={16}
                        color="#003249"
                        style={{ padding: 1 }}
                        onPress={() => {
                          setSearchPhrase("");
                          setfields(pld)
                        }}
                      />
                    )}
                  </View>
                </View>
              </View>
              <ScrollView
                horizontal={true}
                contentContainerStyle={{ height:'100%',width: "100%", }}
              >
                <FlatList
                  data={fields}
                  renderItem={({ item }) => {
                    // if (searchPhrase.length !== 0)
                    //   if (
                    //     !item?.label
                    //       ?.toLowerCase()
                    //       .includes(
                    //         searchPhrase?.toLowerCase().trim().replace(/\s/g, "")
                    //       )
                    //   )
                    //     return <></>;
                    return (
                      <View
                        onStartShouldSetResponder={() => {
                          navigation.navigate("BeatLocation", {
                            beatLocation: item,
                          });
                        }}
                        key={item._id}
                        style={{
                          flexDirection: "column",
                          alignContent: "center",
                          rowGap: 25,
                          justifyContent: "center",
                          backgroundColor: "#FFFFFF",
                          borderRadius: 8,
                          shadowColor: "#979797",
                          shadowOffset: {
                            width: 1,
                            height: 1,
                          },
                          shadowRadius: 20,
                          elevation: 10,
                          shadowOpacity: 1,
                          padding: 20,
                        }}
                      >
                        <MenuTab
                          leftIconComp={
                            <Image
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 4,
                                resizeMode: "cover",
                              }}
                              source={require("../../assets/images/logo.png")}
                            />
                          }
                          title={JSON.stringify(item[table.columns[0].columnName])}
                          rightIconComp={
                            <View
                            // onStartShouldSetResponder={}
                            >
                              <Text
                                style={{
                                  fontWeight: 900,
                                  fontSize: 24,
                                  color: "#003249",
                                }}
                              >
                                <Entypo
                                  name="location"
                                  size={32}
                                  color="#003249"
                                />
                              </Text>
                            </View>
                          }
                        />
                        <Text
                          style={{
                            fontWeight: 400,
                            fontSize: 14,
                            color: "#003249",
                          }}
                        >
                          {}
                        </Text>
                      </View>
                    );
                  }}
                  keyExtractor={(item) => item._id}
                  ItemSeparatorComponent={renderSeparator}
                />
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  dropdown: {
    color: "#003249",
    // fontFamily: FontFamily.poppinsRegular,
    fontSize: 15,
    height: 60,
    width: "100%",
    backgroundColor: "white",
    borderBottomColor: "#003249",
    borderBottomWidth: 1,
    borderRadius: 20,
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

  container: {
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "white",

    borderColor: "#003249",
    borderWidth: 0.2,
    borderRadius: 4,
  },
  searchBar__unclicked: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    width: "95%",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    width: "100%",

    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 14,
    marginLeft: 10,
    width: "90%",
    backgroundColor: "transparent",
  },
});
