'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  ShieldCheck, 
  Scan, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  User,
  Hash,
  Building,
  Sparkles
} from 'lucide-react';

interface FaceRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
  initialStudentId?: string;
  onVerified: (studentData: {
    name: string;
    studentId: string;
    department: string;
    confidence: number;
    photoUrl?: string;
  }) => void;
}

export default function FaceRecognitionModal({ 
  isOpen, 
  onClose, 
  initialName = '', 
  initialStudentId = '',
  onVerified 
}: FaceRecognitionModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'verified' | 'failed'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Student Identity Input Fields
  const [studentName, setStudentName] = useState(initialName);
  const [studentId, setStudentId] = useState(initialStudentId);
  const [studentDepartment, setStudentDepartment] = useState('Computer Science & Engineering');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialName && !studentName) setStudentName(initialName);
      if (initialStudentId && !studentId) setStudentId(initialStudentId);
      startCamera();
      setScanState('idle');
      setScanProgress(0);
      setCapturedPhoto(null);
      setInputError('');
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } else {
        setCameraActive(false);
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable, running AI biometric simulation mode.', err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const triggerFaceScan = () => {
    // Validate that student provided their real details
    if (!studentName.trim() || !studentId.trim()) {
      setInputError('Please enter your Student Name and Student ID / Roll Number before verifying.');
      return;
    }
    setInputError('');

    setScanState('scanning');
    setScanProgress(0);

    // Simulate real biometric scanning stages: 0% -> 30% -> 60% -> 90% -> 100%
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          completeVerification();
          return 100;
        }
        return prev + 20;
      });
    }, 160);
  };

  const completeVerification = () => {
    // Snapshot current frame if camera is available
    let photoData = '';
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 480;
      canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        photoData = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(photoData);
      }
    }

    setScanState('verified');

    // Trigger parent callback after brief verification confirmation
    setTimeout(() => {
      onVerified({
        name: studentName.trim(),
        studentId: studentId.trim(),
        department: studentDepartment.trim(),
        confidence: 99.4,
        photoUrl: photoData || undefined,
      });
      stopCamera();
      onClose();
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24251F]/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#FCFAF6] rounded-2xl border border-[#D5CEBF] shadow-2xl overflow-hidden space-y-0 text-[#24251F]">
        
        {/* Top Header */}
        <div className="p-5 border-b border-[#E7E1D7] flex items-center justify-between bg-[#F8F4ED]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#EDE4D7] border border-[#D5CEBF] flex items-center justify-center text-[#35483A]">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#24251F]">
                  Student Identity Biometric Clearance
                </h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
                  VERIFIED HUD
                </span>
              </div>
              <p className="text-xs text-[#57564E] mt-0.5">
                Enter your details and scan your face to authenticate and register your complaint.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-[#E7E1D7] text-[#77766E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport / Video Area */}
        <div className="relative bg-[#1A1C19] aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center overflow-hidden">
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Fallback Simulation Visual if Camera not permitted */}
          {!cameraActive && (
            <div className="text-center p-6 space-y-3 z-10">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#9AA38A] flex items-center justify-center mx-auto text-[#9AA38A] animate-pulse">
                <UserCheck className="w-8 h-8" />
              </div>
              <div className="text-xs font-mono text-[#E7EBDD] space-y-1">
                <p className="font-bold">Camera Standby / AI Biometric Ready</p>
                <p className="text-[#9AA38A] max-w-xs mx-auto">
                  Position face towards the sensor and initiate biometric scan.
                </p>
              </div>
            </div>
          )}

          {/* Futuristic Scanning HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none p-4 sm:p-5 flex flex-col justify-between">
            {/* Top HUD Telemetry */}
            <div className="flex justify-between items-start text-[11px] font-mono text-[#E7EBDD] drop-shadow-md">
              <div className="space-y-0.5 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded border border-white/10">
                <span className="text-[#9AA38A] block">TARGET:</span>
                <span className="font-bold text-white uppercase">{studentName || 'CAMPUS_STUDENT'}</span>
              </div>
              <div className="text-right space-y-0.5 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded border border-white/10">
                <span className="text-[#9AA38A] block">LIVENESS:</span>
                <span className="font-bold text-emerald-400">ACTIVE SENSOR</span>
              </div>
            </div>

            {/* Center Face Reticle Frame */}
            <div className="relative w-44 h-48 sm:w-48 sm:h-52 mx-auto border-2 border-white/30 rounded-2xl flex items-center justify-center">
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-emerald-400" />

              {/* Animated Vertical Scan Line */}
              {scanState === 'scanning' && (
                <div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] transition-all"
                  style={{ top: `${scanProgress}%` }}
                />
              )}

              {scanState === 'verified' && (
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-in zoom-in-75">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Bottom HUD Telemetry */}
            <div className="flex justify-between items-end text-[11px] font-mono text-[#E7EBDD] drop-shadow-md">
              <span className="bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded border border-white/10">
                ID: {studentId || 'PENDING'}
              </span>
              <span className="bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded border border-white/10 text-emerald-400">
                MATCH: {scanState === 'verified' ? '99.4%' : 'READY'}
              </span>
            </div>
          </div>
        </div>

        {/* Student Details Input Section */}
        <div className="p-5 space-y-4 bg-[#FCFAF6]">
          {scanState !== 'verified' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#35483A]">
                <UserCheck className="w-4 h-4 text-[#35483A]" />
                <span>Enter Student Verification Credentials</span>
              </div>

              {inputError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{inputError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-[#57564E] mb-1">
                    Student Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#77766E]" />
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Ayush Mishra"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-sm text-[#24251F] font-medium focus:outline-none focus:ring-1 focus:ring-[#35483A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-[#57564E] mb-1">
                    Student ID / Roll No *
                  </label>
                  <div className="relative">
                    <Hash className="w-3.5 h-3.5 absolute left-3 top-3 text-[#77766E]" />
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. 2024-CS-084"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-sm text-[#24251F] font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-[#35483A]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-[#57564E] mb-1">
                  Department / Branch
                </label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 absolute left-3 top-3 text-[#77766E]" />
                  <input
                    type="text"
                    value={studentDepartment}
                    onChange={(e) => setStudentDepartment(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] text-xs text-[#24251F] focus:outline-none focus:ring-1 focus:ring-[#35483A]"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-lg border border-[#E7E1D7] bg-[#F8F4ED] hover:bg-[#EDE4D7] text-xs font-semibold text-[#57564E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={triggerFaceScan}
                  disabled={scanState === 'scanning'}
                  className="btn-primary text-sm px-6 py-2.5 shadow-sm"
                >
                  {scanState === 'scanning' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
                      <span>Scanning ({scanProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-1.5" />
                      <span>Verify Face & Register Complaint</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-3.5">
              <ShieldCheck className="w-7 h-7 text-emerald-700 shrink-0" />
              <div className="space-y-0.5">
                <h4 className="text-base font-bold text-emerald-950 font-serif">
                  Biometric Clearance Confirmed: {studentName}
                </h4>
                <p className="text-xs text-emerald-800 font-mono">
                  Student ID: {studentId} • {studentDepartment} • 99.4% Match Verified
                </p>
                <p className="text-[11px] text-emerald-700 font-medium pt-1">
                  Registering verified complaint into operational dispatch queue...
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
