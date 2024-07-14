import React, { useState } from "react";
import hero from "../../public/hero.png";
function Banner() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <>
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 flex flex-col md:flex-row mt-10">
        <div className="w-full order-2 md:order-1 md:w-1/2 mt-12 md:mt-36">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold font-serif ">
              Crack the Code to Your Dream Job{" "}
              With<span className="text-orange-600"> LIVE Prep</span>
            </h1>
            <p className="text-sm md:text-lg font-serif">
              Real Questions, Real Companies, Real Success
            </p>
          </div>
        <button className="p-2 bg-cyan-600 text-white rounded-md mt-3" >  <a href="/course">Get Started</a></button>
 
       
        </div>
        <div className="order-1 w-full mt-20 md:w-1/2">
          <img
            src={hero}
            className="md:w-[550px] md:h-[350px] md:ml-12"
            alt=""
          />
        </div>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 w-[320px] h-[564px] md:w-auto md:h-auto bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="md:w-full md:h-screen w-[320px] h-[564px]  overflow-y-auto float-left">
            <button 
              onClick={closeDialog}
              className="float-right text-white bg-red-600 p-2 hover:bg-white hover:text-red-600 rounded-lg m-2"
            >
              close
            </button>
            <course />
          </div>
        </div>
      )}
    </>
  );
}

export default Banner;