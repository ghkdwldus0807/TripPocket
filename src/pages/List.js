import React, { Component } from "react";
import Logout from "../components/Logout";
import top_logo from "../logo/TP_logo.png";
import User from "../components/User";
import Calendars_list from "../components/Calendars_list";
import "../css/List.css";
import firebase, { fetchUserDataFromRealtimeDB } from "../firebase";
import { getDatabase, ref, push, set, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

class List extends Component {
  static defaultProps = {
    newCalendar: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      calendars: [],
      user: null, // 로그아웃 하고 로그인시 중복호출문제 해결 하기 위해 추가, 밑에 this.unsubscribe,componentWillUnmount도 같은 이유
    };
  }

  async componentDidMount() {
    const auth = getAuth(firebase);
    this.unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.setState({ user });

        const userId = `user_db/${user.uid}`;
        const userDataRealtimeDB = await fetchUserDataFromRealtimeDB(userId);

        if (userDataRealtimeDB && userDataRealtimeDB.calendar_numbers) {
          const calendarsData = Object.values(
            userDataRealtimeDB.calendar_numbers
          ).map((calendar) => ({
            calendarName: calendar.calendar_name,
            calendarPhoto: calendar.calendar_photo
              ? calendar.calendar_photo
              : "https://th.bing.com/th/id/OIP.4fRp-L9WTgKn2_p5bJw6bwHaI2?pid=ImgDet&rs=1",
          }));
          this.setState({ calendars: calendarsData });
        } else {
          this.setState({ calendars: [] });
        }
      } else {
        this.setState({ calendars: [], user: null });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  AddNewCalendar = async () => {
    const auth = getAuth(firebase);
    const user = auth.currentUser;

    if (user) {
      const userId = `user_db/${user.uid}`;
      const userDataRealtimeDB = await fetchUserDataFromRealtimeDB(userId);

      if (userDataRealtimeDB) {
        const existingCalendars = Object.values(
          userDataRealtimeDB.calendar_numbers || {}
        ).map((calendar) => calendar.calendar_name);

        const calendarName = prompt("캘린더 이름이 무엇인가요?");

        /*캘린더 이름으로 삭제하기 때문에 중복된 이름을 가진 캘린더 만들지 못하도록 함*/

        if (calendarName) {
          if (existingCalendars.includes(calendarName)) {
            window.alert("이미 존재하는 캘린더 이름입니다.");
            return;
          } else {
            const calendarInfo = {
              calendar_name: calendarName,
              calendar_photo: prompt("캘린더 사진 URL은 무엇인가요?"),
            };

            const database = getDatabase(firebase);
            const databaseRef = ref(database, `${userId}/calendar_numbers`);
            const newCalendarRef = push(databaseRef);

            set(newCalendarRef, calendarInfo);

            this.forceUpdate();
          }
        }
      }
    } else {
      // 사용자가 로그인하지 않은 경우에 대한 처리 (예: 에러 메시지 표시)
      console.error("사용자가 로그인하지 않았습니다.");
      window.alert("사용자가 로그인 하지 않았습니다. 로그인을 먼저 해주세요");
    }
  };

  DeleteCalendar = () => {
    const auth = getAuth(firebase);
    const user = auth.currentUser;

    if (user) {
      const calendarName = prompt("삭제할 캘린더의 이름을 입력하세요.");

      if (calendarName) {
        const userId = `user_db/${user.uid}`;
        const database = getDatabase(firebase);
        const databaseRef = ref(database, `${userId}/calendar_numbers`);

        // 삭제할 캘린더를 찾아서 삭제
        get(databaseRef).then((snapshot) => {
          if (snapshot.exists()) {
            const calendarNumbers = snapshot.val();
            const calendarIdToDelete = Object.keys(calendarNumbers).find(
              (calendarId) =>
                calendarNumbers[calendarId].calendar_name === calendarName
            );

            if (calendarIdToDelete) {
              const calendarRefToDelete = ref(
                database,
                `${userId}/calendar_numbers/${calendarIdToDelete}`
              );
              set(calendarRefToDelete, null);
              this.forceUpdate(); // 화면 갱신
            } else {
              window.alert(
                "해당 이름의 캘린더를 찾을 수 없습니다. 띄어쓰기까지 확인 부탁드립니다."
              );
            }
          }
        });
      }
    } else {
      console.error("사용자가 로그인하지 않았습니다.");
      window.alert("사용자가 로그인 하지 않았습니다. 로그인을 먼저 해주세요");
    }
  };

  render() {
    return (
      <div className="List">
        <div className="Top_list">
          <img src={top_logo} alt="logo" style={{ marginRight: "auto" }} />
          <User />
          <span className="separate">|</span>
          {/* 유저이름이랑 로그아웃 버튼 구분선 */}
          <Logout />
        </div>
        <hr></hr>
        <div className="middle_list">
          <button className="plus_button" onClick={this.AddNewCalendar}>
            +
          </button>
          <button className="delete_button" onClick={this.DeleteCalendar}>
            X
          </button>
          <Calendars_list calendars={this.state.calendars} />
        </div>
      </div>
    );
  }
}

export default List;
