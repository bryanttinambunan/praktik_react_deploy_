import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';

const todayMinDate = new Date().toISOString().split('T')[0];

export default function DateInput({
  value,
  onChange,
  isError = false,
  errorMessage,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [iconKey, setIconKey] = useState(0);
  const inputRef = useRef(null);

  // Format date to "12 October 2026"
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const handleDateChange = (newVal) => {
    onChange(newVal);
    // Trigger calendar icon scale animation
    setIconKey((prev) => prev + 1);
  };

  // Quick preset shortcuts
  const setQuickDate = (offsetDays) => {
    const today = new Date();
    today.setDate(today.getDate() + offsetDays);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    handleDateChange(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <div className={`date-input-container ${isError ? 'has-error' : ''}`}>
      <div className="location-label-wrapper">
        <label className="location-label">
          <span className="label-bullet" style={{ backgroundColor: '#2563eb' }} />
          Departure Date
        </label>
        {value && (
          <span className="date-badge-pill">
            {formatDisplayDate(value)}
          </span>
        )}
      </div>

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
        className="input-box-wrapper date-box-wrapper"
        onClick={() => {
          if (inputRef.current) {
            if (typeof inputRef.current.showPicker === 'function') {
              inputRef.current.showPicker();
            } else {
              inputRef.current.focus();
            }
          }
        }}
      >
        {/* Animated Calendar Icon */}
        <motion.div
          key={iconKey}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="input-leading-icon"
          style={{
            color: isFocused ? '#2563eb' : isError ? '#ef4444' : '#64748b',
          }}
        >
          <CalendarIcon size={19} />
        </motion.div>

        {/* Formatted Date Display + Hidden Native Picker */}
        <div className="date-display-field">
          {value ? (
            <span className="date-formatted-text">{formatDisplayDate(value)}</span>
          ) : (
            <span className="date-placeholder-text">Select departure date</span>
          )}
        </div>

        <input
          ref={inputRef}
          type="date"
          value={value}
          min={todayMinDate}
          onChange={(e) => handleDateChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="native-hidden-date-input"
          aria-label="Departure date"
        />
      </motion.div>

      {/* Quick Select Presets */}
      <div className="date-quick-chips">
        <button
          type="button"
          onClick={() => setQuickDate(1)}
          className="date-chip-btn"
        >
          Besok
        </button>
        <button
          type="button"
          onClick={() => setQuickDate(5)}
          className="date-chip-btn"
        >
          Akhir Pekan
        </button>
        <button
          type="button"
          onClick={() => setQuickDate(14)}
          className="date-chip-btn"
        >
          +2 Minggu
        </button>
      </div>

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
