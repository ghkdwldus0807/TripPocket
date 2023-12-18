import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logout from "../components/Logout";
import User from "../components/User";
import Calendar from "../components/Calendar";
import EditModal from "../components/EditModal";
import AddExpenseModal from "../components/AddExpenseModal";
import AddTodoModal from "../components/AddTodoModal";
import "../css/Planner.css";
import firebase, { fetchUserDataFromRealtimeDB } from "../firebase";
import TopLogo_home from "../components/TopLogo_home";
import {
  getDatabase,
  ref,
  get,
  onValue,
  set,
  child,
  update,
  push,
  remove,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

function Planner() {
  const navigate = useNavigate();
  const { calendarKey } = useParams();
  const location = useLocation();
  const state = location.state || {};
  const passedDate = state.selectedDate;
  const [scheduleData, setScheduleData] = useState({});

  const currentDate = new Date();

  const initialFormattedDate = `${currentDate.getFullYear()}.${
    currentDate.getMonth() + 1
  }.${currentDate.getDate()}`;

  const [selectedDate, setSelectedDate] = useState(() => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
  });

  const formattedDate = `${currentDate.getFullYear()}.${
    currentDate.getMonth() + 1
  }.${currentDate.getDate()}`;
  const selectedDateFormatted = selectedDate
    ? selectedDate.replace(/\./g, "-")
    : initialFormattedDate.replace(/\./g, "-");

  if (!selectedDate) {
    setSelectedDate(
      `${currentDate.getFullYear()}.${
        currentDate.getMonth() + 1
      }.${currentDate.getDate()}`
    );
  }

  const auth = getAuth();
  const user = auth.currentUser;

  const moveToMemo = () => {
    navigate(`/memo/${calendarKey}`, {
      state: { selectedDate: selectedDateFormatted },
    });
  };

  const fetchData = useCallback(
    (date) => {
      if (user && date) {
        const userId = user.uid;
        const database = getDatabase();
        const formattedFetchDate = date.replace(/\./g, "-");
        const dateRef = ref(
          database,
          `user_db/${userId}/calendar_numbers/${calendarKey}/${formattedFetchDate}`
        );

        onValue(dateRef, (snapshot) => {
          const dateData = snapshot.val();
          if (dateData) {
            setScheduleData({ [date]: dateData });
          } else {
            console.log(`${date}의 데이터가 없습니다.`);
            setScheduleData({ [date]: {} }); //runtime 에러 해결 완료!! 이렇게 간단하다니..ㅋ
          }
        });

        const expensesRef = ref(
          database,
          `user_db/${userId}/calendar_numbers/${calendarKey}/expenses/${formattedFetchDate}`
        );

        onValue(expensesRef, (snapshot) => {
          const expensesData = snapshot.val();
          if (expensesData) {
            const expensesWithId = Object.keys(expensesData).map((id) => ({
              id,
              ...expensesData[id],
            }));
            setExpenses(expensesWithId);
          } else {
            setExpenses([]);
          }
        });
      }
    },
    [user]
  );

  useEffect(() => {
    const savedDate = localStorage.getItem("selectedDate");
    if (savedDate) {
      // 저장된 날짜가 있으면 그 날짜를 사용
      setSelectedDate(savedDate);
    } else {
      // 저장된 날짜가 없으면 현재 날짜를 사용
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()}`;
      setSelectedDate(formattedDate);
    }
    fetchData(selectedDate);
  }, []);

  useEffect(() => {
    if (passedDate) {
      setSelectedDate(passedDate);
      fetchData(passedDate);
    }
  }, [passedDate]);

  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate);
    fetchData(selectedDate); // 날짜가 변경될 때마다 데이터 로딩
  }, []);

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate, fetchData]);

  const [expenses, setExpenses] = useState([]);

  const [newExpense, setNewExpense] = useState({
    amount: "",
    currency: "USD", // 기본값으로 USD 설정, 필요에 따라 변경 가능
    description: "",
  });

  const addExpense = (newExpenseData) => {
    const db = getDatabase();
    const userId = user.uid;
    const expensePath = `user_db/${userId}/calendar_numbers/${calendarKey}/expenses/${selectedDateFormatted}`;
    const newExpenseRef = push(ref(db, expensePath));

    set(newExpenseRef, newExpenseData)
      .then(() => {
        console.log("Expense added successfully!");
        // Firebase에서 최신 expenses 데이터 가져와서 상태 업데이트
        const expensesRef = ref(
          db,
          `user_db/${userId}/calendar_numbers/${calendarKey}/expenses/${selectedDateFormatted}`
        );
        onValue(
          expensesRef,
          (snapshot) => {
            const expensesData = snapshot.val();
            if (expensesData) {
              setExpenses(Object.values(expensesData));
            } else {
              setExpenses([]);
            }
          },
          { onlyOnce: true }
        );
      })
      .catch((error) => {
        console.error("Error adding expense: ", error);
      });
  };

  const [availableCurrencies, setAvailableCurrencies] = useState([]);

  useEffect(() => {
    // 사용 가능한 화폐 목록을 불러오는 함수
    const fetchCurrencies = async () => {
      const db = getDatabase();
      const currencyRef = ref(db, "currency_db");
      onValue(
        currencyRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setAvailableCurrencies(Object.keys(data));
          }
        },
        { onlyOnce: true }
      );
    };

    fetchCurrencies();
  }, []);

  const getCurrencySymbol = (currencyCode) => {
    const currencySymbols = {
      USD: "$",
      EUR: "€",
      WON: "₩",
      YEN: "￥",
      // 다른 화폐 단위 추가 가능
    };
    return currencySymbols[currencyCode] || currencyCode;
  };

  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate);
    fetchData(selectedDate); // 날짜가 변경될 때마다 데이터 로딩
  }, [selectedDate]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState({
    time: "",
    plan: "",
  });

  const [editingExpense, setEditingExpense] = useState({
    amount: "",
    currency: "",
    description: "",
  });

  const [modalType, setModalType] = useState("schedule"); // 기본값은 'schedule'

  const handleEditClick = (time, plan) => {
    setEditingSchedule({ time, plan });
    setModalType("schedule"); // 모달 타입을 'schedule'로 설정
    setIsModalOpen(true);
  };

  const handleEditExpenseClick = (expense) => {
    setEditingExpense({
      id: expense.id,
      amount: expense.amount,
      currency: expense.currency,
      description: expense.description,
    });
    setModalType("expense");
    setIsModalOpen(true);
  };

  const handleSaveExpenseChanges = (
    expenseId,
    newAmount,
    newCurrency,
    newDescription
  ) => {
    const db = getDatabase();
    const userId = user.uid;
    const expensePath = `user_db/${userId}/calendar_numbers/${calendarKey}/expenses/${selectedDateFormatted}/${expenseId}`;

    const updatedExpense = {
      amount: newAmount,
      currency: newCurrency,
      description: newDescription,
    };

    update(ref(db, expensePath), updatedExpense)
      .then(() => {
        console.log("Expense updated successfully!");
        setExpenses((prevExpenses) => {
          return prevExpenses.map((expense) => {
            if (expense.id === expenseId) {
              return {
                ...expense,
                amount: newAmount,
                currency: newCurrency,
                description: newDescription,
              };
            }
            return expense;
          });
        });
      })
      .catch((error) => {
        console.error("Error updating expense: ", error);
      });

    setIsModalOpen(false);
  };

  const handleDeleteExpense = (expenseId) => {
    const db = getDatabase();
    const userId = user.uid;
    const expensePath = `user_db/${userId}/calendar_numbers/${calendarKey}/expenses/${selectedDateFormatted}/${expenseId}`;

    remove(ref(db, expensePath))
      .then(() => {
        console.log("Expense removed successfully!");
        setExpenses((prevExpenses) => {
          return prevExpenses.filter((expense) => expense.id !== expenseId);
        });
      })
      .catch((error) => {
        console.error("Error removing expense: ", error);
      });
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = (newTime, newPlan) => {
    const db = getDatabase();
    const userId = user.uid;
    const dataPath = `user_db/${userId}/calendar_numbers/${calendarKey}/${selectedDateFormatted}`;

    // 기존 시간의 일정 수정 또는 새 시간에 일정 추가
    const updates = {};
    updates[editingSchedule.time] = null; // 기존 시간의 일정 삭제
    updates[newTime] = newPlan; // 새 시간에 일정 추가

    update(ref(db, dataPath), updates)
      .then(() => {
        // 데이터 업데이트 후 UI 업데이트
        setIsModalOpen(false);
        setScheduleData((prevData) => ({
          ...prevData,
          [selectedDate]: {
            ...prevData[selectedDate],
            [newTime]: newPlan,
          },
        }));
      })
      .catch((error) => {
        console.error("업데이트 오류:", error);
      });
  };

  const handleDeleteSchedule = () => {
    const db = getDatabase();
    const userId = user.uid;
    const dataPath = `user_db/${userId}/calendar_numbers/${calendarKey}/${selectedDateFormatted}`;

    // 특정 시간의 일정을 삭제
    const scheduleRef = ref(db, `${dataPath}/${editingSchedule.time}`);
    remove(scheduleRef)
      .then(() => {
        // UI 업데이트를 위해 현재 상태에서 삭제된 일정 제거
        setScheduleData((prevData) => ({
          ...prevData,
          [selectedDate]: Object.fromEntries(
            Object.entries(prevData[selectedDate]).filter(
              ([time, _]) => time !== editingSchedule.time
            )
          ),
        }));
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("삭제 오류:", error);
      });
  };

  const handleDateClick = (date, time, plan) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const db = getDatabase();
      const userId = user.uid;

      const formattedDate = date.replace(/\./g, "-");

      const dataPath = `user_db/${userId}/calendar_numbers/${calendarKey}/${formattedDate}`;

      get(ref(db, dataPath))
        .then((snapshot) => {
          const existingData = snapshot.val() || {};
          existingData[time] = plan;

          update(ref(db, dataPath), existingData)
            .then(() => {
              get(ref(db, dataPath)).then((snapshot) => {
                if (snapshot.exists()) {
                  const schedule = snapshot.val();
                  const sortedSchedule = Object.fromEntries(
                    Object.entries(schedule).sort((a, b) => {
                      return parseFloat(a[0]) - parseFloat(b[0]);
                    })
                  );
                  setScheduleData((prevData) => ({
                    ...prevData,
                    [date]: sortedSchedule,
                  }));
                }
              });
            })
            .catch((error) => {
              console.error("업데이트 문제임:", error);
            });
        })
        .catch((error) => {
          console.error("가져오기 문제:", error);
          const newDateData = {
            [time]: plan,
          };
          set(ref(db, dataPath), newDateData)
            .then(() => {
              get(child(ref(db, dataPath)).get()).then((snapshot) => {
                if (snapshot.exists()) {
                  const schedule = snapshot.val();
                  setScheduleData((prevData) => ({
                    ...prevData,
                    [date]: schedule,
                  }));
                }
              });
            })
            .catch((error) => {
              console.error("데이터 업데이트 오류:", error);
            });
        });

      setSelectedDate(date);
    }
  };

  const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const openAddTodoModal = () => setIsAddTodoModalOpen(true);
  const openAddExpenseModal = () => setIsAddExpenseModalOpen(true);
  const closeAddTodoModal = () => setIsAddTodoModalOpen(false);
  const closeAddExpenseModal = () => setIsAddExpenseModalOpen(false);
  const handleAddTodoSave = (time, plan) => {
    if (user) {
      const db = getDatabase();
      const userId = user.uid;
      const schedulePath = `user_db/${userId}/calendar_numbers/${calendarKey}/${selectedDateFormatted}`;

      const newScheduleRef = ref(db, `${schedulePath}/${time}`);
      set(newScheduleRef, plan)
        .then(() => {
          console.log("Schedule added successfully!");
          // 로컬 상태 업데이트
          setScheduleData((prevData) => ({
            ...prevData,
            [selectedDate]: {
              ...prevData[selectedDate],
              [time]: plan,
            },
          }));
        })
        .catch((error) => {
          console.error("Error adding schedule: ", error);
        });
    }
  };

  const handleAddExpenseSave = (expenseData) => {
    if (user) {
      const db = getDatabase();
      const userId = user.uid;
      const expensePath = `user_db/${userId}/calendar_numbers/${calendarKey}/expenses/${selectedDateFormatted}`;
      const newExpenseRef = push(ref(db, expensePath));

      set(newExpenseRef, expenseData)
        .then(() => {
          console.log("Expense added successfully!");
          // Firebase에서 최신 expenses 데이터 가져와서 상태 업데이트
          const expensesRef = ref(
            db,
            `user_db/${userId}/calendar_numbers/${calendarKey}/expenses/${selectedDateFormatted}`
          );
          onValue(expensesRef, (snapshot) => {
            const expensesData = snapshot.val();
            if (expensesData) {
              const expensesWithId = Object.keys(expensesData).map((id) => ({
                id,
                ...expensesData[id],
              }));
              setExpenses(expensesWithId);
            } else {
              setExpenses([]);
            }
          });
        })
        .catch((error) => {
          console.error("Error adding expense: ", error);
        });
    }
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
            <span className="current_date">{selectedDate}</span>
            <button className="toggle_btn active">일정</button>

            <button className="toggle_btn" onClick={moveToMemo}>
              메모
            </button>
          </div>
          <div className="daily_details">
            <div className="schedule">
              <h2>
                Today's Schedule{" "}
                <button className="add_btn" onClick={openAddTodoModal}>
                  ADD
                </button>
              </h2>
              <div className="timeline_container">
                {selectedDate && scheduleData[selectedDate] ? (
                  Object.entries(scheduleData[selectedDate]).length > 0 ? (
                    Object.entries(scheduleData[selectedDate]).map(
                      ([time, plan]) => (
                        <div
                          className="timeline"
                          key={time}
                          onClick={() => handleEditClick(time, plan)}
                        >
                          <div
                            className="timeline_dot"
                            style={{ top: "25%" }}
                          ></div>
                          {time}
                          <div className="schedule_detail">
                            <input type="checkbox" />
                            {plan}
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <p>No schedule for the selected date.</p>
                  )
                ) : (
                  <p>Loading schedule...</p>
                )}
              </div>
            </div>
            <div className="expense">
              <h2>
                Today's Expense{" "}
                <button className="add_btn" onClick={openAddExpenseModal}>
                  ADD
                </button>
              </h2>
              {expenses.map((expense, index) => (
                <div
                  key={index}
                  onClick={() => handleEditExpenseClick(expense)}
                >
                  <div className="expense_item">
                    <span className="expense_money">
                      {getCurrencySymbol(expense.currency)}
                      {expense.amount}
                    </span>
                  </div>
                  <div className="expense_detail">{expense.description}</div>
                  <hr></hr>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <AddTodoModal
        isOpen={isAddTodoModalOpen}
        onClose={closeAddTodoModal}
        onSave={handleAddTodoSave}
      />

      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={closeAddExpenseModal}
        onSave={handleAddExpenseSave}
        availableCurrencies={availableCurrencies}
      />
      <EditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type={modalType}
        time={editingSchedule.time}
        plan={editingSchedule.plan}
        onSave={handleSaveChanges}
        onDelete={handleDeleteSchedule}
        onSaveExpense={handleSaveExpenseChanges}
        onDeleteExpense={handleDeleteExpense}
        expenseId={editingExpense.id}
        amount={editingExpense.amount}
        currency={editingExpense.currency}
        description={editingExpense.description}
      />
    </div>
  );
}

export default Planner;
