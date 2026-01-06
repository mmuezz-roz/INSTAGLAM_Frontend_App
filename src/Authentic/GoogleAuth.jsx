import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function GoogleAuth() {
  const { login } = useContext(AuthContext);

  const handleSuccess = async (res) => {
    const response = await api.post("/googlelog", {
      token: res.credential,
    });

    login(response.data.user, response.data.token);
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Google Login Failed")}
    />
  );
}
