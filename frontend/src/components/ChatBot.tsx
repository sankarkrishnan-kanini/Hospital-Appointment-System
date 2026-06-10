'use client';
import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { Trash2, Send, ChevronDown, Mic, Square, Play, Pause, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChatBot } from '@/hooks/useChatBot';
import api from '@/lib/axios';

interface Props {
  role: 'patient' | 'doctor';
  userName: string;
}

const MIC_CONSTRAINTS: MediaStreamConstraints = {
  video: false,
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: { ideal: 16000 },
  },
};

export default function ChatBot({ role, userName }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevMsgCount = useRef(1);
  const { messages, loading, sendMessage, clearChat, triggerBriefing } = useChatBot(role, userName);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [submittingAudio, setSubmittingAudio] = useState(false);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
      streamRef.current = null;
      audioContextRef.current = null;
    };
  }, []);

  const prevAudioUrl = useRef<string | null>(null);
  useEffect(() => {
    if (prevAudioUrl.current && prevAudioUrl.current !== audioUrl) {
      URL.revokeObjectURL(prevAudioUrl.current);
    }
    prevAudioUrl.current = audioUrl;
  }, [audioUrl]);

  const initStream = useCallback(async () => {
    
    if (streamRef.current && streamRef.current.getTracks().some((t) => t.readyState === 'live')) {
      // Resume AudioContext if it was suspended by the browser
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      return streamRef.current;
    }
    const rawStream = await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS);
    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(rawStream);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 85;
    highpass.Q.value = 0.707;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 3500;
    lowpass.Q.value = 0.707;

    const dest = ctx.createMediaStreamDestination();
    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(dest);

    streamRef.current = dest.stream;
    audioContextRef.current = ctx;
    return dest.stream;
  }, []);

  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await initStream();
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        '',
      ];
      const mimeType = mimeTypes.find((t) =>
        t === '' || MediaRecorder.isTypeSupported(t)
      ) ?? '';

      const recorderOptions: MediaRecorderOptions = mimeType
        ? { mimeType }
        : {};
      const recorder = new MediaRecorder(stream, recorderOptions);
      const actualMime = recorder.mimeType || 'audio/webm';
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: actualMime });
        const url = URL.createObjectURL(blob);
        audioBlobRef.current = blob;
        setAudioBlob(blob);
        setAudioUrl(url);
        setIsRecording(false);
      };

      // Discard any previous preview before starting
      discardRecording();
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access failed:', err);
    }
  }, [initStream]);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();

      console.log(audioBlob);
    }
  }, []);

  const discardRecording = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioBlobRef.current = null;
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current = null;
    }
  }, [audioUrl]);

  const togglePlayback = useCallback(() => {
    if (!audioUrl) return;
    if (isPlaying && audioElRef.current) {
      audioElRef.current.pause();
      setIsPlaying(false);
      return;
    }
    const el = new Audio(audioUrl);
    el.onended = () => setIsPlaying(false);
    el.play();
    audioElRef.current = el;
    setIsPlaying(true);
  }, [audioUrl, isPlaying]);

  const handleSubmitRecording = useCallback(async () => {
    const blob = audioBlobRef.current;
    if (!blob) return;
    setSubmittingAudio(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        try {
          const base64data = reader.result as string;
          console.log(base64data);
          const response = await api.post('/transcribe', { audio: base64data });
          const data = response.data;
          if (data.transcription) {
            await sendMessage(data.transcription);
          }
        } catch (err) {
          console.error('Transcription failed:', err);
        } finally {
          discardRecording();
          setSubmittingAudio(false);
        }
      };
    } catch (err) {
      console.error('Submit recording failed:', err);
      setSubmittingAudio(false);
    }
  }, [sendMessage, discardRecording]);
  // Track unread when closed
  useEffect(() => {
    if (!open && messages.length > prevMsgCount.current) {
      setUnread(u => u + (messages.length - prevMsgCount.current));
    }
    prevMsgCount.current = messages.length;
  }, [messages, open]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  }, [messages, open, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
    // Trigger daily briefing for doctors on first open
    if (role === 'doctor') triggerBriefing();
  };

  const handleClose = () => setOpen(false);

  const handleSend = async () => {
    const val = input.trim();
    if (!val || loading) return;
    setInput('');
    await sendMessage(val);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSend();
  };

  const handleChip = (chip: string) => {
    if (loading) return;
    sendMessage(chip);
  };

  const handleNavigate = (route: string) => {
    router.push(route);
    setOpen(false);
  };

  const displayName = role === 'doctor'
    ? userName.replace('Dr. ', '')
    : userName.split('@')[0];

  return (
    <>
      {/* ── Floating Launcher ── */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 group"
          title="Chat with MediAssist"
        >
          <div className="relative">
            {/* Outer pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#2d6be4] opacity-20 animate-ping" />
            {/* Button shell */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#2d6be4] to-[#1a4fc4] shadow-[0_8px_32px_rgba(45,107,228,0.5)] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_14px_44px_rgba(45,107,228,0.65)]">
              {/* Robot SVG */}
              <svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm robot-float">
                {/* Antenna */}
                <line x1="32" y1="6" x2="32" y2="14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="32" cy="5" r="3" fill="#93c5fd"/>
                {/* Head */}
                <rect x="14" y="14" width="36" height="26" rx="8" fill="white" fillOpacity="0.95"/>
                {/* Eyes */}
                <circle cx="24" cy="25" r="4" fill="#2d6be4"/>
                <circle cx="40" cy="25" r="4" fill="#2d6be4"/>
                <circle cx="25.5" cy="23.5" r="1.5" fill="white"/>
                <circle cx="41.5" cy="23.5" r="1.5" fill="white"/>
                {/* Mouth */}
                <path d="M24 32 Q32 37 40 32" stroke="#2d6be4" strokeWidth="2" strokeLinecap="round" fill="none"/>
                {/* Ear bolts */}
                <rect x="10" y="22" width="5" height="8" rx="2.5" fill="white" fillOpacity="0.7"/>
                <rect x="49" y="22" width="5" height="8" rx="2.5" fill="white" fillOpacity="0.7"/>
                {/* Body */}
                <rect x="20" y="42" width="24" height="14" rx="5" fill="white" fillOpacity="0.7"/>
                {/* Body panel */}
                <rect x="25" y="46" width="6" height="4" rx="1.5" fill="#93c5fd"/>
                <rect x="33" y="46" width="6" height="4" rx="1.5" fill="#93c5fd"/>
              </svg>
            </div>
            {/* Unread badge */}
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">
                {unread}
              </span>
            )}
            {/* Tooltip label */}
            <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
              <div className="bg-gray-900 text-white text-[11px] font-medium px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg">
                Chat with MediAssist 🤖
                <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          </div>
        </button>
      )}

      {/* ── Chat Window ── */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] flex flex-col rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.18)] border border-white/20 chat-open"
          style={{ background: '#f8faff' }}
        >
          {/* ── Header ── */}
          <div className="relative flex-shrink-0 bg-gradient-to-br from-[#2d6be4] via-[#2563eb] to-[#1a4fc4] px-5 pt-5 pb-14">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-8 w-20 h-20 bg-white/5 rounded-full translate-y-1/2" />

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/30">
                  <svg width="26" height="26" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="32" y1="6" x2="32" y2="14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="32" cy="5" r="3" fill="#93c5fd"/>
                    <rect x="14" y="14" width="36" height="26" rx="8" fill="white" fillOpacity="0.95"/>
                    <circle cx="24" cy="25" r="4" fill="#2d6be4"/>
                    <circle cx="40" cy="25" r="4" fill="#2d6be4"/>
                    <circle cx="25.5" cy="23.5" r="1.5" fill="white"/>
                    <circle cx="41.5" cy="23.5" r="1.5" fill="white"/>
                    <path d="M24 32 Q32 37 40 32" stroke="#2d6be4" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <rect x="10" y="22" width="5" height="8" rx="2.5" fill="white" fillOpacity="0.7"/>
                    <rect x="49" y="22" width="5" height="8" rx="2.5" fill="white" fillOpacity="0.7"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm leading-none">MediAssist AI</p>
                    {/* Online dot */}
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      <span className="text-emerald-300 text-[10px] font-medium">Online</span>
                    </span>
                  </div>
                  <p className="text-blue-200 text-[11px] mt-1">
                    {role === 'patient' ? '🏥 Patient Assistant' : '👨‍⚕️ Doctor Assistant'}
                  </p>
                </div>
              </div>

              {/* Header actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                  title="Clear chat"
                >
                  <Trash2 size={13} className="text-white/80" />
                </button>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                  title="Close"
                >
                  <ChevronDown size={15} className="text-white/80" />
                </button>
              </div>
            </div>

            {/* Greeting card */}
            <div className="relative mt-4 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
              <p className="text-white text-[13px] font-medium leading-snug">
                Hi {displayName}! 👋
              </p>
              <p className="text-blue-100 text-[11px] mt-0.5">
                Ask me anything — I'm here to help.
              </p>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 -mt-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {messages.map((m, idx) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.from === 'user' ? 'items-end' : 'items-start'}`}
                style={{
                  animationDelay: `${idx * 30}ms`,
                }}
              >
                {/* Avatar row for bot */}
                {m.from === 'bot' && (
                  <div className="flex items-end gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2d6be4] to-[#1a4fc4] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="32" y1="6" x2="32" y2="14" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                        <circle cx="32" cy="5" r="3.5" fill="#93c5fd"/>
                        <rect x="14" y="14" width="36" height="26" rx="8" fill="white" fillOpacity="0.95"/>
                        <circle cx="24" cy="25" r="4" fill="#2d6be4"/>
                        <circle cx="40" cy="25" r="4" fill="#2d6be4"/>
                        <circle cx="25.5" cy="23.5" r="1.5" fill="white"/>
                        <circle cx="41.5" cy="23.5" r="1.5" fill="white"/>
                        <path d="M24 32 Q32 37 40 32" stroke="#2d6be4" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        <rect x="10" y="22" width="5" height="8" rx="2.5" fill="white" fillOpacity="0.6"/>
                        <rect x="49" y="22" width="5" height="8" rx="2.5" fill="white" fillOpacity="0.6"/>
                      </svg>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">MediAssist</span>
                  </div>
                )}

                <div className={`flex items-end gap-2 ${m.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Bubble */}
                  <div
                    className={`max-w-[78%] px-4 py-2.5 text-[13px] whitespace-pre-wrap leading-relaxed shadow-sm ${
                      m.from === 'user'
                        ? 'bg-gradient-to-br from-[#2d6be4] to-[#1a4fc4] text-white rounded-2xl rounded-br-md'
                        : m.isEmergency
                          ? 'bg-red-50 text-red-900 rounded-2xl rounded-bl-md border-2 border-red-300 ring-2 ring-red-100'
                          : 'bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-100'
                    }`}
                  >
                    {m.isEmergency && (
                      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-red-200">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[11px] font-bold text-red-600 uppercase tracking-wide">Emergency Alert</span>
                      </div>
                    )}
                    {m.text}
                  </div>
                </div>

                {/* Timestamp */}
                <span className={`text-[10px] text-gray-400 mt-1 ${m.from === 'user' ? 'pr-1' : 'pl-8'}`}>
                  {m.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>

                {/* Quick reply chips — only on latest bot message */}
                {m.chips && m.from === 'bot' && idx === messages.length - 1 && !loading && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pl-8 max-w-full">
                    {m.chips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleChip(chip)}
                        disabled={loading}
                        className={`text-[11px] px-3 py-1.5 rounded-full transition-all duration-200 font-medium shadow-sm disabled:opacity-40 whitespace-nowrap ${
                          m.isEmergency
                            ? 'bg-red-50 border border-red-300 text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600'
                            : 'bg-white border border-[#2d6be4]/30 text-[#2d6be4] hover:bg-[#2d6be4] hover:text-white hover:border-[#2d6be4]'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}

                {/* Navigation link — shown below chips if route exists */}
                {m.chipRoutes && m.from === 'bot' && idx === messages.length - 1 && !loading && (
                  <div className="flex flex-wrap gap-2 mt-1.5 pl-8">
                    {Object.entries(m.chipRoutes).filter(([, route]) => route).map(([label, route]) => (
                      <button
                        key={label}
                        onClick={() => handleNavigate(route)}
                        className="text-[10px] text-gray-400 hover:text-[#2d6be4] underline underline-offset-2 transition-colors"
                      >
                        ↗ Open {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#2d6be4] to-[#1a4fc4] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="32" y1="6" x2="32" y2="14" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="32" cy="5" r="3.5" fill="#93c5fd"/>
                    <rect x="14" y="14" width="36" height="26" rx="8" fill="white" fillOpacity="0.95"/>
                    <circle cx="24" cy="25" r="4" fill="#2d6be4"/>
                    <circle cx="40" cy="25" r="4" fill="#2d6be4"/>
                    <circle cx="25.5" cy="23.5" r="1.5" fill="white"/>
                    <circle cx="41.5" cy="23.5" r="1.5" fill="white"/>
                    <path d="M24 32 Q32 37 40 32" stroke="#2d6be4" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <rect x="10" y="22" width="5" height="8" rx="2.5" fill="white" fillOpacity="0.6"/>
                    <rect x="49" y="22" width="5" height="8" rx="2.5" fill="white" fillOpacity="0.6"/>
                  </svg>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-2 h-2 bg-[#2d6be4] rounded-full animate-bounce opacity-60"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Input ── */}
          <div className="flex-shrink-0 px-4 pb-4 pt-2 bg-white border-t border-gray-100">
            {/* Audio preview bar */}
            {audioUrl && !isRecording && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-2xl px-3 py-2 mb-2 animate-in fade-in">
                <button
                  onClick={togglePlayback}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2d6be4] to-[#1a4fc4] text-white flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                </button>
                {/* Waveform placeholder */}
                <div className="flex-1 flex items-center gap-[3px] h-6 px-1">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-[3px] rounded-full ${isPlaying ? 'bg-[#2d6be4] animate-pulse' : 'bg-blue-300'}`}
                      style={{ height: `${8 + Math.sin(i * 0.8) * 10 + Math.random() * 6}px`, animationDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
                <button
                  onClick={handleSubmitRecording}
                  disabled={submittingAudio || loading}
                  className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 hover:bg-emerald-600 hover:scale-105 transition-all disabled:opacity-40"
                  title="Send voice message"
                >
                  {submittingAudio ? (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={12} />
                  )}
                </button>
                <button
                  onClick={discardRecording}
                  className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center flex-shrink-0 hover:bg-red-100 hover:text-red-500 transition-all"
                  title="Discard"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {/* Recording indicator */}
            {isRecording && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-[12px] text-red-600 font-medium flex-1">Recording…</span>
                <button
                  onClick={handleStopRecording}
                  className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 hover:scale-105 transition-all"
                  title="Stop recording"
                >
                  <Square size={11} />
                </button>
              </div>
            )}

            {/* Text input + mic button */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-[#2d6be4] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(45,107,228,0.1)] transition-all duration-200">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={isRecording ? 'Recording...' : 'Type a message...'}
                disabled={loading || isRecording || submittingAudio}
                className="flex-1 bg-transparent text-[13px] text-gray-800 placeholder-gray-400 outline-none disabled:opacity-50 min-w-0"
              />
              {/* Mic button — shown when no text typed and not already recording/previewing */}
              {!input.trim() && !audioUrl && !isRecording && (
                <button
                  onClick={handleStartRecording}
                  disabled={loading || submittingAudio}
                  className="w-8 h-8 bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-[#2d6be4] hover:text-white hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                  title="Record voice message"
                >
                  <Mic size={14} />
                </button>
              )}
              {/* Send button — shown when text is typed */}
              {input.trim() && (
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 bg-gradient-to-br from-[#2d6be4] to-[#1a4fc4] text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-[0_4px_12px_rgba(45,107,228,0.4)] hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex-shrink-0"
                >
                  <Send size={13} />
                </button>
              )}
            </div>
            <p className="text-center text-[10px] text-gray-300 mt-2">
              Powered by MediAssist AI · Your data is secure
            </p>
          </div>
        </div>
      )}
    </>
  );
}
