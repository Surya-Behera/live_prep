import React from "react";
import Home from "./home/Home";
import { Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import Course from "./Course/Courses";

function App() {
  return (
    <>
      <div className="dark:bg-slate-900 dark:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course" element={<Course/>} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
