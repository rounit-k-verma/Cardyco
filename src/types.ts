export type TabType = 'live' | 'history' | 'settings';

export interface ECGRecording {
  id: string;
  date: string;
  time: string;
  bpm: number;
  bpmType: 'PEAK' | 'REST' | 'AVG';
  lead: string;
  duration: string;
  status: 'flagged' | 'normal';
  statusLabel: string;
  rhythmDetail: string; // e.g., 'PR: 118ms', 'QRS: 86ms', 'QTc: 412ms', 'ST Seg: Isoelectric'
  metaNote: string; // e.g. 'AI Biometric Analysis complete', 'Recorded for 45s', 'Reviewed by Dr. Vance', 'Sensor Signal 99% Quality'
  metaIcon: string;
  waveformVariant: 'tachycardia' | 'resting-sinus' | 'normal-walk' | 'morning-baseline';
  doctorReviewed?: boolean;
  reviewer?: string;
  pathData: string;
}

export interface VitalsData {
  heartRate: number;
  rhythmStatus: string;
  hrv: number;
  hrvStatus: string;
  spo2: number;
  spo2Status: string;
  battery: number;
  signalQuality: number; // 1 to 5
  lead: string;
  sweepSpeed: string;
  calibration: string;
  filter: string;
}

export interface PatientInfo {
  name: string;
  age: number;
  mrn: string;
  assignedDoctor: string;
  clinic: string;
  deviceSerial: string;
}
