
// employeeIds -> should follow the d-type for empoyee id
export interface TypeCrew {
  vehicleId: number;
  employeeIds?: number[] | string[];
  date: Date | string;
}