import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "../firebase";
import top_logo from "../logo/TP_logo.png";
import book1 from "../logo/book1.png";
import "../css/List_guest.css";

function ListGuest() {
  const navigate = useNavigate();
  const ToLogin = () => {
    navigate("/");
  };

  return (
    <div className="List_guest">
      <div className="Top">
        <img className="top_logo" src={top_logo} alt="logo" />
        <button onClick={ToLogin}>로그인</button>
      </div>
      <figure className="lists">
        <img src={book1} alt="book1" />
        <figcaption>예시입니다</figcaption>
      </figure>
    </div>
  );
}

export default ListGuest;
