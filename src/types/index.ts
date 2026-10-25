export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type CaseStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved';

export type AnimalType = 'Dog' | 'Cat' | 'Bird' | 'Wildlife' | 'Farm Animal' | 'Other';

export interface CaseHistoryItem {
  id: string;
  timestamp: number;
  action: string;
  note: string;
  author: string;
}

export interface RescueCase {
  id: string;
  animalType: AnimalType;
  animalBreedOrDesc?: string;
  condition: string;
  location: string;
  landmark?: string;
  priority: PriorityLevel;
  priorityScore: number; // 4 for Critical, 3 for High, 2 for Medium, 1 for Low
  status: CaseStatus;
  reporterName: string;
  reporterPhone: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  resolutionOutcome?: string;
  history: CaseHistoryItem[];
}

export type VolunteerStatus = 'Available' | 'On Mission' | 'Busy' | 'Offline';

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email: string;
  specializations: string[];
  vehicle: string;
  status: VolunteerStatus;
  assignedCaseCount: number;
  totalRescuedCount: number;
  currentZone: string;
}

export interface HeapNode<T> {
  item: T;
  index: number;
}
