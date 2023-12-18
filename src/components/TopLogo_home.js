import React, { Component } from "react";
import top_logo from "../logo/TP_logo.png";
import { useNavigate } from "react-router-dom";

function TopLogo_home() {
  const navigate = useNavigate();
  const ToList = () => {
    navigate("/list");
  };
  return (
    <img
      src={top_logo}
      alt="logo"
      onClick={ToList}
      style={{ marginRight: "auto" }}
    />
  );
}

export default TopLogo_home;
