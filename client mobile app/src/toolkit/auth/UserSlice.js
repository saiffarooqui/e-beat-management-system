import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {cloudinaryURL,baseURL} from '@env'
//Function to save user token in device
const saveUser = async (userToken) => {
  try {
    await AsyncStorage.setItem("userToken", userToken);
  } catch (error) {
    console.log(error.message);
  }
};

//Verify User function
export const verifyUser = createAsyncThunk(
  "users/verifyUser",
  async ({ phone, value }, thunkAPI) => {
    try {
      const response = await fetch(`${baseURL}user/verify`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phone,
          otp: value,
        }),
      });
      let data = await response.json();
      if (response.status === 200) {
        saveUser(data.token);
        return { data, phone };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (rejectedValueOrSerializedError) {
      const data = {
        msg: "Network request failed",
      };
      return thunkAPI.rejectWithValue(data);
    }
  }
);
//Register User funtion
export const registerUser = createAsyncThunk(
  "users/register",
  async (
    {
      fullName,
      phoneNumber,
      district,
      designation,
      subDivision,
      policeStation,
      images,
    },
    thunkAPI
  ) => {
    try {
      const dataFile = new FormData();
      const uri = images.src;
      const type = images.type;
      const name = images.name;
      var avatar = "";
      console.log("Hdere")
      const source = {
        uri,
        type,
        name,
      };
      console.log(source);
      dataFile.append("file", source);
      console.log(dataFile.file);
      dataFile.append("upload_preset", "inspirathon");
      await fetch(cloudinaryURL, {
        method: "post",
        body: dataFile,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.secure_url);
          console.log(data.secure_url);
          avatar = data.secure_url;
          console.log({
            fullName: fullName,
            phoneNumber: phoneNumber,
            district: district,
            designation: designation,
            subDivision: subDivision,
            policeStation: policeStation,
            avatar: data.secure_url,
          });
        })
        .catch((err) => {
          console.log(err);
          const data = {
            msg: "An Error Occured While Uploading",
          };
          return thunkAPI.rejectWithValue(data);
        });
      const response = await fetch(`${baseURL}user/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName,
          phoneNumber: phoneNumber,
          district: district,
          designation: designation,
          subDivision: subDivision,
          policeStation: policeStation,
          avatar:avatar
        }),
      });
      let data = await response.json();
      if (response.status === 201 || response.status === 200) {
        return { data, phoneNumber };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (rejectedValueOrSerializedError) {
      const data = {
        msg: "Network request failed",
      };
      return thunkAPI.rejectWithValue(data);
    }
  }
);
//Login user function
export const loginUser = createAsyncThunk(
  "users/login",
  async ({ phone }, thunkAPI) => {
    
    console.log(phone)
    try {
      const response = await fetch(`${baseURL}user/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phone,
        }),
      });
      console.log(response)
      let data = await response.json();
      if (response.status === 200) {
        return { phone };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (rejectedValueOrSerializedError) {
      const data = {
        msg: "Network request failed",
      };
      return thunkAPI.rejectWithValue(data);
    }
  }
);
//Fetch user using token function
export const fetchUserBytoken = createAsyncThunk(
  "users/fetchUserByToken",
  async ({ token }, thunkAPI) => {
    console.log(baseURL, token,`${baseURL}user/userinfo`);
    try {
      console.log("Here")
      const response = await fetch(`${baseURL}user/userinfo`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });
      console.log(response)
      let data = await response.json();
      if (response.status === 200) {
        return { ...data };
      } else {
        console.log("ERRE")
        return thunkAPI.rejectWithValue(data);
      }
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError)
      const data = {
        msg: "Network request failed",
      };
      return thunkAPI.rejectWithValue(data);
    }
  }
);

//refetch token

export const fetchUserBytokenAgain = createAsyncThunk(
  "users/fetchUserByTokenAgain",
  async ({ token }, thunkAPI) => {
    console.log(`${baseURL}user/getNewToken`, token);
    try {
      const response = await fetch(`${baseURL}user/getNewToken`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });
      let data = await response.json();
      console.log("GET",data)
      if (response.status === 200) {
        saveUser(data.token);
        console.log("SAVED",data.token)
        return { data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (rejectedValueOrSerializedError) {
      const data = {
        msg: "Network request failed",
      };
      return thunkAPI.rejectWithValue(data);
    }
  }
);
//Create user function
export const createTable = createAsyncThunk(
  "users/createTable",
  async ({ collection,formValues}, thunkAPI) => {
    try {
      console.log(collection,formValues,`${baseURL}data/${collection.collectionName}`)
      const response = await fetch(`${baseURL}data/${collection.collectionName}`, {
        method: "POST",
        headers: {
         
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      console.log(response)
      let data = await response.json();
      if (response.status === 200) {
        return { ...data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (rejectedValueOrSerializedError) {
      const data = {
        msg: "Network request failed",
      };
      return thunkAPI.rejectWithValue(data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ token, name, address, gender, avatar }, thunkAPI) => {
    try {
      const response = await fetch(`${baseURL}user/updateprofile`, {
        method: "POST",
        headers: {
          Authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          address: address,
          gender: gender,
          avatar: avatar,
        }),
      });
      let data = await response.json();
      if (response.status === 200) {
        return { ...data };
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (rejectedValueOrSerializedError) {
      const data = {
        msg: "Network request failed",
      };
      return thunkAPI.rejectWithValue(data);
    }
  }
);
export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isFetching: true,
    isSuccess: false,
    isError: false,
    errorMessage: "",
    token: null,
    profileCreated: false,
    adminVerified: false,
    phone: null,
  },
  reducers: {
    //clearing all flags
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      return state;
    },
    //Setting the state token by using token store on device
    setToken: (state, action) => {
      state.token = action.payload.token;
      return state;
    },
    //logout
    dismissToken: (state) => {
      state.token = null;
      state.user = null;
      state.profileCreated = false;
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      state.errorMessage = "";
      state.phone = null;
      return state;
    },
  },
  //These reducers are for createAsyncThunk
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(verifyUser.fulfilled, (state, action) => {
      console.log("Action 1",action)
      state.isSuccess = true; //success flag
      state.errorMessage = ""; //no error message so clear it
    //  state.profileCreated = action.payload.profileCreated;
      state.token = action.payload.data.token; //token got
    });
    builder.addCase(verifyUser.rejected, (state, action) => {
      
      state.isFetching = false; //stop fetching flag
      state.isError = true; // set error
      state.errorMessage = action.payload.msg; //show appropriate error message
    });
    builder.addCase(verifyUser.pending, (state) => {
      state.isFetching = true; //fethcing the result(loader)
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      console.log("HUA", action.meta.arg);
      state.isSuccess = true;
      state.phone = action.meta.arg.phoneNumber; //to be used on verify ui
      state.errorMessage = "";
      console.log(state);
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      console.log("Hua nahi");
      state.isFetching = false; //stop fetching flag
      state.isError = true; // set error
      state.errorMessage = action.payload.msg; //show appropriate error message
    });
    builder.addCase(registerUser.pending, (state) => {
      state.isFetching = true; //fethcing the result(loader)
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isSuccess = true;
      state.phone = action.meta.arg.phone; //to be used on verify ui
      state.errorMessage = "";
    });
    builder.addCase(loginUser.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = action.payload.msg;
    });
    builder.addCase(fetchUserBytoken.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(fetchUserBytoken.fulfilled, (state, action) => {
      state.isSuccess = true;
      console.log(action.payload)
      state.adminVerified = action.payload.verified;
      state.user = action.payload
      state.errorMessage = "";
      console.log(state.adminVerified)
      console.log("Action 2",action.payload)
      state.isError = false
    });
    builder.addCase(fetchUserBytoken.rejected, (state, action) => {
      console.log("REje")
     
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = action.payload.msg;
      state.profileCreated = false;
    });
    builder.addCase(fetchUserBytokenAgain.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(fetchUserBytokenAgain.fulfilled, (state, action) => {
      state.isSuccess = true;
      state.token = action.payload.data.token
      console.log("GP",action.payload.data.user, action.payload.data.user.verified)
      state.adminVerified = action.payload.data.user.verified;
      state.user = action.payload.data.user
      state.errorMessage = "";
      console.log(state.adminVerified)
    });
    builder.addCase(fetchUserBytokenAgain.rejected, (state, action) => {
    
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = action.payload.msg;
      state.profileCreated = false;
    });
    builder.addCase(createTable.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(createTable.fulfilled, (state, action) => {
      state.isSuccess = true;
      state.errorMessage = "";
    });
    builder.addCase(createTable.rejected, (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = action.payload.msg;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isSuccess = true;
      state.profileCreated = true;
      state.errorMessage = "";
      state.user = {
        userId: action.meta.arg.user,
        avatar: action.meta.arg.avatar,
        name: action.meta.arg.name,
        gender: action.meta.arg.gender,
        address: action.meta.arg.address,
        isVendor: action.meta.arg.isVendor,
      };
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = action.payload.msg;
    });
  },
});

//export reducers of User
export const { clearState, setToken, dismissToken } = userSlice.actions;
//export state of User
export const userSelector = (state) => state.user;
