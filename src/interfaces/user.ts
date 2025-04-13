export type User = {
  id: string;
  name: string;
  email: string;
  hpcsaNumber: string;
  signature: string;
  role: "paramedic" | "admin";
  qualification: string;
  baseLocation: string;
}; 