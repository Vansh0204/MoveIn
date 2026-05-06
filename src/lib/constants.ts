import { College } from '@/types';

export const COLLEGES: College[] = [
  {
    id: 'coep',
    name: 'College of Engineering Pune',
    shortName: 'COEP',
    area: 'Shivajinagar',
    coords: { lat: 18.5286, lng: 73.8548 },
    studentCount: 4500,
    color: '#1D6B5A'
  },
  {
    id: 'mit',
    name: 'MIT World Peace University',
    shortName: 'MIT-WPU',
    area: 'Kothrud',
    coords: { lat: 18.5181, lng: 73.8151 },
    studentCount: 15000,
    color: '#C4603A'
  },
  {
    id: 'symbiosis-vn',
    name: 'Symbiosis International',
    shortName: 'Symbiosis',
    area: 'Viman Nagar',
    coords: { lat: 18.5630, lng: 73.9110 },
    studentCount: 8000,
    color: '#C8A96E'
  },
  {
    id: 'pccoe',
    name: 'Pimpri Chinchwad College of Engineering',
    shortName: 'PCCOE',
    area: 'Nigdi',
    coords: { lat: 18.6517, lng: 73.7614 },
    studentCount: 5000,
    color: '#0F0E0C'
  },
  {
    id: 'dypatil',
    name: 'Dr. D. Y. Patil Institute of Technology',
    shortName: 'DY Patil',
    area: 'Pimpri',
    coords: { lat: 18.6226, lng: 73.8207 },
    studentCount: 6000,
    color: '#1D6B5A'
  },
  {
    id: 'vit',
    name: 'Vishwakarma Institute of Technology',
    shortName: 'Vishwakarma',
    area: 'Bibwewadi',
    coords: { lat: 18.4636, lng: 73.8682 },
    studentCount: 4000,
    color: '#C4603A'
  },
  {
    id: 'fergusson',
    name: 'Fergusson College',
    shortName: 'Fergusson',
    area: 'Shivajinagar',
    coords: { lat: 18.5222, lng: 73.8395 },
    studentCount: 7000,
    color: '#C8A96E'
  },
  {
    id: 'modern',
    name: 'Modern College of Arts, Science and Commerce',
    shortName: 'Modern College',
    area: 'Shivajinagar',
    coords: { lat: 18.5283, lng: 73.8436 },
    studentCount: 5500,
    color: '#0F0E0C'
  }
];

export const AMENITY_ICONS: Record<string, string> = {
  wifi: 'Wifi',
  ac: 'AirVent',
  laundry: 'WashingMachine',
  food: 'Utensils',
  cleaning: 'Sparkles',
  security: 'ShieldCheck',
  gym: 'Dumbbell',
  power: 'Zap',
  tv: 'Tv',
  parking: 'Car'
};

export const SAFETY_CATEGORIES = [
  'Structural Integrity',
  'Building Age and Maintenance',
  'Water Leakage History',
  'Pest Control Status',
  'Ventilation Quality',
  'Security Guards (24/7)',
  'CCTV Coverage',
  'Biometric/Smart Access',
  'Visitor Log System',
  'Background Checked Staff',
  'Daily Room Cleaning',
  'Bathroom Hygiene',
  'Kitchen/Mess Cleanliness',
  'Waste Management',
  'Water Quality/Purifiers',
  'Female Only Floors/Blocks',
  'Female Security Staff',
  'Curfew/Entry Policies',
  'Emergency Contacts Directory',
  'Well-lit Surrounding Areas',
  'Fire Extinguishers Availability',
  'Emergency Exit Routes',
  'Smoke Detectors',
  'Fire Drill Frequency',
  'Electrical Safety Standards'
];
