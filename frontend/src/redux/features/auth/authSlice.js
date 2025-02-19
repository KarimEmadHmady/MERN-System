import { createSlice } from "@reduxjs/toolkit";

const checkExpiration = () => {
  const expirationTime = localStorage.getItem("expirationTime");
  if (expirationTime && new Date().getTime() > expirationTime) {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("loginTime"); 

    return null;
  }
  return localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
};

const initialState = {
  userInfo: checkExpiration(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 10 * 60 * 60 * 1000;

      localStorage.setItem("expirationTime", expirationTime);
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTime");
      localStorage.removeItem("loginTime"); 

    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
