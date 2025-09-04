"use client";

import { useQuery, useQueries, type UseQueryResult, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { apiGetCrewEmployeeID } from "@/lib/api/crew-apis";
import { apiGetUserInformation } from "@/lib/api/apiEmployee";
import { useSessionQuery } from "@/hooks/auth/useSession";
import { useZuStandCrewStore } from "@/lib/zuStand/crew";
import { TypeCrew } from "@/interfaces/crew";
import { UserData } from "@/lib/auth/dal";
import type { ApiError } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase();

export function CrewStatus() {
  const { zsSetCrewID } = useZuStandCrewStore();
  const { data: session } = useSessionQuery();

  const { data: crewData, isLoading: isLoadingCrew } = useQuery<TypeCrew | null, ApiError>({
    queryKey: ["crew", session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const res = await apiGetCrewEmployeeID(session.user.id);
      return res.match(
        (crews) => {
          const todaysCrew = crews.find(
            (i: TypeCrew) => new Date(i.date).toLocaleDateString() === new Date().toLocaleDateString()
          );
          return todaysCrew || null;
        },
        (e) => {
          throw e;
        }
      );
    },
    enabled: !!session?.user.id,
  });

  const employeeIds = crewData?.employeeIds || [];
  const crewMemberQueries = useQueries({
    queries: employeeIds.map((id) => ({
      queryKey: ["employee", id],
      queryFn: async (): Promise<UserData> => {
        const result = await apiGetUserInformation(id.toString());
        return result.match(
          (user) => user,
          (e) => {
            throw e;
          }
        );
      },
      enabled: !!id,
    })) as UseQueryOptions<UserData, ApiError>[],
  }) as UseQueryResult<UserData, ApiError>[];

  const isLoadingMembers = crewMemberQueries.some(q => q.isLoading);

  useEffect(() => {
    if (crewData) {
      zsSetCrewID(crewData.vehicleId);
    } else if (crewData === null && session?.user && !isLoadingCrew) {
      toast.info("No crew assigned for today");
    }
  }, [crewData, session, isLoadingCrew, zsSetCrewID]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/50 pb-4">
        <CardTitle className="text-xl">Crew Members</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {(isLoadingCrew || isLoadingMembers) && (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-3 w-2/5" />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!isLoadingCrew && !isLoadingMembers && crewMemberQueries.length > 0 && (
          <ul className="space-y-4">
            {crewMemberQueries.map((query) => {
              if (!query.data) return null;
              const employee = query.data;
              return (
                <li key={employee.id} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.firstName}${employee.lastName}`}
                      alt={`${employee.firstName} ${employee.lastName}`}
                    />
                    <AvatarFallback>
                      {getInitials(`${employee.firstName} ${employee.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-medium">{`${employee.firstName} ${employee.lastName}`}</span>
                      <span className="text-sm text-muted-foreground">{employee.email || 'No email'}</span>
                    </div>
                    <Badge variant="outline">Crew</Badge>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {!isLoadingCrew && crewData?.employeeIds?.length === 0 && (
            <p className="text-sm text-muted-foreground">No crew members assigned.</p>
        )}

        {!isLoadingCrew && !crewData && (
            <p className="text-sm text-muted-foreground">No crew assigned for today.</p>
        )}
      </CardContent>
    </Card>
  );
} 