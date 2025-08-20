"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { useCrewGetCurrentv1 } from "@/hooks/crew/useCrew";
import { crewShiftDate } from "@/utils/convert";
import { useEffect, useState } from "react";
import { typeShiftStatus } from "@/types/crew";

export default function CrewStatusSection() {
  const [shiftStatus, setShiftStatus] = useState<typeShiftStatus>('future');
  const { data, isLoading } = useCrewGetCurrentv1();

  useEffect(() => {
    if (data?.crew) {
      const now = new Date().getTime();
      const startTime = new Date(data.crew.startTime).getTime();
      const endTime = new Date(data.crew.endTime).getTime();

      if (now >= startTime && now <= endTime) {
        setShiftStatus('current');
      } else if (now < startTime) {
        setShiftStatus('future');
      } else {
        setShiftStatus('past');
      }
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 flex-col sm:flex-row">
        <div className="animate-pulse bg-gray-200 rounded-full px-4 py-2 h-8 w-32"></div>
        <div className="animate-pulse bg-gray-200 rounded-full px-4 py-2 h-8 w-32"></div>
        <div className="animate-pulse bg-gray-200 rounded-full px-4 py-2 h-8 w-24"></div>
      </div>
    );
  }

  if (!data?.crew) {
    return (
      <div className="">
        <Badge variant="outline" className="px-4 py-2">
          <Users className="w-4 h-4 mr-2" />
          No Crew / Shift
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 flex-col sm:flex-row">
      {/* start time */}
      <Badge 
        variant="outline"
        className={`px-4 py-2 ${
          shiftStatus === 'current' 
            ? 'bg-green-600 text-white' 
            : shiftStatus === 'future' 
            ? 'bg-orange-600 text-white' 
            : 'bg-gray-600 text-white'
        }`}
      >
        <Clock className="w-4 h-4 mr-2" />
        Start: {crewShiftDate(data.crew.startTime)}
      </Badge>
      
      {/* end time */}
      <Badge variant="outline" className="px-4 py-2 bg-red-600 text-white">
        <Clock className="w-4 h-4 mr-2" />
        End: {crewShiftDate(data.crew.endTime)}
      </Badge>
      
      <Badge variant="outline" className="px-4 py-2">
        <Users className="w-4 h-4 mr-2" />
        Crew: {data.employees.length}
      </Badge>
    </div>
  );
}
