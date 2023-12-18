import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import List from "./pages/List";
import Signup from "./pages/Signup";
import List_guest from "./pages/List_guest";

import Planner from "./pages/Planner";
import Memo from "./pages/Memo";

class Routing extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/list" element={<List />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/list_guest" element={<List_guest />} />

          <Route exact path="/planner/:calendarKey" element={<Planner />} />
          <Route exact path="/memo/:calendarKey" element={<Memo />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default Routing;
