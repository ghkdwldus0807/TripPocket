import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logout from "../components/Logout";
import User from "../components/User";
import Calendar from "../components/Calendar";
import EditMemoModal from "../components/EditMemoModal";

import "../css/Memo.css";
import TopLogo_home from "../components/TopLogo_home";
import { getDatabase, ref, get, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Memo() {
  const navigate = useNavigate();
  const { calendarKey } = useParams();
  const location = useLocation();
  const state = location.state || {};
  const passedDate = state.selectedDate;
  const currentDate = new Date();

  const getCurrentFormattedDate = () => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;
  };

  const [selectedDate, setSelectedDate] = useState(() => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
  });

  if (!selectedDate) {
    setSelectedDate(
      `${currentDate.getFullYear()}.${
        currentDate.getMonth() + 1
      }.${currentDate.getDate()}`
    );
  }

  const formattedDate = selectedDate.replace(/\./g, "-");

  const [scheduleData, setScheduleData] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [memoData, setMemoData] = useState({
    memo_photo: "",
    memo_content: "",
  });
  const [editMemoData, setEditMemoData] = useState({
    memo_photo: "",
    memo_content: "",
  });
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const moveToPlanner = () => {
    navigate(`/planner/${calendarKey}`, {
      state: { selectedDate: selectedDate },
    });
  };

  const handleEditClick = () => {
    setEditMemoData(memoData);
    setIsModalOpen(true);
  };

  const fetchData = useCallback((date, currentUser) => {
    if (currentUser && date) {
      const userId = currentUser.uid;
      const database = getDatabase();
      const formattedFetchDate = date.replace(/\./g, "-");
      const dateRef = ref(
        database,
        `user_db/${userId}/calendar_numbers/${calendarKey}/${formattedFetchDate}`
      );
      const memoRef = ref(
        database,
        `user_db/${userId}/calendar_numbers/${calendarKey}/memo/${formattedFetchDate}`
      );

      onValue(memoRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setMemoData({
            memo_photo:
              data?.memo_photo ||
              "https://th.bing.com/th/id/OIP.u6CwDrGDPdifxh-4a7W4HAHaHa?rs=1&pid=ImgDetMain",
            memo_content:
              data?.memo_content || "이 날짜에 대한 메모가 없습니다.",
          });
        } else {
          // 데이터가 존재하지 않는 경우 처리
          console.log("이 날짜에 대한 데이터가 없습니다.");
          setMemoData({
            memo_photo:
              "https://th.bing.com/th/id/OIP.u6CwDrGDPdifxh-4a7W4HAHaHa?rs=1&pid=ImgDetMain",
            memo_content: "이 날짜에 대한 메모가 없습니다.",
          });
        }
      });

      onValue(dateRef, (snapshot) => {
        const dateData = snapshot.val();
        setScheduleData(dateData || {});
      });

      const expensesRef = ref(
        database,
        `user_db/${userId}/calendar_numbers/${calendarKey}/expenses/${formattedFetchDate}`
      );

      onValue(expensesRef, (snapshot) => {
        const expensesData = snapshot.val();
        const expensesWithId = expensesData
          ? Object.keys(expensesData).map((id) => ({
              id,
              ...expensesData[id],
            }))
          : [];
        setExpenses(expensesWithId);
      });
    }
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    setUser(currentUser);

    if (currentUser) {
      fetchData(selectedDate);

      const memoRef = ref(
        getDatabase(),
        `user_db/${currentUser.uid}/calendar_numbers/${calendarKey}/memo/${formattedDate}`
      );

      onValue(memoRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setMemoData({
            memo_photo:
              data?.memo_photo ||
              "https://th.bing.com/th/id/OIP.u6CwDrGDPdifxh-4a7W4HAHaHa?rs=1&pid=ImgDetMain",
            memo_content:
              data?.memo_content || "이 날짜에 대한 메모가 없습니다.",
          });
        } else {
          // 데이터가 존재하지 않는 경우 처리
          console.log("이 날짜에 대한 데이터가 없습니다.");
          setMemoData({
            memo_photo:
              "https://th.bing.com/th/id/OIP.u6CwDrGDPdifxh-4a7W4HAHaHa?rs=1&pid=ImgDetMain",
            memo_content: "이 날짜에 대한 메모가 없습니다.",
          });
        }
      });
    }
  }, [calendarKey, formattedDate, selectedDate, user]);

  useEffect(() => {
    if (passedDate) {
      setSelectedDate(passedDate);
      fetchData(passedDate);
    }
  }, [passedDate]);

  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate);
    fetchData(selectedDate); // 날짜가 변경될 때마다 데이터 로딩
  }, [selectedDate]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        fetchData(selectedDate, currentUser);
        fetchData(formattedDate);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [calendarKey, formattedDate, selectedDate]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    localStorage.setItem("selectedDate", date);
    fetchData(date);
  };

  return (
    <div className="List">
      <div className="Top_list">
        <TopLogo_home />
        <User />
        <span className="separate">|</span>
        <Logout />
      </div>
      <hr></hr>
      <div className="content_wrapper">
        <Calendar
          scheduleData={scheduleData}
          selectedDate={selectedDate || formattedDate}
          onDateClick={handleDateClick}
          onDateSelect={(date) => setSelectedDate(date)}
        />
        <div className="right_section">
          <div className="date_toggle_container">
            <span className="current_date">{formattedDate}</span>

            <button className="toggle_btn" onClick={moveToPlanner}>
              일정
            </button>

            <button className="toggle_btn active">메모</button>
            <div className="edit_container">
              <button className="edit_btn" onClick={handleEditClick}>
                EDIT
              </button>
              <EditMemoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                calendarKey={calendarKey}
                selectedDate={selectedDate}
                initialMemoData={editMemoData}
                userId={user ? user.uid : null}
              />
            </div>
          </div>
          <div className="memo">
            <img
              className="image"
              src={
                memoData.memo_photo ||
                "https://th.bing.com/th/id/OIP.u6CwDrGDPdifxh-4a7W4HAHaHa?rs=1&pid=ImgDetMain"
              }
              alt="메모사진"
            ></img>
            <div className="memo_detail">
              {memoData.memo_content || "No memo for this date."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Memo;
