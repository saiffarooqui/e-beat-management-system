import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SigninStack from "./src/screens/auth/SigninStack";
import BottomNavigation from "./src/screens/BottomNavigation";
import { Provider } from "react-redux";
import store from "./src/toolkit/store";
import {
  clearState,
  fetchUserBytoken,
  setToken,
  dismissToken,
} from "./src/toolkit/auth/UserSlice";
import {
  userSelector,
  user,
  isError,
  isFetching,
  isSuccess,
} from "./src/toolkit/auth/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { StatusBar } from "expo-status-bar";
function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}
export default function AppWrapper() {
  // Store, renders the provider, so the context will be accessible from App.
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
export function App() {
  const Stack = createStackNavigator();
  let userToken = null;
  const {
    profileCreated,
    token,
    isFetching,
    isSuccess,
    isError,
    errorMessage,
    
  } = useSelector(userSelector);
  const dispatch = useDispatch();

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
        if (errorMessage === "Invalid Authentication.") {
          console.log("Deleting token");
          const keys = await AsyncStorage.getAllKeys();
          await AsyncStorage.multiRemove(keys);
          dispatch(dismissToken());
        }
        dispatch(clearState());
       }
      if (isSuccess) {
        console.log("ka")
        dispatch(clearState());
      }
    };
    errCheck();
  }, [isError, isSuccess]);



  React.useEffect(() => {
   // console.log(userToken);
    
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      
      console.log()
      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        userToken = await AsyncStorage.getItem("userToken");

        if (userToken) {
          
          dispatch(setToken({ token: userToken }));
        }

        // After restoring token, we may need to validate it in production apps
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
       
      } catch (e) {
        // Restoring token failed
      } finally {
        dispatch(clearState());
      }
    };
    bootstrapAsync();
  }, []);


  React.useEffect(() => {
    if (token) {
      console.log("Her",token)
      dispatch(fetchUserBytoken({ token: token }));
    }
  }, [token]);
  return (
    <>
      <StatusBar />
      {isFetching ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10,
          }}
        >
          <ActivityIndicator size="large" color="003249" />
        </View>
      ) : (
        <>
          <NavigationContainer>
            <Stack.Navigator>
              {token == null? (
                // No token found, user isn't signed in
                <Stack.Screen
                  name="SigninStack"
                  component={SigninStack}
                  options={{ headerShown: false }}
                />
              ) : (
                <Stack.Screen
                  name="AppStack"
                  component={BottomNavigation}
                  options={{ headerShown: false }}
                />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({});
