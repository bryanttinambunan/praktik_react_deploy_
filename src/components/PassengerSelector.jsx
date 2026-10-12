import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Users } from 'lucide-react';

export default function PassengerSelector({ passengers, onChange }) {
  const handleDecrement = () => {
    if (passengers > 1) {
      onChange(passengers - 1);
    }
  };

  const handleIncrement = () => {
    if (passengers < 9) {
      onChange(passengers + 1);
    }
  };

  return (
    <div className="passenger-selector-container">
      <div className="location-label-wrapper">
        <label className="location-label">
          <span className="label-bullet" style={{ backgroundColor: '#2563eb' }} />
          Passengers
        </label>
        <span className="passenger-helper-tag">
          {passengers === 1 ? 'Solo Traveler' : `${passengers} Penumpang`}
        </span>
      </div>

      <div className="passenger-control-card">
        <div className="passenger-meta-left">
          <div className="passenger-icon-box">
            <Users size={18} color="#2563eb" />
          </div>
          <div className="passenger-desc">
            <span className="passenger-title">Total Penumpang</span>
            <span className="passenger-subtitle">Dewasa, Anak & Bayi</span>
          </div>
        </div>

        {/* Counter controls [-] count [+] */}
        <div className="passenger-stepper">
          <motion.button
            type="button"
            aria-label="Decrease passenger count"
            disabled={passengers <= 1}
            whileHover={passengers > 1 ? { scale: 1.12, backgroundColor: '#e2e8f0' } : {}}
            whileTap={passengers > 1 ? { scale: 0.9 } : {}}
            onClick={handleDecrement}
            className={`stepper-btn ${passengers <= 1 ? 'disabled' : ''}`}
          >
            <Minus size={15} />
          </motion.button>

          {/* Animated Number with Scale Bump */}
          <div className="passenger-count-wrapper">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={passengers}
                initial={{ scale: 0.6, y: -6, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.6, y: 6, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="passenger-count-number"
              >
                {passengers}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.button
            type="button"
            aria-label="Increase passenger count"
            disabled={passengers >= 9}
            whileHover={passengers < 9 ? { scale: 1.12, backgroundColor: '#e2e8f0' } : {}}
            whileTap={passengers < 9 ? { scale: 0.9 } : {}}
            onClick={handleIncrement}
            className={`stepper-btn ${passengers >= 9 ? 'disabled' : ''}`}
          >
            <Plus size={15} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
