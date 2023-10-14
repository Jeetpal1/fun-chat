import React from "react";
import "./Login.css";
import myImg from "../assets/images/funchat.png";
import { Button } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";

function Login() {
  const [{}, dispatch] = useStateValue();
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        dispatch({ 
          type: actionTypes.SET_USER, 
          user: result.user });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <div className="login">
      <div className="login__container">
        <img src={myImg} alt="logo" className="login__imgLogo" />

        <div className="login__text">
          <h4>Sign in to Jeetpal's FunChat</h4>
        </div>
        <Button type="submit" onClick={signIn}>
          Sign In With Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
