import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//Create user function
import {cloudinaryURL,baseURL} from '@env'
const url = baseURL;
export const createTable = createAsyncThunk(
  "/createTable",
  async (
    { fields, table, beatArea, location, archived, formValues,token },
    thunkAPI
  ) => {
    let ferror = false;
    fields.forEach(({ columnName }) => {
      if (
        columnName !== "geometry" &&
        columnName != "user" &&
        columnName != "table" &&
        columnName != "beatArea" &&
        columnName !== "archived"
      ) {
        console.log(columnName);
        if (
          !formValues.hasOwnProperty(columnName) ||
          formValues[columnName] === ""
        )
          ferror = true;
      }
    });
    if (ferror) {
      const ndata = {
        msg: "All fields required",
      };
      console.log("j");
      return thunkAPI.rejectWithValue(ndata);
    }
    console.log(
      JSON.stringify({
        table: table?._id,
        ...formValues,
        geometry: {
          coordinates: [location.longitude, location.latitude],
        },
        beatArea: beatArea?._id,
        archived: archived,
      })
    );

    try {
   
      const response = await fetch(`${baseURL}column/create`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          table: table?._id,
          ...formValues,
          geometry: {
            coordinates: [location.longitude, location.latitude],
          },
          beatArea: beatArea?._id,
          archived: archived,
        }),
      });
      //console.log(policeStation.status,subDivisions.status)
      console.log(response);
      let data = await response.json();

      // console.log(data)
      if (response.status === 201) {
        return thunkAPI.fulfillWithValue(
          JSON.stringify(data)
        );
      } else {
        //Alert.alert("Something went wrong", data.msg);
        thunkAPI.rejectWithValue(data);
        return;
      }
    } catch (error) {
      console.log(error);
      const ndata = {
        msg: "Request failed",
      };
      return thunkAPI.rejectWithValue(ndata);
    } finally {
    }
  }
);

export const findMyBeat = createAsyncThunk(
  "/findMyBeat",
  async ({ token, policeStationid, user }, thunkAPI) => {
    console.log("HERERE", `${url}beat/beatofficer/all`);

    try {
      const response = await fetch(`${url}beat/beatofficer/all`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      //console.log(policeStation.status,subDivisions.status)
      //rr console.log(response);
      let data = await response.json();

      // console.log(data)
      if (response.status === 200) {
        return thunkAPI.fulfillWithValue(
          JSON.stringify({ data: data, user: user })
        );
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
export const beatSlice = createSlice({
  name: "beat",
  initialState: {
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
    beats: [],
    beatArea: null,
    policeStations: [],
    subDivisions: [],
    policeStation: null,
    subDivision: null,
    columnInfos: [],

  },
  reducers: {
    //clearing all flags
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      return state;
    },
    setBeatArea: (state, action) => {
      state.beatArea = action.payload.beatArea.beatArea;
      console.log("Yeh,", state.beatArea);
      return state;
    },
    setColumnInfos:(state,action)=>
    {

      state.columnInfos = action.payload
      console.log("Yeh,", state.columnInfos,action.payload);
      return state;
    }
  },
  //These reducers are for createAsyncThunk
  extraReducers: (builder) => {
    builder.addCase(createTable.pending, (state) => {
      state.isFetching = true;
      console.log("P");
    });
    builder.addCase(createTable.fulfilled, (state, action) => {
      state.isSuccess = true;
      state.errorMessage = "";
      console.log("F");
      console.log(action)
      state.columnInfos.push(action.payload.columnInfo);
     
    });
    builder.addCase(createTable.rejected, (state, action) => {
      state.isFetching = false;
      console.log("R", action.payload);
      state.isError = true;
      state.errorMessage = action.payload.msg;
    });
    builder.addCase(findMyBeat.pending, (state) => {
      state.isFetching = true;
      console.log("P");
    });
    builder.addCase(findMyBeat.fulfilled, (state, action) => {
      action.payload = JSON.parse(action.payload);
      state.isSuccess = true;
      state.errorMessage = "";
      state.beats = action.payload.data.assignedBeatOfficers.filter(
        (f) => f.assignedUser?._id === action.payload.user?._id
      );
      state.isFetching = false;
      //console.log("Beat Mila");
      //console.log(action.payload.data);
      //console.log(state);
    });
    builder.addCase(findMyBeat.rejected, (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.errorMessage = action.payload.msg;
    });
  },
});

//export reducers of User
export const { clearState, setBeatArea,setColumnInfos } = beatSlice.actions;
//export state of User
export const beatSelector = (state) => state.beat;
