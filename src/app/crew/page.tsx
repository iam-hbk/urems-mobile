
'use client'

import LoadingComponent from "@/components/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCrewEmployeeID } from "@/hooks/crew/useCrew"
import { typeCrewEmployee, typeCrewInfoV1 } from "@/types/crew";
import { AvatarProfileImage } from "@/utils/constant";
import { crewShiftDate, crewShiftStatus } from "@/utils/convert";
import { CalendarDays, Users } from "lucide-react";
import { useEffect } from "react";


export default function Page() {
  const { data: crews, isLoading } = useGetCrewEmployeeID();

  useEffect(() => { }, [crews])

  if (isLoading) {
    return <LoadingComponent />
  }

  return <div className=" container mx-auto p-6 " >
    {
      crews && crews.length > 0 ?
        <div className=" flex flex-col gap-[1rem] " >
          {
            crews.map((crew: typeCrewInfoV1, idx: number) => {

              const crewStatus = crewShiftStatus(crew.crew.startTime, crew.crew.endTime);
              const crewStatusColor = crewStatus === 'current' ? 'text-green-600'
                : crewStatus === 'future' ? 'text-orange-600'
                  : crewStatus === 'past' ? 'text-red-600' : null

              return <Card key={idx} className="col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${crewStatusColor} `} >
                      <Users className="w-5 h-5" />
                      Crew Members
                    </div>
                    <div className=" flex flex-row gap-[1rem] items-center " >
                      <div className={` flex flex-row gap-[1rem] items-center ${crewStatusColor}`} >
                        <CalendarDays />
                        <span className=" text-[1rem] " >
                          {crewShiftDate(crew.crew.startTime)}
                        </span>
                      </div>
                      <span className=" text-[1rem] text-red-600 " >{
                        crewShiftDate(crew.crew.endTime)}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className=" flex flex-col gap-y-[1rem] sm:flex-row sm:gap-x-[1rem]  ">
                    {crew && crew.employees.map((member: typeCrewEmployee, index) => (
                      <div key={index} className=" w-full sm:w-[50%] md:w-[32%] flex items-center gap-4 border rounded-lg p-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={AvatarProfileImage} />
                          <AvatarFallback className="uppercase ">{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium capitalize ">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{"Role"}</div>
                          <div className="text-sm text-gray-500">HPCA: {'hpcaNumber'}</div>
                          <Badge variant={"default"} className="mt-2">
                            {'Default'}
                          </Badge>
                          {/* <Badge variant={member.status === "On Duty" ? "default" : "secondary"} className="mt-2">
                          {member.status}
                        </Badge> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            })
          }
        </div>
        :
        <div className=" text-center text-[1.5rem] " >
          No Employee Crews Found
        </div>
    }
  </div>
}