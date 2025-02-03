"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  CarIcon,
  IdCardIcon,
  Loader,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { UREM__ERP_API_BASE } from "@/lib/wretch";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";
import LoadingComponent from "@/components/loading";

interface ContactDetails {
  cellNumber: string;
  email: string;
  telephoneNumber: string;
  contactDetailsType: number;
  contactDetailsTypeNavigation: {
    typeDescription: string;
  };
}

interface PersonIdentification {
  isPrimary: boolean;
  identification: {
    identification1: string;
    identificationType: {
      identificationType1: string;
    };
  };
}

interface Person {
  personId: number;
  firstName: string;
  secondName: string;
  lastName: string;
  dateOfBirth: string;
  initials: string;
  gender: string;
  personContactDetails: Array<{
    isPrimary: boolean;
    contactDetails: ContactDetails;
  }>;
  personIdentifications: PersonIdentification[];
}

interface EmployeeType {
  employeeTypeId: number;
  typeDescription: string;
}

interface VehicleDto {
  vehicleId?: number;
  vehicleName: string;
  vehicleLicense: string;
  vehicleRegistrationNumber: string;
  VINNumber: string;
  vehicleTypeID: number;
}

export interface EmployeeData {
  employeeNumber: number;
  employeeType: EmployeeType;
  person: Person;
  assignedVehicle: VehicleDto | null;
}

export default function EmployeeProfile() {
  const { zsSetEmployee } = useZuStandEmployeeStore()
  const [activeTab, setActiveTab] = useState("personal");

  const {
    data: employeeData,
    isLoading,
    error,
  } = useQuery<EmployeeData>({
    queryKey: ["employeeData", "2"],
    queryFn: async () => {
      const response = await fetch(
        `${UREM__ERP_API_BASE}/api/Employee/EmployeeWithDetails/2`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (employeeData) {
      console.log(employeeData);
      zsSetEmployee(employeeData);
    }
  }, [employeeData, zsSetEmployee]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (<LoadingComponent message="Setting up your profile..." />);
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  if (!employeeData) {
    return <p>No data found</p>;
  }


  return (
    <div className="container mx-auto p-6">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={`/placeholder.svg?height=80&width=80`}
              alt={employeeData.person.firstName}
            />
            <AvatarFallback>
              {getInitials(
                `${employeeData.person.firstName} ${employeeData.person.lastName}`,
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{`${employeeData.person.firstName} ${employeeData.person.lastName}`}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Employee #{employeeData.employeeNumber}
            </p>
            <Badge variant="secondary" className="mt-2">
              {employeeData.employeeType.typeDescription}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="mt-4">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium">Date of Birth</dt>
                  <dd className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {format(
                      new Date(employeeData.person.dateOfBirth),
                      "MMMM d, yyyy",
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Gender</dt>
                  <dd className="capitalize">{employeeData.person.gender}</dd>
                </div>
                <div>
                  <dt className="font-medium">Initials</dt>
                  <dd>{employeeData.person.initials}</dd>
                </div>
                {employeeData.person.personIdentifications.map((id, index) => (
                  <div key={index}>
                    <dt className="font-medium">
                      {id.identification.identificationType.identificationType1}
                    </dt>
                    <dd className="flex items-center gap-2">
                      <IdCardIcon className="h-4 w-4" />
                      {id.identification.identification1}
                    </dd>
                  </div>
                ))}
              </dl>
            </TabsContent>
            <TabsContent value="contact" className="mt-4">
              {employeeData.person.personContactDetails.map(
                (contact, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="mb-2 font-medium">
                      {
                        contact.contactDetails.contactDetailsTypeNavigation
                          .typeDescription
                      }{" "}
                      Contact
                    </h3>
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm text-muted-foreground">Email</dt>
                        <dd className="flex items-center gap-2">
                          <MailIcon className="h-4 w-4" />
                          {contact.contactDetails.email}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">
                          Cell Number
                        </dt>
                        <dd className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4" />
                          {contact.contactDetails.cellNumber}
                        </dd>
                      </div>
                      {contact.contactDetails.telephoneNumber && (
                        <div>
                          <dt className="text-sm text-muted-foreground">
                            Telephone
                          </dt>
                          <dd className="flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4" />
                            {contact.contactDetails.telephoneNumber}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                ),
              )}
            </TabsContent>
            <TabsContent value="vehicle" className="mt-4">
              {employeeData.assignedVehicle ? (
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="font-medium">Vehicle Name</dt>
                    <dd className="flex items-center gap-2">
                      <CarIcon className="h-4 w-4" />
                      {employeeData.assignedVehicle.vehicleName}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">License</dt>
                    <dd>{employeeData.assignedVehicle.vehicleLicense}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Registration Number</dt>
                    <dd>
                      {employeeData.assignedVehicle.vehicleRegistrationNumber}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">VIN Number</dt>
                    <dd>{employeeData.assignedVehicle.VINNumber}</dd>
                  </div>
                </dl>
              ) : (
                <p>No vehicle assigned</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
