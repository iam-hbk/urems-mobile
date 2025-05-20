"use client";

import { DetailedFormResponse } from "@/types/form-template";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Calendar, Clock, User, Truck, Users, Building } from "lucide-react";

interface ResponseMetaCardProps {
  data: DetailedFormResponse;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString();
  } catch (error) {
    return "Invalid Date";
  }
};

export function ResponseMetaCard({ data }: ResponseMetaCardProps) {
  const MetaItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) => (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );

  return (
    <Card className="bg-card">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {data.formTemplate?.title || "Untitled Form"}
              </h3>
              {data.isCompleted ? (
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
                value={formatDate(data.createdAt)}
              />
              <MetaItem
                icon={Clock}
                label="Last Updated"
                value={formatDate(data.updatedAt)}
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
              value={data.patientId || "N/A"}
            />
            <MetaItem
              icon={Truck}
              label="Vehicle ID"
              value={data.vehicleId || "N/A"}
            />
            <MetaItem
              icon={Users}
              label="Crew ID"
              value={data.crewId || "N/A"}
            />
            <MetaItem
              icon={Building}
              label="Employee ID"
              value={data.employeeId || "N/A"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 