import React from 'react';
import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';

export default function TravelBackground() {
  return (
    <div className="travel-background-canvas" aria-hidden="true">
      {/* Soft Ambient Blobs */}
      <div className="sky-ambient-blob blob-1" />
      <div className="sky-ambient-blob blob-2" />
      <div className="sky-ambient-blob blob-3" />

      {/* Horizon Line (Section 2) */}
      <div className="sky-horizon-line" />

      {/* Soft Floating Clouds (Section 20: x: -50 -> 50, repeat: Infinity) */}
      <motion.div
        animate={{ x: [-50, 50, -50] }}
        transition={{ repeat: Infinity, duration: 24, ease: 'easeInOut' }}
        className="sky-cloud-item cloud-top-left"
      >
        <Cloud size={88} strokeWidth={1} color="#bae6fd" fill="#f0f9ff" />
      </motion.div>

      <motion.div
        animate={{ x: [40, -40, 40] }}
        transition={{ repeat: Infinity, duration: 28, ease: 'easeInOut' }}
        className="sky-cloud-item cloud-top-right"
      >
        <Cloud size={110} strokeWidth={1} color="#bae6fd" fill="#f8fcff" />
      </motion.div>

      <motion.div
        animate={{ x: [-35, 45, -35] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
        className="sky-cloud-item cloud-mid-left"
      >
        <Cloud size={70} strokeWidth={1} color="#bae6fd" fill="#eff8ff" />
      </motion.div>

      <motion.div
        animate={{ x: [30, -35, 30] }}
        transition={{ repeat: Infinity, duration: 26, ease: 'easeInOut' }}
        className="sky-cloud-item cloud-bottom-right"
      >
        <Cloud size={95} strokeWidth={1} color="#bae6fd" fill="#f0f9ff" />
      </motion.div>

      {/* Subtle Aviation Dot Grid & Trajectory Lines */}
      <svg className="sky-grid-svg" width="100%" height="100%">
        <defs>
          <pattern id="skyDotPattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#cbd5e1" opacity="0.45" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#skyDotPattern)" />
        {/* Soft decorative flight arcs */}
        <path
          d="M -100 280 Q 400 120 1200 320"
          fill="none"
          stroke="#bfdbfe"
          strokeWidth="1.5"
          strokeDasharray="8 8"
          opacity="0.5"
        />
        <path
          d="M 100 480 Q 700 300 1400 460"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1.2"
          strokeDasharray="6 6"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
