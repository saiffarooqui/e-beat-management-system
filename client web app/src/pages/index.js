import Image from "next/image";
import { Inter } from "next/font/google";
import PhoneInput from "react-phone-input-2";
import Select from "react-select";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });
import { useSelector, useDispatch } from "react-redux";
import OtpInput from "react-otp-input";
import {
  userSelector,
  clearState,
  loginUser,
  dismissToken,
  registerUser,
  resend,
  verifyUser,
  setToken,
  fetchUserBytoken,
} from "@/store/auth/UserSlice";
import { LoadingScreen } from "@/components/LoadingScreen";
import {
  getAllPoliceStation,
  getAllSubdivisions,
  useractionSelector,
} from "@/store/userActions/userActionSlice";

export default function Home() {
  const {
    user,
    isSuccess,
    otp,
    phone,
    isError,
    errorMessage,
    token,
    isFetching,
  } = useSelector(userSelector);
  const url = "http://localhost:5000/";
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      console.log("Fetching");
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
          console.log(data);
          setallsubdivisions(data);
          console.log("set");
        }
        const response2 = await fetch(`${url}user/getAllPoliceStations`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        console.log("res check", response2);
        let data2 = await response2.json();
        console.log(data2);
        if (response2.status === 200) {
          console.log(data2);
          setallpolicestations(data2);
        }
      } catch (error) {
        console.log("Error");
      }
    })();
  }, []);

  useEffect(() => {
    const errCheck = async () => {
      if (isError) {
        alert("Error: " + errorMessage);
        if (errorMessage === "Invalid Authentication.") {
          console.log("Deleting token");
          localStorage.clear();
          dispatch(dismissToken());
        }
        dispatch(clearState());
      }
      if (isSuccess) {
        dispatch(clearState());
      }
    };
    errCheck();
  }, [isError, isSuccess]);
  const askOTP = async (event) => {
    event.preventDefault();
    dispatch(loginUser({ phone: phoneNumber }));
  };
  const verifyOTP = async () => {
    event.preventDefault();
    dispatch(verifyUser({ phoneNumber: phone, value: OtpIt }));
  };
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [imageload, setimageLoad] = useState(false);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFilename(event.target.files[0].name);
  };
  const register = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "inspirathon");
    console.log(formData);
    for (let value of formData.values()) {
      console.log(value);
    }
    setimageLoad(true);
    await fetch(process.env.CLOUDINARY_URL_UPLOAD, {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.secure_url);
        setavatar(data.secure_url);
        setimageLoad(false);
        dispatch(
          registerUser({
            fullName: fullName,
            phoneNumber: phoneNumber,
            district: district.value,
            designation: designation.value,
            subDivision: subDivision._id,
            policeStation: policeStation._id,
            avatar: data.secure_url,
            result: result,
          })
        );
      })
      .catch((err) => {
        setimageLoad(false);

        console.log(err);
        alert("An Error Occured While Uploading");
        alert("An Error Occured While Uploading");
      });
  };

  const [phoneNumber, setphone] = useState();
  const [toggle, setToggle] = useState(true);
  const [fullName, setFullName] = useState("");
  const [result, setResult] = useState("");
  const [district, setdistrict] = useState("");
  const [designation, setdesignation] = useState("");
  const [subDivision, setsubDivision] = useState("");
  const [avatar, setavatar] = useState("");
  const [OtpIt, setOtpIt] = useState("");
  const [policeStation, setpoliceStation] = useState("");
  const [allsubdivisions, setallsubdivisions] = useState([]);
  const [allpolicestations, setallpolicestations] = useState([]);
  let userToken = null;
  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      console.log();
      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        userToken = localStorage.getItem("ebeatToken");
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

  useEffect(() => {
    if (token) {
      dispatch(fetchUserBytoken({ token: token }));
    }
  }, [token]);
  const router = useRouter();
  useEffect(() => {
    if (user) {
      // console.log(user)
      router.push(`/Dashboard/${user.designation}/${user._id}`);
    }
  }, [user]);
  return (
    <>
      {imageload ? (
        <>
          <div className="h-screen flex flex-col justify-center align-middle items-center content-center bg-slate">
            <div className="loading-screen">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </>
      ) : isFetching ? (
        <>
          <div className="h-screen flex flex-col justify-center align-middle items-center content-center bg-slate">
            <LoadingScreen />
          </div>
        </>
      ) : (
        <div className="relative min-h-screen flex">
          <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white h-screen ">
            <div
              className=" sm:w-1/2 xl:w-3/5 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-[#003249] text-white bg-no-repeat bg-cover relative w-1/5  fixed"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1579451861283-a2239070aaa9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
              }}
            >
              <div className="absolute bg-gradient-to-b from-[#003249] to-[white] opacity-75 inset-0 z-0"></div>
              <div className=" w-full  max-w-md z-10 grid justify-items-center ">
                <Image
                  src="/logo.png"
                  alt="Picture of the author"
                  width={300}
                  height={300}
                />
                <div className="sm:text-4xl xl:text-5xl font-bold leading-tight mb-6">
                  E-Beat System
                </div>
                {/* <div className="sm:text-sm xl:text-md text-gray-200 font-normal">
            
                What is Lorem Ipsum Lorem Ipsum is simply dummy text of the
                printing and typesetting industry Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s when an
                unknown printer took a galley of type and scrambled it to make a
                type specimen book it has?
              </div> */}
              </div>

              <ul className="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
            <div className="md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full w-2/5 xl:w-2/5 p-8  md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-white overflow-y-hidden">
              <div className="max-w-md w-full space-y-8 h-screen overflow-y-auto divide-y py-10">
                <div className="text-center">
                  <h2 className="mt-6 text-3xl font-bold text-gray-900">
                    Welcom Back!
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Please sign in to your account
                  </p>
                </div>

                {otp ? (
                  <>
                    <form
                      className="mt-8 space-y-6"
                      onSubmit={verifyOTP}
                      method="POST"
                      encType="multipart/form-data"
                    >
                      <div className="mt-8 content-center">
                        <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide mb-8">
                          Enter OTP
                        </label>
                        <OtpInput
                          className="mt-8 w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                          inputStyle={{
                            padding: 10,
                            borderWidth: 1,
                            width: 40,
                            margin: 8,
                            color: "black",
                          }}
                          value={OtpIt}
                          onChange={setOtpIt}
                          numInputs={6}
                          renderSeparator={<span>-</span>}
                          renderInput={(props) => <input {...props} />}
                        />
                      </div>
                      <div>
                        <button
                          type="submit"
                          className=" text-white w-full flex justify-center bg-gradient-to-r from-[#01364f] to-slate-700  hover:bg-gradient-to-l hover:from-[#01364f] hover:to-slate-700 p-4  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                        >
                          Verify OTP
                        </button>
                      </div>
                      <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
                        <button
                          onClick={() => {
                            dispatch(resend());
                          }}
                        >
                          <a
                            href="#"
                            className="text-[#003249] hover:text-[#003249] no-underline hover:underline cursor-pointer transition ease-in duration-300"
                          >
                            Resend
                          </a>
                        </button>
                      </p>
                    </form>
                  </>
                ) : toggle ? (
                  <form
                    className="mt-8 space-y-6"
                    onSubmit={askOTP}
                    method="POST"
                    encType="multipart/form-data"
                  >
                    <input type="hidden" name="remember" value="true" />
                    <div className="relative">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Phone number
                      </label>

                      <PhoneInput
                        className=" w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                        country={"in"}
                        value={phoneNumber}
                        countryCodeEditable={false}
                        specialLabel=""
                        onChange={(phoneNumber) => setphone(phoneNumber)}
                        inputStyle={{
                          outline: "none",
                          color: "black",
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember_me"
                          name="remember_me"
                          type="checkbox"
                          className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className=" text-white w-full flex justify-center bg-gradient-to-r from-[#01364f] to-slate-700  hover:bg-gradient-to-l hover:from-[#01364f] hover:to-slate-700 p-4  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                      >
                        Send OTP
                      </button>
                    </div>
                    <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
                      <span>Don't have an account?</span>
                      <button onClick={() => setToggle(!toggle)}>
                        <a
                          href="#"
                          className="text-[#003249] hover:text-[#003249] no-underline hover:underline cursor-pointer transition ease-in duration-300"
                        >
                          Sign Up
                        </a>
                      </button>
                    </p>
                  </form>
                ) : (
                  <form
                    className="mt-8 space-y-6"
                    action="#"
                    method="POST"
                    onSubmit={register}
                    encType="multipart/form-data"
                  >
                    <input type="hidden" name="remember" value="true" />
                    <div className="mt-8 content-center">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Full Name
                      </label>
                      <input
                        className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-[#003249] text-[#003249]"
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Phone number
                      </label>
                      <PhoneInput
                        className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-[#003249] text-[#003249]"
                        country={"in"}
                        value={phoneNumber}
                        countryCodeEditable={false}
                        specialLabel=""
                        onChange={(phoneNumber) => setphone(phoneNumber)}
                        inputStyle={{
                          outline: "none",
                        }}
                      />
                    </div>
                    <div className="mt-8 content-center">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Designation
                      </label>
                      <Select
                        className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-[#003249] text-[#003249]"
                        value={designation}
                        onChange={(value) => {
                          setdesignation(value);
                        }}
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            boxShadow: "none",
                            borderWidth: 0,
                            border: state.isFocused && "none",
                          }),
                          menu: (provided, state) => ({
                            ...provided,

                            zIndex: 9999,
                          }),

                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isFocused && "lightgray",
                            color: state.isFocused ? "#003249" : "black",
                          }),
                          menuPortal: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                        }}
                        menuPortalTarget={document.body}
                        menuPosition={"fixed"}
                        classNamePrefix="District"
                        // defaultValue={colourOptions[0]}
                        // isDisabled={isDisabled}
                        // isLoading={isLoading}
                        // isClearable={isClearable}
                        // isRtl={isRtl}
                        isSearchable={true}
                        name="designation"
                        options={[
                          { label: "Constable", value: "constable" },
                          { label: "Hawaldar", value: "hawaldar" },
                          { label: "SP", value: "sp" },
                          { label: "Admin", value: "admin" },
                          { label: "DSP", value: "dsp" },
                          { label: "PI", value: "pi" },
                        ]}
                      />
                    </div>
                    <div className="mt-8 content-center">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        District
                      </label>
                      <Select
                        className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-[#003249] text-[#003249]"
                        value={district}
                        onChange={(value) => {
                          setdistrict(value);
                        }}
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            boxShadow: "none",
                            borderWidth: 0,
                            border: state.isFocused && "none",
                          }),
                          menu: (provided, state) => ({
                            ...provided,

                            boxShadow: "none",
                            borderWidth: 1,
                            backgroundColor: "white",
                            borderColor: "black",
                            width: "90%",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isFocused && "lightgray",
                            color: state.isFocused ? "#003249" : "black",
                          }),
                        }}
                        classNamePrefix="District"
                        // defaultValue={colourOptions[0]}
                        // isDisabled={isDisabled}
                        // isLoading={isLoading}
                        // isClearable={isClearable}
                        // isRtl={isRtl}
                        isSearchable={true}
                        name="district"
                        options={[
                          { label: "North", value: "north" },
                          { label: "South", value: "south" },
                        ]}
                      />
                    </div>
                    <div className="mt-8 content-center">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Sub Division
                      </label>

                      <Select
                        className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-[#003249] text-[#003249]"
                        value={subDivision}
                        onChange={(value) => {
                          setsubDivision(value);
                        }}
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            boxShadow: "none",
                            borderWidth: 0,
                            border: state.isFocused && "none",
                          }),
                          menu: (provided, state) => ({
                            ...provided,

                            boxShadow: "none",
                            borderWidth: 1,
                            backgroundColor: "white",
                            borderColor: "black",
                            width: "90%",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isFocused && "lightgray",
                            color: state.isFocused ? "#003249" : "black",
                          }),
                        }}
                        classNamePrefix="District"
                        // defaultValue={colourOptions[0]}
                        // isDisabled={isDisabled}
                        // isLoading={isLoading}
                        // isClearable={isClearable}
                        // isRtl={isRtl}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option._id}
                        isSearchable={true}
                        options={allsubdivisions.filter(
                          (i) => i.district === district.value
                        )}
                        isDisabled={district.length === 0 ? true : false}
                        name="subdivision"
                      />
                    </div>
                    <div className="mt-8 content-center">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Police station
                      </label>
                      <Select
                        className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-[#003249] text-[#003249]"
                        value={policeStation}
                        onChange={(value) => {
                          setpoliceStation(value);
                        }}
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            boxShadow: "none",
                            borderWidth: 0,
                            border: state.isFocused && "none",
                          }),
                          menu: (provided, state) => ({
                            ...provided,

                            boxShadow: "none",
                            borderWidth: 1,
                            backgroundColor: "white",
                            borderColor: "black",
                            width: "90%",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isFocused && "lightgray",
                            color: state.isFocused ? "#003249" : "black",
                          }),
                        }}
                        classNamePrefix="District"
                        // defaultValue={colourOptions[0]}
                        // isDisabled={isDisabled}
                        // isLoading={isLoading}
                        // isClearable={isClearable}
                        // isRtl={isRtl}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option._id}
                        isSearchable={true}
                        options={allpolicestations.filter(
                          (i) => i.subDivision._id === subDivision._id
                        )}
                        isDisabled={subDivision.length === 0 ? true : false}
                        name="subdivision"
                      />
                    </div>

                    <div className="mt-8 content-center">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Upload Image
                      </label>

                      {file && <img src={URL.createObjectURL(file)} alt="" />}
                      <span>
                        <input
                          type="file"
                          name="file"
                          id="file_up"
                          onChange={handleFileChange}
                          className="m-4"
                        />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember_me"
                          name="remember_me"
                          type="checkbox"
                          className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Remember me
                        </label>
                      </div>
                      {/* <div className="text-sm">
                    <a
                      href="#"
                      className="text-indigo-400 hover:text-[#003249]"
                    >
                      Forgot your password?
                    </a>
                  </div> */}
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="text-white w-full flex justify-center bg-gradient-to-r from-[#01364f] to-slate-700  hover:bg-gradient-to-l hover:from-[#01364f] hover:to-slate-700 p-4  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                      >
                        Send OTP
                      </button>
                    </div>
                    <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
                      <span>Have an account?</span>
                      <button onClick={() => setToggle(!toggle)}>
                        <a
                          href="#"
                          className="text-[#003249] hover:text-[#003249] no-underline hover:underline cursor-pointer transition ease-in duration-300"
                        >
                          Sign In
                        </a>
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
