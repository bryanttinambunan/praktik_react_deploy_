import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Loader2 } from 'lucide-react';

export default function BookingButton({ onClick, loading = false, disabled = false }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={
        !disabled && !loading
          ? { scale: 1.02, y: -2, boxShadow: '0 12px 28px -4px rgba(37, 99, 235, 0.35)' }
          : {}
      }
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      transition={{ duration: 0.18 }}
      className={`booking-action-btn ${loading ? 'is-loading' : ''} ${disabled ? 'is-disabled' : ''}`}
    >
      {loading ? (
        <span className="btn-inner-loading">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="spinner-icon-box"
          >
            <Loader2 size={19} />
          </motion.div>
          <span>Booking...</span>
        </span>
      ) : (
        <span className="btn-inner-content">
          <span>Book My Trip</span>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="btn-plane-icon"
          >
            <Plane size={18} />
          </motion.span>
        </span>
      )}
    </motion.button>
  );
}
