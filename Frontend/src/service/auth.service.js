import api from "./api";
import TokenService from "./token.service";

const API_URL = import.meta.env.VITE_AUTH_API;

const register = async ( username, email, password, address, lat, lng) => {
  return await api.post(API_URL + "/signup", { username, email, password, address, lat, lng });
};

const login = async (username, password) => {
  const response = await api.post(API_URL + "/login", { username, password });
  if (response.data.accessToken) {
    // localStorage.setItem(
    //   "accessToken",
    //   JSON.stringify(response.data.accessToken)
    // );
    // localStorage.setItem("user", JSON.stringify(response));
    TokenService.setUser(response.data); // เก็บข้อมูลผู้ใช้เมื่อเข้าสู่ระบบสำเร็จ
  }
  return response;
};

const logout = () => {
  // localStorage.removeItem("accessToken");
  // localStorage.removeItem("user");
  TokenService.removeUser(); // ลบข้อมูลผู้ใช้เมื่อออกจากระบบเมื่อทำการLogout
};

const AuthService = {
  register,
  login,
  logout,
};

export default AuthService;