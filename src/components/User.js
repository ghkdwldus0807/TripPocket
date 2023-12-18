import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase, { fetchUserDataFromRealtimeDB } from "../firebase";
import "../css/User.css";
import { getDatabase, ref, update } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import Modal from "react-modal";
Modal.setAppElement("#root");

function User() {
  const [user, setUser] = useState("사용자 데이터를 불러오는 중...");
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const auth = getAuth(firebase);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = `user_db/${user.uid}`;
        const userDataRealtimeDB = await fetchUserDataFromRealtimeDB(userId);
        if (userDataRealtimeDB) {
          setName(userDataRealtimeDB.user_name);
          setPhoto(
            userDataRealtimeDB.user_photo ||
              "https://th.bing.com/th/id/OIP.kYojycY1hp-1M8m53f_TkgHaHa?pid=ImgDet&rs=1"
          );
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    let photoURL = photo;
    if (selectedFile) {
      const storage = getStorage(firebase);
      const fileRef = storageRef(storage, `profile_photo/${selectedFile.name}`);
      await uploadBytes(fileRef, selectedFile);
      photoURL = await getDownloadURL(fileRef);
    }

    const auth = getAuth(firebase);
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = `user_db/${currentUser.uid}`;
      const database = getDatabase(firebase);
      const userRef = ref(database, userId);

      await update(userRef, {
        user_name: name,
        user_photo: photoURL,
      });
      setPhoto(photoURL);
      setModalIsOpen(false); // 모달 닫기
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const defaultPhotoUrl =
    "https://th.bing.com/th/id/OIP.kYojycY1hp-1M8m53f_TkgHaHa?pid=ImgDet&rs=1";

  const handleDeletePhoto = async () => {
    // 프로필 사진만 기본 이미지로 변경
    setPhoto(defaultPhotoUrl);
    const auth = getAuth(firebase);
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userId = `user_db/${currentUser.uid}`;
      const database = getDatabase(firebase);
      const userRef = ref(database, userId);

      await update(userRef, {
        user_photo: defaultPhotoUrl,
      });
    }
  };

  return (
    <div className="User" style={{ display: "flex", alignItems: "center" }}>
      {user !== null ? (
        <div
          style={{ display: "flex", alignItems: "center", textAlign: "center" }}
        >
          <img
            src={photo}
            alt="사용자 사진"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              marginRight: "15px",
            }}
            onClick={openModal}
          />
          <p className="User_name" onClick={openModal}>
            {name}
          </p>
        </div>
      ) : (
        <p>{user}</p>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>프로필 정보 변경</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
        />
        <input type="file" onChange={handleFileSelect} />
        <button onClick={handleUpdateProfile}>변경</button>
        <button onClick={handleDeletePhoto}>삭제</button>
        <button onClick={() => setModalIsOpen(false)}>닫기</button>
      </Modal>
    </div>
  );
}

export default User;
