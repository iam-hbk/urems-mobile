import { typeShiftStatus } from "@/types/crew";

export function crewShiftDate(date_: string): string {
  const today = new Date(date_);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const hours = String(today.getHours()).padStart(2, '0');
  const minutes = String(today.getMinutes()).padStart(2, '0');

  // const customFormat = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}`;
  const customFormat = `${day}-${month}-${year} ${hours}:${minutes}`;
  return customFormat;
}

export function extractTime(date_: string) {
  const d = new Date(date_)
  const hrs = d.getHours().toString().padStart(2, '0')
  const min = d.getMinutes().toString().padStart(2, '0')
  return `${hrs}:${min}`
}

export function crewShiftStatus(stime: string, etime: string)
  : typeShiftStatus {

  const sdate = new Date(stime).getTime()
  const edate = new Date(etime).getTime()
  const currentTime = new Date().getTime()

  if (currentTime >= sdate && currentTime <= edate) return 'current'
  else if (currentTime < sdate) return 'future'
  else if (currentTime > sdate) return 'past'
  return 'unknown'
}