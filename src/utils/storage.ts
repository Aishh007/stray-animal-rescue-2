import { RescueCase, Volunteer } from '../types';
import { priorityToScore } from './heap';

const STORAGE_KEY_CASES = 'stray_animal_cases_v1';
const STORAGE_KEY_VOLUNTEERS = 'stray_animal_volunteers_v1';

// Base time anchor: current time minus relative intervals to demonstrate realistic timestamps
const now = Date.now();
const minutesAgo = (mins: number) => now - mins * 60 * 1000;
const hoursAgo = (hrs: number) => now - hrs * 60 * 60 * 1000;

export const DEFAULT_VOLUNTEERS: Volunteer[] = [
  {
    id: 'VOL-001',
    name: 'Elena Rostova',
    phone: '+1 (555) 392-1084',
    email: 'elena.rostova@animalrescue.org',
    specializations: ['K9 Handling', 'Canine First Aid', 'Aggressive Breed Triage'],
    vehicle: 'Sprinter Van + Dual Animal Crates',
    status: 'Available',
    assignedCaseCount: 1,
    totalRescuedCount: 42,
    currentZone: 'North Sector & Riverside',
  },
  {
    id: 'VOL-002',
    name: 'Marcus Chen',
    phone: '+1 (555) 781-4491',
    email: 'm.chen@animalrescue.org',
    specializations: ['Feline Rescue', 'Urban Entrapment', 'Night Operations'],
    vehicle: 'Subaru Outback + Telescopic Net & Trap',
    status: 'Available',
    assignedCaseCount: 0,
    totalRescuedCount: 38,
    currentZone: 'Downtown Core & Metro Yards',
  },
  {
    id: 'VOL-003',
    name: 'Dr. Priya Nair',
    phone: '+1 (555) 902-6638',
    email: 'priya.nair.dvm@mobilevetcare.com',
    specializations: ['Avian Medicine', 'Wildlife Stabilization', 'Mobile Surgery'],
    vehicle: 'Custom Mobile Clinic Ambulance',
    status: 'On Mission',
    assignedCaseCount: 1,
    totalRescuedCount: 74,
    currentZone: 'Eastside & Harbor Marina',
  },
  {
    id: 'VOL-004',
    name: 'Jordan Miller',
    phone: '+1 (555) 612-8802',
    email: 'jordan.m@heavyrescue.org',
    specializations: ['Drain & Trench Extraction', 'Heavy Animals', 'Welfare Evacuation'],
    vehicle: 'Ford F-250 4x4 + Winch & Harness',
    status: 'Available',
    assignedCaseCount: 0,
    totalRescuedCount: 29,
    currentZone: 'Industrial Park & South Corridor',
  },
];

export const DEFAULT_CASES: RescueCase[] = [
  {
    id: 'CASE-2026-101',
    animalType: 'Dog',
    animalBreedOrDesc: 'Golden mix, adult male (~28kg)',
    condition: 'Vehicle collision on expressway off-ramp. Severe posterior hip fracture, internal bleeding suspected. Whimpering, cannot stand.',
    location: 'Highway 101 Southbound, Exit 14 Off-ramp',
    landmark: 'Adjacent to North Toll Plaza green divider',
    priority: 'Critical',
    priorityScore: priorityToScore('Critical'),
    status: 'Pending',
    reporterName: 'Officer Daniel Vance',
    reporterPhone: '+1 (555) 231-9044',
    notes: 'Highway Patrol stopped traffic in outer lane. Immediate transport to emergency trauma surgical center needed.',
    createdAt: minutesAgo(42),
    updatedAt: minutesAgo(42),
    history: [
      {
        id: 'hist-1',
        timestamp: minutesAgo(42),
        action: 'Case Intake Logged',
        note: 'Emergency distress call received from highway patrol unit. Prioritized as Critical.',
        author: 'Central Dispatch System',
      },
      {
        id: 'hist-2',
        timestamp: minutesAgo(40),
        action: 'Prioritized for Assignment',
        note: 'Queued as highest urgency (Critical) for immediate rescuer assignment.',
        author: 'Dispatch Desk',
      },
    ],
  },
  {
    id: 'CASE-2026-102',
    animalType: 'Cat',
    animalBreedOrDesc: 'Domestic Shorthair Tabby, juvenile (~6 months)',
    condition: 'Trapped inside engine compartment of parked commercial delivery truck. Dehydrated, burns on front paws, severe distress cries.',
    location: '842 Commercial Way, Dock B',
    landmark: 'Near DHL Logistics Hub Gate 3',
    priority: 'High',
    priorityScore: priorityToScore('High'),
    status: 'Pending',
    reporterName: 'Carlos Mendez (Fleet Mgr)',
    reporterPhone: '+1 (555) 890-4122',
    notes: 'Driver cannot start truck without harming animal. Hood is locked; mechanical removal of underside splash shield required.',
    createdAt: minutesAgo(85), // Older than case 103!
    updatedAt: minutesAgo(85),
    history: [
      {
        id: 'hist-3',
        timestamp: minutesAgo(85),
        action: 'Case Intake Logged',
        note: 'Reported by logistics warehouse staff. Engine bay entrapment.',
        author: 'Intake Operator Sarah K.',
      },
      {
        id: 'hist-4',
        timestamp: minutesAgo(83),
        action: 'Prioritized for Assignment',
        note: 'Queued with High urgency due to entrapment and burn risk.',
        author: 'Dispatch Desk',
      },
    ],
  },
  {
    id: 'CASE-2026-103',
    animalType: 'Dog',
    animalBreedOrDesc: 'Terrier mix, medium build, scruffy grey',
    condition: 'Deep infected bite puncture wounds around neck and shoulder from territorial stray fight. Lethargic, feverish, guarded.',
    location: 'Riverside Community Park, Trail Mile 3',
    landmark: 'Resting under wooden pedestrian bridge near willow tree',
    priority: 'High',
    priorityScore: priorityToScore('High'),
    status: 'Assigned',
    assignedVolunteerId: 'VOL-001',
    assignedVolunteerName: 'Elena Rostova',
    reporterName: 'Clara Oswald',
    reporterPhone: '+1 (555) 344-9182',
    notes: 'Dog is timid but accepts small treats. Elena is en route with soft leash and antiseptic wash kit.',
    createdAt: hoursAgo(2.5),
    updatedAt: minutesAgo(30),
    history: [
      {
        id: 'hist-5',
        timestamp: hoursAgo(2.5),
        action: 'Case Intake Logged',
        note: 'Park jogger noticed injured dog unable to walk comfortably.',
        author: 'Intake Operator',
      },
      {
        id: 'hist-6',
        timestamp: minutesAgo(30),
        action: 'Assigned to Volunteer',
        note: 'Dispatched Elena Rostova (K9 Specialist) based on matching breed experience and close zone proximity.',
        author: 'Dispatcher Rachel M.',
      },
    ],
  },
  {
    id: 'CASE-2026-104',
    animalType: 'Bird',
    animalBreedOrDesc: 'Red-tailed Hawk, adult',
    condition: 'Wings tangled in discarded monofilament fishing line suspended from light pole. Hanging upside down, wing strain.',
    location: 'Harbor Marina Pier 7, Slip 42',
    landmark: 'Top of mooring pole adjacent to fuel dock',
    priority: 'Medium',
    priorityScore: priorityToScore('Medium'),
    status: 'In Progress',
    assignedVolunteerId: 'VOL-003',
    assignedVolunteerName: 'Dr. Priya Nair',
    reporterName: 'Capt. Ron Bradley',
    reporterPhone: '+1 (555) 481-2290',
    notes: 'Dr. Priya Nair on scene with mobile clinic equipment, telescoping pole shears, and gentle raptor restraint wrap.',
    createdAt: hoursAgo(4),
    updatedAt: minutesAgo(18),
    history: [
      {
        id: 'hist-7',
        timestamp: hoursAgo(4),
        action: 'Case Intake Logged',
        note: 'Harbor master reported entangled raptor.',
        author: 'Dispatch Desk',
      },
      {
        id: 'hist-8',
        timestamp: hoursAgo(1.5),
        action: 'Assigned to Volunteer',
        note: 'Assigned to Dr. Priya Nair due to avian medical specialty.',
        author: 'Dispatcher Rachel M.',
      },
      {
        id: 'hist-9',
        timestamp: minutesAgo(18),
        action: 'Rescue In Progress',
        note: 'Dr. Priya arrived on scene. Mobile crane and wrap prepared. Untangling operation initiated.',
        author: 'Dr. Priya Nair',
      },
    ],
  },
  {
    id: 'CASE-2026-105',
    animalType: 'Cat',
    animalBreedOrDesc: 'Calico kitten, approx 6 weeks old, ~450g',
    condition: 'Abandoned in open cardboard box behind grocery store loading dock. Mild dehydration and bilateral conjunctivitis.',
    location: 'Behind Metro Fresh Foods, 1240 Pine Street',
    landmark: 'Beside blue recycling compactor',
    priority: 'Low',
    priorityScore: priorityToScore('Low'),
    status: 'Resolved',
    assignedVolunteerId: 'VOL-002',
    assignedVolunteerName: 'Marcus Chen',
    reporterName: 'Amanda Cruz',
    reporterPhone: '+1 (555) 771-3091',
    notes: 'Recovered safely by Marcus Chen, brought to partner clinic for warm saline flush, milk replacer feeding, and placement in foster care.',
    createdAt: hoursAgo(7),
    updatedAt: hoursAgo(1),
    resolvedAt: hoursAgo(1),
    resolutionOutcome: 'Securely placed at Hope Haven Animal Shelter nursery. Veterinary exam complete: eyes responding to antibiotic drops, appetite strong.',
    history: [
      {
        id: 'hist-10',
        timestamp: hoursAgo(7),
        action: 'Case Intake Logged',
        note: 'Store clerk found kitten in box before shift.',
        author: 'Intake Operator',
      },
      {
        id: 'hist-11',
        timestamp: hoursAgo(5),
        action: 'Assigned to Volunteer',
        note: 'Marcus Chen picked up dispatch during downtown sweep.',
        author: 'Auto-Dispatch Engine',
      },
      {
        id: 'hist-12',
        timestamp: hoursAgo(3.5),
        action: 'Rescue In Progress',
        note: 'Kitten secured in heated pet carrier. Transporting to clinic.',
        author: 'Marcus Chen',
      },
      {
        id: 'hist-13',
        timestamp: hoursAgo(1),
        action: 'Case Successfully Resolved',
        note: 'Veterinary care completed. Safely transferred to licensed foster caregiver.',
        author: 'Marcus Chen',
      },
    ],
  },
];

export function loadCases(): RescueCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CASES);
    if (!raw) {
      saveCases(DEFAULT_CASES);
      return DEFAULT_CASES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveCases(DEFAULT_CASES);
      return DEFAULT_CASES;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load cases from localStorage:', err);
    return DEFAULT_CASES;
  }
}

export function saveCases(cases: RescueCase[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(cases));
  } catch (err) {
    console.error('Failed to save cases to localStorage:', err);
  }
}

export function loadVolunteers(): Volunteer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VOLUNTEERS);
    if (!raw) {
      saveVolunteers(DEFAULT_VOLUNTEERS);
      return DEFAULT_VOLUNTEERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveVolunteers(DEFAULT_VOLUNTEERS);
      return DEFAULT_VOLUNTEERS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load volunteers from localStorage:', err);
    return DEFAULT_VOLUNTEERS;
  }
}

export function saveVolunteers(volunteers: Volunteer[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(volunteers));
  } catch (err) {
    console.error('Failed to save volunteers to localStorage:', err);
  }
}

export function resetDemoData(): { cases: RescueCase[]; volunteers: Volunteer[] } {
  saveCases(DEFAULT_CASES);
  saveVolunteers(DEFAULT_VOLUNTEERS);
  return { cases: DEFAULT_CASES, volunteers: DEFAULT_VOLUNTEERS };
}

export function generateNextCaseId(existingCases: RescueCase[]): string {
  const currentYear = new Date().getFullYear();
  let maxNum = 105;
  for (const c of existingCases) {
    const match = c.id.match(/CASE-\d{4}-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  return `CASE-${currentYear}-${maxNum + 1}`;
}

export function generateNextVolunteerId(volunteers: Volunteer[]): string {
  let maxNum = 4;
  for (const v of volunteers) {
    const match = v.id.match(/VOL-(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }
  return `VOL-${String(maxNum + 1).padStart(3, '0')}`;
}
