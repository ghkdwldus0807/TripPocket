import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase from "../firebase";
import { getDatabase, ref, get } from "firebase/database";
const auth = getAuth(firebase);

//훅 사용하기 위해서 함수형으로 바꿈
function Auth() {
  const [id_email, setIdEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const ID_Auth = (new_id) => {
    // 아이디 이메일 업데이트
    setIdEmail(new_id);
  };

  const PW_Auth = (new_pw) => {
    // 패스워드 업데이트
    setPassword(new_pw);
  };
  const ToSignup = () => {
    navigate("/signup");
  }; //회원가입 페이지로 이동
  const ToMain = () => {
    navigate("/list_guest");
  }; //로그인 하지 않은 방문자가 볼 수 있는 페이지

  const handleLogin = () => {
    // Firebase 로그인 메서드 호출
    signInWithEmailAndPassword(auth, id_email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const db = getDatabase(firebase);
        const usersRef = ref(db, "user_db/" + user.uid);
        get(usersRef).then((snapshot) => {
          const user_name = snapshot.val().user_name;
          if (user_name !== undefined) {
            alert("로그인 성공!\n" + user_name + "님 환영합니다");
          } else {
            alert("로그인 성공!\n환영합니다!");
          }
        });
        navigate("/list"); //성공하면 달력들 페이지로
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("로그인 실패: " + errorMessage);
      });
  }; // 여기까지만 바뀜 밑에는 똑같아

  return (
    <div>
      <div className="ID_PW_Button">
        <div className="ID">
          <label htmlFor="id">아이디</label>
          <input
            type="id"
            name="id"
            id="id"
            value={id_email}
            onChange={(e) => ID_Auth(e.target.value)}
          ></input>
        </div>
        <div className="PW">
          <label htmlFor="pw">비밀번호</label>
          <input
            type="password"
            name="pw"
            id="pw"
            value={password}
            onChange={(e) => PW_Auth(e.target.value)}
          ></input>
        </div>
      </div>
      <div className="Main_Login_Sign_Button">
        <button onClick={ToMain}>메인</button>
        <button className="login_button" onClick={handleLogin}>
          로그인
        </button>
        <button onClick={ToSignup}>회원가입</button>
      </div>
    </div>
  );
}

export default Auth;
