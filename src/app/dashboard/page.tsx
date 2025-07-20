"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Ambulance,
  Clipboard,
  FileText,
  AlertTriangle,
  Clock,
  Users
} from "lucide-react";
import { useCrewGetCurrent } from "@/hooks/crew/useCrew";
import LoadingComponent from "@/components/loading";
import { crewShiftDate, crewShiftStatus } from "@/utils/convert";
import { useEffect, useState } from "react";
import { typeShiftStatus } from "@/types/crew";

const todoData = [
  { name: "Completed", value: 5, color: "#4ade80" },
  { name: "Pending", value: 3, color: "#f87171" },
  { name: "In Progress", value: 2, color: "#60a5fa" },
];

const crewMembers = [
  {
    name: "Dr. Sarah Johnson",
    role: "Lead Paramedic",
    hpcaNumber: "HP12345",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=frank",
    status: "On Duty"
  },
  {
    name: "James Wilson",
    role: "EMT",
    hpcaNumber: "HP67890",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=paul",
    status: "On Duty"
  },
  {
    name: "Maria Garcia",
    role: "Emergency Nurse",
    hpcaNumber: "HP11223",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    status: "Break"
  }
];

const avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=frank"

const inventoryItems = [
  {
    name: "Oxygen Tanks",
    current: 2,
    required: 5,
    priority: "High",
    status: "Critical"
  },
  {
    name: "Morphine",
    current: 8,
    required: 10,
    priority: "Medium",
    status: "Warning"
  },
  {
    name: "Bandages",
    current: 45,
    required: 50,
    priority: "Low",
    status: "Good"
  }
];

const activeCases = [
  {
    id: "PRF-2024-001",
    patient: "John Doe",
    status: "In Progress",
    priority: "High",
    timeElapsed: "45m"
  },
  {
    id: "PRF-2024-002",
    patient: "Jane Smith",
    status: "Pending",
    priority: "Medium",
    timeElapsed: "15m"
  }
];


export default function DashboardPage() {
  const [shiftStatus, setShiftStatus] = useState<typeShiftStatus>('future');
  const { data, isLoading } = useCrewGetCurrent();

  useEffect(() => {
    if (data) {
      setShiftStatus(
        crewShiftStatus(data[0].startTime, data[0].endTime)
      );
    }
  }, [data])

  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8 sm:flex-row sm:gap-y-0 gap-y-[1rem] flex-col">
        <h1 className="text-3xl font-bold">Welcome to Romeo 1</h1>
        {
          data ? <div className="flex items-center gap-4 flex-col sm:flex-row ">
            {/* start time */}
            <Badge variant="outline"
              className={`px-4 py-2 ${shiftStatus === 'current' ? 'bg-green-600 text-white' : shiftStatus === 'future' ? 'bg-orange-600 text-white' : 'bg-white'} `}>
              <Clock className={`w-4 h-4 mr-2`} />
              Shift: {`${crewShiftDate(data[0].startTime)}`}
            </Badge>
            {/* end time */}
            <Badge variant="outline"
              className={`px-4 py-2 bg-red-600 text-white`}>
              <Clock className={`w-4 h-4 mr-2`} />
              Shift: {`${crewShiftDate(data[0].endTime)}`}
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Crew: 1/3
            </Badge>
          </div>
            :
            <div className="" >
              <Badge variant="outline" className="px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                No Crew / Shift
              </Badge>
            </div>}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Action Cards */}
        <Card className="col-span-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <button className="flex items-center justify-center gap-3 bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                <FileText className="w-6 h-6" />
                <span className="font-medium">Create PRF</span>
              </button>
              <button className="flex items-center justify-center gap-3 bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                <Clipboard className="w-6 h-6" />
                <span className="font-medium">Complete Checklist</span>
              </button>
              <button className="flex items-center justify-center gap-3 bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                <Ambulance className="w-6 h-6" />
                <span className="font-medium">Complete DOD</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* TODOs Section */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clipboard className="w-5 h-5" />
              TODOs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={todoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={40}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {todoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {todoData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Status */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.name}</span>
                    <Badge variant={
                      item.status === "Critical" ? "destructive" :
                        item.status === "Warning" ? "secondary" : "default"
                    }>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{item.current}/{item.required}</span>
                    <span>•</span>
                    <span>Priority: {item.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Cases */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Active Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCases.map((case_, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{case_.id}</span>
                    <Badge variant={
                      case_.priority === "High" ? "destructive" :
                        case_.priority === "Medium" ? "secondary" : "default"
                    }>
                      {case_.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>{case_.patient}</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{case_.timeElapsed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Crew Members */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Crew Members
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className=" flex flex-col gap-y-[1rem] sm:flex-row sm:gap-x-[1rem]  ">
              {data && data.map((member, index) => (
                <div key={index} className=" w-[32%] flex items-center gap-4 border rounded-lg p-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={avatar} />
                    <AvatarFallback className="uppercase ">{member.employee.person.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium capitalize ">
                      {member.employee.person.firstName} {member.employee.person.lastName}
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
      </div>
    </div >
  );
} 