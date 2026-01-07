

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../context/AuthContext";

export default function GoogleAuth() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          const res = await api.post("/user/googlelog", {
            token: credentialResponse.credential,
          });

          login(res.data.user, res.data.token);
          navigate("/profile");
        } catch (err) {
          console.error("Google login failed", err);
        }
      }}
      onError={() => {
        console.log("Google Login Failed");
      }}
    />
  );
}

