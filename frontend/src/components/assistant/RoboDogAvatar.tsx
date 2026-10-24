'use client';

import React from 'react';

interface RoboDogAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isAnimated?: boolean;
  mood?: 'idle' | 'listening' | 'happy' | 'alert';
}

export default function RoboDogAvatar({
  size = 'md',
  className = '',
  isAnimated = true,
  mood = 'idle',
}: RoboDogAvatarProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const glowColor = mood === 'alert' ? '#E11D48' : '#10B981';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}
      title="Spot K-9 — Autonomous Campus Assistant"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-sm transition-transform duration-300 ${
          isAnimated ? 'hover:scale-105' : ''
        }`}
      >
        <defs>
          {/* Metallic gradient for robot dog plates */}
          <linearGradient id="roboBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3E5444" />
            <stop offset="50%" stopColor="#2A3B2F" />
            <stop offset="100%" stopColor="#1E2A22" />
          </linearGradient>

          <linearGradient id="roboPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#526E5B" />
            <stop offset="100%" stopColor="#35483A" />
          </linearGradient>

          {/* Cyber Visor Gradient */}
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="visorGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <linearGradient id="collarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Outer Tech Hex Halo */}
        <circle cx="50" cy="50" r="47" fill="#F4EFE6" stroke="#D5CEBF" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="43" fill="none" stroke="#35483A" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />

        {/* ROBOT EARS (Perked angular robotic canine ears) */}
        {/* Left Ear */}
        <path
          d="M26 40 L16 15 L36 28 Z"
          fill="url(#roboBodyGrad)"
          stroke="#1E2A22"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Left Ear Inner Acoustic Plate */}
        <path
          d="M24 35 L19 20 L31 28 Z"
          fill="#1E2A22"
          stroke="url(#visorGrad)"
          strokeWidth="0.8"
        />
        <line x1="22" y1="26" x2="27" y2="30" stroke="#34D399" strokeWidth="0.8" opacity="0.8" />

        {/* Right Ear */}
        <path
          d="M74 40 L84 15 L64 28 Z"
          fill="url(#roboBodyGrad)"
          stroke="#1E2A22"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Right Ear Inner Acoustic Plate */}
        <path
          d="M76 35 L81 20 L69 28 Z"
          fill="#1E2A22"
          stroke="url(#visorGrad)"
          strokeWidth="0.8"
        />
        <line x1="78" y1="26" x2="73" y2="30" stroke="#34D399" strokeWidth="0.8" opacity="0.8" />

        {/* Antenna / Beacon between ears */}
        <line x1="50" y1="26" x2="50" y2="18" stroke="#35483A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="16" r="3" fill={glowColor} filter="url(#visorGlow)" />
        <circle cx="50" cy="16" r="1.5" fill="#FFFFFF" />

        {/* HEAD BASE (Sleek Angular Robo-Chassis) */}
        <path
          d="M28 36 L72 36 L78 56 L68 76 L32 76 L22 56 Z"
          fill="url(#roboBodyGrad)"
          stroke="#1E2A22"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* BROW / FOREHEAD ARMOR PLATE */}
        <path
          d="M32 38 L68 38 L72 46 L28 46 Z"
          fill="url(#roboPlateGrad)"
          stroke="#2A3B2F"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Tech screws / bolts */}
        <circle cx="34" cy="42" r="1.2" fill="#CCD6BE" />
        <circle cx="66" cy="42" r="1.2" fill="#CCD6BE" />

        {/* CYBER VISOR (Glowing Horizontal Multi-Sensor Eye Bar) */}
        <path
          d="M30 48 L70 48 L68 57 L32 57 Z"
          fill="#0F172A"
          stroke="#1E2A22"
          strokeWidth="1.5"
        />
        <rect
          x="33"
          y="50"
          width="34"
          height="5.5"
          rx="2.5"
          fill="url(#visorGrad)"
          filter="url(#visorGlow)"
        />
        {/* Digital Pupillary HUD ticks */}
        <rect x="42" y="51" width="3" height="3.5" rx="0.5" fill="#FFFFFF" />
        <rect x="55" y="51" width="3" height="3.5" rx="0.5" fill="#FFFFFF" />
        <line x1="34" y1="52.75" x2="66" y2="52.75" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.6" />

        {/* SNOUT / JAW (Robotic canine muzzle) */}
        <path
          d="M36 62 L64 62 L60 74 L40 74 Z"
          fill="url(#roboPlateGrad)"
          stroke="#1E2A22"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* NOSE / AUDITORY SENSOR */}
        <path
          d="M45 64 L55 64 L53 68 L47 68 Z"
          fill="#0F172A"
          stroke="#34D399"
          strokeWidth="0.75"
        />
        {/* Acoustic Micro-Grill */}
        <line x1="42" y1="71" x2="58" y2="71" stroke="#24251F" strokeWidth="1" strokeLinecap="round" />
        <line x1="44" y1="73" x2="56" y2="73" stroke="#24251F" strokeWidth="0.8" strokeLinecap="round" />

        {/* CHEEK SENSOR PADS (Left & Right) */}
        <circle cx="27" cy="58" r="2.5" fill="#2A3B2F" stroke="#35483A" strokeWidth="0.8" />
        <circle cx="27" cy="58" r="1" fill="#34D399" />
        <circle cx="73" cy="58" r="2.5" fill="#2A3B2F" stroke="#35483A" strokeWidth="0.8" />
        <circle cx="73" cy="58" r="1" fill="#34D399" />

        {/* HIGH-TECH COLLAR & CAMPUS BADGE */}
        <path
          d="M30 76 L70 76 L66 84 L34 84 Z"
          fill="url(#collarGrad)"
          stroke="#B45309"
          strokeWidth="1.2"
        />
        {/* Collar Medallion / Tag */}
        <polygon
          points="50,81 56,87 50,93 44,87"
          fill="#F8F4ED"
          stroke="#B45309"
          strokeWidth="1"
        />
        {/* Mini Shield / Paw Icon inside medallion */}
        <circle cx="50" cy="87" r="2.2" fill="#35483A" />
        <circle cx="50" cy="87" r="1" fill="#10B981" />
      </svg>

      {/* Online Pulse Indicator Dot */}
      <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#FCFAF6]" />
      </span>
    </div>
  );
}
