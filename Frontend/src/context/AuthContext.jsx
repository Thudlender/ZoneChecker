import { useState, useContext, createContext, useEffect } from "react";
import AuthService from "../service/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser);

  const login = (user) => setUser(user); //เซ็ตค่าปัจจุบันเสมอ
  const logout = () => {
    AuthService.logout();
    setUser(null); //logout แล้ว clear user
  };

  function getUser() {
    const temp = localStorage.getItem("user");
    const saveUser = JSON.parse(temp);
    return saveUser || null;
  }

  useEffect(() => {
    const temp = JSON.stringify(user);
    localStorage.setItem("user", temp);
  }, [user]); //call back function สั่งให้มันทำอะไร
//สร้างฟังก์ชันแล้วส่งให้กับ children ใครที่อยู่ภายใต้ AuthProvider จะถือว่าเป็น children ถึงจะเรียกใช้ใน Layout
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
//สร้างฟังก์ชันที่ชื่อว่า useAuthContext เพื่อเรียกใช้ ีuseContext

export const useAuthContext = () => useContext(AuthContext);