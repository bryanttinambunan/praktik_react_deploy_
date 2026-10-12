import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle2 } from 'lucide-react';

export default function PassengerInput({
  value,
  onChange,
  isError = false,
  errorMessage,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`passenger-input-block ${isError ? 'has-error' : ''}`}>
      <div className="location-label-wrapper">
        <label className="location-label">
          <span className="label-bullet" style={{ backgroundColor: '#2563eb' }} />
          Passenger Name
        </label>
        {value && value.trim().length > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="passenger-valid-chip"
          >
            <CheckCircle2 size={12} color="#10b981" />
            <span>Terdaftar</span>
          </motion.span>
        )}
      </div>

      {/* Focusable Input Box with Micro-interactions */}
      <motion.div
        animate={{
          borderColor: isError
            ? '#ef4444'
            : isFocused
            ? '#2563eb'
            : '#e2e8f0',
          boxShadow: isError
            ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
            : isFocused
            ? '0 4px 16px rgba(37, 99, 235, 0.12), 0 0 0 3px rgba(37, 99, 235, 0.12)'
            : '0 1px 2px rgba(15, 23, 42, 0.04)',
        }}
        transition={{ duration: 0.25 }}
        className="input-box-wrapper"
      >
        <motion.div
          animate={{
            color: isFocused ? '#2563eb' : isError ? '#ef4444' : '#64748b',
            scale: isFocused ? 1.12 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="input-leading-icon"
        >
          <User size={19} />
        </motion.div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter passenger name (e.g. Bryant Tinambunan)"
          aria-label="Passenger Name"
          className="location-native-input"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="clear-input-btn"
            title="Clear name"
          >
            ×
          </button>
        )}
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {isError && errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="field-error-text"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
