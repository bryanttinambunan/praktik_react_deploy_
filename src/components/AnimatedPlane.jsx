import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnimatedPlane({
  size = 110,
  isClickable = false,
  onClick,
  isTakingOff = false,
  customClassName = '',
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`animated-plane-root ${customClassName}`} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Tooltip 'Click to Fly' on Hover (Section 4) */}
      <AnimatePresence>
        {isClickable && isHovered && !isTakingOff && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: -18, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            className="click-to-fly-tooltip"
          >
            <span>Click to Fly</span>
            <span className="tooltip-plane-icon">✈</span>
            <div className="tooltip-arrow" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Plane Motion Container */}
      <motion.div
        onClick={isClickable && !isTakingOff ? onClick : undefined}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={
          isTakingOff
            ? {
                // Taking off animation
                scale: [1, 1.1, 1.05],
              }
            : {
                // Idle floating animation (Section 3)
                y: [0, -8, 0],
                rotate: [-2, 2, -2],
              }
        }
        transition={
          isTakingOff
            ? { duration: 0.6 }
            : {
                repeat: Infinity,
                duration: 3.5,
                ease: 'easeInOut',
              }
        }
        whileHover={
          isClickable && !isTakingOff
            ? {
                scale: 1.08,
                y: -5,
                transition: { duration: 0.25 },
              }
            : {}
        }
        whileTap={isClickable && !isTakingOff ? { scale: 0.95 } : {}}
        className={`plane-interactive-wrapper ${isClickable ? 'is-clickable' : ''} ${
          isTakingOff ? 'is-taking-off' : ''
        }`}
        style={{ cursor: isClickable && !isTakingOff ? 'pointer' : 'default' }}
      >
        {/* Jet Engine Smoke Trail (Section 5, Tahap 4) */}
        <div className={`plane-jet-trail ${isTakingOff ? 'trail-active' : ''}`}>
          <div className="trail-stream stream-upper" />
          <div className="trail-stream stream-lower" />
          <div className="trail-cloud-puff puff-1" />
          <div className="trail-cloud-puff puff-2" />
        </div>

        {/* Vector SVG Jet Airplane */}
        <svg
          width={size}
          height={size * 0.72}
          viewBox="0 0 160 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="plane-svg-graphic"
        >
          <defs>
            {/* Fuselage gradient */}
            <linearGradient id="fuselageGrad" x1="10" y1="30" x2="155" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="35%" stopColor="#2563eb" />
              <stop offset="70%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>

            {/* Wing gradient */}
            <linearGradient id="wingGrad" x1="45" y1="5" x2="110" y2="75" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="60%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            {/* Cockpit / window shine */}
            <linearGradient id="windowGrad" x1="120" y1="42" x2="148" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            {/* Turbine glow */}
            <radialGradient id="turbineGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#fb923c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
            </radialGradient>

            {/* Drop shadow */}
            <filter id="planeShadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#1e3a8a" floodOpacity="0.18" />
            </filter>
          </defs>

          <g filter="url(#planeShadow)">
            {/* Far Wing */}
            <path
              d="M78 40 L96 8 C98 5 103 6 104 10 L108 40 Z"
              fill="#1e40af"
              opacity="0.85"
            />

            {/* Far Tail Fin */}
            <path
              d="M24 45 L32 20 C33 17 37 17 38 21 L43 45 Z"
              fill="#1e3a8a"
              opacity="0.9"
            />

            {/* Jet Exhaust Flame Behind Turbine */}
            <ellipse cx="62" cy="78" rx="8" ry="4" fill="url(#turbineGlow)" />

            {/* Main Fuselage Body */}
            <path
              d="M18 52 C18 46 25 43 36 43 L126 43 C142 43 154 48 156 55 C154 62 142 67 126 67 L36 67 C25 67 18 64 18 58 Z"
              fill="url(#fuselageGrad)"
            />

            {/* Nose Cone Curve */}
            <path
              d="M136 44 C148 47 156 52 156 55 C156 58 148 63 136 66 L126 67 L126 43 Z"
              fill="#3b82f6"
            />

            {/* Cockpit Window */}
            <path
              d="M128 47 L142 49 C145 50 146 53 144 55 L132 55 C129 55 127 52 128 47 Z"
              fill="url(#windowGrad)"
            />

            {/* Passenger Windows */}
            <circle cx="114" cy="53" r="2.8" fill="#e0f2fe" opacity="0.9" />
            <circle cx="102" cy="53" r="2.8" fill="#e0f2fe" opacity="0.9" />
            <circle cx="90" cy="53" r="2.8" fill="#e0f2fe" opacity="0.9" />
            <circle cx="78" cy="53" r="2.8" fill="#e0f2fe" opacity="0.9" />
            <circle cx="66" cy="53" r="2.8" fill="#e0f2fe" opacity="0.9" />
            <circle cx="54" cy="53" r="2.8" fill="#e0f2fe" opacity="0.9" />

            {/* Near Main Wing */}
            <path
              d="M62 58 L88 102 C90 106 95 106 97 102 L112 58 Z"
              fill="url(#wingGrad)"
            />
            {/* Wing Edge Stripe */}
            <path
              d="M87 99 L93 99 L108 58 L104 58 Z"
              fill="#93c5fd"
              opacity="0.75"
            />

            {/* Under-Wing Engine Turbine */}
            <rect x="68" y="72" width="22" height="11" rx="5.5" fill="#1e293b" />
            <rect x="85" y="73" width="4" height="9" rx="2" fill="#94a3b8" />
            <circle cx="70" cy="77.5" r="4.5" fill="#334155" />

            {/* Main Tail Fin */}
            <path
              d="M20 50 L34 16 C35 12 40 12 42 16 L48 50 Z"
              fill="url(#wingGrad)"
            />
            {/* Tail Fin Decorative Stripe */}
            <path
              d="M32 20 L37 20 L44 50 L40 50 Z"
              fill="#f97316"
            />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
