import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, MapPin } from 'lucide-react';
import AnimatedPlane from './AnimatedPlane';

export default function IntroFlight({ onStartJourney }) {
  const [isTakingOff, setIsTakingOff] = useState(false);

  const handleClickPlane = () => {
    if (isTakingOff) return;
    setIsTakingOff(true);
    // Call parent handler to begin flight & unveil form
    onStartJourney();
  };

  return (
    <div className="intro-flight-container">
      {/* Opening Hero Text (Tahap 1: Fades out upon click) */}
      <AnimatePresence>
        {!isTakingOff && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="intro-text-cluster"
          >
            <div className="intro-badge">
              <Sparkles size={14} color="#2563eb" />
              <span>Interactive Travel Booking</span>
            </div>

            <h1 className="intro-title">Ready for Takeoff?</h1>

            <div className="intro-hint-pulse">
              <span className="pulse-ring" />
              <span className="pulse-dot" />
              <span className="pulse-text">Klik pesawat di bawah untuk lepas landas</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flight Runway & Interactive Airplane Stage */}
      <div className="intro-runway-stage">
        {/* Decorative Runway Track / Horizon Indicator */}
        <div className="runway-guideline">
          <div className="runway-marker start-point">
            <MapPin size={16} color="#2563eb" />
            <span>Medan (MDN)</span>
          </div>
          <div className="runway-dashed-track" />
          <div className="runway-marker end-point">
            <Compass size={16} color="#0284c7" />
            <span>Bali (DPS)</span>
          </div>
        </div>

        {/* Airplane Container with Responsive Flight Path (Tahap 2 & 3 & 4) */}
        <motion.div
          animate={
            isTakingOff
              ? {
                  // Flights to the right, climbs upwards, and tilts
                  x: ['0vw', '45vw', '110vw'],
                  y: [0, -45, -120],
                  rotate: [0, -6, -3],
                  scale: [1, 1.08, 0.95],
                }
              : {
                  x: 0,
                  y: 0,
                  rotate: 0,
                }
          }
          transition={
            isTakingOff
              ? {
                  duration: 1.8,
                  ease: [0.25, 0.1, 0.25, 1],
                }
              : {
                  duration: 0.4,
                }
          }
          className="airplane-flight-track"
        >
          {/* Extended Jet Contrail Trail during Takeoff */}
          {isTakingOff && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: [0, 0.9, 0.4], width: ['0%', '100%'] }}
              transition={{ duration: 1.8 }}
              className="contrail-takeoff-trail"
            />
          )}

          <AnimatedPlane
            size={135}
            isClickable={!isTakingOff}
            onClick={handleClickPlane}
            isTakingOff={isTakingOff}
          />
        </motion.div>
      </div>
    </div>
  );
}
