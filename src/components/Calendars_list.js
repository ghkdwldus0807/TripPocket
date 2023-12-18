import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebase, { fetchUserDataFromRealtimeDB } from "../firebase";
import { getDatabase, ref, onValue, off, Database } from "firebase/database";
import { useNavigate } from "react-router-dom";

function Calendars_list() {
  const [user, setUser] = useState("사용자 데이터를 불러오는 중...");
  const [calendars, setCalendars] = useState([]);
  const navigate = useNavigate();

  const moveToCalendar = (calendarKey) => {
    navigate(`/planner/${calendarKey}`);
  };
  const database = getDatabase(firebase);

  const loadCalendarsData = (userId) => {
    const databaseRef = ref(database, `${userId}/calendar_numbers`);

    onValue(databaseRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const calendarsData = Object.keys(data).map((calendarKey) => ({
          calendarKey: calendarKey,
          calendarName: data[calendarKey].calendar_name,
          calendarPhoto: data[calendarKey].calendar_photo
            ? data[calendarKey].calendar_photo
            : "https://th.bing.com/th/id/OIP.4fRp-L9WTgKn2_p5bJw6bwHaI2?pid=ImgDet&rs=1",
        }));
        setCalendars(calendarsData);
      } else {
        setCalendars([]);
      }
    });
  };

  useEffect(() => {
    const auth = getAuth(firebase);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = `user_db/${user.uid}`;
        setUser(user);

        loadCalendarsData(userId);
      } else {
        setUser(null);
        setCalendars([]);
      }
    });

    return () => {
      const userId = `user_db/${user.uid}`;
      const databaseRef = ref(database, `${userId}/calendar_numbers`);
      off(databaseRef); // Firebase Realtime Database의 감시를 중지
      unsubscribe();
    };
  }, [user]);

  return (
    <div className="User">
      {user !== null ? (
        <div>
          <ul
            style={{
              listStyleType: "none",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "start",
            }}
          >
            {/* 동그라미 제거 및 Flex 스타일 적용 옆으로 정렬되게 하도록 */}
            {calendars.map((calendarData, index) => (
              <li
                key={index}
                onClick={() => moveToCalendar(calendarData.calendarKey)}
                style={{ cursor: "pointer", margin: "30px" }} // 각 아이템에 마진 추가
              >
                <img
                  src={calendarData.calendarPhoto}
                  alt={`${calendarData.calendarName} 이미지`}
                  style={{
                    width: "130px",
                    height: "175px",
                    objectFit: "cover",
                  }} // 사진 크기 맞추기
                />
                <div
                  style={{
                    textAlign: "center", // 추가: 텍스트를 수평 중앙 정렬
                    fontSize: "1.2rem", // 추가: 폰트 크기를 조절 (원하는 값으로 변경)
                    marginTop: "15px",
                    maxWidth: "130px",
                    wordWrap: "break-word",
                  }}
                >
                  {calendarData.calendarName}
                </div>
              </li> //이름이 사진 아래에 정렬되도록
            ))}
          </ul>
        </div>
      ) : (
        <p>{user}</p>
      )}
    </div>
  );
}

export default Calendars_list;
