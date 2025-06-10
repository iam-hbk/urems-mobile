"use client";
import { usePrfForms } from "@/hooks/prf/usePrfForms";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "@/components/loading";
import { apiGetCrewEmployeeID } from "@/lib/api/crew-apis";
import { TypeCrew } from "@/interfaces/crew";
import { useZuStandCrewStore } from "@/lib/zuStand/crew";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Circle, AlertCircle } from "lucide-react";
import {
  ChartContainer,
  PieChart,
  Pie,
  Cell,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useGetEmployeeInformation } from "@/hooks/employee/useEmployee";

// Mock TODO data
const todoData = [
  { name: "Completed", value: 3 },
  { name: "Remaining", value: 2 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

// Mock tasks for display
const tasks = [
  { title: "Vehicle Inspection", status: "completed" },
  { title: "Equipment Check", status: "completed" },
  { title: "Medication Stock", status: "completed" },
  { title: "Shift Handover", status: "pending" },
  { title: "Daily Report", status: "pending" },
];

// Mock inventory alerts
const inventoryAlerts = [
  {
    item: "Oxygen Tank",
    status: "low",
    details: "2/4 tanks remaining",
    priority: "high"
  },
  {
    item: "Morphine",
    status: "expiring",
    details: "Expires in 30 days",
    priority: "medium"
  },
  {
    item: "Bandages",
    status: "low",
    details: "20% remaining",
    priority: "low"
  },
];

// Mock active cases
const activeCases = [
  {
    id: "PRF-2024-001",
    type: "Emergency",
    assignedTo: "Jane Smith",
    status: "In Progress",
    location: "Central Hospital"
  },
  {
    id: "PRF-2024-002",
    type: "Transfer",
    assignedTo: "John Doe",
    status: "En Route",
    location: "Memorial Hospital"
  }
];

// Helper function to get initials
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export default function Home() {
  const [view, setView] = useState<"table" | "summary">("table");
  const { data: prfs_, error, isLoading } = usePrfForms();
  const { zsSetEmployee } = useZuStandEmployeeStore();
  const { zsSetCrewID } = useZuStandCrewStore();
  const { data: session, loading: authLoading, sessionToken } = authClient.useSession();
  const { data: employeeData, } = useGetEmployeeInformation();


  // Use React Query for crew information
  const { data: crewData, error: crewError } = useQuery<TypeCrew | null, Error>(
    {
      queryKey: ["crew", session?.user.employeeNumber],
      queryFn: async () => {
        if (!session?.user.employeeNumber) return null;
        const res = await apiGetCrewEmployeeID(
          session.user.employeeNumber.toString(),
        );
        if (res?.data) {
          const todaysCrew = res.data.filter(
            (i: TypeCrew) =>
              new Date(i.date).toLocaleDateString() ===
              new Date().toLocaleDateString(),
          );
          return todaysCrew[0] || null;
        }
        return null;
      },
      enabled: !!session?.user.employeeNumber,
    },
  );

  // Handle crew data changes
  useEffect(() => {
    if (crewData) {
      zsSetCrewID(crewData.vehicleId);
    } else if (crewData === null && session) {
      toast.info("No crew assigned for today");
    }
  }, [crewData, session]);

  // Handle crew error
  useEffect(() => {
    if (crewError) {
      toast.error(`Error getting crew information: ${crewError.message}`);
    }
  }, [crewError]);

  // Set employee data in store
  useEffect(() => {
    if (employeeData) {
      zsSetEmployee(employeeData);
    }
  }, [session, employeeData]);

  // Show loading state
  if (authLoading) {
    return <LoadingComponent message="Checking authentication..." />;
  }

  // Check authentication
  if (!session?.user) {
    return <LoadingComponent message="Redirecting to login..." />;
  }

  // Show loading state for PRF data
  if (isLoading) {
    return <LoadingComponent message="Loading PRF data..." />;
  }

  if (!prfs_) {
    return <div>No PRFs found</div>;
  }

  return (
    <main className="flex min-h-screen w-full flex-col gap-6 p-6">
      {/* Welcome Header */}
      <div className="rounded-lg border bg-card p-4 text-center">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Welcome to Romeo 1
        </h1>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* TODO Status Card */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/50 pb-4">
            <CardTitle className="text-xl">TODOs</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 p-6">
            <div className="relative">
              <ChartContainer className="h-40 w-40" config={{}}>
                <PieChart>
                  <Pie
                    data={todoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={48}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {todoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold">{Math.round((todoData[0].value / (todoData[0].value + todoData[1].value)) * 100)}%</span>
              </div>
            </div>
            <div className="w-full space-y-2">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-md border p-2 ${task.status === 'completed' ? 'bg-primary/5 border-primary/20' : 'bg-muted/5'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Circle className={`h-2 w-2 ${task.status === 'completed' ? 'fill-primary' : 'fill-muted'}`} />
                    <span className={`text-sm ${task.status === 'completed' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      {task.title}
                    </span>
                  </div>
                  <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Crew Status Card */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/50 pb-4">
            <CardTitle className="text-xl">Crew Members</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.person.firstName}${session.user.person.lastName}`}
                    alt={`${session.user.person.firstName} ${session.user.person.lastName}`}
                  />
                  <AvatarFallback>
                    {getInitials(`${session.user.person.firstName} ${session.user.person.lastName}`)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">{session.user.person.firstName} {session.user.person.lastName}</span>
                    <span className="text-sm text-muted-foreground">HPCA: {session.user.employeeNumber || 'N/A'}</span>
                  </div>
                  <Badge variant="outline">{session.user.employeeType?.typeDescription || 'N/A'}</Badge>
                </div>
              </li>
              {/* Example additional crew members */}
              <li className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=JaneSmith`}
                    alt="Jane Smith"
                  />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">Jane Smith</span>
                    <span className="text-sm text-muted-foreground">HPCA: 12345</span>
                  </div>
                  <Badge variant="outline">Paramedic</Badge>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe`}
                    alt="John Doe"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-medium">John Doe</span>
                    <span className="text-sm text-muted-foreground">HPCA: 67890</span>
                  </div>
                  <Badge variant="outline">EMT</Badge>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Inventory Status Card */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/50 pb-4">
            <CardTitle className="text-xl">Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {inventoryAlerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertCircle className={`h-4 w-4 flex-shrink-0 ${alert.priority === 'high' ? 'text-destructive' :
                    alert.priority === 'medium' ? 'text-orange-500' :
                      'text-muted-foreground'
                    }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{alert.item}</p>
                      <Badge variant={
                        alert.priority === 'high' ? 'destructive' :
                          alert.priority === 'medium' ? 'default' :
                            'secondary'
                      }>
                        {alert.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.details}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <h3 className="mb-2 font-semibold">Active Cases</h3>
                {activeCases.map((case_, index) => (
                  <div key={index} className="mb-2 rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{case_.id}</span>
                      <Badge>{case_.type}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Assigned to: {case_.assignedTo}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{case_.location}</span>
                      <Badge variant="secondary">{case_.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Create PRF Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-xl">Create PRF</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Create a new Patient Report Form for the current case
            </p>
            <Button asChild className="w-full">
              <Link href="/create-prf">Create New</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Complete Checklist Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-xl">Complete Checklist</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Review and complete the required checklists
            </p>
            <Button asChild className="w-full">
              <Link href="/checklists">View Checklists</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Complete DOD Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-xl">Complete DOD</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Fill out the Daily Operations Documentation
            </p>
            <Button asChild className="w-full">
              <Link href="/dod">Start DOD</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
