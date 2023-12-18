import React, { Component } from "react";
import "../css/Calendar.css";

class Calendar extends Component {
  static defaultProps = {
    imageURL: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
  }

  getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  handlePrevMonth = () => {
    const { date } = this.state;
    this.setState({
      date: new Date(date.getFullYear(), date.getMonth() - 1),
    });
  };

  handleNextMonth = () => {
    const { date } = this.state;
    this.setState({
      date: new Date(date.getFullYear(), date.getMonth() + 1),
    });
  };

  handleCellClick = (day) => {
    const { date } = this.state;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const selectedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    this.props.onDateSelect(selectedDate);
  };

  render() {
    const { date } = this.state;
    const month = date.getMonth();
    const year = date.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = this.getDaysInMonth(month, year);
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

    let weeks = [];
    let week = [];

    // 해당 월의 첫 날의 요일에 따라 빈 칸 삽입
    for (let i = 0; i < firstDay; i++) {
      week.push(<div key={i + "empty"} className="day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(
        <div key={day} className="day">
          <div
            className="date_number"
            onClick={() => this.handleCellClick(day)}
          >
            {day}
          </div>
          <img src={this.props.imageURL[day]} alt="" className="day_image" />
        </div>
      ); // 달력 안에 이미지 받을 때 사용(나중에 수정 좀 해야할듯)

      if ((day + firstDay) % 7 === 0 || day === daysInMonth) {
        // 해당 월의 마지막 날짜와 같을 경우 빈 칸 채우기
        while (week.length < 7) {
          week.push(
            <div key={day + week.length + "empty"} className="day empty"></div>
          );
        }

        weeks.push(
          <div key={day + "week"} className="week">
            {week}
          </div>
        );
        week = [];
      }
    }

    return (
      <div className="calendar">
        <div className="header">
          <button className="arrow left" onClick={this.handlePrevMonth}>
            &#x25C0; {month === 0 ? 12 : month}월
          </button>
          {month + 1}월 {year}
          <button className="arrow right" onClick={this.handleNextMonth}>
            {month === 11 ? 1 : month + 2}월 &#x25B6;
          </button>
        </div>
        <div className="day_names">
          {dayNames.map((day, index) => (
            <div
              key={index}
              className="day_name"
              onClick={this.handleCellClick}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="weeks">{weeks}</div>
      </div>
    );
  }
}

export default Calendar;
