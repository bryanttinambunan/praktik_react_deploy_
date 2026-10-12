import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Plane, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { findCity, getFlightDetails } from '../data/destinations';

export default function SuccessCard({
  from,
  to,
  departureDate,
  passengers,
  travelClass,
  bookingCode = 'AJ-9482X',
  onReset,
}) {
  const fromCity = findCity(from);
  const toCity = findCity(to);
  const flightDetails = getFlightDetails(from, to);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#f59e0b', '#10b981'],
      });
    } catch {
      // Fallback silently if canvas not available
    }
  }, []);

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '12 October 2026';
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="success-screen-wrapper"
    >
      {/* Big Animated Check Icon */}
      <div className="check-icon-outer-halo">
        <motion.div
          initial={{ scale: 0, rotate: -10, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 18,
            delay: 0.15,
          }}
          className="check-icon-circle"
        >
          <Check size={38} strokeWidth={2.5} color="#ffffff" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        className="success-header-text"
      >
        <span className="success-badge-chip">Booking Confirmed</span>
        <h2 className="success-title">Your Journey is Ready</h2>
        <p className="success-subtitle">
          Your journey from <strong>{from || 'Medan'}</strong> to <strong>{to || 'Bali'}</strong> has been booked successfully.
        </p>
      </motion.div>

      {/* Modern Boarding Pass Ticket */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36, duration: 0.45 }}
        className="boarding-ticket"
      >
        {/* Ticket Top Airline Branding */}
        <div className="ticket-top-band">
          <div className="ticket-airline-logo">
            <Plane size={16} color="#ffffff" />
            <span>AeroJourney Air</span>
          </div>
          <div className="ticket-pnr-badge">
            <span className="pnr-label">BOOKING CODE</span>
            <span className="pnr-val">{bookingCode}</span>
          </div>
        </div>

        {/* Ticket Route Header */}
        <div className="ticket-body">
          <div className="ticket-flight-route">
            <div className="route-col start">
              <span className="airport-code-huge">{fromCity ? fromCity.code : 'MDN'}</span>
              <span className="city-name-sub">{from || 'Medan'}</span>
              <span className="terminal-info">Terminal 1A</span>
            </div>

            <div className="flight-visual-indicator">
              <span className="flight-time-badge">{flightDetails.durationText}</span>
              <div className="flight-track-line">
                <div className="track-dot start" />
                <div className="track-dash" />
                <div className="track-plane-icon">
                  <Plane size={14} color="#2563eb" />
                </div>
                <div className="track-dash" />
                <div className="track-dot end" />
              </div>
              <span className="flight-num-badge">{flightDetails.flightNumber} • Direct</span>
            </div>

            <div className="route-col end">
              <span className="airport-code-huge">{toCity ? toCity.code : 'DPS'}</span>
              <span className="city-name-sub">{to || 'Bali'}</span>
              <span className="terminal-info">Terminal 2B</span>
            </div>
          </div>

          {/* Ticket Perforated Divider */}
          <div className="perforated-divider">
            <div className="notch left" />
            <div className="dash-line" />
            <div className="notch right" />
          </div>

          {/* Flight Details Grid */}
          <div className="ticket-grid-details">
            <div className="grid-cell">
              <span className="grid-label">DATE</span>
              <span className="grid-val">{formatDisplayDate(departureDate)}</span>
            </div>
            <div className="grid-cell">
              <span className="grid-label">PASSENGERS</span>
              <span className="grid-val">{passengers} Passengers</span>
            </div>
            <div className="grid-cell">
              <span className="grid-label">CLASS</span>
              <span className="grid-val">{travelClass} Class</span>
            </div>
            <div className="grid-cell">
              <span className="grid-label">GATE / SEAT</span>
              <span className="grid-val">{flightDetails.gate} / 12A{passengers > 1 ? `-${12 + passengers - 1}A` : ''}</span>
            </div>
          </div>

          {/* Barcode & Boarding Pass Footer */}
          <div className="ticket-footer-barcode">
            <div className="barcode-bars">
              <div className="bar b-1" />
              <div className="bar b-2" />
              <div className="bar b-3" />
              <div className="bar b-1" />
              <div className="bar b-4" />
              <div className="bar b-2" />
              <div className="bar b-1" />
              <div className="bar b-3" />
              <div className="bar b-4" />
              <div className="bar b-2" />
              <div className="bar b-1" />
              <div className="bar b-3" />
              <div className="bar b-2" />
              <div className="bar b-4" />
              <div className="bar b-1" />
              <div className="bar b-3" />
            </div>
            <span className="barcode-number">e-TICKET NO. 892 4819 0294 11</span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.35 }}
        className="success-actions-row"
      >
        <button
          type="button"
          onClick={onReset}
          className="reset-booking-btn"
        >
          <RotateCcw size={16} />
          <span>Book Another Trip</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
