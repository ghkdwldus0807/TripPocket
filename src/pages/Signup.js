import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebase from "../firebase";
import Main_logo_top from "../logo/SmallLogo.png";
import Main_logo from "../logo/TripPocket_logo.png";
import "../css/Signup.css";
import { getDatabase, ref, push, set, get } from "firebase/database";

function Signup() {
  const [new_id, setNewID] = useState("");
  const [new_pw, setNewPW] = useState("");
  const [new_name, setNewName] = useState("");
  const [new_photo, setNewPhoto] = useState("");

  const navigate = useNavigate();

  const ToLogin = () => {
    navigate("/");
  };

  const New_ID = (new_id) => {
    setNewID(new_id);
  };

  const New_PW = (new_pw) => {
    setNewPW(new_pw);
  };
  const New_Name = (new_name) => {
    setNewName(new_name);
  };

  const New_Photo = (new_photo) => {
    setNewPhoto(new_photo);
  };

  const handleSignup = () => {
    const auth = getAuth(firebase);
    // Firebase에 새 사용자 생성 요청
    createUserWithEmailAndPassword(auth, new_id, new_pw)
      .then((userCredential) => {
        const user = userCredential.user;

        const db = getDatabase(firebase); // Firebase Realtime Database 객체 가져오기
        const usersRef = ref(db, "user_db/" + user.uid); // 사용자 데이터 참조 생성

        const userData = {
          calendar_numbers: "",
          user_name: new_name,
          user_photo: new_photo || "",
          user_pw: new_pw,
        };

        set(usersRef, userData);

        get(usersRef).then((snapshot) => {
          const user_name = snapshot.val().user_name;
          if (user_name !== undefined) {
            alert("로그인 성공!\n" + user_name + "님 환영합니다");
          } else {
            alert("로그인 성공!\n환영합니다!");
          }
        });
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("회원가입 실패: " + errorMessage);
      });
  };

  return (
    <div className="Signup">
      <div className="Logo">
        <img className="logo_top" src={Main_logo_top} alt="logo_top"></img>
        <img className="logo_" src={Main_logo} alt="logo_"></img>
      </div>
      <div className="ID_PW_Make">
        <div className="ID">
          <label htmlFor="id">아이디</label>
          <input
            type="text"
            id="id"
            name="id"
            value={new_id}
            onChange={(e) => New_ID(e.target.value)}
          ></input>
        </div>
        <div className="PW">
          <label htmlFor="pw">비밀번호</label>
          <input
            type="password" // 비밀번호 필드로 설정
            id="pw"
            name="pw"
            value={new_pw}
            onChange={(e) => New_PW(e.target.value)}
          ></input>
        </div>
        <div className="Name">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={new_name}
            onChange={(e) => New_Name(e.target.value)}
          />
        </div>
        <div className="Photo">
          <label htmlFor="photo">프로필 URL</label>
          <input
            type="text"
            id="photo"
            name="photo"
            value={new_photo}
            onChange={(e) => New_Photo(e.target.value)}
          />
        </div>
      </div>
      <div className="Main_Sign_Button">
        <div className="MoveTOMain_Button">
          <button onClick={ToLogin}>로그인</button>
        </div>
        <div className="line">|</div>
        <div className="SignUp_Button">
          <button onClick={handleSignup}>회원가입</button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
