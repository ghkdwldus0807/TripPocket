//로그아웃은 모든 페이지에 있어야 할 것 같아서 따로 component 만들었엉

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import firebase from "../firebase";
const auth = getAuth(firebase);

function Logout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Firebase 로그아웃 메서드 호출
    signOut(auth)
      .then(() => {
        alert("로그아웃되었습니다.");
        navigate("/");
      })
      .catch((error) => {
        // 로그아웃 실패 처리
        console.error("로그아웃 실패: " + error);
      });
  };
  return (
    <button
      onClick={handleLogout}
      style={{
        marginRight: "70px",
        marginLeft: "50px",
        border: "none",
        backgroundColor: "white",
        width: "100px",
        height: "30px ",
        fontSize: "18px",
        fontWeight: "600",
      }} //로그아웃 버튼 스타일 변경
    >
      로그아웃
    </button>
  );
}

export default Logout;
