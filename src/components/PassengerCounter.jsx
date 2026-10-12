import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Users } from 'lucide-react';

export default function PassengerCounter({ passengers, onChange }) {
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
          Number of Passengers
        </label>
        <span className="passenger-helper-tag">
          {passengers === 1 ? '1 Penumpang' : `${passengers} Penumpang`}
        </span>
      </div>

      <div className="passenger-control-card">
        <div className="passenger-meta-left">
          <div className="passenger-icon-box">
            <Users size={18} color="#2563eb" />
          </div>
          <div className="passenger-desc">
            <span className="passenger-title">Total Penumpang</span>
            <span className="passenger-subtitle">Min. 1 Penumpang</span>
          </div>
        </div>

        {/* Counter controls [-] count [+] */}
        <div className="passenger-stepper">
          <motion.button
            type="button"
            aria-label="Kurangi jumlah penumpang"
            disabled={passengers <= 1}
            whileHover={passengers > 1 ? { scale: 1.12, backgroundColor: '#e2e8f0' } : {}}
            whileTap={passengers > 1 ? { scale: 0.9 } : {}}
            onClick={handleDecrement}
            className={`stepper-btn ${passengers <= 1 ? 'disabled' : ''}`}
          >
            <Minus size={15} />
          </motion.button>

          {/* Animated Number with Scale Bounce */}
          <div className="passenger-count-wrapper">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={passengers}
                initial={{ scale: 0.5, y: -6, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.5, y: 6, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="passenger-count-number"
              >
                {passengers}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.button
            type="button"
            aria-label="Tambah jumlah penumpang"
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
