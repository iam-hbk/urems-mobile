"use client";

import { DetailedFormResponse, FormTemplateSummary } from "@/types/form-template";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Calendar, Clock, User, Truck, Users, Building } from "lucide-react";

interface ResponseMetaCardProps {
  response?: DetailedFormResponse;
  template: FormTemplateSummary;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString();
  } catch (error) {
    return "Invalid Date";
  }
};

export function ResponseMetaCard({ response, template }: ResponseMetaCardProps) {
  const MetaItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) => (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );

  if (!response) {
    return (
      <Card className="bg-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">
                  {template.title}
                </h3>
                <Badge variant="secondary" className="bg-gray-500 hover:bg-gray-600">
                  Loading...
                </Badge>
              </div>
              <div className="space-y-2">
                <MetaItem
                  icon={Calendar}
                  label="Created"
                  value="Loading..."
                />
                <MetaItem
                  icon={Clock}
                  label="Last Updated"
                  value="Loading..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-muted-foreground">Identifiers</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>
              <MetaItem
                icon={User}
                label="Patient ID"
                value="Loading..."
              />
              <MetaItem
                icon={Truck}
                label="Vehicle ID"
                value="Loading..."
              />
              <MetaItem
                icon={Users}
                label="Crew ID"
                value="Loading..."
              />
              <MetaItem
                icon={Building}
                label="Employee ID"
                value="Loading..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {template.title}
              </h3>
              {response.isCompleted ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  <CheckCircle className="mr-1 h-3 w-3" /> Completed
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">
                  <XCircle className="mr-1 h-3 w-3" /> In Progress
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <MetaItem
                icon={Calendar}
                label="Created"
                value={formatDate(response.createdAt)}
              />
              <MetaItem
                icon={Clock}
                label="Last Updated"
                value={formatDate(response.updatedAt)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-muted-foreground">Identifiers</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>
            <MetaItem
              icon={User}
              label="Patient ID"
              value={response.patientId || "N/A"}
            />
            <MetaItem
              icon={Truck}
              label="Vehicle ID"
              value={response.vehicleId || "N/A"}
            />
            <MetaItem
              icon={Users}
              label="Crew ID"
              value={response.crewId || "N/A"}
            />
            <MetaItem
              icon={Building}
              label="Employee ID"
              value={response.employeeId || "N/A"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 