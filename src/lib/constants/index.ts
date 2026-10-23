import { Category, Priority, CampusLocation, StaffMember, UserProfile } from '../types';

export const CATEGORY_LABELS: Record<Category, string> = {
  plumbing: 'Plumbing & Water',
  electricity: 'Electrical & Power',
  cleanliness: 'Housekeeping & Sanitation',
  internet: 'IT & Wi-Fi Network',
};

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string; hex: string }> = {
  plumbing: { bg: 'bg-[#EBF1F3]', text: 'text-[#244E57]', border: 'border-[#CBDCE0]', hex: '#244E57' },
  electricity: { bg: 'bg-[#F9F0E3]', text: 'text-[#8C5E20]', border: 'border-[#EAD5BA]', hex: '#8C5E20' },
  cleanliness: { bg: 'bg-[#E7EBDD]', text: 'text-[#35483A]', border: 'border-[#CCD6BE]', hex: '#35483A' },
  internet: { bg: 'bg-[#EBE9F2]', text: 'text-[#474266]', border: 'border-[#D1CCE0]', hex: '#474266' },
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  urgent: 'Urgent',
};

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string; border: string; dot: string }> = {
  low: { bg: 'bg-[#EFECE6]', text: 'text-[#6E6A61]', border: 'border-[#DDD8CE]', dot: 'bg-[#8F8A7E]' },
  normal: { bg: 'bg-[#E8EDE9]', text: 'text-[#35483A]', border: 'border-[#CBD8CE]', dot: 'bg-[#35483A]' },
  high: { bg: 'bg-[#F9F0E3]', text: 'text-[#8C5E20]', border: 'border-[#EAD5BA]', dot: 'bg-[#8C5E20]' },
  urgent: { bg: 'bg-[#F7E5E5]', text: 'text-[#9E2A2B]', border: 'border-[#E6BCBC]', dot: 'bg-[#9E2A2B]' },
};

export const DEPARTMENT_MAPPINGS: Record<Category, string> = {
  plumbing: 'Plumbing & Hydraulic Services',
  electricity: 'Electrical Infrastructure',
  cleanliness: 'Campus Housekeeping & Sanitation',
  internet: 'IT Network & Systems Operations',
};

export const SLA_HOURS_MATRIX: Record<Category, Record<Priority, number>> = {
  plumbing: { urgent: 2, high: 6, normal: 24, low: 48 },
  electricity: { urgent: 1, high: 4, normal: 12, low: 36 },
  cleanliness: { urgent: 3, high: 8, normal: 24, low: 48 },
  internet: { urgent: 2, high: 6, normal: 18, low: 48 },
};

export const CAMPUS_BUILDINGS: CampusLocation[] = [
  {
    id: 'b-hostel-c',
    building: 'Tagore Hostel (Block C)',
    buildingCode: 'TH-C',
    floors: [1, 2, 3, 4],
    rooms: ['C-101 to C-130', 'C-201 to C-230', 'C-301 to C-330', 'C-401 to C-430', 'Common Washroom Wing A', 'Common Washroom Wing B'],
    type: 'hostel',
    coordinates: { x: -3.5, y: 1.2, z: 2.5 },
    mapPosition: { x: 22, y: 35 },
  },
  {
    id: 'b-hostel-b',
    building: 'Gargi Hostel (Block B)',
    buildingCode: 'GH-B',
    floors: [1, 2, 3],
    rooms: ['B-101 to B-125', 'B-201 to B-225', 'B-301 to B-325', 'Pantry Room', 'Laundry Area'],
    type: 'hostel',
    coordinates: { x: -3.8, y: 1.0, z: -2.0 },
    mapPosition: { x: 20, y: 68 },
  },
  {
    id: 'b-eng-quad',
    building: 'APJ Abdul Kalam Engineering Quad',
    buildingCode: 'AK-EQ',
    floors: [1, 2, 3, 4, 5],
    rooms: ['Room 101', 'Room 204 (Robotics Lab)', 'Room 312 (Lecture Hall 1)', 'Room 408 (AI Lab)', 'Server Room 501', 'East Wing Restrooms'],
    type: 'academic',
    coordinates: { x: 2.8, y: 1.8, z: 2.2 },
    mapPosition: { x: 74, y: 32 },
  },
  {
    id: 'b-science-tower',
    building: 'Raman Science & Innovation Tower',
    buildingCode: 'RS-IT',
    floors: [1, 2, 3, 4],
    rooms: ['Physics Lab 102', 'Chemistry Lab 201', 'Auditorium A', 'Faculty Lounge', 'West Restrooms'],
    type: 'academic',
    coordinates: { x: 3.2, y: 1.5, z: -2.4 },
    mapPosition: { x: 78, y: 72 },
  },
  {
    id: 'b-library',
    building: 'Central Knowledge Commons (Library)',
    buildingCode: 'CK-LIB',
    floors: [1, 2, 3],
    rooms: ['Ground Floor Circulation', '1st Floor Quiet Reading', '2nd Floor Digital Archive & Wi-Fi Hub', '3rd Floor Study Pods'],
    type: 'library',
    coordinates: { x: 0.0, y: 1.1, z: 0.0 },
    mapPosition: { x: 50, y: 50 },
  },
  {
    id: 'b-dining',
    building: 'Student Dining & Recreational Center',
    buildingCode: 'SD-RC',
    floors: [1, 2],
    rooms: ['Main Mess Hall', 'Cafeteria Courtyard', 'Kitchen Area', 'Restrooms G-Floor'],
    type: 'dining',
    coordinates: { x: -0.2, y: 0.8, z: -3.5 },
    mapPosition: { x: 48, y: 84 },
  },
];

export const DEMO_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Rajesh Sharma',
    email: 'rajesh.plumb@campusconnect.demo',
    department: 'Plumbing & Hydraulic Services',
    skills: ['plumbing'],
    activeWorkload: 2,
    assignedBuilding: 'Tagore Hostel (Block C)',
    isAvailable: true,
  },
  {
    id: 'staff-2',
    name: 'Vikas Deshmukh',
    email: 'vikas.elec@campusconnect.demo',
    department: 'Electrical Infrastructure',
    skills: ['electricity'],
    activeWorkload: 1,
    assignedBuilding: 'APJ Abdul Kalam Engineering Quad',
    isAvailable: true,
  },
  {
    id: 'staff-3',
    name: 'Sunita Patil',
    email: 'sunita.housekeep@campusconnect.demo',
    department: 'Campus Housekeeping & Sanitation',
    skills: ['cleanliness'],
    activeWorkload: 3,
    assignedBuilding: 'Central Knowledge Commons (Library)',
    isAvailable: true,
  },
  {
    id: 'staff-4',
    name: 'Karan Sen',
    email: 'karan.net@campusconnect.demo',
    department: 'IT Network & Systems Operations',
    skills: ['internet'],
    activeWorkload: 1,
    assignedBuilding: 'Central Knowledge Commons (Library)',
    isAvailable: true,
  },
  {
    id: 'staff-5',
    name: 'Amitabh Verma',
    email: 'amitabh.senior@campusconnect.demo',
    department: 'Plumbing & Hydraulic Services',
    skills: ['plumbing', 'cleanliness'],
    activeWorkload: 0,
    assignedBuilding: 'Gargi Hostel (Block B)',
    isAvailable: true,
  },
];

export const DEMO_PROFILES: Record<string, UserProfile> = {
  student: {
    id: 'student-demo-id',
    name: 'Ananya Roy',
    email: 'student@campusconnect.demo',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  staff: {
    id: 'staff-demo-id',
    name: 'Rajesh Sharma (Operations Lead)',
    email: 'staff@campusconnect.demo',
    role: 'staff',
    department: 'Plumbing & Hydraulic Services',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  admin: {
    id: 'admin-demo-id',
    name: 'Dr. Meenakshi Sundaram (Campus Director)',
    email: 'admin@campusconnect.demo',
    role: 'admin',
    department: 'Campus Executive Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
};
