
'use client'

import { useGetCrewEmployeeID } from "@/hooks/crew/useCrew"
import { useEffect } from "react";


export default function Page() {
  const { data: crews } = useGetCrewEmployeeID();
  console.log(' .... ', crews);

  useEffect(() => { }, [crews])

  return <div className=" container mx-auto p-6 " >
    <div >
      Crews
    </div>
  </div>
}