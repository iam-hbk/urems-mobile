"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Ambulance,
  Clipboard,
  FileText,
  AlertTriangle,
  Clock
} from "lucide-react";
import CrewStatusSection from "@/components/crew/CrewStatusSection";
import CrewMembersSection from "@/components/crew/CrewMembersSection";
import { activeCases, inventoryItems, todoData } from "@/utils/constant";

export default function DashboardPage() {



  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8 sm:flex-row sm:gap-y-0 gap-y-[1rem] flex-col">
        <h1 className="text-3xl font-bold">Welcome</h1>
        <CrewStatusSection />
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
        <CrewMembersSection />
      </div>
    </div >
  );
} 