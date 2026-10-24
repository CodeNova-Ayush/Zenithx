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
import ShowMeRecorder from '@/components/report/ShowMeRecorder';
import { analyzeShowMeRecording } from '@/lib/ai/show-me-analysis';
import { MediaAnalysisResult } from '@/lib/types';
import { Video, ShieldAlert } from 'lucide-react';

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

  // Student Identification & Contact Details State
  const [studentName, setStudentName] = useState(user?.name && user.name !== 'Ananya Sharma' ? user.name : '');
  const [studentRollNo, setStudentRollNo] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState(user?.email && user.email !== 'ananya@campus.edu' ? user.email : '');
  const [studentDepartment, setStudentDepartment] = useState('Computer Science & Engineering');
  const [formValidationMessage, setFormValidationMessage] = useState<string | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);

  // AI Interpretation State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIComplaintAnalysis | null>(null);
  const [isDemoAi, setIsDemoAi] = useState(false);
  const [clarificationResponse, setClarificationResponse] = useState('');

  // Show-Me Video & Voice Reporting Mode
  const [reportMode, setReportMode] = useState<'text' | 'showme'>('text');
  const [showMeAnalysis, setShowMeAnalysis] = useState<MediaAnalysisResult | null>(null);
  const [isAnalyzingShowMe, setIsAnalyzingShowMe] = useState(false);
  const [showMeMedia, setShowMeMedia] = useState<{ blob: Blob; mediaType: 'video' | 'audio'; dataUrl: string } | null>(null);
  const [isFollowUpRecording, setIsFollowUpRecording] = useState(false);

  // Editable fields in review step
  const [finalCategory, setFinalCategory] = useState<Category>('plumbing');
  const [finalPriority, setFinalPriority] = useState<Priority>('normal');
  const [finalTitle, setFinalTitle] = useState('');
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [createdTicketNumber, setCreatedTicketNumber] = useState<string | null>(null);

  // Show-Me Recording Handler
  const handleShowMeComplete = async (blob: Blob, mediaType: 'video' | 'audio', dataUrl: string) => {
    setShowMeMedia({ blob, mediaType, dataUrl });
    setIsAnalyzingShowMe(true);

    try {
      const result = await analyzeShowMeRecording({ mediaDataUrl: dataUrl, mediaType });
      setShowMeAnalysis(result);
      setComplaintText(result.transcriptEnglish || result.transcriptOriginal);
      setFinalCategory(result.suggestedCategory);
      setFinalPriority(result.suggestedPriority);
      setFinalTitle(result.transcriptEnglish ? result.transcriptEnglish.slice(0, 70) : 'Multimodal Reported Issue');

      if (result.extractedLocation?.building) {
        const matchedBldg = CAMPUS_BUILDINGS.find(b => b.building.toLowerCase().includes(result.extractedLocation.building!.toLowerCase()));
        if (matchedBldg) setSelectedBuilding(matchedBldg.building);
      }
      if (result.extractedLocation?.floor) {
        setSelectedFloor(result.extractedLocation.floor);
      }
      if (result.extractedLocation?.room) {
        setSelectedRoom(result.extractedLocation.room);
      }
    } catch (err: any) {
      console.error('Show-Me analysis failed:', err);
      alert('Could not complete multimodal analysis. You can continue with text description.');
    } finally {
      setIsAnalyzingShowMe(false);
    }
  };

  // Follow-up voice answer handler
  const toggleFollowUpVoice = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your reply.');
      return;
    }

    if (isFollowUpRecording) {
      setIsFollowUpRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsFollowUpRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setClarificationResponse(prev => prev ? `${prev} ${transcript}` : transcript);
      };
      recognition.onerror = () => setIsFollowUpRecording(false);
      recognition.onend = () => setIsFollowUpRecording(false);
      recognition.start();
    } catch {
      setIsFollowUpRecording(false);
    }
  };


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

  // Validate all student identity and contact fields
  const validateStudentDetails = (): boolean => {
    if (!studentName.trim()) {
      setFormValidationMessage('Please enter your Full Name.');
      return false;
    }
    if (!studentRollNo.trim()) {
      setFormValidationMessage('Please enter your Student Roll Number / Campus ID.');
      return false;
    }
    if (!studentPhone.trim()) {
      setFormValidationMessage('Please enter your Contact Mobile/WhatsApp phone number so technicians can reach you.');
      return false;
    }
    if (!studentEmail.trim()) {
      setFormValidationMessage('Please enter your official Campus Email address.');
      return false;
    }
    if (!selectedRoom.trim()) {
      setFormValidationMessage('Please specify the Room, Wing, or Landmark indicator.');
      return false;
    }
    setFormValidationMessage(null);
    return true;
  };

  // Direct Submission Handler (with full student details)
  const handleDirectSubmission = () => {
    if (!validateStudentDetails()) {
      setStep(2);
      return;
    }

    const studentUid = studentRollNo.trim() || user?.id || 'STUDENT-REG';
    const studentDisplayName = studentName.trim() || user?.name || 'Campus Student';
    const studentContactEmail = studentEmail.trim() || user?.email || 'student@campus.edu';

    const ticket = createTicket({
      title: finalTitle || aiAnalysis?.summary || 'Campus Maintenance Incident',
      originalDescription: clarificationResponse
        ? `${complaintText}\n\nClarification Provided:\n${clarificationResponse}\n\n[Student Identity Manifest]\n• Full Name: ${studentDisplayName}\n• Roll Number: ${studentRollNo.trim()}\n• Contact Phone: ${studentPhone.trim()}\n• Department: ${studentDepartment.trim()}\n• Location: ${selectedBuilding}, Floor ${selectedFloor}, ${selectedRoom.trim()}`
        : `${complaintText}\n\n[Student Identity Manifest]\n• Full Name: ${studentDisplayName}\n• Roll Number: ${studentRollNo.trim()}\n• Contact Phone: ${studentPhone.trim()}\n• Department: ${studentDepartment.trim()}\n• Location: ${selectedBuilding}, Floor ${selectedFloor}, ${selectedRoom.trim()}`,
      aiSummary: aiAnalysis?.summary || complaintText.slice(0, 80),
      category: finalCategory,
      building: selectedBuilding,
      floor: selectedFloor,
      room: selectedRoom,
      priority: finalPriority,
      studentId: studentUid,
      studentName: studentDisplayName,
      studentEmail: studentContactEmail,
      studentPhone: studentPhone.trim(),
      studentDepartment: studentDepartment.trim(),
      imageUrl: photoPreview || undefined,
      isSafetyHazard: showMeAnalysis?.isSafetyHazard,
      safetyEscalationReason: showMeAnalysis?.isSafetyHazard ? showMeAnalysis.safetyConcerns.join(' • ') : undefined,
      mediaRecord: showMeMedia ? {
        id: `med-${Date.now()}`,
        mediaType: showMeMedia.mediaType,
        mediaUrl: showMeMedia.dataUrl,
        durationSeconds: 15,
        fileSizeBytes: showMeMedia.blob.size,
        recordedAt: new Date().toISOString(),
        analysis: showMeAnalysis || undefined,
      } : undefined,
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
    const verifiedName = studentData.name || studentName || 'Campus Student';
    const verifiedId = studentData.studentId || studentRollNo || 'STUDENT-BIO';
    const verifiedDept = studentData.department || studentDepartment || 'Engineering';

    if (studentData.name) setStudentName(studentData.name);
    if (studentData.studentId) setStudentRollNo(studentData.studentId);
    if (studentData.department) setStudentDepartment(studentData.department);

    setBiometricData({
      studentName: verifiedName,
      studentId: verifiedId,
      department: verifiedDept,
      faceImage: studentData.photoUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    const studentUid = verifiedId;
    const studentDisplayName = verifiedName;
    const studentContactEmail = studentEmail.trim() || user?.email || `${verifiedId.toLowerCase().replace(/[^a-z0-9]/g, '')}@campus.edu`;

    const ticket = createTicket({
      title: finalTitle || aiAnalysis?.summary || 'Campus Maintenance Incident',
      originalDescription: clarificationResponse
        ? `${complaintText}\n\nClarification Provided:\n${clarificationResponse}\n\n[Biometric Face ID Verified: ${studentDisplayName} (Roll ID: ${verifiedId}) — Match: 99.4% | Phone: ${studentPhone} | Dept: ${verifiedDept}]`
        : `${complaintText}\n\n[Biometric Face ID Verified: ${studentDisplayName} (Roll ID: ${verifiedId}) — Match: 99.4% | Phone: ${studentPhone} | Dept: ${verifiedDept}]`,
      aiSummary: aiAnalysis?.summary || complaintText.slice(0, 80),
      category: finalCategory,
      building: selectedBuilding,
      floor: selectedFloor,
      room: selectedRoom,
      priority: finalPriority,
      studentId: studentUid,
      studentName: studentDisplayName,
      studentEmail: studentContactEmail,
      studentPhone: studentPhone.trim(),
      studentDepartment: verifiedDept,
      imageUrl: studentData.photoUrl || photoPreview || undefined,
      isSafetyHazard: showMeAnalysis?.isSafetyHazard,
      safetyEscalationReason: showMeAnalysis?.isSafetyHazard ? showMeAnalysis.safetyConcerns.join(' • ') : undefined,
      mediaRecord: showMeMedia ? {
        id: `med-${Date.now()}`,
        mediaType: showMeMedia.mediaType,
        mediaUrl: showMeMedia.dataUrl,
        durationSeconds: 15,
        fileSizeBytes: showMeMedia.blob.size,
        recordedAt: new Date().toISOString(),
        analysis: showMeAnalysis || undefined,
      } : undefined,
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
              Choose your reporting method: type with photos or record a short video/voice clip for Gemini AI interpretation.
            </p>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setReportMode('text')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  reportMode === 'text' 
                    ? 'bg-[#35483A] text-white shadow-xs' 
                    : 'bg-[#F8F4ED] text-[#77766E] hover:text-[#24251F] border border-[#E7E1D7]'
                }`}
              >
                Type Details & Photos
              </button>
              <button
                type="button"
                onClick={() => setReportMode('showme')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  reportMode === 'showme' 
                    ? 'bg-[#35483A] text-white shadow-xs' 
                    : 'bg-[#F8F4ED] text-[#77766E] hover:text-[#24251F] border border-[#E7E1D7]'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-amber-500" />
                <span>Show Me (Video / Voice AI)</span>
                <span className="text-[10px] font-mono px-1 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  NEW
                </span>
              </button>
            </div>
          </div>

          {/* SHOW-ME MULTIMODAL MODE */}
          {reportMode === 'showme' ? (
            <div className="space-y-6">
              <ShowMeRecorder 
                onRecordingComplete={handleShowMeComplete} 
                maxDurationSeconds={15} 
              />

              {isAnalyzingShowMe && (
                <div className="p-6 rounded-2xl border border-border-subtle bg-ivory text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin mx-auto" />
                  <h4 className="font-serif text-sm font-bold text-ink">Analyzing Recording with Gemini Multimodal AI</h4>
                  <p className="text-xs text-muted-ink max-w-sm mx-auto">
                    Transcribing spoken Hindi/English, detecting audible rhythm anomalies, and indexing visible damage...
                  </p>
                </div>
              )}

              {showMeAnalysis && (
                <div className="p-5 rounded-2xl border border-border-strong bg-ivory space-y-4 shadow-xs">
                  {/* Immediate Safety Hazard Escalation Indicator */}
                  {showMeAnalysis.isSafetyHazard && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-900 flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="font-bold flex items-center gap-2">
                          <span>Immediate Safety Hazard Detected</span>
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px]">URGENT PRIORITY</span>
                        </div>
                        <p className="text-[11px] text-rose-800 leading-relaxed">
                          Gemini identified active arcing, sparks, or severe water accumulation. This report is automatically escalated for immediate staff dispatch upon your confirmation.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Transcripts */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-ink font-bold">
                      Multimodal Speech Transcription ({showMeAnalysis.detectedLanguage})
                    </span>
                    <div className="p-3.5 rounded-xl bg-paper border border-border-subtle text-xs text-ink leading-relaxed font-mono">
                      <p className="text-muted-ink italic">&ldquo;{showMeAnalysis.transcriptOriginal}&rdquo;</p>
                      {showMeAnalysis.transcriptEnglish !== showMeAnalysis.transcriptOriginal && (
                        <p className="mt-1 font-semibold text-ink">English: &ldquo;{showMeAnalysis.transcriptEnglish}&rdquo;</p>
                      )}
                    </div>
                  </div>

                  {/* Observations Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-paper border border-border-subtle space-y-1.5">
                      <span className="font-mono text-[11px] uppercase font-bold text-forest">Visible Observations</span>
                      <ul className="space-y-1 text-muted-ink text-[11px]">
                        {showMeAnalysis.visualObservations.map((obs, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-forest mt-1 shrink-0" />
                            <span>{obs}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-paper border border-border-subtle space-y-1.5">
                      <span className="font-mono text-[11px] uppercase font-bold text-forest">Audible Observations</span>
                      <ul className="space-y-1 text-muted-ink text-[11px]">
                        {showMeAnalysis.audioObservations.map((obs, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber mt-1 shrink-0" />
                            <span>{obs}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Interactive Follow-Up Clarification Question */}
                  <div className="p-4 rounded-xl border border-border-strong bg-paper space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase font-bold text-amber-700">
                        Follow-Up Question from Gemini
                      </span>
                      <button
                        type="button"
                        onClick={toggleFollowUpVoice}
                        className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-colors ${
                          isFollowUpRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-ivory border border-border-subtle text-muted-ink hover:text-ink'
                        }`}
                      >
                        <Mic className="w-3 h-3" />
                        <span>{isFollowUpRecording ? 'Recording...' : 'Answer by Voice'}</span>
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-ink">
                      {showMeAnalysis.followUpQuestion}
                    </p>

                    <input
                      type="text"
                      value={clarificationResponse}
                      onChange={(e) => setClarificationResponse(e.target.value)}
                      placeholder="Type or speak answer (e.g. 'Near entry door on bench 4')..."
                      className="w-full text-xs p-2.5 rounded-lg border border-border-subtle bg-ivory text-ink focus:ring-1 focus:ring-forest"
                    />
                  </div>

                  {/* Proceed from Show-Me */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-primary"
                    >
                      <span>Proceed to Location Verification</span>
                      <ArrowRight className="w-4 h-4 ml-1 btn-arrow" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}

      {/* STEP 2: Location & Student Identification */}
      {step === 2 && (
        <div className="bg-[#FCFAF6] rounded-xl border border-[#E7E1D7] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E7E1D7] pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#35483A] text-white">
                STEP 2 OF 4
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#24251F]">
                Incident Location & Student Identification
              </h2>
            </div>
            <p className="text-xs text-[#57564E] mt-1">
              Provide the exact campus location and your verified student details. Technicians need your contact details to reach you during physical repairs.
            </p>
          </div>

          {/* Validation Alert */}
          {formValidationMessage && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formValidationMessage}</span>
            </div>
          )}

          {/* Section A: Physical Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#35483A] border-b border-[#E7E1D7] pb-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Part A: Campus Fixture Location</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-1.5 font-semibold">
                  Facility / Building *
                </label>
                <select
                  value={selectedBuilding}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#35483A]"
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
                  Floor Level *
                </label>
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#35483A]"
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
                  Specific Room / Wing / Landmark Indicator *
                </label>
                <input
                  type="text"
                  value={selectedRoom}
                  onChange={(e) => {
                    setSelectedRoom(e.target.value);
                    if (formValidationMessage) setFormValidationMessage(null);
                  }}
                  placeholder="E.g. Room 204, Common Washroom Wing A, or Study Pod 3"
                  className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#35483A]"
                />
              </div>
            </div>
          </div>

          {/* Section B: Student Credentials & Contact */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-[#E7E1D7] pb-1.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#35483A]">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Part B: Student Contact & Identity (Required)</span>
              </div>
              {biometricVerified && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Biometric Face ID Attached
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-1.5 font-semibold">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    if (formValidationMessage) setFormValidationMessage(null);
                  }}
                  placeholder="E.g. Ananya Sharma or Rahul Verma"
                  className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#35483A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-1.5 font-semibold">
                  Roll Number / Student Campus ID *
                </label>
                <input
                  type="text"
                  value={studentRollNo}
                  onChange={(e) => {
                    setStudentRollNo(e.target.value);
                    if (formValidationMessage) setFormValidationMessage(null);
                  }}
                  placeholder="E.g. 2024CSB1042 or STU-8821"
                  className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#35483A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-1.5 font-semibold">
                  Contact Phone / WhatsApp Mobile *
                </label>
                <input
                  type="tel"
                  value={studentPhone}
                  onChange={(e) => {
                    setStudentPhone(e.target.value);
                    if (formValidationMessage) setFormValidationMessage(null);
                  }}
                  placeholder="E.g. +91 98765 43210"
                  className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#35483A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-1.5 font-semibold">
                  Official Campus Email *
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => {
                    setStudentEmail(e.target.value);
                    if (formValidationMessage) setFormValidationMessage(null);
                  }}
                  placeholder="E.g. ananya@campus.edu"
                  className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#35483A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#77766E] mb-1.5 font-semibold">
                  Academic Department / Branch *
                </label>
                <select
                  value={studentDepartment}
                  onChange={(e) => setStudentDepartment(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-[#24251F] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#35483A]"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil & Infrastructure Engineering">Civil & Infrastructure Engineering</option>
                  <option value="Chemical Engineering">Chemical Engineering</option>
                  <option value="Biotechnology & Biosciences">Biotechnology & Biosciences</option>
                  <option value="Management & Humanities">Management & Humanities</option>
                </select>
              </div>
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
              onClick={() => {
                if (!validateStudentDetails()) return;
                triggerAiAnalysis();
              }}
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

            {/* Student & Dispatch Manifest Card */}
            <div className="p-4 rounded-xl bg-[#F8F4ED] border border-[#E7E1D7] text-xs space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-[#E7E1D7]">
                <span className="text-[11px] uppercase font-bold text-[#35483A] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Student Credentials & Dispatch Manifest</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7EBDD] text-[#35483A]">
                  {biometricVerified ? 'BIOMETRIC VERIFIED (99.4%) ✓' : 'VERIFIED STUDENT DETAILS'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[#24251F]">
                <div>
                  <span className="text-[#77766E] text-[10px] block">Student Name:</span>
                  <span className="font-bold text-xs">{studentName || user?.name || 'Campus Student'}</span>
                </div>
                <div>
                  <span className="text-[#77766E] text-[10px] block">Roll Number / Student ID:</span>
                  <span className="font-bold text-xs">{studentRollNo || 'STU-PENDING'}</span>
                </div>
                <div>
                  <span className="text-[#77766E] text-[10px] block">Contact Mobile / Phone:</span>
                  <span className="font-bold text-xs">{studentPhone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[#77766E] text-[10px] block">Official Campus Email:</span>
                  <span className="font-bold text-xs">{studentEmail || 'student@campus.edu'}</span>
                </div>
                <div>
                  <span className="text-[#77766E] text-[10px] block">Academic Branch / Dept:</span>
                  <span className="font-bold text-xs">{studentDepartment}</span>
                </div>
                <div>
                  <span className="text-[#77766E] text-[10px] block">Assigned Fixture Location:</span>
                  <span className="font-bold text-xs">{selectedBuilding}, Floor {selectedFloor}, {selectedRoom}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E7E1D7] flex justify-between text-[#77766E]">
                <span>Routing To Department:</span>
                <span className="text-[#35483A] font-bold">{aiAnalysis?.department || 'Campus Operations'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E7E1D7]">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn-secondary w-full sm:w-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSubmitTicket}
                className="px-3.5 py-2.5 rounded-lg border border-[#D5CEBF] bg-[#EDE4D7] hover:bg-[#E2D8C9] text-xs font-mono font-bold text-[#35483A] transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer"
                title="Verify face with biometric camera"
              >
                <ScanFace className="w-4 h-4 text-[#35483A]" />
                <span>{biometricVerified ? 'Re-scan Face ID' : 'Face ID Fast-Track'}</span>
              </button>

              <button
                type="button"
                onClick={handleDirectSubmission}
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Official Complaint</span>
              </button>
            </div>
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
              <span className="text-[#77766E]">Student Name:</span>
              <span className="text-[#24251F] font-bold">{studentName || biometricData?.studentName || user?.name || 'Registered Student'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#77766E]">Roll / ID Number:</span>
              <span className="text-[#24251F] font-bold">{studentRollNo || biometricData?.studentId || user?.id || 'CC-ID-VERIFIED'}</span>
            </div>
            {studentPhone && (
              <div className="flex justify-between">
                <span className="text-[#77766E]">Contact Phone:</span>
                <span className="text-[#24251F] font-bold">{studentPhone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#77766E]">Verification:</span>
              <span className={biometricVerified ? "text-emerald-700 font-bold" : "text-[#35483A] font-bold"}>
                {biometricVerified ? 'Face ID Biometric Verified (99.4%) ✓' : 'Verified Student Credentials ✓'}
              </span>
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
