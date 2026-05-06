export interface College {
  id: string;
  name: string;
  shortName: string;
  area: string;
  coords: {
    lat: number;
    lng: number;
  };
  studentCount: number;
  color: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface SafetyAudit {
  category: string;
  score: number; // e.g., out of 5 or 100
  remarks?: string;
  passed: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  area: string;
  coords: {
    lat: number;
    lng: number;
  };
  priceMonthly: number;
  deposit: number;
  images: string[];
  amenities: Amenity[];
  safetyAudits: SafetyAudit[];
  closestColleges: {
    collegeId: string;
    distanceKm: number;
  }[];
  rating: number;
  isVerified: boolean;
  type: 'Hostel' | 'PG' | 'Co-living' | 'Apartment';
  gender: 'Male' | 'Female' | 'Unisex';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Student' | 'Owner' | 'Admin';
  collegeId?: string;
  savedProperties?: string[];
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  startDate: Date;
  endDate?: Date;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  amount: number;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
