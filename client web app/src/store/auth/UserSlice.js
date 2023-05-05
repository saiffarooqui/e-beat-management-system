import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const url    = "http://localhost:5000/";
//Verify User function
export const verifyUser = createAsyncThunk(
  "users/verifyUser",
  async ({ phoneNumber, value }, thunkAPI) => {
    console.log(phoneNumber, value);
    try {
      const response = await fetch(`${url}user/verify`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          phoneNumber: "+" + phoneNumber,
          otp: value,
        }),
      });
      console.log("Yaha");
      //console.log(otp)
      console.log(response);
      let data = await response.json();
      console.log(data);
      if (response.status === 200) {
        localStorage.setItem("ebeatToken", data.token);
        console.log("Yaha");
        return thunkAPI.fulfillWithValue(data);
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (rejectedValueOrSerializedError) {
      console.log("E", rejectedValueOrSerializedError);
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
      avatar,
      result,
    },
    thunkAPI
  ) => {
    console.log("HERE", avatar);
    try {
      const response = await fetch(`${url}user/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName,
          phoneNumber: "+" + phoneNumber,
          district: district,
          designation: designation,
          subDivision: subDivision,
          policeStation: policeStation,
          avatar: avatar,
        }),
      });
      console.log(response);
      let data = await response.json();
      console.log("Here");
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
    try {
      const response = await fetch(`${url}user/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: "+" + phone,
        }),
      });
      console.log("HERE", response);
      let data = await response.json();
      if (response.status === 200) {
        console.log("Here");
        return thunkAPI.fulfillWithValue({ data, phone });
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
  "user/userinfo",
  async ({ token }, thunkAPI) => {
    console.log(url, token);
    try {
      const response = await fetch(`${url}user/userinfo`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });
      let data = await response.json();
      if (response.status === 200) {
        console.log(data);
        return thunkAPI.fulfillWithValue(data);
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
    otp: false,
  },
  reducers: {
    //clearing all flags
    clearState: (state) => {
      console.log("Clearing");
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      return state;
    },
    resend: (state) => {
      state.otp = false;
      state.phone = null;
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
      console.log(action);
      state.isSuccess = true; //success flag
      state.errorMessage = ""; //no error message so clear it
      state.adminVerified = action.payload.user.verified;
      state.token = action.payload.token; //token got
      state.otp = false;
    });
    builder.addCase(verifyUser.rejected, (state, action) => {
      state.isFetching = false; //stop fetching flag
      state.isError = true; // set error
      console.log(action.payload);
      state.errorMessage = action.payload.msg; //show appropriate error message
    });
    builder.addCase(verifyUser.pending, (state) => {
      state.isFetching = true; //fethcing the result(loader)
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      console.log("HUA", action);
      state.isSuccess = true;
      console.log(action);
      state.phone = action.meta.arg.phoneNumber; //to be used on verify ui
      state.errorMessage = "";
      state.otp = true;
      console.log(state);
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      console.log("Hua nahi");
      state.isFetching = false; //stop fetching flag
      state.isError = true; // set error
      state.errorMessage = action.payload.msg; //show appropriate error message
      state.otp = false;
    });
    builder.addCase(registerUser.pending, (state) => {
      state.isFetching = true; //fethcing the result(loader)
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      console.log(action);
      state.isSuccess = true;
      console.log("Athis", action);
      state.phone = action.meta.arg.phone; //to be used on verify ui
      state.errorMessage = "";
      state.otp = true;
      console.log(state);
    });
    builder.addCase(loginUser.pending, (state) => {
      state.isFetching = true;
      console.log("Here 3");
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = action.payload.msg;
      console.log("Here4");
      state.otp = false;
    });
    builder.addCase(fetchUserBytoken.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(fetchUserBytoken.fulfilled, (state, action) => {
      console.log("Here", action);
      state.isSuccess = true;
      state.errorMessage = "";
      state.user = action.payload;
    });
    builder.addCase(fetchUserBytoken.rejected, (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = action.payload.msg;
      state.profileCreated = false;
    });
  },
});

//export reducers of User
export const { clearState, setToken, dismissToken, resend } = userSlice.actions;
//export state of User
export const userSelector = (state) => state.user;
