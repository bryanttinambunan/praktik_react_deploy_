import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plane, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { findCity, getFlightDetails } from '../data/destinations';

export default function SuccessScreen({
  passengerName,
  from,
  to,
  departureDate,
  passengers,
  travelClass,
  bookingCode = 'AJ-7482X',
  onReset,
}) {
  const fromCity = findCity(from);
  const toCity = findCity(to);
  const flightDetails = getFlightDetails(from, to);

  const [planeFlownAway, setPlaneFlownAway] = useState(false);

  // Trigger celebration confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#f59e0b', '#10b981'],
      });
    } catch {
      // Fallback
    }

    // Finale plane flight after 0.8s
    const timer = setTimeout(() => {
      setPlaneFlownAway(true);
    }, 800);
    return () => clearTimeout(timer);
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

  const displayName = passengerName && passengerName.trim() ? passengerName : 'Bryant Tinambunan';
  const fromCode = fromCity ? fromCity.code : 'MDN';
  const toCode = toCity ? toCity.code : 'DPS';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="success-screen-wrapper"
    >
      {/* Animated Check Icon (scale: 0 -> 1, opacity: 0 -> 1) */}
      <div className="check-icon-outer-halo">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 18,
            delay: 0.2,
          }}
          className="check-icon-circle"
        >
          <Check size={38} strokeWidth={2.8} color="#ffffff" />
        </motion.div>
      </div>

      {/* Header Heading: "You're Ready to Fly!" (Section 18) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="success-header-text"
      >
        <span className="success-badge-chip">Flight Booked Successfully</span>
        <h2 className="success-title">You're Ready to Fly!</h2>
        <p className="success-subtitle">
          Selamat <strong>{displayName}</strong>, tiket penerbangan Anda siap digunakan.
        </p>
      </motion.div>

      {/* Grand Finale Flying Plane Animation (Section 18: Pesawat terbang ke kanan) */}
      <div className="finale-flight-track-strip">
        <motion.div
          initial={{ x: '-15%', y: 0, opacity: 0 }}
          animate={
            planeFlownAway
              ? { x: '120%', y: -15, opacity: [0, 1, 1, 0] }
              : { x: '20%', y: 0, opacity: 1 }
          }
          transition={
            planeFlownAway
              ? { duration: 1.8, ease: 'easeInOut' }
              : { duration: 0.4 }
          }
          className="finale-flying-plane"
        >
          <Plane size={24} color="#2563eb" className="finale-plane-icon" />
          <div className="finale-trail-dust" />
        </motion.div>
      </div>

      {/* Modern Boarding Pass Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.45 }}
        className="boarding-ticket"
      >
        {/* Ticket Header */}
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

        {/* Ticket Body */}
        <div className="ticket-body">
          {/* Passenger Name Display */}
          <div className="ticket-passenger-banner">
            <span className="ticket-label">PASSENGER NAME</span>
            <span className="ticket-passenger-name">{displayName}</span>
          </div>

          {/* Route Display */}
          <div className="ticket-flight-route">
            <div className="route-col start">
              <span className="airport-code-huge">{fromCode}</span>
              <span className="city-name-sub">{from || 'Medan'}</span>
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
              <span className="airport-code-huge">{toCode}</span>
              <span className="city-name-sub">{to || 'Bali'}</span>
            </div>
          </div>

          {/* Perforated Divider */}
          <div className="perforated-divider">
            <div className="notch left" />
            <div className="dash-line" />
            <div className="notch right" />
          </div>

          {/* Details Grid */}
          <div className="ticket-grid-details">
            <div className="grid-cell">
              <span className="grid-label">DEPARTURE DATE</span>
              <span className="grid-val">{formatDisplayDate(departureDate)}</span>
            </div>
            <div className="grid-cell">
              <span className="grid-label">PASSENGERS</span>
              <span className="grid-val">{passengers} Penumpang</span>
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

          {/* Barcode */}
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
            </div>
            <span className="barcode-number">e-TICKET NO. 921 4820 1823 88</span>
          </div>
        </div>
      </motion.div>

      {/* Restart / Book Another Action */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.35 }}
        className="success-actions-row"
      >
        <button
          type="button"
          onClick={onReset}
          className="reset-booking-btn"
        >
          <RotateCcw size={16} />
          <span>Book Another Flight</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
