"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useCrewGetCurrentv1 } from "@/hooks/crew/useCrew";
import { typeCrewEmployee } from "@/types/crew";
import { AvatarProfileImage } from "@/utils/constant";

export default function CrewMembersSection() {
  const { data, isLoading } = useCrewGetCurrentv1();

  const renderLoadingSkeleton = () => (
    <div className="flex flex-col gap-y-4 sm:flex-row sm:gap-x-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="w-full sm:w-[50%] md:w-[32%] flex items-center gap-4 border rounded-lg p-4">
          <div className="animate-pulse bg-gray-200 rounded-full w-12 h-12"></div>
          <div className="flex-1">
            <div className="animate-pulse bg-gray-200 h-4 w-32 mb-2 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-3 w-20 mb-1 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-3 w-24 mb-2 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500">No crew members assigned</p>
    </div>
  );

  const renderCrewMembers = () => (
    <div className="flex flex-col gap-y-4 sm:flex-row sm:gap-x-4">
      {data?.employees.map((member: typeCrewEmployee, index) => (
        <div key={index} className="w-full sm:w-[50%] md:w-[32%] flex items-center gap-4 border rounded-lg p-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={AvatarProfileImage} />
            <AvatarFallback className="uppercase">
              {member.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium capitalize">
              {member.firstName} {member.lastName}
            </div>
            <div className="text-sm text-gray-500">Role</div>
            <div className="text-sm text-gray-500">HPCA: hpcaNumber</div>
            <Badge variant="default" className="mt-2">
              Default
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Crew Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading 
          ? renderLoadingSkeleton() 
          : !data?.employees || data.employees.length === 0 
          ? renderEmptyState() 
          : renderCrewMembers()
        }
      </CardContent>
    </Card>
  );
}
