import { CampusKnowledgeEntry, KnowledgeGap } from '../types';

export const SEEDED_CAMPUS_KNOWLEDGE_ENTRIES: CampusKnowledgeEntry[] = [
  // -------------------------------------------------------------------------
  // 1. HOSTEL RULES & POLICIES
  // -------------------------------------------------------------------------
  {
    id: 'kb-hostel-001',
    title: 'Hostel Curfew and Main Gate Timings',
    slug: 'hostel-curfew-timings',
    category: 'hostel_rules',
    summary: 'Hostel entry deadline is 10:30 PM. Late entries require digital pass via Warden portal.',
    content: `All residential hostel blocks have a strict entry cutoff at 10:30 PM on weekdays and Sundays. On Friday and Saturday nights, an extended grace period until 11:00 PM applies.
Students arriving after curfew must scan their RFID student ID card at the security booth and sign the Late Register. Accumulating three unexcused late entries in a calendar month triggers an automated SMS notification to the student's designated local guardian and a meeting with the Hostel Warden.
For academic lab work extending past 10:30 PM, students must obtain a digital 'Night Lab Pass' endorsed by their supervising faculty before 6:00 PM.`,
    ownerDepartment: 'Hostel Administration & Chief Warden Office',
    contactEmail: 'warden-tagore@campus.edu',
    contactPhone: '+91-11-2700-1010',
    officeLocation: 'Tagore Block C, Room 101',
    sourceLink: 'https://campus.edu/handbook/hostel-regulations-sec4',
    audience: 'hostel_residents',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-09-15T10:00:00Z',
    isStale: false,
    tags: ['curfew', 'gate timings', 'hostel entry', 'night pass', 'warden'],
    helpfulCount: 142,
    unhelpfulCount: 3,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-09-15T10:00:00Z',
  },
  {
    id: 'kb-hostel-002',
    title: 'Visitor and Guest Room Booking Policy',
    slug: 'visitor-guest-room-policy',
    category: 'hostel_rules',
    summary: 'Day visitors permitted 9:00 AM to 7:00 PM in common areas. No overnight guests in student rooms.',
    content: `Visitors (parents, siblings, outside students) must register at the hostel security desk with a government-issued photo ID.
Day visiting hours are strictly 9:00 AM to 7:00 PM in designated common rooms, cafeterias, and visitor lobbies. Under no circumstances are outside guests permitted inside student dorm rooms.
Parents seeking overnight accommodation may book the Campus Guest House at subsidized rates (Rs. 800/night for single AC room, Rs. 1,200/night for double AC room). Reservations must be submitted through the ERP portal at least 48 hours in advance.`,
    ownerDepartment: 'Hostel Administration & Chief Warden Office',
    contactEmail: 'guesthouse@campus.edu',
    contactPhone: '+91-11-2700-1012',
    officeLocation: 'Main Guest House Annex',
    sourceLink: 'https://campus.edu/handbook/guest-policy',
    audience: 'hostel_residents',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-08-20T11:00:00Z',
    isStale: false,
    tags: ['visitors', 'parents', 'guest room', 'overnight stay', 'guest house'],
    helpfulCount: 89,
    unhelpfulCount: 2,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-20T11:00:00Z',
  },
  {
    id: 'kb-hostel-003',
    title: 'Electrical Appliances and Fire Safety Restrictions',
    slug: 'electrical-appliances-policy',
    category: 'hostel_rules',
    summary: 'Electric irons, heaters, and induction stoves are strictly prohibited in hostel rooms.',
    content: `To prevent electrical overloading and fire hazards, individual rooms are rated for a maximum connected load of 500 Watts.
PERMITTED APPLIANCES: Laptops, mobile chargers, study lamps, electric shavers, and low-wattage electric kettles (up to 0.5 liter).
STRICTLY PROHIBITED: Electric immersion rods, room heaters, blowers, heavy electric irons, induction stoves, toasters, and air fryers.
Possession of prohibited high-wattage equipment leads to confiscation by the facility vigilance team and a disciplinary fine of Rs. 1,500. Designated ironing stations with automated 15-minute cutoffs are available on each floor laundry wing.`,
    ownerDepartment: 'Electrical Infrastructure & Campus Safety',
    contactEmail: 'power-ops@campus.edu',
    contactPhone: '+91-11-2700-1003',
    officeLocation: 'Substation Annex',
    sourceLink: 'https://campus.edu/safety/electrical-code',
    audience: 'hostel_residents',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-07-10T09:30:00Z',
    isStale: false,
    tags: ['appliances', 'heater', 'iron', 'fire safety', 'wattage limit', 'electricity'],
    helpfulCount: 215,
    unhelpfulCount: 12,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-07-10T09:30:00Z',
  },
  {
    id: 'kb-hostel-004',
    title: 'Hostel Quiet Hours and Noise Protocol',
    slug: 'quiet-hours-protocol',
    category: 'hostel_rules',
    summary: 'Quiet hours run from 11:00 PM to 6:00 AM daily. Speakers and musical instruments prohibited.',
    content: `Designated Quiet Hours are observed from 11:00 PM to 6:00 AM across all residential hostel wings.
During quiet hours, loud conversations in corridors, open audio speakers, high-volume group gatherings, and amplified musical instruments are strictly prohibited. Headphones must be used for late-night audio or video calls.
Group study sessions should relocate to the 24/7 Academic Quad Reading Rooms. Persistent noise violations should be reported via the CampusConnect Cleanliness & Discipline category.`,
    ownerDepartment: 'Hostel Administration',
    contactEmail: 'warden-tagore@campus.edu',
    contactPhone: '+91-11-2700-1010',
    officeLocation: 'Tagore Block C, Room 101',
    sourceLink: 'https://campus.edu/handbook/hostel-noise-code',
    audience: 'hostel_residents',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-06-12T14:00:00Z',
    isStale: false,
    tags: ['quiet hours', 'noise', 'study', 'music', 'corridor disturbance'],
    helpfulCount: 67,
    unhelpfulCount: 4,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-06-12T14:00:00Z',
  },
  {
    id: 'kb-hostel-005',
    title: 'Hostel Room Change Application Procedure',
    slug: 'hostel-room-change-procedure',
    category: 'hostel_rules',
    summary: 'Mutual room changes open during the second week of each semester via ERP portal.',
    content: `Room changes are permitted only during the designated Room Swapping Window open during Week 2 of the Autumn and Spring semesters.
Procedure:
1. Both students intending to execute a mutual swap must submit matching online requests on the ERP portal under Hostel Affairs > Room Change.
2. If requesting a change due to medical conditions, an official recommendation from the Chief Medical Officer at the Campus Health Center is required.
3. Once approved by the Warden, room keys must be exchanged at the hostel caretaker desk within 48 hours following a joint room inventory inspection.`,
    ownerDepartment: 'Hostel Administration & Chief Warden Office',
    contactEmail: 'warden-tagore@campus.edu',
    contactPhone: '+91-11-2700-1010',
    officeLocation: 'Tagore Block C, Room 101',
    sourceLink: 'https://campus.edu/hostel/room-change-guide',
    audience: 'hostel_residents',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-05-18T10:00:00Z',
    isStale: false,
    tags: ['room change', 'room swap', 'roommate', 'warden', 'erp'],
    helpfulCount: 110,
    unhelpfulCount: 5,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-05-18T10:00:00Z',
  },
  {
    id: 'kb-hostel-006',
    title: 'Mess Rebate and Meal Absence Policy',
    slug: 'mess-rebate-absence-policy',
    category: 'hostel_rules',
    summary: 'Apply for mess rebate at least 48 hours in advance for absences of 3 or more consecutive days.',
    content: `Hostel residents absent from campus for three (3) or more consecutive days are eligible for a daily mess fee rebate of Rs. 140/day.
Requirements:
- Applications must be logged on the ERP portal under Mess Management > Leave Rebate at least 48 hours before the absence commences.
- Retroactive rebate claims after returning to campus are strictly not accepted.
- Approved academic leave certificates, medical certificates, or formal vacation dates must be attached.
- Maximum allowable mess rebate per semester is capped at 21 days, excluding official semester breaks.`,
    ownerDepartment: 'Campus Dining & Mess Committee',
    contactEmail: 'mess-committee@campus.edu',
    contactPhone: '+91-11-2700-1040',
    officeLocation: 'Central Dining Complex, 1st Floor',
    sourceLink: 'https://campus.edu/dining/mess-rebates',
    audience: 'hostel_residents',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-08-01T12:00:00Z',
    isStale: false,
    tags: ['mess rebate', 'food discount', 'hostel absence', 'dining refund'],
    helpfulCount: 184,
    unhelpfulCount: 7,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-01T12:00:00Z',
  },
  {
    id: 'kb-hostel-007',
    title: 'Summer Vacation Room Vacating and Luggage Storage',
    slug: 'vacation-luggage-storage',
    category: 'hostel_rules',
    summary: 'Luggage room storage available in Common Hall B. Rooms must be cleared during annual maintenance.',
    content: `During the annual summer break (June 1 - July 20), residential rooms undergo deep sanitation, electrical overhaul, and painting.
All students must clear personal belongings from their rooms by 5:00 PM on the day following their final end-semester examination.
Each student is allotted storage space for up to two (2) standard locked cartons/suitcases in the Central Hostel Cloakroom (Common Hall B). All stored items must be tagged with student name, roll number, and phone number using official waterproof luggage tags provided by the caretaker.`,
    ownerDepartment: 'Hostel Administration',
    contactEmail: 'warden-tagore@campus.edu',
    contactPhone: '+91-11-2700-1010',
    officeLocation: 'Tagore Block C Caretaker Desk',
    sourceLink: 'https://campus.edu/hostel/vacation-guidelines',
    audience: 'hostel_residents',
    status: 'published',
    effectiveFrom: '2026-05-01',
    effectiveTo: '2026-08-01',
    lastReviewedAt: '2026-05-05T09:00:00Z',
    isStale: false,
    tags: ['luggage storage', 'vacation', 'summer break', 'cloakroom'],
    helpfulCount: 73,
    unhelpfulCount: 1,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-05T09:00:00Z',
  },
  {
    id: 'kb-hostel-008',
    title: 'Hostel Maintenance Complaint Protocol',
    slug: 'hostel-maintenance-protocol',
    category: 'hostel_rules',
    summary: 'Report room repairs through CampusConnect with photos. Do not pay private handymen.',
    content: `All repairs for plumbing, electrical fittings, masonry, furniture, and Wi-Fi within hostel blocks must be logged exclusively via the CampusConnect portal.
Key Rules:
1. Never employ or pay private outside handymen; unauthorized electrical or plumbing modifications violate hostel lease agreements.
2. Institutional maintenance technicians are uniformed and carry digital job orders.
3. Standard SLA turnaround times: Urgent safety issues (1-2 hours), high priority fixtures (4-6 hours), routine requests (12-24 hours).
4. Students must inspect and complete the digital Proof-of-Fix sign-off after the repair is completed.`,
    ownerDepartment: 'Campus Operations & Facilities Management',
    contactEmail: 'facilities@campus.edu',
    contactPhone: '+91-11-2700-1000',
    officeLocation: 'Central Maintenance Depot',
    sourceLink: 'https://campus.edu/operations/repair-protocol',
    audience: 'hostel_residents',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-09-01T08:00:00Z',
    isStale: false,
    tags: ['maintenance', 'complaint', 'repairs', 'plumbing', 'electrician', 'sla'],
    helpfulCount: 312,
    unhelpfulCount: 2,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
  },

  // -------------------------------------------------------------------------
  // 2. COLLEGE SERVICES & ACADEMIC ADMINISTRATION
  // -------------------------------------------------------------------------
  {
    id: 'kb-service-001',
    title: 'Bonafide Certificate Issuance Procedure',
    slug: 'bonafide-certificate-procedure',
    category: 'services',
    summary: 'Apply online via Student ERP. Processing time is 48 hours for physical or digitally signed PDF.',
    content: `Students requiring a Bonafide Certificate for passport applications, education loan processing, visa verification, or internship applications must follow this procedure:
1. Log in to the Student ERP Portal > Academic Services > Certificates > Bonafide Certificate.
2. Select purpose (e.g. Passport, Bank Loan, Visa, General Internship).
3. If a digitally signed PDF with institutional QR code verification is sufficient, it generates automatically within 2 hours.
4. If an embossed physical stamp and signature by the Dean of Academic Affairs is required, select 'Physical Pickup'. The certificate will be ready for collection at the Academic Helpdesk (Admin Block Room 104) within 48 business hours.
Fee: First two copies per semester are free; additional copies are Rs. 50 each.`,
    ownerDepartment: 'Academic Affairs & Student Records Desk',
    contactEmail: 'academic-records@campus.edu',
    contactPhone: '+91-11-2700-1025',
    officeLocation: 'Admin Block Room 104',
    sourceLink: 'https://campus.edu/academics/bonafide-certificates',
    audience: 'students',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-09-10T14:00:00Z',
    isStale: false,
    tags: ['bonafide', 'certificate', 'passport', 'bank loan', 'student affairs', 'letter'],
    helpfulCount: 420,
    unhelpfulCount: 6,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-09-10T14:00:00Z',
  },
  {
    id: 'kb-service-002',
    title: 'Duplicate Student ID Card Replacement',
    slug: 'duplicate-id-card-replacement',
    category: 'services',
    summary: 'Report lost ID at Security Booth. Replacement card printed in 3 working days (Fee: Rs. 200).',
    content: `In the event of a lost, stolen, or physically broken RFID Student Smart Card:
1. Immediately report the card as lost on the Campus Security Portal to deactivate door access, mess billing, and library borrowing privileges.
2. For lost cards, obtain a temporary 7-day paper entry pass from the Main Gate Security Office.
3. Pay the replacement fee of Rs. 200 online via the Finance Payment Gateway.
4. Visit the ID Card Production Unit (Security Office Room 102, Main Gate) between 10:00 AM and 1:00 PM on any working day with payment receipt.
5. New Smart Cards are printed and issued within three (3) working days.`,
    ownerDepartment: 'Campus Security & Access Control',
    contactEmail: 'security-cards@campus.edu',
    contactPhone: '+91-11-2700-1007',
    officeLocation: 'Main Gate Security Office Room 102',
    sourceLink: 'https://campus.edu/security/id-card-replacement',
    audience: 'students',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-08-15T16:00:00Z',
    isStale: false,
    tags: ['id card', 'lost card', 'rfid', 'smart card', 'security gate'],
    helpfulCount: 165,
    unhelpfulCount: 8,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-15T16:00:00Z',
  },
  {
    id: 'kb-service-003',
    title: 'Official Transcripts and Grade Card Requests',
    slug: 'transcripts-grade-cards',
    category: 'services',
    summary: 'Request sealed transcripts from Examination Cell. Dispatched in 7-10 business days.',
    content: `Students and alumni applying for higher education or permanent immigration can request official attested transcripts:
1. Applications must be placed through the Examination Cell Portal (transcripts.campus.edu).
2. Upload scanned copies of all semester grade sheets.
3. Standard processing timeline is 7 to 10 working days.
4. Sealed official envelopes can be collected in person at Examination Cell Counter 3 or dispatched internationally via DHL/FedEx with tracking provided.
Fees: Rs. 300 per sealed set for domestic delivery; courier charges apply for overseas dispatches.`,
    ownerDepartment: 'Examination Cell & Student Evaluation',
    contactEmail: 'exam-transcripts@campus.edu',
    contactPhone: '+91-11-2700-1030',
    officeLocation: 'Examination Block Ground Floor',
    sourceLink: 'https://campus.edu/examination/transcripts',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-07-22T10:00:00Z',
    isStale: false,
    tags: ['transcript', 'grade card', 'marksheet', 'exam cell', 'degree'],
    helpfulCount: 198,
    unhelpfulCount: 4,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-07-22T10:00:00Z',
  },
  {
    id: 'kb-service-004',
    title: 'Medical Leave and Academic Attendance Waiver',
    slug: 'medical-leave-attendance-waiver',
    category: 'services',
    summary: 'Submit medical fitness certificate to Health Center within 3 days of returning to campus.',
    content: `In cases where severe illness prevents academic attendance:
1. Treatment records or hospital discharge summaries must be presented to the Campus Health Center CMO within three (3) working days of resuming classes.
2. The CMO verifies external medical documents and issues a formal 'Medical Attendance Endorsement Slip'.
3. The student must upload this endorsement slip on the ERP portal under Attendance Appeals.
4. Approved medical leaves grant waiver points towards the minimum mandatory 75% attendance criterion (up to a maximum ceiling of 10% attendance concession).`,
    ownerDepartment: 'Student Welfare & Health Center',
    contactEmail: 'medical-records@campus.edu',
    contactPhone: '+91-11-2700-1008',
    officeLocation: 'Health Center Room 3',
    sourceLink: 'https://campus.edu/health/attendance-waiver',
    audience: 'students',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-08-30T11:00:00Z',
    isStale: false,
    tags: ['medical leave', 'attendance', 'health center', 'doctor note', '75 percent'],
    helpfulCount: 231,
    unhelpfulCount: 15,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-30T11:00:00Z',
  },
  {
    id: 'kb-service-005',
    title: 'MindSpace Student Counseling and Mental Wellness Center',
    slug: 'student-counseling-center',
    category: 'services',
    summary: 'Free, 100% confidential psychological counseling. Book online or visit Health Center 3rd floor.',
    content: `The MindSpace Wellness Center provides professional psychological support, stress management, and counseling services for all enrolled students.
Key Details:
- Location: 3rd Floor, Campus Health Center (separate private entrance for confidentiality).
- Services: One-on-one therapy sessions, academic anxiety workshops, sleep hygiene guidance, and peer support groups.
- All sessions are 100% confidential; session notes are never shared with academic departments, wardens, or parents without explicit student consent.
- Hours: Monday through Saturday, 9:00 AM to 7:00 PM.
- Bookings: Walk-ins welcome, or book privately at wellness.campus.edu or call extension 2740.`,
    ownerDepartment: 'Dean of Student Affairs (DoSA) - Wellness Division',
    contactEmail: 'mindspace@campus.edu',
    contactPhone: '+91-11-2700-2740',
    officeLocation: 'Health Center 3rd Floor',
    sourceLink: 'https://campus.edu/wellness/mindspace',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-09-01T09:00:00Z',
    isStale: false,
    tags: ['counseling', 'mental health', 'therapist', 'stress', 'wellness', 'confidential'],
    helpfulCount: 310,
    unhelpfulCount: 1,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-09-01T09:00:00Z',
  },
  {
    id: 'kb-service-006',
    title: 'Railway and Flight Student Concession Forms',
    slug: 'travel-concession-forms',
    category: 'services',
    summary: 'Indian Railways student concession vouchers issued by Student Welfare Office during semester breaks.',
    content: `Full-time students traveling to their registered home hometown during official semester vacations (winter and summer breaks) are eligible for Indian Railways Student Concession vouchers:
- Eligibility: Age under 25 years for general category; under 27 years for SC/ST students.
- Collection: Forms are available at the Student Welfare Office (Admin Block Room 202) starting 15 days before the vacation commences.
- Processing: Submit filled voucher with student ID and hometown residential proof. Signed concessions are distributed within 24 hours.`,
    ownerDepartment: 'Student Welfare Office',
    contactEmail: 'travel-concessions@campus.edu',
    contactPhone: '+91-11-2700-1028',
    officeLocation: 'Admin Block Room 202',
    sourceLink: 'https://campus.edu/student-welfare/travel-concessions',
    audience: 'students',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-04-10T15:00:00Z',
    isStale: false,
    tags: ['railway concession', 'train ticket', 'student discount', 'vacation travel'],
    helpfulCount: 145,
    unhelpfulCount: 3,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-04-10T15:00:00Z',
  },
  {
    id: 'kb-service-007',
    title: 'Fee Payment Deadlines and Late Penalty Structure',
    slug: 'fee-payment-deadlines',
    category: 'services',
    summary: 'Semester fees due by 15th January and 15th July. Rs. 100/day late fee applies thereafter.',
    content: `Academic semester fees and residential hostel charges must be settled through the State Bank of India Collect portal or the institutional ERP gateway:
- Autumn Semester Deadline: July 15th of each academic year.
- Spring Semester Deadline: January 15th of each academic year.
- Late Registration: Late payments incur a fine of Rs. 100/day for the first 10 days, increasing to Rs. 250/day up to day 20.
- Failure to pay fees by Day 20 leads to deregistration from active courses until resolved with the Finance Office.`,
    ownerDepartment: 'Finance & Accounts Division',
    contactEmail: 'fees@campus.edu',
    contactPhone: '+91-11-2700-1015',
    officeLocation: 'Admin Block Ground Floor Room 12',
    sourceLink: 'https://campus.edu/finance/fee-structure',
    audience: 'students',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-08-05T10:00:00Z',
    isStale: false,
    tags: ['fees', 'tuition', 'fine', 'late fee', 'payment gateway'],
    helpfulCount: 92,
    unhelpfulCount: 18,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-05T10:00:00Z',
  },
  {
    id: 'kb-service-008',
    title: 'Anti-Ragging and Harassment Redressal Committee',
    slug: 'anti-ragging-redressal',
    category: 'services',
    summary: 'Zero tolerance for ragging. 24/7 National toll-free helpline 1800-180-5522 or Proctor Desk.',
    content: `The institution maintains a zero-tolerance policy regarding any form of ragging, intimidation, discrimination, or physical harassment:
- Immediate Helpline (Campus Proctor): +91-11-2700-1099 (Monitored 24/7).
- National Anti-Ragging Toll Free Hotline: 1800-180-5522 (helpline@antiragging.in).
- Internal Complaints Committee (ICC) for gender-based harassment: icc@campus.edu.
All complaints are investigated with utmost urgency and confidentiality within 24 hours of receipt.`,
    ownerDepartment: 'Chief Proctorial Board & Anti-Ragging Committee',
    contactEmail: 'proctor@campus.edu',
    contactPhone: '+91-11-2700-1099',
    officeLocation: 'Proctorial Complex Annex',
    sourceLink: 'https://campus.edu/safety/anti-ragging-code',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-09-01T08:00:00Z',
    isStale: false,
    tags: ['anti ragging', 'proctor', 'harassment', 'safety', 'helpline', 'emergency'],
    helpfulCount: 520,
    unhelpfulCount: 0,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
  },

  // -------------------------------------------------------------------------
  // 3. FACILITIES & CAMPUS AMENITIES
  // -------------------------------------------------------------------------
  {
    id: 'kb-facility-001',
    title: 'Campus Central Library Working Hours and Borrowing Limits',
    slug: 'central-library-hours-borrowing',
    category: 'facilities',
    summary: 'Library open 8:00 AM to 11:00 PM (24/7 during exams). UG students may borrow 4 books for 14 days.',
    content: `The Central Library provides extensive print, digital, and quiet research facilities:
- Regular Hours: Monday - Saturday: 8:00 AM to 11:00 PM; Sundays: 10:00 AM to 6:00 PM.
- Exam Period: 24/7 round-the-clock reading hall access in the Ground Floor Air-Conditioned Study Atrium.
- Book Borrowing Quotas:
  - Undergraduate students: 4 books for 14 days.
  - Postgraduate/PhD scholars: 8 books for 30 days.
  - Faculty members: 15 books for 90 days.
- Renewals: One online renewal permitted via library.campus.edu unless another user has placed a hold. Overdue fine is Rs. 5 per day per book.`,
    ownerDepartment: 'Library & Learning Resource Center',
    contactEmail: 'library-helpdesk@campus.edu',
    contactPhone: '+91-11-2700-1050',
    officeLocation: 'Central Library Circulation Desk',
    sourceLink: 'https://campus.edu/library/borrowing-rules',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-09-05T12:00:00Z',
    isStale: false,
    tags: ['library', 'books', 'borrowing', 'reading room', 'study hours', 'exam timings'],
    helpfulCount: 380,
    unhelpfulCount: 5,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-09-05T12:00:00Z',
  },
  {
    id: 'kb-facility-002',
    title: 'Campus Gymnasium Timings and Rules',
    slug: 'gymnasium-timings-rules',
    category: 'facilities',
    summary: 'Gym open 6:00 - 9:30 AM and 4:30 - 9:00 PM. Clean indoor sports shoes mandatory.',
    content: `The Sports Complex Gymnasium is equipped with Olympic barbells, cardio treadmills, and resistance machines:
- Morning Slot: 6:00 AM to 9:30 AM (Mixed).
- Evening Slot: 4:30 PM to 6:00 PM (Women only); 6:00 PM to 9:00 PM (General mixed).
- Certified fitness trainers are on duty during the evening slots.
- Regulations: Clean rubber-soled indoor workout shoes and a sweat towel are strictly mandatory. Barefoot or slipper workouts are prohibited. Lockers are available for session use only; padlocks must be removed after each workout.`,
    ownerDepartment: 'Department of Physical Education & Sports',
    contactEmail: 'sports@campus.edu',
    contactPhone: '+91-11-2700-1060',
    officeLocation: 'Indoor Sports Complex Ground Floor',
    sourceLink: 'https://campus.edu/sports/gym-guidelines',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-08-18T10:00:00Z',
    isStale: false,
    tags: ['gym', 'fitness', 'workout', 'sports complex', 'exercise'],
    helpfulCount: 295,
    unhelpfulCount: 9,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-18T10:00:00Z',
  },
  {
    id: 'kb-facility-003',
    title: 'Badminton and Squash Court Reservation',
    slug: 'badminton-squash-court-booking',
    category: 'facilities',
    summary: 'Reserve wooden badminton and squash courts 24 hours in advance via Sports Portal.',
    content: `The Indoor Sports Complex houses four synthetic wooden badminton courts and two glass-backed squash courts:
- Booking Window: Online slots open daily at 8:00 AM for the following day via sports.campus.edu.
- Duration: Maximum one (1) hour per student per day to allow equitable access.
- Non-marking gum-sole court shoes are strictly mandatory. Black-soled running shoes are prohibited on wooden surfaces. Racquets and shuttlecocks can be borrowed at the equipment desk with a student ID deposit.`,
    ownerDepartment: 'Department of Physical Education & Sports',
    contactEmail: 'sports@campus.edu',
    contactPhone: '+91-11-2700-1060',
    officeLocation: 'Indoor Sports Complex Desk',
    sourceLink: 'https://campus.edu/sports/court-booking',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-07-15T11:00:00Z',
    isStale: false,
    tags: ['badminton', 'squash', 'sports booking', 'court reservation'],
    helpfulCount: 180,
    unhelpfulCount: 6,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-07-15T11:00:00Z',
  },
  {
    id: 'kb-facility-004',
    title: 'Campus Shuttle Bus Schedule and Transit Routes',
    slug: 'campus-shuttle-bus-schedule',
    category: 'facilities',
    summary: 'Shuttle operates every 20-30 mins between Main Gate, Academic Quad, and Metro Station.',
    content: `The electric Campus Shuttle runs continuous circuit loops to connect residential hostels with academic complexes and the nearby Metro station:
- Operating Hours: 7:00 AM to 10:30 PM every day.
- Peak Frequency (7:30 AM - 10:00 AM & 4:30 PM - 6:30 PM): Every 15 minutes.
- Non-Peak Frequency: Every 30 minutes.
- Main Stops:
  1. Main Gate Security Kiosk
  2. APJ Abdul Kalam Engineering Quad
  3. Ramanujan Science Block
  4. Tagore Hostel (Block C) & Mother Teresa Hostel
  5. City Metro Station (Gate 2 Drop-off)
- Fare: Free for students with valid RFID campus card.`,
    ownerDepartment: 'Campus Transport & Fleet Management',
    contactEmail: 'transport@campus.edu',
    contactPhone: '+91-11-2700-1070',
    officeLocation: 'Transport Depot Near Gate 2',
    sourceLink: 'https://campus.edu/transport/shuttle-schedule',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-09-01T10:00:00Z',
    isStale: false,
    tags: ['bus', 'shuttle', 'metro', 'transit', 'transport', 'timings'],
    helpfulCount: 410,
    unhelpfulCount: 14,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'kb-facility-005',
    title: 'Student Health Center and Emergency Dispensary',
    slug: 'student-health-center-emergency',
    category: 'facilities',
    summary: '24/7 emergency nursing and pharmacy. General physician consults 9:00 AM to 5:00 PM.',
    content: `The Campus Health Center provides primary healthcare, diagnostics, and emergency stabilization:
- Emergency Ambulance: Call extension 1008 or +91-11-2700-1008 (Available 24 hours, parked outside clinic).
- Nursing & First Aid: 24/7 round-the-clock staffed emergency triage.
- Outpatient Doctors (OPD): General Physician on duty Monday - Saturday 9:00 AM - 5:00 PM. Dental and Gynecology specialists visit Tuesdays and Thursdays 2:00 PM - 5:00 PM.
- Pharmacy: Basic essential medications (analgesics, antibiotics, rehydration salts, wound dressings) are dispensed free of cost against valid prescription.`,
    ownerDepartment: 'Campus Health & Medical Services',
    contactEmail: 'healthcenter@campus.edu',
    contactPhone: '+91-11-2700-1008',
    officeLocation: 'Health Center Building Near Sports Quad',
    sourceLink: 'https://campus.edu/health/services',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-08-25T14:00:00Z',
    isStale: false,
    tags: ['health center', 'doctor', 'ambulance', 'hospital', 'medical emergency', 'pharmacy'],
    helpfulCount: 512,
    unhelpfulCount: 2,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-25T14:00:00Z',
  },
  {
    id: 'kb-facility-006',
    title: 'Laundromat and Washing Machine Usage Guidelines',
    slug: 'laundromat-washing-machine-guidelines',
    category: 'facilities',
    summary: 'Self-service washers in Hostel Blocks B and D. Token cost Rs. 40 per 6kg load.',
    content: `Commercial automatic washing machines are located in the Ground Floor Utility Wings of Hostel Block B and Block D:
- Operating Hours: Monday to Saturday, 7:00 AM to 9:30 PM.
- Token Purchase: Tokens can be purchased at the Hostel Caretaker desk for Rs. 40 per token (valid for one 45-minute 6kg wash cycle).
- Detergent: Students must supply their own HE (High-Efficiency) liquid detergent. Bleach and industrial solvents are strictly prohibited.
- Rules: Remove laundry immediately upon cycle completion. Unattended clothes remaining in machines after 15 minutes will be removed to the sorting basket to free the unit.`,
    ownerDepartment: 'Hostel Facilities & Housekeeping',
    contactEmail: 'sanitation@campus.edu',
    contactPhone: '+91-11-2700-1004',
    officeLocation: 'Hostel Block B Caretaker Desk',
    sourceLink: 'https://campus.edu/hostel/laundry-services',
    audience: 'hostel_residents',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-07-10T12:00:00Z',
    isStale: false,
    tags: ['laundry', 'washing machine', 'clean clothes', 'tokens', 'dryer'],
    helpfulCount: 168,
    unhelpfulCount: 8,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-07-10T12:00:00Z',
  },
  {
    id: 'kb-facility-007',
    title: 'Canteen, Cafeteria, and Night Mess Timings',
    slug: 'canteen-dining-timings',
    category: 'facilities',
    summary: 'Main Cafeteria open 7:30 AM - 11:30 PM. Tagore Night Canteen serves until 2:30 AM.',
    content: `Multiple dining options are available across campus:
1. Central Student Cafeteria (Adjacent to Library):
   - Breakfast: 7:30 AM - 10:30 AM
   - Lunch: 12:00 PM - 2:30 PM
   - Snacks: 4:30 PM - 6:30 PM
   - Dinner: 7:30 PM - 10:30 PM
2. Tagore Hostel Night Canteen: Open daily from 10:30 PM to 2:30 AM for light meals, sandwiches, maggi, tea, and fresh fruit juices.
3. Nescafe and Coffee Kiosks (Academic Quad): 8:00 AM to 7:00 PM.
All vendors accept UPI and campus debit wallet payments. Food quality audits are conducted weekly by the Student Mess Monitoring Committee.`,
    ownerDepartment: 'Campus Dining Services & Food Committee',
    contactEmail: 'canteen@campus.edu',
    contactPhone: '+91-11-2700-1045',
    officeLocation: 'Central Dining Complex',
    sourceLink: 'https://campus.edu/dining/cafeterias',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-08-12T16:00:00Z',
    isStale: false,
    tags: ['canteen', 'food', 'cafeteria', 'night mess', 'maggi', 'coffee', 'meals'],
    helpfulCount: 340,
    unhelpfulCount: 6,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-12T16:00:00Z',
  },
  {
    id: 'kb-facility-008',
    title: 'Courier and E-Commerce Delivery Parcel Kiosk',
    slug: 'courier-parcel-collection-point',
    category: 'facilities',
    summary: 'All deliveries must be collected at Main Gate Post Kiosk between 10:00 AM and 6:30 PM.',
    content: `For campus security and traffic management, courier delivery agents (Amazon, Flipkart, Bluedart, Swiggy/Zomato parcel couriers) are not permitted entry into student hostel wings:
- Collection Hub: Central Parcel Kiosk, adjacent to Main Gate Security Booth.
- Operating Hours: Monday - Saturday 10:00 AM - 6:30 PM; Sunday 11:00 AM - 4:00 PM.
- Collection Procedure: Present your parcel tracking SMS or OTP along with your Student ID card.
- Food delivery agents (Zomato/Swiggy) may deliver to the Main Gate Security turnaround point until 11:30 PM.`,
    ownerDepartment: 'Campus Security & Postal Dispatch',
    contactEmail: 'dispatch@campus.edu',
    contactPhone: '+91-11-2700-1077',
    officeLocation: 'Main Gate Parcel Kiosk',
    sourceLink: 'https://campus.edu/security/parcel-policy',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-06-25T11:00:00Z',
    isStale: false,
    tags: ['amazon', 'courier', 'delivery', 'parcel', 'swiggy', 'zomato', 'main gate'],
    helpfulCount: 220,
    unhelpfulCount: 5,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-06-25T11:00:00Z',
  },

  // -------------------------------------------------------------------------
  // 4. DEPARTMENT DIRECTORY & EMERGENCY CONTACTS
  // -------------------------------------------------------------------------
  {
    id: 'kb-dept-001',
    title: 'IT Network & Systems Operations Directory',
    slug: 'it-network-directory',
    category: 'department_directory',
    summary: 'Wi-Fi access, campus portal logins, firewall queries. Contact: it-support@campus.edu / Ext 1001.',
    content: `The IT Network & Systems Operations department manages the high-speed optical fiber backbone, Aruba Wi-Fi APs, student ERP, and lab computing:
- Head: Dr. S. Raman, Director of Computing
- Helpdesk Email: it-support@campus.edu
- Direct Phone: +91-11-2700-1001
- Office Location: Ground Floor, Technology & Computation Center
- Walk-in Support Hours: Monday - Friday 9:00 AM - 5:30 PM
- Scope: Campus Wi-Fi 802.1x authentication, email password resets, server access, lab workstations.`,
    ownerDepartment: 'IT Network & Systems Operations',
    contactEmail: 'it-support@campus.edu',
    contactPhone: '+91-11-2700-1001',
    officeLocation: 'Tech Center Ground Floor',
    sourceLink: 'https://campus.edu/directory/it-services',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-09-01T10:00:00Z',
    isStale: false,
    tags: ['it support', 'wifi', 'internet', 'network', 'login', 'email reset', 'tech support'],
    helpfulCount: 310,
    unhelpfulCount: 3,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'kb-dept-002',
    title: 'Plumbing & Hydraulic Infrastructure Services Directory',
    slug: 'plumbing-hydraulic-directory',
    category: 'department_directory',
    summary: 'Water supply, pipe leaks, drainage, geysers. Contact: facilities-water@campus.edu / Ext 1002.',
    content: `Responsible for water treatment plants, overhead tank distribution, hostel washroom lines, and storm drainage:
- Supervisor: M. Ramesh, Senior Hydraulic Engineer
- Helpdesk Email: facilities-water@campus.edu
- Direct Phone: +91-11-2700-1002
- Office Location: Maintenance Shed B (Rear of Engineering Quad)
- Emergency On-Call: 24/7 plumbers stationed in Tagore Hostel and Ramanujan Quad.
- Report all leaks, low pressure, or valve issues on CampusConnect for rapid technician dispatch.`,
    ownerDepartment: 'Plumbing & Hydraulic Services',
    contactEmail: 'facilities-water@campus.edu',
    contactPhone: '+91-11-2700-1002',
    officeLocation: 'Maintenance Shed B',
    sourceLink: 'https://campus.edu/directory/plumbing',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-08-20T10:00:00Z',
    isStale: false,
    tags: ['plumbing', 'water leak', 'tap', 'flush', 'water supply', 'hydraulic'],
    helpfulCount: 205,
    unhelpfulCount: 4,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'kb-dept-003',
    title: 'Electrical Infrastructure & Power Systems Directory',
    slug: 'electrical-power-directory',
    category: 'department_directory',
    summary: 'Power outages, breakers, switchboards, lighting. Contact: power-ops@campus.edu / Ext 1003.',
    content: `Maintains the 11kV campus substation, diesel backup generators, solar rooftop arrays, and building distribution boards:
- Head: Eng. V. Sharma, Executive Electrical Engineer
- Helpdesk Email: power-ops@campus.edu
- Direct Phone: +91-11-2700-1003
- Office Location: Substation Annex Building
- 24/7 Control Room: Monitored for sudden power tripping, sparking switchboards, and line faults.
- High-hazard emergencies (exposed live wires, arcing, smoke from breakers) receive priority technician dispatch within 30 minutes.`,
    ownerDepartment: 'Electrical Infrastructure',
    contactEmail: 'power-ops@campus.edu',
    contactPhone: '+91-11-2700-1003',
    officeLocation: 'Substation Annex Building',
    sourceLink: 'https://campus.edu/directory/electrical',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-09-02T11:00:00Z',
    isStale: false,
    tags: ['electricity', 'power cut', 'spark', 'light', 'fan', 'switchboard', 'breaker'],
    helpfulCount: 290,
    unhelpfulCount: 2,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-09-02T11:00:00Z',
  },
  {
    id: 'kb-dept-004',
    title: 'Campus Housekeeping & Sanitation Directory',
    slug: 'housekeeping-sanitation-directory',
    category: 'department_directory',
    summary: 'Corridor cleaning, waste disposal, washroom sanitization. Contact: sanitation@campus.edu / Ext 1004.',
    content: `Oversees daily academic and residential cleaning, washroom hygiene, garbage sorting, and campus pest control:
- Officer: S. Verma, Sanitation Superintendent
- Helpdesk Email: sanitation@campus.edu
- Direct Phone: +91-11-2700-1004
- Office Location: Ground Floor, Tagore Hostel Service Bay
- Routine washroom cleaning occurs twice daily (8:00 AM - 10:30 AM & 2:00 PM - 4:00 PM). Log unsanitary conditions or supply shortages on CampusConnect.`,
    ownerDepartment: 'Campus Housekeeping & Sanitation',
    contactEmail: 'sanitation@campus.edu',
    contactPhone: '+91-11-2700-1004',
    officeLocation: 'Tagore Service Bay',
    sourceLink: 'https://campus.edu/directory/sanitation',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-07-28T09:00:00Z',
    isStale: false,
    tags: ['cleaning', 'sanitation', 'washroom dirty', 'garbage', 'housekeeping'],
    helpfulCount: 175,
    unhelpfulCount: 5,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-07-28T09:00:00Z',
  },
  {
    id: 'kb-dept-005',
    title: 'Dean of Student Affairs (DoSA) Office Directory',
    slug: 'dean-student-affairs-directory',
    category: 'department_directory',
    summary: 'Student welfare, club activities, scholarships, discipline. Contact: dosa@campus.edu / Ext 1020.',
    content: `The DoSA office oversees student welfare, registered cultural and technical societies, sports clubs, international student affairs, and grievances:
- Dean: Prof. K. Sen
- Email: dosa@campus.edu
- Direct Phone: +91-11-2700-1020
- Office Location: Admin Block, 2nd Floor, Room 204
- Student Walk-in Consultation Hours: Monday to Thursday, 3:00 PM to 5:00 PM. No prior appointment required for urgent student welfare matters.`,
    ownerDepartment: 'Dean of Student Affairs (DoSA)',
    contactEmail: 'dosa@campus.edu',
    contactPhone: '+91-11-2700-1020',
    officeLocation: 'Admin Block Room 204',
    sourceLink: 'https://campus.edu/directory/dosa',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-09-01T15:00:00Z',
    isStale: false,
    tags: ['dosa', 'student affairs', 'scholarship', 'clubs', 'dean', 'welfare'],
    helpfulCount: 260,
    unhelpfulCount: 3,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-09-01T15:00:00Z',
  },
  {
    id: 'kb-dept-006',
    title: 'Campus Emergency & Security Control Desk (24x7)',
    slug: 'campus-security-emergency-desk',
    category: 'department_directory',
    summary: 'CRITICAL: 24/7 emergency dispatch for accidents, fire, medical crises, security. Dial 1800-CAMPUS-911.',
    content: `The Campus Central Security Control Room operates continuously 24 hours a day, 365 days a year:
- EMERGENCY TOLL-FREE HOTLINE: 1800-CAMPUS-911 (1800-226-787-911)
- Landline Emergency Dispatch: +91-11-2700-9999 / +91-11-2700-1099
- Chief Security Officer: Capt. R. Singh (Retd.)
- Physical Location: Main Entrance Gate Security Headquarters
- Immediate Dispatch Capabilities: Rapid response patrol vehicles, institutional fire response extinguishers, quick medical emergency stretcher teams, and direct linkage with city police and disaster response squads.`,
    ownerDepartment: 'Campus Security & Emergency Response',
    contactEmail: 'security-emergency@campus.edu',
    contactPhone: '+91-11-2700-9999',
    officeLocation: 'Main Gate Security Headquarters',
    sourceLink: 'https://campus.edu/emergency',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-09-18T10:00:00Z',
    isStale: false,
    tags: ['emergency', 'security', 'fire', 'ambulance', 'police', 'accident', 'sos', 'danger'],
    helpfulCount: 890,
    unhelpfulCount: 0,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z',
  },

  // -------------------------------------------------------------------------
  // 5. TECHNICAL FAQS & SELF-HELP TROUBLESHOOTING
  // -------------------------------------------------------------------------
  {
    id: 'kb-faq-001',
    title: 'Wi-Fi Self-Help Troubleshooting: CampusConnect-Secure',
    slug: 'wifi-troubleshooting-self-help',
    category: 'faqs',
    summary: 'Fix Wi-Fi connectivity: use PEAP MSCHAPv2, disable Private MAC address, forget and re-add network.',
    content: `If your phone or laptop cannot connect or shows 'Connected, No Internet' on CampusConnect-Secure:
STEP 1: Verify Active Outages: Check if your hostel block has an active infrastructure outage listed on CampusConnect (e.g. switchboard reboot or fiber cut).
STEP 2: Forget and Re-add Network: Open Wi-Fi settings, select 'CampusConnect-Secure', and click 'Forget Network'.
STEP 3: Check Authentication Settings:
- Security Type: WPA2-Enterprise / 802.1x
- EAP Method: PEAP
- Phase 2 Authentication: MSCHAPv2
- CA Certificate: 'Do Not Validate' or 'Trust System Roots'
- Identity: Your complete campus email ID (e.g. student@campusconnect.demo)
- Password: Your institutional LDAP password
STEP 4: Turn OFF Random MAC Address: In Android / iOS settings for this network, change 'MAC Address Type' from 'Randomized MAC' to 'Use Device MAC'. Enterprise radius authentication blocks rapidly changing randomized MACs.
If connection still fails and no outage exists, submit a ticket on CampusConnect under 'Internet & IT Network'.`,
    ownerDepartment: 'IT Network & Systems Operations',
    contactEmail: 'it-support@campus.edu',
    contactPhone: '+91-11-2700-1001',
    officeLocation: 'Tech Center Ground Floor',
    sourceLink: 'https://campus.edu/it/wifi-configuration-guide',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-09-01T12:00:00Z',
    isStale: false,
    tags: ['wifi not working', 'internet', 'troubleshooting', 'campusconnect-secure', 'self help', 'slow speed'],
    helpfulCount: 650,
    unhelpfulCount: 11,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z',
  },
  {
    id: 'kb-faq-002',
    title: 'Water Supply Timings and Pressure Fluctuations',
    slug: 'water-supply-timings',
    category: 'faqs',
    summary: 'Hostel water supply runs 6:00 - 10:30 AM & 5:00 - 9:30 PM. Gravity backup provides low flow outside hours.',
    content: `Main pumped water supply across residential hostels follows a scheduled pressure cycle:
- Morning High Pressure: 6:00 AM to 10:30 AM
- Evening High Pressure: 5:00 PM to 9:30 PM
- Outside these windows, secondary overhead gravity tanks provide baseline low-pressure water for basic usage.
- If your room or washroom wing has zero water flow during the scheduled high-pressure hours, check whether your wing's riser valve is affected by an active outage or submit a ticket under 'Plumbing & Hydraulic Services'.`,
    ownerDepartment: 'Plumbing & Hydraulic Services',
    contactEmail: 'facilities-water@campus.edu',
    contactPhone: '+91-11-2700-1002',
    officeLocation: 'Maintenance Shed B',
    sourceLink: 'https://campus.edu/facilities/water-schedule',
    audience: 'hostel_residents',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-08-15T09:00:00Z',
    isStale: false,
    tags: ['water timing', 'no water', 'tap dry', 'low pressure', 'water supply'],
    helpfulCount: 310,
    unhelpfulCount: 8,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'kb-faq-003',
    title: 'Winter Geyser and Hot Water Operation Hours',
    slug: 'winter-geyser-timings',
    category: 'faqs',
    summary: 'Central hot water geysers operate November through February from 5:30 AM to 10:00 AM daily.',
    content: `Solar and electric hybrid geyser systems in hostel washroom complexes are energized during the winter quarter (November 1 to February 28):
- Active Hours: 5:30 AM to 10:00 AM every morning.
- Evening Hot Water: 6:00 PM to 8:30 PM on days with ambient temperatures below 12°C.
- Individual immersion heaters remain strictly banned due to electrical safety risks.
- If a washroom geyser pilot light is off during scheduled hours, report the issue on CampusConnect under 'Electricity & Lighting'.`,
    ownerDepartment: 'Electrical & Plumbing Operations',
    contactEmail: 'facilities@campus.edu',
    contactPhone: '+91-11-2700-1002',
    officeLocation: 'Maintenance Shed B',
    sourceLink: 'https://campus.edu/facilities/geyser-schedule',
    audience: 'hostel_residents',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-08-01T10:00:00Z',
    isStale: false,
    tags: ['geyser', 'hot water', 'winter', 'cold water', 'heater'],
    helpfulCount: 220,
    unhelpfulCount: 4,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'kb-faq-004',
    title: 'Lost and Found Property Desk',
    slug: 'lost-and-found-desk',
    category: 'faqs',
    summary: 'Lost items deposited at Main Gate Security Booth. Items cataloged and held for 30 days.',
    content: `Items found across classrooms, laboratories, libraries, and quads are handed over to the Central Security Booth:
- Inquire in person with your Student ID at the Main Gate Security Booth between 9:00 AM and 6:00 PM.
- To claim an item (laptop, mobile phone, earphones, wallet, keys), you must accurately describe identifying features or unlock electronic devices.
- Unclaimed items are held for 30 calendar days before being transferred to institutional storage or charitable disposal.`,
    ownerDepartment: 'Campus Security',
    contactEmail: 'security@campus.edu',
    contactPhone: '+91-11-2700-1007',
    officeLocation: 'Main Gate Security Booth',
    sourceLink: 'https://campus.edu/security/lost-found',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-07-20T10:00:00Z',
    isStale: false,
    tags: ['lost', 'found', 'missing item', 'wallet', 'phone', 'keys', 'security'],
    helpfulCount: 195,
    unhelpfulCount: 2,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 'kb-faq-005',
    title: 'Student Two-Wheeler Parking and Campus Vehicle Rules',
    slug: 'parking-vehicle-rules',
    category: 'faqs',
    summary: 'Student two-wheelers parked in Lot P2. Helmets mandatory at gate. No student four-wheelers.',
    content: `Campus regulations governing personal student vehicles:
1. Two-Wheelers: Must be registered with the Security Office to obtain a reflective parking barcode sticker. Park exclusively in designated Lot P2 (adjacent to Sports Complex).
2. Safety: ISI-marked safety helmets are mandatory for both driver and pillion rider at all entry and exit gates. Riding without a helmet incurs an immediate gate confiscation fine of Rs. 300.
3. Four-Wheelers: Undergraduate hostel residents are strictly not permitted to park four-wheeler cars inside campus premises due to space limitations.
4. Speed Limit: The campus-wide speed limit is strictly 20 km/h with active radar monitoring.`,
    ownerDepartment: 'Campus Traffic & Security Control',
    contactEmail: 'traffic@campus.edu',
    contactPhone: '+91-11-2700-1007',
    officeLocation: 'Main Gate Traffic Kiosk',
    sourceLink: 'https://campus.edu/security/parking-regulations',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-06-30T10:00:00Z',
    isStale: false,
    tags: ['parking', 'bike', 'scooter', 'helmet', 'vehicle', 'car'],
    helpfulCount: 140,
    unhelpfulCount: 16,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-06-30T10:00:00Z',
  },
  {
    id: 'kb-faq-006',
    title: 'Classroom AV and Projector Troubleshooting',
    slug: 'classroom-av-troubleshooting',
    category: 'faqs',
    summary: 'For HDMI/audio projector issues in lecture halls, call IT dispatch at extension 1005.',
    content: `When experiencing projector, microphone, or presentation display issues in teaching halls:
- HDMI Cable Swap: Check the podium cable well for alternate HDMI or USB-C dongles.
- Podium Power Switch: Ensure the master AV breaker switch on the side panel is set to 'ON'.
- Fast Technician Dispatch: Call Extension 1005 from the podium landline phone. An on-duty IT media technician arrives within 10 to 15 minutes.`,
    ownerDepartment: 'IT Classroom Media Operations',
    contactEmail: 'av-support@campus.edu',
    contactPhone: '+91-11-2700-1005',
    officeLocation: 'Academic Quad Media Booth 102',
    sourceLink: 'https://campus.edu/it/classroom-av',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-07-05T14:00:00Z',
    isStale: false,
    tags: ['projector', 'classroom audio', 'mic', 'hdmi', 'presentation', 'lecture hall'],
    helpfulCount: 88,
    unhelpfulCount: 2,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-07-05T14:00:00Z',
  },
  {
    id: 'kb-faq-007',
    title: 'Campus Sustainability & Waste Segregation Policy',
    slug: 'sustainability-waste-segregation',
    category: 'faqs',
    summary: 'Green bins for food waste, blue bins for recyclables. Zero single-use plastic on campus.',
    content: `The university is a certified Zero-Waste-to-Landfill campus:
- Blue Bins: Paper, clean cardboard, plastic bottles, metal cans.
- Green Bins: Biodegradable food scraps, fruit peels, mess leftovers.
- Red Bins: Sanitary waste and hazardous chemical packaging.
- E-Waste Drop Box: Used batteries, broken cables, and obsolete electronics must be deposited in the e-waste collection bin located in the Central Library Lobby.
Single-use plastic cups and straws are strictly banned in all cafeterias.`,
    ownerDepartment: 'Green Campus & Sustainability Cell',
    contactEmail: 'green@campus.edu',
    contactPhone: '+91-11-2700-1088',
    officeLocation: 'Bio-Science Quad Room 12',
    sourceLink: 'https://campus.edu/green/waste-code',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-01-01',
    effectiveTo: null,
    lastReviewedAt: '2026-05-15T11:00:00Z',
    isStale: false,
    tags: ['waste', 'recycling', 'green campus', 'e-waste', 'plastic ban'],
    helpfulCount: 95,
    unhelpfulCount: 3,
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: '2026-05-15T11:00:00Z',
  },

  // -------------------------------------------------------------------------
  // 6. STALE ENTRIES (TO TRIGGER FRESHNESS WARNINGS DEMONSTRATION)
  // -------------------------------------------------------------------------
  {
    id: 'kb-stale-001',
    title: 'Library Summer 2025 Temporary Renovation Timings',
    slug: 'library-summer-2025-renovation-timings',
    category: 'facilities',
    summary: 'TEMPORARY: Ground floor restricted during HVAC overhaul. Last reviewed in March 2025.',
    content: `During the Summer 2025 HVAC modernization project, the Central Library Ground floor reading zone operated on shortened hours from 9:00 AM to 6:00 PM.
Students were redirected to the 2nd floor and the APJ Abdul Kalam Quad reading rooms.
Note: This document reflects temporary schedules from the 2025 renovation cycle. For current standard operating hours, refer to the active Central Library schedule.`,
    ownerDepartment: 'Library & Learning Resource Center',
    contactEmail: 'library-helpdesk@campus.edu',
    contactPhone: '+91-11-2700-1050',
    officeLocation: 'Central Library Circulation Desk',
    sourceLink: 'https://campus.edu/library/archived-2025-renovation',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2025-03-01',
    effectiveTo: '2025-07-31',
    lastReviewedAt: '2025-03-10T10:00:00Z', // > 180 days ago (Stale!)
    isStale: true,
    tags: ['library hours', 'renovation', 'summer 2025', 'stale'],
    helpfulCount: 12,
    unhelpfulCount: 28,
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-03-10T10:00:00Z',
  },
  {
    id: 'kb-stale-002',
    title: 'Old Metro Feeder Route via North Gate 3 (Archived Route)',
    slug: 'old-metro-feeder-route-3',
    category: 'facilities',
    summary: 'HISTORICAL: Shuttle stop at North Gate 3 discontinued due to flyover construction. Last reviewed January 2025.',
    content: `Historical notice regarding the discontinued North Gate 3 bus stop:
Following municipal flyover construction in early 2025, the campus shuttle route was permanently relocated to Main Gate Turnaround Kiosk.
Do not wait at North Gate 3 for shuttle pickups. All current shuttles depart exclusively from Main Gate and APJ Quad.`,
    ownerDepartment: 'Campus Transport & Fleet Management',
    contactEmail: 'transport@campus.edu',
    contactPhone: '+91-11-2700-1070',
    officeLocation: 'Transport Depot Near Gate 2',
    sourceLink: 'https://campus.edu/transport/archived-routes',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2025-01-01',
    effectiveTo: '2025-06-30',
    lastReviewedAt: '2025-01-15T09:00:00Z', // > 180 days ago (Stale!)
    isStale: true,
    tags: ['bus route', 'gate 3', 'discontinued', 'shuttle old', 'stale'],
    helpfulCount: 5,
    unhelpfulCount: 42,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T09:00:00Z',
  },

  // -------------------------------------------------------------------------
  // 7. CAMPUS EVENTS & ACTIVITIES
  // -------------------------------------------------------------------------
  {
    id: 'kb-event-001',
    title: 'Annual TechFest Innovate 2026 Hackathon & Exhibition',
    slug: 'techfest-innovate-2026',
    category: 'events',
    summary: 'Flagship campus technical festival: Oct 28 - 30, 2026. Cash prizes, keynote workshops.',
    content: `Innovate 2026 brings together top engineering student teams, startup founders, and research labs:
- Dates: October 28 to October 30, 2026.
- Venue: APJ Abdul Kalam Engineering Quad Auditorium & Innovation Labs.
- Highlights: 36-Hour AI Hackathon, Robotics Obstacle Arena, Autonomous Drone Racing, and Venture Pitching.
- Registration: Open on techfest.campus.edu. Free lunch passes provided for all registered participants. Classes suspended for participating teams on Oct 29.`,
    ownerDepartment: 'Student Technical Council & DoSA',
    contactEmail: 'techfest@campus.edu',
    contactPhone: '+91-11-2700-1090',
    officeLocation: 'Student Activity Center Room 2',
    sourceLink: 'https://techfest.campus.edu',
    audience: 'all',
    status: 'published',
    effectiveFrom: '2026-10-01',
    effectiveTo: '2026-11-05',
    lastReviewedAt: '2026-10-10T10:00:00Z',
    isStale: false,
    tags: ['techfest', 'hackathon', 'events', 'robotics', 'competitions', 'innovate 2026'],
    helpfulCount: 540,
    unhelpfulCount: 2,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-10T10:00:00Z',
  },
  {
    id: 'kb-event-002',
    title: 'Inter-Hostel Sports Olympiad 2026',
    slug: 'inter-hostel-sports-olympiad-2026',
    category: 'events',
    summary: 'Cricket, Football, Basketball, Athletics clash between Tagore, Raman, and Kalam Hostels. Nov 5-12.',
    content: `The premier inter-hostel athletic competition of the academic year:
- Schedule: November 5 through November 12, 2026.
- Fixtures: Cricket at Main Stadium Oval; Football on West Ground; Basketball at Floodlit Hardcourts.
- Points Table & Trophies: Winner receives the rolling Chancellor's Athletics Trophy.
- Sign up with your Hostel Sports Secretary before October 31st.`,
    ownerDepartment: 'Department of Physical Education & Sports',
    contactEmail: 'sports@campus.edu',
    contactPhone: '+91-11-2700-1060',
    officeLocation: 'Indoor Sports Complex',
    sourceLink: 'https://campus.edu/sports/olympiad-2026',
    audience: 'hostel_residents',
    status: 'published',
    effectiveFrom: '2026-10-01',
    effectiveTo: '2026-11-20',
    lastReviewedAt: '2026-10-12T11:00:00Z',
    isStale: false,
    tags: ['sports olympiad', 'football', 'cricket', 'hostel cup', 'athletics'],
    helpfulCount: 290,
    unhelpfulCount: 4,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-12T11:00:00Z',
  },
];

// Initial seeded knowledge gaps for Admin overview
export const INITIAL_KNOWLEDGE_GAPS: KnowledgeGap[] = [
  {
    id: 'gap-001',
    normalizedTopic: 'Drone Flying and Photography Permission Protocol',
    sampleQuestions: [
      'Can I fly my camera drone on the football field for a club video?',
      'How to get drone permission on campus?',
      'Is personal drone photography allowed near hostels?'
    ],
    count: 14,
    unansweredCount: 14,
    thumbsDownCount: 2,
    suggestedDepartment: 'Campus Security & Media Relations',
    status: 'open',
    createdAt: '2026-10-20T12:00:00Z',
    updatedAt: '2026-10-23T16:00:00Z',
  },
  {
    id: 'gap-002',
    normalizedTopic: 'Bicycle Rental and On-Campus Repair Stand',
    sampleQuestions: [
      'Where can I get my bicycle tire punctured fixed on campus?',
      'Is there a cycle repair shop near the hostels?',
      'How do I rent an electric bicycle from campus stand?'
    ],
    count: 11,
    unansweredCount: 9,
    thumbsDownCount: 3,
    suggestedDepartment: 'Campus Transport & Fleet Management',
    status: 'open',
    createdAt: '2026-10-19T09:30:00Z',
    updatedAt: '2026-10-22T14:15:00Z',
  },
  {
    id: 'gap-003',
    normalizedTopic: 'Passport Police Verification NOC Letter',
    sampleQuestions: [
      'Police station is asking for college hostel address proof letter for passport',
      'Where to get NOC for passport verification as a hosteler?',
      'Hostel address certificate for passport police enquiry'
    ],
    count: 18,
    unansweredCount: 18,
    thumbsDownCount: 1,
    suggestedDepartment: 'Chief Warden Office & Academic Records',
    status: 'open',
    createdAt: '2026-10-18T14:00:00Z',
    updatedAt: '2026-10-23T18:00:00Z',
  },
  {
    id: 'gap-004',
    normalizedTopic: 'Overnight Lab Access Extension for Capstone Projects',
    sampleQuestions: [
      'Can final year students work overnight in IoT lab?',
      'Who signs night lab pass for 4th year BTech capstone?',
      'Permission for staying in engineering lab past 2 AM'
    ],
    count: 22,
    unansweredCount: 19,
    thumbsDownCount: 4,
    suggestedDepartment: 'Dean of Academic Affairs & Faculty Supervisors',
    status: 'open',
    createdAt: '2026-10-15T11:00:00Z',
    updatedAt: '2026-10-24T06:00:00Z',
  },
];

// Operational in-memory storage helpers
let knowledgeStore: CampusKnowledgeEntry[] = [...SEEDED_CAMPUS_KNOWLEDGE_ENTRIES];
let gapsStore: KnowledgeGap[] = [...INITIAL_KNOWLEDGE_GAPS];

export function getPublishedKnowledgeEntries(): CampusKnowledgeEntry[] {
  return knowledgeStore.filter(e => e.status === 'published');
}

export function getAllKnowledgeEntries(): CampusKnowledgeEntry[] {
  return [...knowledgeStore];
}

export function getKnowledgeEntryById(id: string): CampusKnowledgeEntry | undefined {
  return knowledgeStore.find(e => e.id === id || e.slug === id);
}

export function saveKnowledgeEntry(entry: CampusKnowledgeEntry): CampusKnowledgeEntry {
  const idx = knowledgeStore.findIndex(e => e.id === entry.id);
  if (idx >= 0) {
    knowledgeStore[idx] = { ...entry, updatedAt: new Date().toISOString() };
    return knowledgeStore[idx];
  } else {
    const newEntry = {
      ...entry,
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    knowledgeStore.unshift(newEntry);
    return newEntry;
  }
}

export function getKnowledgeGaps(): KnowledgeGap[] {
  return [...gapsStore];
}

export function recordKnowledgeGap(query: string, departmentHint?: string): void {
  const norm = query.trim().toLowerCase();
  if (norm.length < 5) return;

  const existing = gapsStore.find(g => 
    norm.includes(g.normalizedTopic.toLowerCase().slice(0, 15)) ||
    g.sampleQuestions.some(sq => sq.toLowerCase().includes(norm.slice(0, 15)))
  );

  if (existing) {
    existing.count += 1;
    existing.unansweredCount += 1;
    if (!existing.sampleQuestions.includes(query) && existing.sampleQuestions.length < 5) {
      existing.sampleQuestions.push(query);
    }
    existing.updatedAt = new Date().toISOString();
  } else {
    gapsStore.unshift({
      id: `gap-${Date.now()}`,
      normalizedTopic: query.slice(0, 50),
      sampleQuestions: [query],
      count: 1,
      unansweredCount: 1,
      thumbsDownCount: 0,
      suggestedDepartment: departmentHint || 'General Administration',
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

export function recordThumbsDownFeedback(topic: string, query: string): void {
  const existing = gapsStore.find(g => 
    g.normalizedTopic.toLowerCase().includes(topic.toLowerCase().slice(0, 15))
  );
  if (existing) {
    existing.thumbsDownCount += 1;
    existing.updatedAt = new Date().toISOString();
  } else {
    recordKnowledgeGap(query);
  }
}
