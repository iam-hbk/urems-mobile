'use client'

import { Loader } from "lucide-react";
import React from "react";

interface LoadingComponentProps {
  message?: string;
}

export default function LoadingComponent({ message = "Loading..." }: LoadingComponentProps) {
  return (
    <div className="absolute text-center w-full top-0 bottom-0 inset-0 flex flex-col items-center justify-center bg-white "
      // this css works
      style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", justifyContent: "center", textAlign: "center", justifyItems: "center", display: "flex", position: "absolute", top: 0, bottom: 0 }}
    >
      {/* <div style={{ width: '40px', height: '40px', textAlign: 'center', border: '4px solid black', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginLeft: "auto", marginRight: "auto" }}></div> */}
      {/*  */}
      <Loader className="animate-spin" size={50} />

      <p className="text-black text-xl mt-[0.7rem] ">{message}</p>
    </div>
  );
};