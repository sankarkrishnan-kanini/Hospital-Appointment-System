'use client';
import { useState, useCallback, useRef } from 'react';
import {
  getPatientAppointmentsApi,
  cancelAppointmentApi,
  searchDoctorsApi,
  getClientAccountApi,
  getSpecializationsApi,
  getAvailableTimeSlotsApi,
  bookAppointmentApi,
} from '@/lib/api/patient.api';
import {
  getDoctorAppointmentsApi,
  completeAppointmentApi,
  getDoctorAnalyticsApi,
  getDoctorProfileApi,
  getDoctorOfficesApi,
} from '@/lib/api/doctor.api';

export interface ChatMessage {
  id: number;
  from: 'bot' | 'user';
  text: string;
  chips?: string[];
  timestamp: Date;
  navigate?: string; // route to navigate to when chip is clicked
  chipRoutes?: Record<string, string>; // chip label → route mapping
  isEmergency?: boolean; // highlight emergency messages
}

// Booking flow state
interface BookingState {
  step: 'idle' | 'select_doctor' | 'select_practice' | 'select_date' | 'select_slot' | 'confirm';
  doctors?: any[];
  selectedDoctor?: any;
  selectedPractice?: any;
  availableDates?: { date: string; slots: any[] }[];
  selectedDate?: string;
  availableSlots?: any[];
  selectedSlot?: any;
}

const SYMPTOM_MAP: Record<string, string> = {
  'chest pain': 'Cardiologist',
  'heart': 'Cardiologist',
  'headache': 'Neurologist',
  'brain': 'Neurologist',
  'skin': 'Dermatologist',
  'rash': 'Dermatologist',
  'eye': 'Ophthalmologist',
  'vision': 'Ophthalmologist',
  'teeth': 'Dentist',
  'tooth': 'Dentist',
  'bone': 'Orthopedist',
  'joint': 'Orthopedist',
  'child': 'Pediatrician',
  'kids': 'Pediatrician',
  'stomach': 'Gastroenterologist',
  'digestion': 'Gastroenterologist',
  'mental': 'Psychiatrist',
  'anxiety': 'Psychiatrist',
  'depression': 'Psychiatrist',
};

const FAQ: Record<string, string> = {
  'bring': '📋 Please bring a valid ID, your insurance card, and any previous medical records or prescriptions.',
  'cost': '💰 Consultation fees vary by doctor. You can see the fee when searching for doctors.',
  'reschedule': '🔄 To reschedule, visit My Appointments and select the appointment you want to change.',
  'insurance': '🏥 Insurance acceptance depends on the doctor. Check the doctor profile for details.',
  'how long': '⏱️ Appointments typically last 15–30 minutes depending on the doctor.',
};

let msgId = 0;
const msg = (from: 'bot' | 'user', text: string, chips?: string[], extra?: Partial<ChatMessage>): ChatMessage => ({
  id: ++msgId, from, text, chips, timestamp: new Date(), ...extra,
});

// ─── EMERGENCY KEYWORDS & CONFIG ────────────────────────────────────────────
const EMERGENCY_KEYWORDS = [
  'emergency', 'chest pain', "can't breathe", 'cannot breathe',
  'heart attack', 'stroke', 'unconscious', 'severe bleeding',
  'choking', 'seizure', 'suicide', 'overdose', 'poisoning',
  'accident', 'trauma', 'fainted', 'not breathing',
];

const EMERGENCY_RESPONSE = `🚨 **EMERGENCY DETECTED**

If you or someone near you is in immediate danger, please act NOW:

📞 **Emergency Numbers:**
• Ambulance: 108
• Emergency: 112
• Police: 100

🏥 **Immediate Steps:**
1. Call 108 immediately
2. Stay calm and describe your location
3. Do NOT move an injured person unless in danger
4. If unconscious, check breathing & clear airway

⚠️ This chatbot is NOT a substitute for emergency medical care. Please call emergency services immediately.`;

export function useChatBot(role: 'patient' | 'doctor', userName: string) {
  const greeting = `👋 Hi ${userName}! I'm your assistant. How can I help you today?`;
  const defaultChips = role === 'patient'
    ? ['View Appointments', 'Find Doctors', 'My Profile', 'Book Appointment']
    : ["Today's Appointments", 'Analytics', 'My Profile', 'Pending Actions'];

  // Default chip → route mapping for contextual navigation
  const defaultChipRoutes: Record<string, string> = role === 'patient'
    ? {
        'View Appointments': '/patient/appointments',
        'Find Doctors': '/patient/doctors',
        'My Profile': '/patient/profile',
        'Book Appointment': '',  // handled by chat flow, no navigation
      }
    : {
        "Today's Appointments": '/doctor/appointments',
        'Analytics': '/doctor/analytics',
        'My Profile': '/doctor/profile',
        'Pending Actions': '',
      };

  const [messages, setMessages] = useState<ChatMessage[]>([
    msg('bot', greeting, defaultChips, { chipRoutes: defaultChipRoutes }),
  ]);
  const [loading, setLoading] = useState(false);
  const [briefingDone, setBriefingDone] = useState(false);
  const bookingRef = useRef<BookingState>({ step: 'idle' });

  const push = useCallback((m: ChatMessage) => setMessages(p => [...p, m]), []);
  const botReply = useCallback((text: string, chips?: string[], extra?: Partial<ChatMessage>) => push(msg('bot', text, chips, extra)), [push]);

  // ─── EMERGENCY CHECK ───────────────────────────────────────────────────────
  const checkEmergency = useCallback((input: string): boolean => {
    const lower = input.toLowerCase();
    const isEmergency = EMERGENCY_KEYWORDS.some(kw => lower.includes(kw));
    if (isEmergency) {
      botReply(EMERGENCY_RESPONSE, ['I\'m okay, continue', 'Call 108 Now'], { isEmergency: true });
      return true;
    }
    return false;
  }, [botReply]);

  // ─── DOCTOR DAILY BRIEFING ─────────────────────────────────────────────────
  const generateDailyBriefing = useCallback(async () => {
    setLoading(true);
    try {
      const [aptsRes, analyticsRes] = await Promise.all([
        getDoctorAppointmentsApi(),
        getDoctorAnalyticsApi(),
      ]);
      const apts = Array.isArray(aptsRes.data) ? aptsRes.data : [];
      const today = new Date().toDateString();
      const todayApts = apts.filter((a: any) => new Date(a.probableStartTime).toDateString() === today);
      const pending = todayApts.filter((a: any) => a.status?.status !== 'Completed' && a.status?.status !== 'CANCELLED');
      const summary = analyticsRes.data?.summary;

      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

      const firstApt = pending.sort((a: any, b: any) =>
        new Date(a.probableStartTime).getTime() - new Date(b.probableStartTime).getTime()
      )[0];

      let briefing = `☀️ ${timeGreeting}, Dr. ${userName.replace('Dr. ', '')}!\n\n📋 **Today's Briefing:**\n`;
      briefing += `• 📅 ${pending.length} appointment${pending.length !== 1 ? 's' : ''} today\n`;
      
      if (firstApt) {
        const time = new Date(firstApt.probableStartTime).toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' });
        const patientName = firstApt.client ? `${firstApt.client.firstName} ${firstApt.client.lastName}` : 'Patient';
        briefing += `• 🕐 First up: ${patientName} at ${time}\n`;
      }

      if (summary) {
        briefing += `• 💰 Total earnings: ₹${summary.totalEarnings ?? 0}\n`;
        briefing += `• 👥 Total patients served: ${summary.totalPatients ?? 0}\n`;
      }

      const completed = todayApts.filter((a: any) => a.status?.status === 'Completed').length;
      if (completed > 0) {
        briefing += `• ✅ ${completed} already completed today\n`;
      }

      briefing += `\nWhat would you like to do?`;

      botReply(briefing, ["Today's Appointments", 'Analytics', 'Next Patient', 'My Profile'], {
        chipRoutes: {
          "Today's Appointments": '/doctor/appointments',
          'Analytics': '/doctor/analytics',
          'My Profile': '/doctor/profile',
        }
      });
    } catch {
      botReply(`👋 Welcome back, Dr. ${userName.replace('Dr. ', '')}! How can I help you today?`, defaultChips);
    } finally { setLoading(false); }
  }, [botReply, userName, defaultChips]);

  // ─── BOOKING FLOW ────────────────────────────────────────────────────────────

  const startBookingFlow = useCallback(async () => {
    setLoading(true);
    try {
      const res = await searchDoctorsApi({});
      const doctors = Array.isArray(res.data) ? res.data : [];
      if (!doctors.length) return botReply('😔 No verified doctors available right now.', defaultChips);

      bookingRef.current = { step: 'select_doctor', doctors };

      const lines = doctors.map((d: any, i: number) => {
        const spec = Array.isArray(d.specializations) ? d.specializations[0] ?? 'General' : 'General';
        return `${i + 1}. Dr. ${d.firstName} ${d.lastName} — ${spec}`;
      }).join('\n');

      botReply(
        `🩺 Available doctors:\n${lines}\n\nReply with the number to select a doctor (e.g. "1"):`,
        doctors.map((_: any, i: number) => `${i + 1}`)
      );
    } finally { setLoading(false); }
  }, [botReply, defaultChips]);

  const handleBookingStep = useCallback(async (input: string): Promise<boolean> => {
    const state = bookingRef.current;
    if (state.step === 'idle') return false;

    const lower = input.toLowerCase().trim();

    // Allow cancel at any step
    if (lower === 'cancel' || lower === 'cancel booking') {
      bookingRef.current = { step: 'idle' };
      botReply('❌ Booking cancelled.', defaultChips);
      return true;
    }

    // Step 1: select doctor by number
    if (state.step === 'select_doctor') {
      const idx = parseInt(input.trim()) - 1;
      if (isNaN(idx) || idx < 0 || idx >= (state.doctors?.length ?? 0)) {
        botReply(`Please reply with a number between 1 and ${state.doctors?.length}.`);
        return true;
      }
      const doctor = state.doctors![idx];
      const practices = doctor.practices ?? [];

      if (!practices.length) {
        botReply('⚠️ This doctor has no active practices. Please choose another.', state.doctors!.map((_: any, i: number) => `${i + 1}`));
        return true;
      }

      bookingRef.current = { ...state, step: 'select_practice', selectedDoctor: doctor };

      if (practices.length === 1) {
        // Auto-select single practice, go straight to slots
        bookingRef.current.selectedPractice = practices[0];
        bookingRef.current.step = 'select_date';
        setLoading(true);
        try {
          const res = await getAvailableTimeSlotsApi(doctor.id, practices[0].doctorHospitalId);
          const dates: { date: string; slots: any[] }[] = Array.isArray(res.data) ? res.data : [];
          if (!dates.length) {
            bookingRef.current = { step: 'idle' };
            return botReply('😔 No available slots for this doctor right now.', defaultChips), true;
          }
          bookingRef.current.availableDates = dates;
          bookingRef.current.step = 'select_date';
          const dateChips = dates.map((d: any) => d.date);
          botReply(
            `📍 Practice: ${practices[0].isPrivate ? `Private — ${practices[0].city ?? ''}` : practices[0].hospital?.name ?? 'Hospital'}\n\n📅 Available dates:\n${dateChips.map((d: string) => `• ${d}`).join('\n')}\n\nWhich date works for you?`,
            dateChips
          );
        } finally { setLoading(false); }
        return true;
      }

      const lines = practices.map((p: any, i: number) => {
        const name = p.isPrivate ? `Private Practice — ${p.city ?? ''}` : (p.hospital?.name ?? 'Hospital');
        return `${i + 1}. ${name} | ₹${p.firstConsultationFee ?? '?'}`;
      }).join('\n');
      botReply(`🏥 Dr. ${doctor.firstName} ${doctor.lastName} practices at:\n${lines}\n\nSelect a practice:`, practices.map((_: any, i: number) => `${i + 1}`));
      return true;
    }

    // Step 2: select practice
    if (state.step === 'select_practice') {
      const practices = state.selectedDoctor?.practices ?? [];
      const idx = parseInt(input.trim()) - 1;
      if (isNaN(idx) || idx < 0 || idx >= practices.length) {
        botReply(`Please reply with a number between 1 and ${practices.length}.`);
        return true;
      }
      const practice = practices[idx];
      bookingRef.current = { ...state, step: 'select_date', selectedPractice: practice };

      setLoading(true);
      try {
        const res = await getAvailableTimeSlotsApi(state.selectedDoctor!.id, practice.doctorHospitalId);
        const dates: { date: string; slots: any[] }[] = Array.isArray(res.data) ? res.data : [];
        if (!dates.length) {
          bookingRef.current = { step: 'idle' };
          return botReply('😔 No available slots for this practice right now.', defaultChips), true;
        }
        bookingRef.current.availableDates = dates;
        const dateChips = dates.map((d: any) => d.date);
        botReply(
          `📅 Available dates:\n${dateChips.map((d: string) => `• ${d}`).join('\n')}\n\nWhich date works for you?`,
          dateChips
        );
      } finally { setLoading(false); }
      return true;
    }

    // Step 3: select date
    if (state.step === 'select_date') {
      const dates = state.availableDates ?? [];
      const matched = dates.find((d: any) => d.date === input.trim());
      if (!matched) {
        botReply(`Please select one of the available dates.`, dates.map((d: any) => d.date));
        return true;
      }
      bookingRef.current = { ...state, step: 'select_slot', selectedDate: matched.date, availableSlots: matched.slots };

      const slotChips = matched.slots.map((s: any) =>
        new Date(s.startTime).toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })
      );
      const lines = matched.slots.map((s: any, i: number) =>
        `${i + 1}. ${new Date(s.startTime).toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })} — ${new Date(s.endTime).toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })}`
      ).join('\n');
      botReply(`🕐 Available slots on ${matched.date}:\n${lines}\n\nSelect a time slot:`, slotChips);
      return true;
    }

    // Step 4: select slot
    if (state.step === 'select_slot') {
      const slots = state.availableSlots ?? [];
      // match by number or by time string
      let slot: any = null;
      const idx = parseInt(input.trim()) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < slots.length) {
        slot = slots[idx];
      } else {
        slot = slots.find((s: any) =>
          new Date(s.startTime).toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' }) === input.trim()
        );
      }
      if (!slot) {
        botReply('Please select a valid time slot.', slots.map((s: any, i: number) => `${i + 1}`));
        return true;
      }

      bookingRef.current = { ...state, step: 'confirm', selectedSlot: slot };
      const doctor = state.selectedDoctor!;
      const practice = state.selectedPractice!;
      const practiceName = practice.isPrivate ? `Private Practice — ${practice.city ?? ''}` : (practice.hospital?.name ?? 'Hospital');
      const time = new Date(slot.startTime).toLocaleString('en-GB', { timeZone: 'UTC' });

      botReply(
        `📋 Booking Summary:\n👨‍⚕️ Dr. ${doctor.firstName} ${doctor.lastName}\n🏥 ${practiceName}\n🕐 ${time}\n💰 ₹${practice.firstConsultationFee ?? '?'}\n\nConfirm booking?`,
        ['✅ Confirm', '❌ Cancel']
      );
      return true;
    }

    // Step 5: confirm
    if (state.step === 'confirm') {
      if (lower.includes('confirm') || lower === '✅ confirm' || lower === 'yes') {
        setLoading(true);
        try {
          const doctor = state.selectedDoctor!;
          const practice = state.selectedPractice!;
          const slot = state.selectedSlot!;
          // get first specialization id from doctor
          const specRes = await getSpecializationsApi();
          const allSpecs = Array.isArray(specRes.data) ? specRes.data : [];
          const docSpecName = Array.isArray(doctor.specializations) ? doctor.specializations[0] : null;
          const specObj = allSpecs.find((s: any) => s.specializationName === docSpecName);

          await bookAppointmentApi({
            doctorId: doctor.id,
            doctorHospitalId: practice.doctorHospitalId,
            timeSlotId: slot.id,
            specializationId: specObj?.id ?? allSpecs[0]?.id,
            reason: 'Booked via chatbot',
          });

          bookingRef.current = { step: 'idle' };
          botReply(
            `✅ Appointment booked successfully!\n👨‍⚕️ Dr. ${doctor.firstName} ${doctor.lastName}\n🕐 ${new Date(slot.startTime).toLocaleString('en-GB', { timeZone: 'UTC' })}`,
            ['View Appointments', 'Book Another']
          );
        } catch (e: any) {
          bookingRef.current = { step: 'idle' };
          botReply(`❌ Booking failed: ${e?.response?.data?.message ?? 'Please try again.'}`, defaultChips);
        } finally { setLoading(false); }
        return true;
      }

      if (lower.includes('cancel') || lower === '❌ cancel' || lower === 'no') {
        bookingRef.current = { step: 'idle' };
        botReply('❌ Booking cancelled.', defaultChips);
        return true;
      }

      botReply('Please reply with "✅ Confirm" or "❌ Cancel".', ['✅ Confirm', '❌ Cancel']);
      return true;
    }

    return false;
  }, [botReply, defaultChips]);

  // ─── PATIENT INTENTS ─────────────────────────────────────────────────────────

  const handlePatientIntent = useCallback(async (input: string) => {
    const lower = input.toLowerCase();

    // Emergency check first — highest priority
    if (checkEmergency(input)) return;

    // "I'm okay" after emergency
    if (lower.includes("i'm okay") || lower.includes('im okay') || lower.includes('i am okay') || lower === "i'm okay, continue") {
      botReply("😊 Glad to hear you're okay! How can I help you?", defaultChips, { chipRoutes: defaultChipRoutes });
      return;
    }

    // Always check booking flow first
    if (bookingRef.current.step !== 'idle') {
      await handleBookingStep(input);
      return;
    }

    // Start booking
    if (lower === 'book appointment' || lower === 'book another' || (lower.includes('book') && !lower.includes('appointment'))) {
      await startBookingFlow();
      return;
    }

    // View appointments
    if (lower.includes('appointment') && (lower.includes('show') || lower.includes('view') || lower.includes('my') || lower.includes('list'))) {
      setLoading(true);
      try {
        const res = await getPatientAppointmentsApi();
        const apts = Array.isArray(res.data) ? res.data : [];
        if (!apts.length) return botReply('📭 You have no appointments yet.', ['Book Appointment', 'Find Doctors']);
        const upcoming = apts.filter((a: any) => a.status?.status !== 'Completed' && a.status?.status !== 'CANCELLED');
        const lines = upcoming.slice(0, 5).map((a: any) => {
          const doctor = a.doctorHospital?.doctor;
          const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Doctor';
          const time = new Date(a.probableStartTime).toLocaleString('en-GB', { timeZone: 'UTC' });
          return `• #${a.id} — ${doctorName} at ${time} [${a.status?.status ?? 'Scheduled'}]`;
        }).join('\n');
        botReply(`📅 Your upcoming appointments (${upcoming.length}):\n${lines || 'None upcoming.'}`, ['Cancel Appointment', 'Book Appointment']);
      } finally { setLoading(false); }
      return;
    }

    // Cancel appointment
    const cancelMatch = lower.match(/cancel.*?#?(\d+)/);
    if (cancelMatch) {
      const id = parseInt(cancelMatch[1]);
      setLoading(true);
      try {
        await cancelAppointmentApi(id, { reason: 'Cancelled via chatbot' });
        botReply(`✅ Appointment #${id} has been cancelled.`, ['View Appointments', 'Book Appointment']);
      } catch {
        botReply(`❌ Could not cancel appointment #${id}. Please check the ID and try again.`);
      } finally { setLoading(false); }
      return;
    }

    // Find doctors (without triggering booking)
    if (lower.includes('find') || lower.includes('search') || lower === 'find doctors' || lower.includes('view all doctors')) {
      setLoading(true);
      try {
        const res = await searchDoctorsApi({});
        const docs = Array.isArray(res.data) ? res.data : [];
        if (!docs.length) return botReply('😔 No doctors found right now.', ['Try Again']);
        const lines = docs.slice(0, 8).map((d: any) => {
          const spec = Array.isArray(d.specializations) ? d.specializations[0] ?? 'General' : 'General';
          const fee = d.practices?.[0]?.firstConsultationFee;
          const city = d.practices?.[0]?.city ?? '';
          return `• Dr. ${d.firstName} ${d.lastName} — ${spec}${city ? ` | ${city}` : ''}${fee ? ` | ₹${fee}` : ''}`;
        }).join('\n');
        botReply(`🩺 Available doctors (${docs.length} found):\n${lines}`, ['Book Appointment', 'My Profile']);
      } finally { setLoading(false); }
      return;
    }

    // Profile check
    if (lower.includes('profile') || lower.includes('account')) {
      setLoading(true);
      try {
        const res = await getClientAccountApi();
        const profile = res.data && !res.data.statusCode ? res.data : null;
        if (!profile) return botReply('⚠️ Your profile is incomplete. Please set it up to book appointments.', ['Setup Profile']);
        botReply(`✅ Your profile is complete!\n👤 ${profile.firstName} ${profile.lastName}\n📞 ${profile.contactNumber ?? 'No phone'}\n📧 ${profile.email ?? ''}`, ['View Appointments', 'Find Doctors']);
      } finally { setLoading(false); }
      return;
    }

    // Symptom → specialization
    for (const [symptom, spec] of Object.entries(SYMPTOM_MAP)) {
      if (lower.includes(symptom)) {
        botReply(`🔍 Based on your symptoms, you should see a ${spec}. Want me to find one for you?`, [`Find ${spec}`, 'Book Appointment']);
        return;
      }
    }

    // FAQ
    for (const [key, answer] of Object.entries(FAQ)) {
      if (lower.includes(key)) {
        botReply(answer, defaultChips);
        return;
      }
    }

    // Specializations
    if (lower.includes('specializ') || lower.includes('specialist')) {
      setLoading(true);
      try {
        const res = await getSpecializationsApi();
        const specs = Array.isArray(res.data) ? res.data : [];
        const lines = specs.map((s: any) => `• ${s.specializationName}`).join('\n');
        botReply(`🏥 Available specializations (${specs.length}):\n${lines}`, ['Find Doctors', 'Book Appointment']);
      } finally { setLoading(false); }
      return;
    }

    botReply("🤔 I didn't quite get that. Try asking about appointments, doctors, or your profile.", defaultChips, { chipRoutes: defaultChipRoutes });
  }, [botReply, defaultChips, defaultChipRoutes, handleBookingStep, startBookingFlow, checkEmergency]);

  // ─── DOCTOR INTENTS ──────────────────────────────────────────────────────────

  const handleDoctorIntent = useCallback(async (input: string) => {
    const lower = input.toLowerCase();

    // Daily briefing trigger
    if (lower === 'briefing' || lower === 'daily briefing' || lower === 'good morning' || lower === 'brief me') {
      await generateDailyBriefing();
      return;
    }

    if (lower.includes('appointment') || lower.includes('today') || lower.includes('patient') || lower === "today's appointments") {
      setLoading(true);
      try {
        const res = await getDoctorAppointmentsApi();
        const apts = Array.isArray(res.data) ? res.data : [];
        const today = new Date().toDateString();
        const todayApts = apts.filter((a: any) => new Date(a.probableStartTime).toDateString() === today);
        if (!todayApts.length) return botReply('📭 No appointments today.', ['View All Appointments', 'Analytics']);
        const lines = todayApts.map((a: any) =>
          `• #${a.id} — ${a.client ? `${a.client.firstName} ${a.client.lastName}` : 'Patient'} at ${new Date(a.probableStartTime).toLocaleTimeString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })} [${a.status?.status ?? 'Scheduled'}]`
        ).join('\n');
        botReply(`📅 Today's appointments (${todayApts.length}):\n${lines}`, ['Complete Appointment', 'Analytics']);
      } finally { setLoading(false); }
      return;
    }

    const completeMatch = lower.match(/complete.*?#?(\d+)/);
    if (completeMatch) {
      const id = parseInt(completeMatch[1]);
      setLoading(true);
      try {
        await completeAppointmentApi(id);
        botReply(`✅ Appointment #${id} marked as completed.`, ["Today's Appointments", 'Analytics']);
      } catch {
        botReply(`❌ Could not complete appointment #${id}. Please verify the ID.`);
      } finally { setLoading(false); }
      return;
    }

    if (lower.includes('analytic') || lower.includes('stat') || lower.includes('how many') || lower.includes('count')) {
      setLoading(true);
      try {
        const res = await getDoctorAnalyticsApi();
        const s = res.data?.summary;
        const thisMonth = res.data?.appointmentsPerMonth?.slice(-1)[0];
        botReply(
          `📊 Analytics Summary:\n• Total Appointments: ${s?.totalAppointments ?? 0}\n• Completed: ${s?.completedAppointments ?? 0}\n• Cancelled: ${s?.cancelledAppointments ?? 0}\n• Total Patients: ${s?.totalPatients ?? 0}\n• Total Earnings: ₹${s?.totalEarnings ?? 0}\n• This Month: ${thisMonth?.count ?? 0} appointments`,
          ["Today's Appointments", 'My Profile']
        );
      } finally { setLoading(false); }
      return;
    }

    if (lower.includes('profile') || lower.includes('my info')) {
      setLoading(true);
      try {
        const res = await getDoctorProfileApi();
        const doc = res.data;
        const specs = Array.isArray(doc?.specializations) ? doc.specializations.join(', ') : 'None';
        botReply(
          `👨‍⚕️ Dr. ${doc?.firstName} ${doc?.lastName}\n🏥 Specializations: ${specs}\n✅ Verified: ${doc?.isVerified ? 'Yes' : 'No'}`,
          ["Today's Appointments", 'Analytics']
        );
      } finally { setLoading(false); }
      return;
    }

    if (lower.includes('office') || lower.includes('hospital') || lower.includes('clinic')) {
      setLoading(true);
      try {
        const res = await getDoctorOfficesApi();
        const offices = Array.isArray(res.data) ? res.data : [];
        if (!offices.length) return botReply('🏥 You have no offices set up yet.', ['Add Office']);
        const lines = offices.map((o: any) =>
          o.isPrivate
            ? `• Private Practice — ${o.city ?? ''}, ${o.state ?? ''}`
            : `• ${o.hospital?.name ?? 'Hospital'} — ${o.hospital?.city ?? ''}`
        ).join('\n');
        botReply(`🏥 Your offices (${offices.length}):\n${lines}`, ["Today's Appointments"]);
      } finally { setLoading(false); }
      return;
    }

    if (lower.includes('next patient') || lower.includes('who is next')) {
      setLoading(true);
      try {
        const res = await getDoctorAppointmentsApi();
        const apts = Array.isArray(res.data) ? res.data : [];
        const now = new Date();
        const next = apts
          .filter((a: any) => new Date(a.probableStartTime) >= now && a.status?.status !== 'Completed')
          .sort((a: any, b: any) => new Date(a.probableStartTime).getTime() - new Date(b.probableStartTime).getTime())[0];
        if (!next) return botReply('📭 No upcoming patients found.', ["Today's Appointments"]);
        botReply(
          `👤 Next patient: ${next.client ? `${next.client.firstName} ${next.client.lastName}` : 'Unknown'}\n🕐 At: ${new Date(next.probableStartTime).toLocaleString('en-GB', { timeZone: 'UTC' })}\n#️⃣ Appointment ID: ${next.id}`,
          ['Complete Appointment', "Today's Appointments"]
        );
      } finally { setLoading(false); }
      return;
    }

    botReply("🤔 I didn't quite get that. Try asking about appointments, analytics, or your profile.", defaultChips, { chipRoutes: defaultChipRoutes });
  }, [botReply, defaultChips, defaultChipRoutes, generateDailyBriefing]);

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim()) return;
    push(msg('user', input));
    if (role === 'patient') await handlePatientIntent(input);
    else await handleDoctorIntent(input);
  }, [push, role, handlePatientIntent, handleDoctorIntent]);

  // Auto-trigger daily briefing for doctors on first interaction
  const triggerBriefing = useCallback(async () => {
    if (role === 'doctor' && !briefingDone) {
      setBriefingDone(true);
      await generateDailyBriefing();
    }
  }, [role, briefingDone, generateDailyBriefing]);

  const clearChat = useCallback(() => {
    bookingRef.current = { step: 'idle' };
    setMessages([msg('bot', greeting, defaultChips, { chipRoutes: defaultChipRoutes })]);
  }, [greeting, defaultChips, defaultChipRoutes]);

  return { messages, loading, sendMessage, clearChat, triggerBriefing };
}
