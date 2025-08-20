"use client";

import Image from "next/image";
import React from "react";

interface LoadingComponentProps {
  message?: string;
}

export default function LoadingComponent({
  message = "Loading...Datas",
}: LoadingComponentProps) {
  return (
    <div className=" h-screen flex flex-col justify-center items-center ">
      <Image
        src="/urems-erp.png"
        alt="UREMS ERP"
        width={100}
        height={100}
        className="animate-ping"
      />
      <p className="mt-[0.7rem] text-xl text-black">{message}</p>
    </div>
  );
}
