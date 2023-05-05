import React, { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Switch,
  Image,
  TouchableWithoutFeedback,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
import InputText from "../../components/InputText";
const { width, height } = Dimensions.get("screen");
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE,Polygon } from "react-native-maps";
import { StatusBar } from "react-native";
import {cloudinaryURL,baseURL} from '@env'
import PrimaryButton from "../../components/PrimaryButton";
import {
  beatSelector,
  createTable,
  clearState,
} from "../../toolkit/beat/BeatAreaSlice";
import { userSelector } from "../../toolkit/auth/UserSlice";
export default function AddEntry() {
  const url = baseURL;
  const [allfields, setallfields] = useState([]);
  const [collection, setcollection] = useState(null);
  const [fields, setfields] = useState([]);
  const [formValues, setFormValues] = useState({});

  const [TableNames, setTableNames] = useState([]);
  const [table, setTable] = useState("");
  const { user, token } = useSelector(userSelector);
  const { isError, isSuccess, errorMessage, isFetching, beatArea } =
    useSelector(beatSelector);
  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    console.log(formValues);
  };
  React.useEffect(() => {
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
        Alert.alert("Success", "Entry done", [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
        dispatch(clearState());
        setFormValues({})
      }
    };
    errCheck();
  }, [isError, isSuccess]);
  useEffect(() => {
    const getTables = async () => {
      setLoad(true);
      try {
        const url = `${baseURL}beat/table/all`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        //console.log(policeStation.status,subDivisions.status)
        //console.log(response);
        let data = await response.json();

       // console.log(data);
        if (response.status === 200) {
          setTableNames(data);
          setLoad(false);
        } else {
          return thunkAPI.rejectWithValue(data);
        }
      } catch (error) {}
      setLoad(false);
    };
    getTables();
  }, []);
  const [location, setLocation] = useState(null);
  const [userlocation, setuserLocation] = useState(null);
  const [mapScreen, setMapScreen] = useState(false);
  const [load, setLoad] = useState(false);
  const mapOn = async () => {
    setLoad(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("PermYission to access location was denied");
      Alert.alert(
        "Permission denied",
        "Allow Hawkeye to access your current position. Without it, you won't be able to find you the chosen one"
      );
      return;
    }
    let ulocation = await Location.getCurrentPositionAsync({});
    setuserLocation(ulocation.coords);
    setMapScreen(true);
    setLoad(false);
    console.log("Loader stopped", ulocation);
  };
  const dispatch = useDispatch();
  const mapOff = async () => {
    setMapScreen(false);
    console.log("Off");
  };

  useEffect(() => {
    setfields([]);
    setFormValues({});
    console.log(table, ";");
    if (table) {
      setfields(TableNames.find((i) => i._id === table._id).columns);
      console.log(
        "Here",
        table,
        TableNames.find((i) => i._id === table._id).columns
      );
    }
  }, [table]);

  const add = async () => {
    console.log("adding",beatArea)
    dispatch(createTable({
      fields:fields,
      archived:archived,
      location:location,
      formValues:formValues,
      beatArea:beatArea,
      table:table,
      token:token
    }))
  };
  const [archived, setArchived] = useState(false);
  const [coords,setBeatAreacoors]= useState(null);
  React.useEffect(() => {
    const getData = async () => {
      setLoad(true);
      try {
        
        const url2 = `${baseURL}beat/beatarea/beatAreaId/${beatArea._id}`;
        console.log(url2)
        const response2 = await fetch(url2, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        let data2 = await response2.json();
       //console.log("PLO",data2)
        if (response2.status === 200) {
          setBeatAreacoors(data2)

        } else {
          Alert.alert("Something went wrong", data.msg);
        }

      } catch (error) {
        Alert.alert("Something went wrong", error);
      } finally {
        setLoad(false);
      }
    };
    getData()
  },[beatArea]);
  return (
    <>
      <StatusBar />
      {load || isFetching ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10,
          }}
        >
          <ActivityIndicator size="large" color="#003249" />
        </View>
      ) : userlocation && mapScreen &&coords? (
        <>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{ ...StyleSheet.absoluteFillObject }}
            initialRegion={{
              latitude: coords?.geometry.coordinates[0][parseInt(coords?.geometry?.coordinates[0].length/2)][1]||userlocation.latitude,
              longitude:  coords?.geometry.coordinates[0][parseInt(coords?.geometry?.coordinates[0].length/2)][0]||userlocation.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
            //showsTraffic={true}
            minZoomLevel={2} // default => 0
            maxZoomLevel={20} // default => 20
            onPress={(event) => {
              console.log(event.nativeEvent.coordinate);
              setLocation(event.nativeEvent.coordinate);
            }}
          >
            <Marker coordinate={userlocation} title="You are here" />
            {location && <Marker coordinate={location} title="Mark This" />}
            {beatArea&&coords && (
            <Polygon
              coordinates={coords?.geometry?.coordinates[0].map((c)=>{ return {latitude:c[1],longitude:c[0]} })}
              strokeColor={"red"}
              fillColor="#aabdbf"
              strokeWidth={1}
            />
          )}

          </MapView>
          <View
            style={{
              padding: 40,
              alignSelf: "flex-end",
              justifyContent: "flex-end",
              alignContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback onPress={mapOff}>
              <AntDesign name="checkcircle" size={40} color="#003249" />
            </TouchableWithoutFeedback>
          </View>
        </>
      ) : (
        <View
          style={{
            backgroundColor: "#f9fafb",

            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
            paddingTop: 90,
            paddingBottom: 120,
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
              //console.log("This",item)
              setTable(item);
            }}
          />
          <View
            style={{
              height: "80%",
              width: "100%",
              paddingBottom: 100,
            }}
          >
            <ScrollView
              contentContainerStyle={{
                backgroundColor: "#f9fafb",
                width: "100%",
                padding: 10,
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "column",
                  rowGap: 25,
                  marginTop: 30,
                }}
              >
                {fields?.map(({ columnName, label, required, _id }) => {
                  if (
                    columnName !== "geometry" &&
                    columnName != "user" &&
                    columnName != "table" &&
                    columnName != "beatArea" &&
                    columnName !== "archived"
                  )
                    return (
                      <View key={_id}>
                        <InputText
                          onChangeText={(value) =>
                            handleInputChange(columnName, value)
                          }
                          value={formValues[columnName]}
                          width={"100%"}
                          height={30}
                          placeholder={columnName}
                        />
                      </View>
                    );
                })}
              </View>
              {table && (
                <View
                  style={{
                    marginTop: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <TouchableWithoutFeedback onPress={mapOn}>
                      <Entypo name="location" size={32} color="#003249" />
                    </TouchableWithoutFeedback>
                    {/* <Text
                      style={{
                        fontSize: 16,
                        textAlign: "center",
                        fontWeight: "600",
                        marginBottom: 6,
                      }}
                    >
                      Location
                    </Text> */}
                  </View>

                  <Switch
                    trackColor={{ false: "#767577", true: "#003249" }}
                    thumbColor={archived ? "#ffffff" : "#f4f3f4"}
                    onValueChange={() => {
                      setArchived(!archived);
                      
                    }}
                    value={archived}
                    style={{
                      transform: [{ scaleX: 1.2 }, { scaleY: 1 }],
                    }}
                  />
                </View>
                
              )}
              {
                table&& <PrimaryButton onPress={()=>{add()}}>Add Data</PrimaryButton>
              }
             
            </ScrollView>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    padding: 40,
    minHeight: "100%",
    rowGap: 10,
  },
  logoContainer: {
    backgroundColor: "#003249",
    width: "100%",
    height: height / 2.5,
  },
  logoContainer2: {
    height: height / 4.5,
  },
  centerAlign: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width / 3,
    height: height / 5,
    borderRadius: 20,
  },
  logo2: {
    width: width / 4,
    height: height / 6,
    borderRadius: 20,
  },
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
});
