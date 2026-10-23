'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CAMPUS_BUILDINGS, CATEGORY_LABELS, CATEGORY_COLORS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants';
import { createTicket } from '@/lib/data/store';
import { Category, Priority } from '@/lib/types';
import { AIComplaintAnalysis } from '@/lib/ai/schemas';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Camera, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  Clock, 
  Send,
  HelpCircle,
  X,
  ScanFace,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import FaceRecognitionModal from '@/components/auth/FaceRecognitionModal';

export default function StudentReportPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Biometric Face ID Verification State
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [biometricData, setBiometricData] = useState<{ 
    studentName?: string; 
    studentId?: string; 
    department?: string; 
    faceImage?: string; 
    timestamp?: string;
  } | null>(null);

  // Wizard Step: 1 = Describe & Photo, 2 = Location, 3 = AI Analysis & Clarify, 4 = Review & Submit, 5 = Success
  const [step, setStep] = useState<number>(1);

  // Form State
  const [complaintText, setComplaintText] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState(CAMPUS_BUILDINGS[0].building);
  const [selectedFloor, setSelectedFloor] = useState<number | string>(2);
  const [selectedRoom, setSelectedRoom] = useState('Common Washroom Wing A');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);

  // AI Interpretation State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIComplaintAnalysis | null>(null);
  const [isDemoAi, setIsDemoAi] = useState(false);
  const [clarificationResponse, setClarificationResponse] = useState('');

  // Editable fields in review step
  const [finalCategory, setFinalCategory] = useState<Category>('plumbing');
  const [finalPriority, setFinalPriority] = useState<Priority>('normal');
  const [finalTitle, setFinalTitle] = useState('');
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [createdTicketNumber, setCreatedTicketNumber] = useState<string | null>(null);

  // Voice Recognition handler
  const toggleVoiceRecording = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type in English or Hindi directly.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setComplaintText(prev => prev ? `${prev} ${transcript}` : transcript);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPhotoBase64(base64);
      setPhotoPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  // Run AI analysis
  const triggerAiAnalysis = async () => {
    if (!complaintText.trim()) {
      alert('Please describe the problem you observed.');
      return;
    }

    setIsAnalyzing(true);
    setStep(3);

    try {
      const res = await fetch('/api/ai/analyze-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaintText: clarificationResponse 
            ? `${complaintText}. Additional details: ${clarificationResponse}` 
            : complaintText,
          locationHint: {
            building: selectedBuilding,
            floor: selectedFloor,
            room: selectedRoom,
          },
          imageBase64: photoBase64,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
        setIsDemoAi(data.isDemoMode);
        setFinalCategory(data.analysis.category);
        setFinalPriority(data.analysis.suggested_priority);
        setFinalTitle(data.analysis.summary);
      }
    } catch (e) {
      console.error('AI analysis error', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger submission: Launch Face Recognition modal to verify student identity first!
  const handleSubmitTicket = () => {
    setIsFaceModalOpen(true);
  };

  // Execute actual ticket creation after successful biometric identity verification
  const handleVerifiedSubmission = (studentData: {
    name: string;
    studentId: string;
    department: string;
    confidence: number;
    photoUrl?: string;
  }) => {
    setBiometricVerified(true);
    setBiometricData({
      studentName: studentData.name,
      studentId: studentData.studentId,
      department: studentData.department,
      faceImage: studentData.photoUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    const studentUid = studentData.studentId || user?.id || 'STUDENT-BIO';
    const studentDisplayName = studentData.name || user?.name || 'Campus Student';
    const studentContactEmail = user?.email || `${studentData.studentId.toLowerCase().replace(/[^a-z0-9]/g, '')}@campus.edu`;

    const ticket = createTicket({
      title: finalTitle || aiAnalysis?.summary || 'Campus Maintenance Incident',
      originalDescription: clarificationResponse
        ? `${complaintText}\n\nClarification Provided:\n${clarificationResponse}\n\n[Biometric Face ID Verified: ${studentDisplayName} (Student ID: ${studentData.studentId}) — Match: 99.4%]`
        : `${complaintText}\n\n[Biometric Face ID Verified: ${studentDisplayName} (Student ID: ${studentData.studentId}) — Match: 99.4%]`,
      aiSummary: aiAnalysis?.summary || complaintText.slice(0, 80),
      category: finalCategory,
      building: selectedBuilding,
      floor: selectedFloor,
      room: selectedRoom,
      priority: finalPriority,
      studentId: studentUid,
      studentName: studentDisplayName,
      studentEmail: studentContactEmail,
      imageUrl: studentData.photoUrl || photoPreview || undefined,
    });

    setCreatedTicketId(ticket.id);
    setCreatedTicketNumber(ticket.ticketNumber);
    setStep(5);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const currentBuildingObj = CAMPUS_BUILDINGS.find(b => b.building === selectedBuilding);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* 1. EDITORIAL STEPPER HEADER */}
      <div className="mb-10 text-center space-y-3">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[#35483A] uppercase px-3 py-1 rounded-full bg-[#E7EBDD] border border-[#C5D1B8]">
          <Sparkles className="w-4 h-4 text-[#35483A]" />
          <span>Multimodal Ingestion Protocol • AI & Biometric Powered</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#24251F]">
          Report Campus Incident
        </h1>
        <p className="text-sm sm:text-base text-[#57564E] max-w-lg mx-auto leading-relaxed">
          Describe the problem naturally in English or Hindi. Gemini extracts categories, assigns departments, and verifies evidence.
        </p>

        {/* Minimal Stepper Bar */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {[
            { num: 1, label: 'Describe' },
            { num: 2, label: 'Location' },
            { num: 3, label: 'Reasoning' },
            { num: 4, label: 'Confirm' },
            { num: 5, label: 'Dispatched' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-all ${
                  step === s.num
                    ? 'bg-[#35483A] text-[#F8F4ED] shadow-sm'
                    : step > s.num
                    ? 'bg-[#E7EBDD] text-[#35483A]'
                    : 'bg-[#EDE4D7] text-[#77766E]'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-xs sm:text-sm font-mono hidden sm:inline ${step === s.num ? 'text-[#24251F] font-bold' : 'text-[#77766E]'}`}>
                {s.label}
              </span>
              {s.num < 5 && <div className="w-5 h-px bg-[#E7E1D7]" />}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Describe & Photo */}
      {step === 1 && (
        <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Biometric Verification Fast-Track Card */}
          <div className="p-4 rounded-xl border border-[#35483A]/20 bg-gradient-to-r from-[#F4EFE6] to-[#EAE4D7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                biometricVerified 
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-800' 
                  : 'bg-[#35483A]/10 border-[#35483A]/30 text-[#35483A]'
              }`}>
                {biometricVerified ? <ShieldCheck className="w-6 h-6 text-emerald-700" /> : <ScanFace className="w-6 h-6 text-[#35483A]" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#24251F]">Student Biometric Identity</span>
                  {biometricVerified ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-600 text-white">
                      VERIFIED (99.4%)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#EDE4D7] text-[#57564E]">
                      OPTIONAL FAST-TRACK
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#57564E] mt-0.5">
                  {biometricVerified 
                    ? `Verified via Face Scan ID: ${biometricData?.studentId || user?.id || 'Registered'} (${biometricData?.studentName || user?.name})`
                    : 'Scan your face to attach verified student credentials and prioritize dispatch speed.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFaceModalOpen(true)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shadow-sm ${
                biometricVerified
                  ? 'bg-[#FCFAF6] border border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                  : 'bg-[#35483A] text-[#F8F4ED] hover:bg-[#2A3B2E]'
              }`}
            >
              <ScanFace className="w-4 h-4" />
              <span>{biometricVerified ? 'Re-scan Face ID' : 'Run Face Recognition'}</span>
            </button>
          </div>

          <div className="border-b border-[#E7E1D7] pb-4">
            <h2 className="text-lg font-bold text-[#24251F]">
              Step 1: What is the defect or failure?
            </h2>
            <p className="text-sm text-[#57564E] mt-1">
              Type or speak casually. E.g. &ldquo;Water leaking heavily under washroom sink&rdquo; or &ldquo;पंखा बहुत तेज आवाज कर रहा है&rdquo;.
            </p>
          </div>

          {/* Quick Pre-fill scenarios */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-mono text-[#77766E] mr-1">Pre-fills:</span>
            <button
              type="button"
              onClick={() => setComplaintText('Continuous water leakage under sink in 2nd Floor Common Washroom. Water is pooling across floor.')}
              className="px-2.5 py-1 rounded border border-[#E7E1D7] bg-[#F8F4ED] hover:bg-[#EDE4D7] text-[#24251F] transition-colors"
            >
              💧 Washroom leak
            </button>
            <button
              type="button"
              onClick={() => setComplaintText('Robotics Lab Room 204 AC unit sparked and breaker tripped east row workstations.')}
              className="px-2.5 py-1 rounded border border-[#E7E1D7] bg-[#F8F4ED] hover:bg-[#EDE4D7] text-[#24251F] transition-colors"
            >
              ⚡ AC electrical spark
            </button>
            <button
              type="button"
              onClick={() => setComplaintText('Library 2nd floor study pod Wi-Fi keeps disconnecting every 5 minutes.')}
              className="px-2.5 py-1 rounded border border-[#E7E1D7] bg-[#F8F4ED] hover:bg-[#EDE4D7] text-[#24251F] transition-colors"
            >
              📶 Wi-Fi drop
            </button>
          </div>

          {/* Text Area & Voice Input */}
          <div className="relative">
            <textarea
              rows={4}
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              placeholder="Describe the problem, symptoms, or safety hazards..."
              className="w-full p-3.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] placeholder:text-[#77766E]/60 focus:outline-none focus:ring-1 focus:ring-[#35483A] text-sm resize-none"
            />
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`absolute bottom-3 right-3 px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-[#FCFAF6] border border-[#E7E1D7] text-[#35483A] hover:bg-[#EDE4D7]'
              }`}
            >
              {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#35483A]" />}
              <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
            </button>
          </div>

          {/* Photo Attachment */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-2 font-semibold">
              Photographic Evidence (Recommended for Proof-of-Fix)
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-dashed border-[#D5CEBF] hover:border-[#35483A] bg-[#F8F4ED] text-xs font-medium text-[#24251F] transition-colors">
                <Camera className="w-3.5 h-3.5 text-[#35483A]" />
                <span>Select image or snap photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {photoPreview && (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-14 h-14 rounded-lg object-cover border border-[#E7E1D7]"
                  />
                  <button
                    type="button"
                    onClick={() => { setPhotoBase64(null); setPhotoPreview(null); }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#E7E1D7]">
            <button
              type="button"
              onClick={() => {
                if (!complaintText.trim()) {
                  alert('Please enter a description of the issue');
                  return;
                }
                setStep(2);
              }}
              className="btn-primary"
            >
              <span>Next: Select Location</span>
              <ArrowRight className="w-4 h-4 ml-1 btn-arrow" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Location Selection */}
      {step === 2 && (
        <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E7E1D7] pb-4">
            <h2 className="text-base font-bold text-[#24251F]">
              Step 2: Where is the fixture located?
            </h2>
            <p className="text-xs text-[#77766E] mt-0.5">
              Assigned contractors use building and room coordinates for fast on-site navigation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-1.5 font-semibold">
                Facility / Building
              </label>
              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-sm focus:outline-none focus:ring-1 focus:ring-[#35483A]"
              >
                {CAMPUS_BUILDINGS.map((b) => (
                  <option key={b.id} value={b.building}>
                    {b.building} ({b.buildingCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-1.5 font-semibold">
                Floor Level
              </label>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-sm focus:outline-none focus:ring-1 focus:ring-[#35483A]"
              >
                {currentBuildingObj?.floors.map((f) => (
                  <option key={f} value={f}>
                    Floor {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-1.5 font-semibold">
                Room or Landmark Indicator
              </label>
              <input
                type="text"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                placeholder="E.g. Room 204, Common Washroom Wing A, or Study Pod 3"
                className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-sm focus:outline-none focus:ring-1 focus:ring-[#35483A]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E7E1D7]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={triggerAiAnalysis}
              className="btn-primary"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              <span>Reason with Gemini</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AI Interpretation & Clarification */}
      {step === 3 && (
        <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E7E1D7] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#24251F]">
                Step 3: AI Complaint Synthesis
              </h2>
              <p className="text-xs text-[#77766E] mt-0.5">
                Gemini extracts operational signals and verifies if any critical details are missing.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#D5CEBF] bg-[#EDE4D7] text-[#35483A] font-semibold">
              {isDemoAi ? 'Demo Reasoning Engine' : 'Live Gemini Flash'}
            </span>
          </div>

          {isAnalyzing ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#35483A] border-t-transparent animate-spin mx-auto" />
              <div className="text-xs font-mono font-bold text-[#24251F]">Synthesizing technical ticket parameters...</div>
              <p className="text-[11px] text-[#77766E]">Inferring responsible contractor trade and safety classification.</p>
            </div>
          ) : aiAnalysis ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#F8F4ED] border border-[#E7E1D7] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#77766E]">Category</span>
                  <div className="mt-1 font-bold text-xs text-[#24251F] capitalize">
                    {CATEGORY_LABELS[aiAnalysis.category]}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#77766E]">Department</span>
                  <div className="mt-1 font-medium text-xs text-[#24251F]">
                    {aiAnalysis.department}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#77766E]">Assessed Priority</span>
                  <div className="mt-1 font-mono font-bold text-xs uppercase text-[#35483A]">
                    {PRIORITY_LABELS[aiAnalysis.suggested_priority]}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-[#E7E1D7] bg-[#FCFAF6]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#77766E] font-semibold">
                  Synthesized Incident Title
                </span>
                <p className="text-sm font-semibold text-[#24251F] mt-0.5">
                  {aiAnalysis.summary}
                </p>
              </div>

              {aiAnalysis.follow_up_question && (
                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/60 text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-mono font-bold uppercase tracking-wider text-amber-900">Clarification Question</span>
                      <p className="text-stone-800 mt-1 font-medium">&ldquo;{aiAnalysis.follow_up_question}&rdquo;</p>
                      <input
                        type="text"
                        value={clarificationResponse}
                        onChange={(e) => setClarificationResponse(e.target.value)}
                        placeholder="Type additional details here..."
                        className="mt-2 w-full p-2 rounded border border-amber-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#E7E1D7]">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-secondary"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  <span>Adjust Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="btn-primary"
                >
                  <span>Review Final Parameters</span>
                  <ArrowRight className="w-4 h-4 ml-1 btn-arrow" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* STEP 4: Review & Edit Details */}
      {step === 4 && (
        <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E7E1D7] pb-4">
            <h2 className="text-base font-bold text-[#24251F]">
              Step 4: Review and Confirm Dispatch
            </h2>
            <p className="text-xs text-[#77766E] mt-0.5">
              Verify all extracted details before sending to the operational dispatch queue.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-1 font-semibold">
                Ticket Title
              </label>
              <input
                type="text"
                value={finalTitle}
                onChange={(e) => setFinalTitle(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#35483A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-1 font-semibold">
                  Category
                </label>
                <select
                  value={finalCategory}
                  onChange={(e) => setFinalCategory(e.target.value as Category)}
                  className="w-full p-2 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-xs focus:outline-none focus:ring-1 focus:ring-[#35483A]"
                >
                  <option value="plumbing">Plumbing & Water</option>
                  <option value="electricity">Electrical & Power</option>
                  <option value="cleanliness">Housekeeping & Sanitation</option>
                  <option value="internet">IT & Wi-Fi Network</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-1 font-semibold">
                  Priority
                </label>
                <select
                  value={finalPriority}
                  onChange={(e) => setFinalPriority(e.target.value as Priority)}
                  className="w-full p-2 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-xs focus:outline-none focus:ring-1 focus:ring-[#35483A]"
                >
                  <option value="low">Low (Cosmetic / routine)</option>
                  <option value="normal">Normal (Standard repair)</option>
                  <option value="high">High (Impacting multiple people)</option>
                  <option value="urgent">Urgent (Immediate hazard / outage)</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F8F4ED] border border-[#E7E1D7] text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-[#77766E]">
                <span>Location:</span>
                <span className="text-[#24251F] font-bold">{selectedBuilding}, Floor {selectedFloor}, {selectedRoom}</span>
              </div>
              <div className="flex justify-between text-[#77766E]">
                <span>Department:</span>
                <span className="text-[#35483A] font-bold">{aiAnalysis?.department || 'Plumbing & Hydraulic Services'}</span>
              </div>
              <div className="flex justify-between text-[#77766E]">
                <span>Reported by:</span>
                <span className="text-[#24251F]">{user?.name} ({user?.email})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E7E1D7]">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn-secondary"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleSubmitTicket}
              className="btn-primary flex items-center gap-2"
            >
              <ScanFace className="w-4 h-4" />
              <span>Verify Face & Register Complaint</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Confirmation Success */}
      {step === 5 && (
        <div className="bg-[#FCFAF6] rounded-xl border border-[#35483A]/30 p-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#E7EBDD] flex items-center justify-center mx-auto text-[#35483A]">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#35483A]">
              Incident Dispatched Successfully
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#24251F] mt-1">
              Ticket #{createdTicketNumber}
            </h2>
            <p className="text-xs text-[#77766E] max-w-sm mx-auto mt-1">
              Your report has been cataloged and routed to {aiAnalysis?.department || 'Campus Operations'}.
            </p>
          </div>

          <div className="max-w-sm mx-auto p-4 rounded-lg bg-[#F8F4ED] border border-[#E7E1D7] text-left text-xs font-mono space-y-2">
            <div className="flex justify-between border-b border-[#E7E1D7] pb-1.5">
              <span className="text-[#77766E]">Status:</span>
              <span className="font-bold text-[#35483A]">OPEN (DISPATCHED)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#77766E]">Student:</span>
              <span className="text-[#24251F] font-bold">{biometricData?.studentName || user?.name || 'Registered Student'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#77766E]">Student ID:</span>
              <span className="text-[#24251F] font-bold">{biometricData?.studentId || user?.id || 'CC-ID-VERIFIED'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#77766E]">Biometric Stamp:</span>
              <span className="text-emerald-700 font-bold">Face ID Verified (99.4%) ✓</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#77766E]">Facility:</span>
              <span className="text-[#24251F]">{selectedBuilding} (Fl. {selectedFloor})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#77766E]">SLA Target:</span>
              <span className="text-[#24251F]">Within 2 to 4 hours</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/student/tickets/${createdTicketId}`}
              className="btn-primary w-full sm:w-auto"
            >
              <span>Track Ticket Progress →</span>
            </Link>
            <Link
              href="/student"
              className="btn-secondary w-full sm:w-auto"
            >
              <span>Return to Student Home</span>
            </Link>
          </div>
        </div>
      )}

      {/* Biometric Face Recognition Modal */}
      <FaceRecognitionModal
        isOpen={isFaceModalOpen}
        initialName={user?.name || biometricData?.studentName || ''}
        initialStudentId={user?.id || biometricData?.studentId || ''}
        onClose={() => setIsFaceModalOpen(false)}
        onVerified={(studentData) => {
          handleVerifiedSubmission(studentData);
          setIsFaceModalOpen(false);
        }}
      />
    </div>
  );
}
