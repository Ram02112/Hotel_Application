import axios from "axios";
import { STAFF_AUTH, STAFF_LOGIN, STAFF_REGISTER, STAFF_LOGOUT } from "./types";

export default function useStaff() {
  const token = localStorage.getItem("staffToken");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const staffRegister = (data) => {
    const request = axios
      .post("http://localhost:4000/staff/signup", data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });
    return {
      type: STAFF_REGISTER,
      payload: request,
    };
  };

  const staffLogin = (data) => {
    const request = axios
      .post("http://localhost:4000/staff/login", data)
      .then((res) => res.data)
      .catch((err) => err.response.data);

    return {
      type: STAFF_LOGIN,
      payload: request,
    };
  };

  const staffAuth = () => {
    const request = axios
      .get("http://localhost:4000/staff/authStaff", config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data);
    return {
      type: STAFF_AUTH,
      payload: request,
    };
  };

  const staffLogout = () => {
    const request = axios
      .get("http://localhost:4000/staff/logout", config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data);
    return {
      type: STAFF_LOGOUT,
      payload: request,
    };
  };

  return {
    staffRegister,
    staffLogin,
    staffAuth,
    staffLogout,
  };
}
