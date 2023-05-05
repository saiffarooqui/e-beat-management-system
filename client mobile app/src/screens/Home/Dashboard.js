import React, { useEffect, useState } from "react";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
  EvilIcons,
  Feather,
} from "@expo/vector-icons";
import {
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  ImageBackground,
  Alert,
} from "react-native";
const { width, height } = Dimensions.get("screen");
import { createStackNavigator } from "@react-navigation/stack";
import DashBottomNavigation from "./DashBottomNavigation";
import { useSelector, useDispatch } from "react-redux";
import MenuTab from "../../components/MenuTab";
import {
  beatSelector,
  clearState,
  findMyBeat,
  setBeatArea,
} from "../../toolkit/beat/BeatAreaSlice";
import { userSelector } from "../../toolkit/auth/UserSlice";
import SnapEntry from "./SnapEntry";
import PrimaryButton from "../../components/PrimaryButton";
import BeatMap from "./BeatMap";
import BeatLocation from "./BeatLocation";
const Dash = createStackNavigator();

const renderSeparator = () => {
  return (
    <View
      style={{
        height: 10,
        width: "86%",
        backgroundColor: "#CED0CE",
        marginLeft: "5%",
      }}
    />
  );
};

export default function Dashboard({ nvigation }) {
  return (
    <Dash.Navigator
      initialRouteName="DashboardBeat"
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#003249",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          height: 110,
        },
        headerTitleStyle: {
          color: "#FFFFFF",
          fontSize: 22,
          // fontFamily: "Inter",
          fontStyle: "normal",
          fontWeight: 900,
        },
        headerTintColor: "white",
      }}
    >
      <Dash.Screen
        name="Dashboard"
        component={DashBeat}
        options={{ tabBarLabel: "Beat" }}
      />
      <Dash.Screen
        name="Snap"
        component={SnapEntry}
        options={{ tabBarLabel: "Beat" }}
      />
      <Dash.Screen
        name="DashBottom"
        component={DashBottomNavigation}
        options={{ tabBarLabel: "Beat" }}
      />
       <Dash.Screen
        name="Beat Area"
        component={BeatLocation}
        options={{ tabBarLabel: "Beat" }}
      />
    </Dash.Navigator>
  );
}

const DashBeat = ({ navigation }) => {
  const dispatch = useDispatch();
  const [searchPhrase, setSearchPhrase] = React.useState("");
  const [clicked, setClicked] = React.useState(false);
  console.log("Ke");
  const renderHeader = () => (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <View style={styles.container}>
        <View
          style={
            clicked ? styles.searchBar__clicked : styles.searchBar__unclicked
          }
        >
          {/* search Icon */}
          <Feather
            name="search"
            size={18}
            color="#003249"
            style={{ marginLeft: 1 }}
          />
          {/* Input field */}
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={searchPhrase}
            onChangeText={setSearchPhrase}
            placeholderTextColor={"#003249"}
            onFocus={() => {
              setClicked(true);
            }}
          />
          {/* cross Icon, depending on whether the search bar is clicked or not */}
          {clicked && (
            <Entypo
              name="cross"
              size={20}
              color="#003249"
              style={{ padding: 1 }}
              onPress={() => {
                setSearchPhrase("");
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
  const search = () => {
    console.log(searchPhrase);
  };
  const { user, token } = useSelector(userSelector);
  const { beats, isError, isSuccess, isFetching, errorMessage } =
    useSelector(beatSelector);
  //const beats = [{_id:1,name:"Beat1"},{_id:2,name:"Beat2"},{_id:3,name:"Beat2"},{_id:4,name:"Beat2"}]
  useEffect(() => {
    dispatch(
      findMyBeat({ token: token, policeStationid: user.policeStation?._id,user:user })
    );
    console.log("J", beats.length);
  }, []);
  useEffect(() => {
    const errCheck = async () => {
      if (isError) {
        Alert.alert("Error", errorMessage, [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
        dispatch(clearState());
      }
      if (isSuccess) {
        console.log("ka");

        dispatch(clearState());
      }
    };
    errCheck();
  }, [isError, isSuccess]);
  const today = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);
  return (
    <>
      {isFetching ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 14,
          }}
        >
          <ActivityIndicator size="large" color="#003249" />
        </View>
      ) : (
        <View
          style={{
            backgroundColor: "white",
            flexDirection: "column",
            height: "100%",
          
          }}
        >
          <View
            style={{
              borderBottomEndRadius: 20,
              borderBottomStartRadius: 20,
              paddingHorizontal: 20,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#003249",
              paddingBottom: 30,
            }}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={{
                width: width / 5,
                height: height / 5,
                borderRadius: 20,
                resizeMode: "contain",
              }}
            />
            <View
              style={{
                flexDirection: "row",
                columnGap: 1,
                width: "94%",

                justifyContent: "space-between",
              }}
            >
              <View style={{}}>
                <View
                  style={{
                    flexDirection: "row",
                    columnGap: 2,
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="police-station"
                    size={30}
                    color="white"
                  />
                  <Text
                    style={{ fontSize: 30, fontWeight: 600, color: "white" }}
                  >
                    {user?.policeStation?.name}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "white",
                  alignSelf: "flex-end",
                }}
              >
                {user?.subDivision?.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "94%",

                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  alignSelf: "flex-start",
                  fontWeight: 400,
                  color: "white",
                }}
              >
                {user?.district.toUpperCase()}
              </Text>
              <Text
                style={{
                  alignSelf: "flex-end",

                  fontWeight: 400,
                  color: "#003249",
                }}
              >
                {formattedDate}
              </Text>
            </View>
          </View>
          {beats.length === 0 ? (
            <>
              <View
                //key={item._id}
                style={{
                  flexDirection: "column",
                  alignContent: "center",
                  rowGap: 25,
                  alignItems:'center',
                  justifyContent: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 8,
                  shadowColor: "#003249",
                  shadowOffset: {
                    width: 1,
                    height: 1,
                  },
                  shadowRadius: 20,
                
                  elevation: 10,
                  shadowOpacity: 1,
                  padding: 20,
            
                  marginTop: 16,
                  marginBottom: 16,
                  marginHorizontal:20,
                 
                }}
              >
                <Text style={{ fontSize: 14 }}>
                  Sir no beats assigned to you as of now
                </Text>
                <PrimaryButton
                onPress={() => {
                  dispatch(
                    findMyBeat({
                      token: token,
                      policeStationid: user.policeStation?._id,
                    })
                  );
                }}
              >
                Recheck
              </PrimaryButton>
              </View>
             
            </>
          ) : (
            <>
              <Text
                style={{
                  alignSelf: "flex-start",
                  // paddingLeft: 20,
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#003249",
                  marginTop:30,
                  paddingHorizontal:20
                }}
              >
                Beat Areas
              </Text>
              <ScrollView
                horizontal={true}
                contentContainerStyle={{ width: "100%", paddingBottom: 30, paddingHorizontal:20}}
              >
                <FlatList
                  data={beats}
                  renderItem={({ item }) => {
                    if (searchPhrase.length !== 0)
                      if (
                        !item?.name
                          ?.toLowerCase()
                          .includes(
                            searchPhrase
                              ?.toLowerCase()
                              .trim()
                              .replace(/\s/g, "")
                          )
                      )
                        return (
                          <>
                            <View
                            key={item?._id}
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
                                width: "100%",
                              }}
                            >
                              <Text style={{ fontSize: 14 }}>No Results</Text>
                            </View>
                          </>
                        );
                    return (
                      <View
                        onStartShouldSetResponder={() => {
                          console.log("My BEAT",item)
                          dispatch(setBeatArea({ beatArea: item }));
                          navigation.navigate("DashBottom");
                        }}
                        key={item?._id}
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
                          title={item.beatArea.name}
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
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: 400,
                              fontSize: 14,
                              color: "#003249",
                            }}
                          >
                            <MaterialCommunityIcons
                              name="police-station"
                              size={24}
                              color="#003249"
                            />
                            {user?.policeStation.name}
                          </Text>
                          <Text
                            style={{
                              fontWeight: 400,
                              fontSize: 14,
                              color: "#003249",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            PI: {item.assignedBy.fullName}
                            {/* <MaterialIcons name="local-police" size={16} color="003249" /> */}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                  keyExtractor={(item) => item?._id}
                  ItemSeparatorComponent={renderSeparator}
                  ListHeaderComponent={renderHeader}
                />
              </ScrollView>
            </>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  logoContainer: {
    backgroundColor: "#003249",
    width: "100%",
    height: height / 2.5,
  },
  centerAlign: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width / 5,
    height: height / 5,
    borderRadius: 20,
    resizeMode: "contain",
  },

  textStyle: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#003249",
  },
  outerInputContainer: {
    marginTop: 2,
    backgroundColor: "rgba(230,230,230,0.9)",
    height: height,
  },
  phoneNumberView: {
    width: "100%",
    height: 50,
    backgroundColor: "#F0EFFF",
    marginVertical: 25,
  },
  titleContainer: {
    alignItems: "center",
    marginVertical: 5,
  },
  textContainerStyle: {
    paddingVertical: 0,
    backgroundColor: "#F0EFFF",
    borderWidth: 1,
    borderColor: "#F0EFFF",
  },
  phoneInputStyle: {
    color: "#003249",
    fontWeight: "bold",
  },
  container: {
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "transparent",
    padding: 1,
    borderColor: "#003249",
    borderWidth: 1,
    borderRadius: 10,
  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: "row",
    width: "100%",

    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 16,
    marginLeft: 10,
    width: "90%",
    backgroundColor: "transparent",
  },
});
