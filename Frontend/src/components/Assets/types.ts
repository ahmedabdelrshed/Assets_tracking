export interface Asset {
  id: number;
  name: string;
  status: string;
  assignedTo: {
    username: string;
    id: number;
  };
}

export interface Employee {
  id: number;
  username: string;
}

export interface AssetHistory {
  id: number;
  status: string;
  timestamp: string;
}

export const statusOptions = ["Available", "In_Use", "Under_Maintenance"];