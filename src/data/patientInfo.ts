/**
 * CARDYCO Patient Information — Single Source of Truth
 * All components should import from here instead of using hardcoded strings.
 */

export const PATIENT_INFO = {
  name: 'Sunita Sharma',
  initials: 'SS',
  age: 62,
  displayAge: '62 yrs, Female',
  sex: 'Female',
  uhid: '#AP-82941-IN',
  monitoringProtocol: 'CARDYCO 30-Day Ambulatory',
} as const;

export const DOCTOR_INFO = {
  primary: {
    name: 'Dr. Rajesh Sharma',
    credentials: 'MD, DM (Cardiology), FACC',
    fullTitle: 'Dr. Rajesh Sharma, MD, DM (Cardiology), FACC',
    specialty: 'Senior Consultant Interventional Cardiologist',
    hospital: 'Apollo Hospitals & AIIMS Telemetry Network',
    registration: 'MCI-29481',
  },
  secondary: [
    { name: 'Dr. Priya Nair', credentials: 'MD (Cardiology, AIIMS)' },
    { name: 'Dr. Vikram Malhotra', credentials: 'MD (Fortis Heart Institute)' },
    { name: 'Dr. Ananya Sen', credentials: 'MD (AIIMS)' },
  ],
} as const;

export const HOSPITAL_INFO = {
  name: 'Apollo Hospitals & Heart Centre, New Delhi',
  shortName: 'Apollo Hospitals & Heart Centre',
  department: 'Department of Cardiac Electrophysiology & AIIMS Telemetry Network',
  accreditation: 'NABL Accredited Cardiac Holter Lab • ICMR Reg. #DL-NABL-88491',
  documentId: 'IND-CARDYCO-9884',
} as const;

export const DEVICE_INFO = {
  serial: 'CARDYCO-9884-TX',
  model: 'CARDYCO IoT Patch V3',
  firmware: 'v2.14-IN',
} as const;
