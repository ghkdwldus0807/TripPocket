import React, { Component } from "react";
import "../css/Login.css";
import Main_logo_top from "../logo/SmallLogo.png";
import Main_logo from "../logo/TripPocket_logo.png";
import Auth from "../components/Auth";

//일단 div태그로 다 지정함 나중에 Header, Body 태그 등으로 컴포넌트 만들어서 따로 빼자
class Login extends Component {
  render() {
    return (
      <div className="Login">
        <div className="Logo">
          <img className="logo_top" src={Main_logo_top} alt="logo_top"></img>
          <img className="logo_" src={Main_logo} alt="logo_"></img>
        </div>
        <Auth />
      </div>
    );
  }
}

export default Login;
