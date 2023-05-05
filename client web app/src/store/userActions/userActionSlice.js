import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const url = "http://192.168.1.3:5000/";
const url = "http://localhost:5000/";
//Verify User function
export const addPoliceStation = createAsyncThunk(
  "users/addPoliceStation",
  async ({ name, district, token }, thunkAPI) => {
    console.log(name, district, token);
    try {
      const response = await fetch(`${url}user/addPoliceStation`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },

        body: JSON.stringify({
          name: name,
          district: district,
        }),
      });
      console.log("res check", response);
      let data = await response.json();
      console.log(data);
      if (response.status === 201) {
        return thunkAPI.fulfillWithValue(data);
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (rejectedValueOrSerializedError) {
      console.log("Error");
      const data = {
        msg: "Network request failed",
      };
      return thunkAPI.rejectWithValue(data);
    }
  }
);

export const getAllPoliceStation = createAsyncThunk(
  "users/getAllPoliceStation",
  async ({ token }, thunkAPI) => {
        try {
      const response = await fetch(`${url}user/getAllPoliceStations`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log("res check", response);
      let data = await response.json();
      console.log(data);
      if (response.status === 200) {
        return thunkAPI.fulfillWithValue(data);
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (rejectedValueOrSerializedError) {
      console.log("Error");
      const data = {
        msg: "Network request failed",
      };
      return thunkAPI.rejectWithValue(data);
    }
  }
);

export const getAllSubdivisions = createAsyncThunk(
    "users/getAllSubdivisions",
    async ({ token }, thunkAPI) => {
          try {
        const response = await fetch(`${url}user/getAllSubDivisions`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        console.log("res check", response);
        let data = await response.json();
        console.log(data);
        if (response.status === 200) {
          return thunkAPI.fulfillWithValue(data);
        } else {
          return thunkAPI.rejectWithValue(data);
        }
      } catch (rejectedValueOrSerializedError) {
        console.log("Error");
        const data = {
          msg: "Network request failed",
        };
        return thunkAPI.rejectWithValue(data);
      }
    }
  );
export const addSubDivision = createAsyncThunk(
  "users/addSubDivision",
  async ({ name, district, token }, thunkAPI) => {
    try {
      const response = await fetch(`${url}user/addSubDivision`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },

        body: JSON.stringify({
          name: name,
          district: district,
        }),
      });
      console.log("res check", response);
      let data = await response.json();
      console.log(data);
      if (response.status === 201) {
        return thunkAPI.fulfillWithValue(data);
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (rejectedValueOrSerializedError) {
      console.log("Error");
      const data = {
        msg: "Network request failed",
      };
      return thunkAPI.rejectWithValue(data);
    }
  }
);

export const userActionSlice = createSlice({
  name: "useractions",
  initialState: {
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
    policeStations: [],
    subDivisions: [],
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
  },
  //These reducers are for createAsyncThunk
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(addPoliceStation.fulfilled, (state, action) => {
      console.log(action);
      state.isSuccess = true; //success flag
      state.errorMessage = ""; //no error message so clear it
      state.policeStations.push({
        name: action.meta.arg.name,
        district: action.meta.arg.district,
        _id:
          new Date().getTime().toString(36) +
          Math.random().toString(36).substr(2, 5),
      });
      console.log(state)
      state.token = action.payload.token; //token got
      state.isFetching = false; //stop fetching flag
    });
    builder.addCase(addPoliceStation.rejected, (state, action) => {
      state.isFetching = false; //stop fetching flag
      state.isError = true; // set error
      console.log(action.payload);
      state.errorMessage = action.payload.msg; //show appropriate error message
    });
    builder.addCase(addPoliceStation.pending, (state) => {
      state.isFetching = true; //fethcing the result(loader)
    });
    builder.addCase(addSubDivision.fulfilled, (state, action) => {
      console.log(action);
      state.isSuccess = true; //success flag
      state.errorMessage = ""; //no error message so clear it
      state.subDivisions.push({
        name: action.meta.arg.name,
        district: action.meta.arg.district,
        _id:
          new Date().getTime().toString(36) +
          Math.random().toString(36).substr(2, 5),
      });
      state.token = action.payload.token; //token got
    });
    builder.addCase(addSubDivision.rejected, (state, action) => {
      state.isFetching = false; //stop fetching flag
      state.isError = true; // set error
      console.log(action.payload);
      state.errorMessage = action.payload.msg; //show appropriate error message
    });
    builder.addCase(addSubDivision.pending, (state) => {
      state.isFetching = true; //fethcing the result(loader)
    });
    builder.addCase(getAllPoliceStation.fulfilled, (state, action) => {
      console.log(action);
      state.isSuccess = true; //success flag
      state.errorMessage = ""; //no error message so clear it
      state.policeStations = action.payload;
      state.token = action.payload.token; //token got
    });
    builder.addCase(getAllPoliceStation.rejected, (state, action) => {
      state.isFetching = false; //stop fetching flag
      state.isError = true; // set error
      console.log(action.payload);
      state.errorMessage = "Somethng went wrong"; //show appropriate error message
    });
    builder.addCase(getAllPoliceStation.pending, (state) => {
      state.isFetching = true; //fethcing the result(loader)
    });
    builder.addCase(getAllSubdivisions.fulfilled, (state, action) => {
        console.log(action);
        state.isSuccess = true; //success flag
        state.errorMessage = ""; //no error message so clear it
        state.subDivisions= action.payload;
        state.token = action.payload.token; //token got
      });
      builder.addCase(getAllSubdivisions.rejected, (state, action) => {
        state.isFetching = false; //stop fetching flag
        state.isError = true; // set error
        console.log(action.payload);
        state.errorMessage = "Somethng went wrong"; //show appropriate error message
      });
      builder.addCase(getAllSubdivisions.pending, (state) => {
        state.isFetching = true; //fethcing the result(loader)
      });
  },
});

//export reducers of User
export const { clearState } = userActionSlice.actions;
//export state of User
export const useractionSelector = (state) => state.useractions;
