
export const cookieNameUserId = 'user_id';
export const cookieNameAccessToken = 'access_token';

export const EMPLOYEE_TYPE = {
  1: 'Full Time',
  2: 'Part Time',
  3: 'Contract'
} as const;

export const crewMembers = [
  {
    name: "Dr. Sarah Johnson",
    role: "Lead Paramedic",
    hpcaNumber: "HP12345",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=frank",
    status: "On Duty"
  },
  {
    name: "James Wilson",
    role: "EMT",
    hpcaNumber: "HP67890",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=paul",
    status: "On Duty"
  },
  {
    name: "Maria Garcia",
    role: "Emergency Nurse",
    hpcaNumber: "HP11223",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    status: "Break"
  }
];

export const todoData = [
  { name: "Completed", value: 5, color: "#4ade80" },
  { name: "Pending", value: 3, color: "#f87171" },
  { name: "In Progress", value: 2, color: "#60a5fa" },
];

export const AvatarProfileImage = "https://api.dicebear.com/7.x/avataaars/svg?seed=mike"

export const inventoryItems = [
  {
    name: "Oxygen Tanks",
    current: 2,
    required: 5,
    priority: "High",
    status: "Critical"
  },
  {
    name: "Morphine",
    current: 8,
    required: 10,
    priority: "Medium",
    status: "Warning"
  },
  {
    name: "Bandages",
    current: 45,
    required: 50,
    priority: "Low",
    status: "Good"
  }
];

export const activeCases = [
  {
    id: "PRF-2024-001",
    patient: "John Doe",
    status: "In Progress",
    priority: "High",
    timeElapsed: "45m"
  },
  {
    id: "PRF-2024-002",
    patient: "Jane Smith",
    status: "Pending",
    priority: "Medium",
    timeElapsed: "15m"
  }
];