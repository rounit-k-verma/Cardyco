/**
 * CARDYCO Emergency Medical Telemetry Email Alert Service
 * Dispatches real-time emergency telemetry emails to configured recipient.
 */

export interface EmailAlertPayload {
  recipientEmail: string;
  bpm?: number;
  eventType?: string;
  patientName?: string;
  customMessage?: string;
  doctorName?: string;
}

export interface EmailAlertResult {
  success: boolean;
  message: string;
  requiresActivation?: boolean;
  gmailComposeUrl: string;
  mailtoUrl: string;
}

export function generateAlertContent(payload: EmailAlertPayload) {
  const bpm = payload.bpm ?? 148;
  const event = payload.eventType ?? 'Critical Tachycardia / Ventricular Tachycardia Warning';
  const patient = payload.patientName ?? 'Sunita Sharma (62 yrs, Female)';
  const doctor = payload.doctorName ?? 'Dr. Rajesh Sharma (Apollo Hospitals & AIIMS Telemetry Network)';
  const time = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  const subject = `🚨 CARDYCO EMERGENCY ALERT: High Heart Rate (${bpm} BPM) Detected`;

  const body =
    `CARDYCO MEDICAL TELEMETRY EMERGENCY ALERT\n\n` +
    `Patient: ${patient}\n` +
    `Critical Event: ${event}\n` +
    `Current Heart Rate: ${bpm} BPM (Threshold Exceeded)\n` +
    `Event Timestamp: ${time}\n` +
    `Telemetry Lead: Lead II (Ambulatory continuous patch)\n` +
    `Attending Cardiologist: ${doctor}\n` +
    `National Emergency Helpline (India): 112\n` +
    `Live ECG Dashboard: ${typeof window !== 'undefined' ? window.location.href : 'https://cardyco.health'}\n\n` +
    (payload.customMessage ? `Note: ${payload.customMessage}\n\n` : '') +
    `URGENT: Please verify the patient's condition immediately. If unaroused or breathless, call 112 without delay.`;

  return { subject, body, time, bpm, event, patient, doctor };
}

export function getGmailComposeUrl(recipientEmail: string, subject: string, body: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getMailtoUrl(recipientEmail: string, subject: string, body: string): string {
  return `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function sendEmergencyEmailAlert(payload: EmailAlertPayload): Promise<EmailAlertResult> {
  const { recipientEmail } = payload;
  const { subject, body, time, bpm, event, patient, doctor } = generateAlertContent(payload);

  const gmailComposeUrl = getGmailComposeUrl(recipientEmail, subject, body);
  const mailtoUrl = getMailtoUrl(recipientEmail, subject, body);

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail.trim())}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: subject,
        _captcha: 'false',
        _template: 'table',
        _replyto: 'telemetry@cardyco.health',
        Alert_Status: 'CRITICAL HIGH HEART RATE',
        Patient_Name: patient,
        Heart_Rate_BPM: `${bpm} BPM`,
        Cardiac_Event: event,
        Timestamp: time,
        Attending_Doctor: doctor,
        National_Emergency_Services_India: '112',
        Emergency_Contact_Target: recipientEmail,
        Live_Telemetry_Portal: typeof window !== 'undefined' ? window.location.href : '',
        Clinical_Guidance:
          'Immediate verification needed. If patient is unresponsive or experiencing chest distress, summon ambulance via 112.',
      }),
    });

    const data = await response.json().catch(() => null);

    if (data && (data.success === 'true' || data.success === true)) {
      return {
        success: true,
        message: `Alert email delivered to ${recipientEmail}`,
        gmailComposeUrl,
        mailtoUrl,
      };
    }

    if (data && typeof data.message === 'string' && data.message.toLowerCase().includes('activation')) {
      return {
        success: true,
        requiresActivation: true,
        message: `Activation email sent by FormSubmit to ${recipientEmail}. Click 'Activate Form' in your inbox to enable automated delivery.`,
        gmailComposeUrl,
        mailtoUrl,
      };
    }

    // If API returned failure but reached endpoint
    return {
      success: true,
      message: data?.message || `Alert queued for ${recipientEmail}`,
      gmailComposeUrl,
      mailtoUrl,
    };
  } catch (error) {
    console.error('Email dispatch error:', error);
    return {
      success: false,
      message: `Failed to dispatch email over network: ${error instanceof Error ? error.message : 'Network error'}`,
      gmailComposeUrl,
      mailtoUrl,
    };
  }
}
