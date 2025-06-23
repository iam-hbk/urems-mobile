import { MailIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUser, UserData } from "@/lib/auth/dal";
import { redirect } from "next/navigation";
import ChangePasswordForm from "@/components/changePasswordForm";

// Re-export UserData as EmployeeData for compatibility if needed elsewhere,
// but it's better to refactor other files to use UserData directly.
export type { UserData as EmployeeData };

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default async function EmployeeProfilePage() {
  const employeeData = await getUser();

  if (employeeData.isErr()) {
    // This will be caught by the middleware, but it's good practice to have it.
    redirect("/login");
  }

  const userData = employeeData.value;
  
  return (
    <div className="container mx-auto p-6">
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={`/placeholder.svg?height=80&width=80`}
              alt={userData.firstName}
            />
            <AvatarFallback>
              {getInitials(
                `${userData.firstName} ${userData.lastName}`,
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{`${userData.firstName} ${userData.lastName}`}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {userData.userName}
            </p>
            <Badge variant="secondary" className="mt-2 mr-2">
              {userData.role || "Role"}
            </Badge>
            <Badge variant="outline" className="mt-2 mr-2">
              {userData.employeeType || "Emp type"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="mt-4">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium">Gender</dt>
                  <dd className="capitalize">{userData.gender}</dd>
                </div>
                <div className="uppercase">
                  <dt className="font-medium">Initials</dt>
                  <dd>{userData.initials}</dd>
                </div>
              </dl>
            </TabsContent>
            <TabsContent value="contact" className="mt-4">
              <div className="mb-4">
                <h3 className="mb-2 font-medium">Contact</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Email</dt>
                    <dd className="flex items-center gap-2">
                      <a href={`mailto:${userData.email}`}>
                        <MailIcon className="h-4 w-4" />
                        {userData.email}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </TabsContent>
            <TabsContent value="settings" className="mt-4">
              <ChangePasswordForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
