import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import  VoiceInput from "../components/VoiceInput"
function Courses() {
  return (
    <>
      <Navbar />
      <div className=" min-h-screen p-10 mt-10">
      <VoiceInput/>
      </div>
      <Footer />
    </>
  );
}

export default Courses;
