'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Mic, 
  StopCircle, 
  RotateCcw, 
  Check, 
  Upload, 
  ShieldCheck, 
  AlertCircle, 
  Volume2, 
  Sparkles,
  Camera
} from 'lucide-react';

interface ShowMeRecorderProps {
  onRecordingComplete: (blob: Blob, mediaType: 'video' | 'audio', dataUrl: string) => void;
  maxDurationSeconds?: number;
}

export default function ShowMeRecorder({ 
  onRecordingComplete, 
  maxDurationSeconds = 15 
}: ShowMeRecorderProps) {
  const [mode, setMode] = useState<'video' | 'audio'>('video');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Cleanup streams on unmount
  useEffect(() => {
    return () => {
      stopStream();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    setPermissionError(null);
    chunksRef.current = [];
    setRecordedBlob(null);
    setPreviewUrl(null);
    setTimer(0);

    try {
      const constraints: MediaStreamConstraints = mode === 'video' 
        ? { video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }, audio: true }
        : { audio: true, video: false };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current && mode === 'video') {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mimeType = mode === 'video' 
        ? (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus') ? 'video/webm;codecs=vp8,opus' : 'video/mp4')
        : (MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4');

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(finalBlob);
        const url = URL.createObjectURL(finalBlob);
        setPreviewUrl(url);
        stopStream();
      };

      recorder.start(500); // 500ms slice
      setIsRecording(true);

      // Countdown timer
      let elapsed = 0;
      timerIntervalRef.current = setInterval(() => {
        elapsed += 1;
        setTimer(elapsed);
        if (elapsed >= maxDurationSeconds) {
          stopRecording();
        }
      }, 1000);

    } catch (err: any) {
      console.error('Media recording error:', err);
      setPermissionError(err.message || 'Camera and microphone permission denied. Please grant access or upload a file.');
      stopStream();
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleRetake = () => {
    setRecordedBlob(null);
    setPreviewUrl(null);
    setTimer(0);
    stopStream();
  };

  const handleConfirm = () => {
    if (!recordedBlob) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onRecordingComplete(recordedBlob, mode, reader.result as string);
    };
    reader.readAsDataURL(recordedBlob);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('File exceeds maximum size limit of 15MB.');
      return;
    }

    const isVideo = file.type.startsWith('video');
    const isAudio = file.type.startsWith('audio');
    if (!isVideo && !isAudio) {
      alert('Please upload a valid audio or video file.');
      return;
    }

    setRecordedBlob(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setMode(isVideo ? 'video' : 'audio');
  };

  return (
    <div className="space-y-4 p-5 rounded-2xl border border-border-strong bg-paper shadow-xs">
      {/* Mode Selector & Duration Cap */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setMode('video'); handleRetake(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              mode === 'video' ? 'bg-forest text-ivory' : 'bg-ivory text-muted-ink hover:text-ink'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video & Voice</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('audio'); handleRetake(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              mode === 'audio' ? 'bg-forest text-ivory' : 'bg-ivory text-muted-ink hover:text-ink'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Only</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-muted-ink">
          Max: <span className="font-bold text-ink">{maxDurationSeconds}s</span> duration • Hindi or English
        </div>
      </div>

      {/* Permission Error Banner */}
      {permissionError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{permissionError}</p>
            <p className="text-[11px] text-rose-700">
              You can alternatively select an existing short clip using the file upload below.
            </p>
          </div>
        </div>
      )}

      {/* Video Preview or Audio Waveform */}
      <div className="relative aspect-video max-h-72 w-full rounded-xl bg-ink/90 overflow-hidden flex items-center justify-center border border-border-subtle">
        {previewUrl ? (
          mode === 'video' ? (
            <video src={previewUrl} controls className="w-full h-full object-contain" />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center text-ivory">
              <Volume2 className="w-12 h-12 text-forest animate-pulse" />
              <audio src={previewUrl} controls className="w-full max-w-xs" />
              <span className="text-xs font-mono text-muted-ink">Audio recording ready for AI interpretation</span>
            </div>
          )
        ) : isRecording ? (
          mode === 'video' ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 text-ivory">
              <div className="relative">
                <Mic className="w-12 h-12 text-rose-500 animate-bounce" />
                <span className="absolute -inset-2 rounded-full border border-rose-500/50 animate-ping" />
              </div>
              <span className="font-mono text-xs text-rose-400">Recording spoken narration...</span>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center text-muted-ink">
            {mode === 'video' ? <Camera className="w-10 h-10 opacity-40" /> : <Mic className="w-10 h-10 opacity-40" />}
            <p className="text-xs font-mono max-w-xs text-zinc-400">
              Press &ldquo;Record {mode === 'video' ? 'Clip' : 'Voice'}&rdquo; and explain the problem in Hindi or English.
            </p>
          </div>
        )}

        {/* Live Timer Badge */}
        {isRecording && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-rose-600/90 text-white font-mono text-xs flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>00:{String(maxDurationSeconds - timer).padStart(2, '0')}</span>
          </div>
        )}
      </div>

      {/* Control Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {!previewUrl ? (
          <>
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest/90 text-ivory font-mono text-xs font-bold flex items-center gap-2 shadow-xs transition-transform active:scale-95"
              >
                {mode === 'video' ? <Video className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>Start Recording ({maxDurationSeconds}s)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-xs animate-pulse"
              >
                <StopCircle className="w-4 h-4" />
                <span>Stop & Process</span>
              </button>
            )}

            {/* File Upload Option */}
            <label className="cursor-pointer px-3 py-2 rounded-xl border border-border-subtle bg-paper hover:bg-ivory text-xs font-mono text-muted-ink hover:text-ink flex items-center gap-1.5 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Select File</span>
              <input
                type="file"
                accept="video/*,audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </>
        ) : (
          <div className="flex items-center gap-2 w-full justify-between">
            <button
              type="button"
              onClick={handleRetake}
              className="px-3.5 py-2 rounded-xl border border-border-subtle hover:bg-ivory text-xs font-mono text-muted-ink hover:text-ink flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest/90 text-ivory font-mono text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber" />
              <span>Analyze with Gemini AI</span>
            </button>
          </div>
        )}
      </div>

      {/* Privacy Disclosure Notice */}
      <div className="p-3 rounded-xl bg-ivory/80 border border-border-subtle text-[11px] text-muted-ink flex items-start gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Mandatory Privacy Disclosure:</strong> Your audio and video clip is transferred server-side to Gemini AI to extract observations, transcribe spoken speech, and verify location details. Only authorized campus maintenance personnel can access this recording.
        </p>
      </div>
    </div>
  );
}
