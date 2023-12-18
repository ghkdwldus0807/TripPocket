import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { getDatabase, ref, set, remove } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const EditMemoModal = ({
  isOpen,
  onClose,
  calendarKey,
  selectedDate,
  initialMemoData,
  userId,
}) => {
  const [memoData, setMemoData] = useState(initialMemoData);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    setMemoData(initialMemoData); // initialMemoData가 변경될 때마다 memoData 업데이트
  }, [initialMemoData]);

  const handleSave = async () => {
    let photoURL = memoData.memo_photo;
    if (selectedFile) {
      const storage = getStorage();
      const fileRef = storageRef(storage, `memo_photo/${selectedFile.name}`);
      await uploadBytes(fileRef, selectedFile);
      photoURL = await getDownloadURL(fileRef);
    }

    // 나머지 데이터와 함께 Realtime Database에 저장
    const database = getDatabase();
    const memoRef = ref(
      database,
      `user_db/${userId}/calendar_numbers/${calendarKey}/memo/${selectedDate}`
    );
    set(memoRef, { ...memoData, memo_photo: photoURL })
      .then(() => {
        onClose(); // 모달 닫기
      })
      .catch((error) => {
        console.error("Error updating memo:", error);
      });
  };

  const handleDelete = () => {
    const database = getDatabase();
    const memoRef = ref(
      database,
      `user_db/${userId}/calendar_numbers/${calendarKey}/memo/${selectedDate}`
    );

    remove(memoRef)
      .then(() => {
        onClose(); // 모달 닫고 상태 업데이트
      })
      .catch((error) => {
        console.error("Error deleting memo:", error);
      });
  };

  // 메모 내용 업데이트 시에 기존 memoData를 복사한 후 해당 필드만 업데이트
  const handleContentChange = (e) => {
    setMemoData((prevData) => ({
      ...prevData,
      memo_content: e.target.value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Edit Memo</h2>
      <input type="file" onChange={handleFileSelect} accept="image/*" />
      <textarea
        value={memoData.memo_content || ""}
        onChange={handleContentChange}
        placeholder="Memo content"
        rows={7}
      />
      <button onClick={handleSave}>수정</button>
      <button onClick={handleDelete}>삭제</button>
      <button onClick={onClose}>닫기</button>
    </Modal>
  );
};

export default EditMemoModal;
