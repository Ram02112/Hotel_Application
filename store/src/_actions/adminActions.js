import axios from "axios";
import { ADMIN_AUTH, ADMIN_LOGIN, ADMIN_LOGOUT, ADMIN_REGISTER } from "./types";

export default function useAdmin() {
  const token = localStorage.getItem("adminToken");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const adminRegister = (data) => {
    const request = axios
      .post("http://localhost:4000/admin/signup", data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });
    return {
      type: ADMIN_REGISTER,
      payload: request,
    };
  };

  const adminLogin = (data) => {
    const request = axios
      .post("http://localhost:4000/admin/login", data)
      .then((res) => res.data)
      .catch((err) => err.response.data);

    return {
      type: ADMIN_LOGIN,
      payload: request,
    };
  };

  const adminAuth = () => {
    const request = axios
      .get("http://localhost:4000/admin/authAdmin", config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data);
    return {
      type: ADMIN_AUTH,
      payload: request,
    };
  };

  const adminLogout = () => {
    const request = axios
      .get("http://localhost:4000/admin/logout", config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data);
    return {
      type: ADMIN_LOGOUT,
      payload: request,
    };
  };

  return {
    adminRegister,
    adminLogin,
    adminAuth,
    adminLogout,
  };
}
