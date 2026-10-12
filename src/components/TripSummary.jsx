import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Calendar, Users, ShieldCheck, User } from 'lucide-react';
import { findCity, getFlightDetails } from '../data/destinations';

export default function TripSummary({
  passengerName,
  from,
  to,
  departureDate,
  passengers,
  travelClass,
}) {
  const fromCity = findCity(from);
  const toCity = findCity(to);
  const flightDetails = getFlightDetails(from, to);

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

  const fromCode = fromCity ? fromCity.code : 'MDN';
  const toCode = toCity ? toCity.code : 'DPS';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="trip-summary-card"
    >
      <div className="trip-summary-header">
        <div className="summary-title-badge">
          <Plane size={14} className="rotate-icon" />
          <span>Your Journey</span>
        </div>
        <span className="summary-flight-number">{flightDetails.flightNumber}</span>
      </div>

      {/* Visual Travel Route (Section 11: MEDAN ● ─────── ✈ ─────── ● BALI) */}
      <div className="travel-route-banner">
        <div className="route-banner-node">
          <span className="route-city-code">{fromCode}</span>
          <span className="route-city-dot origin-dot">●</span>
          <span className="route-city-name">{from || 'Medan'}</span>
        </div>

        {/* Animated Flight Path Line with SVG pathLength */}
        <div className="route-path-track">
          <svg className="route-path-svg" viewBox="0 0 200 20" preserveAspectRatio="none">
            <line
              x1="10"
              y1="10"
              x2="190"
              y2="10"
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <motion.line
              x1="10"
              y1="10"
              x2="190"
              y2="10"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>

          {/* Animated Mini Plane cruising across the line */}
          <motion.div
            animate={{ x: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="mini-cruising-plane"
          >
            <Plane size={15} color="#2563eb" />
          </motion.div>
        </div>

        <div className="route-banner-node end-node">
          <span className="route-city-code dest-code">{toCode}</span>
          <span className="route-city-dot dest-dot">●</span>
          <span className="route-city-name">{to || 'Bali'}</span>
        </div>
      </div>

      {/* Structured Journey Information Grid (Section 15) */}
      <div className="journey-summary-grid">
        <div className="journey-grid-cell">
          <div className="cell-header">
            <User size={13} color="#2563eb" />
            <span className="cell-label">Passenger</span>
          </div>
          <span className="cell-value highlight-passenger">
            {passengerName && passengerName.trim() ? passengerName : 'Bryant Tinambunan'}
          </span>
        </div>

        <div className="journey-grid-cell">
          <div className="cell-header">
            <Calendar size={13} color="#2563eb" />
            <span className="cell-label">Departure</span>
          </div>
          <span className="cell-value">{formatDisplayDate(departureDate)}</span>
        </div>

        <div className="journey-grid-cell">
          <div className="cell-header">
            <Users size={13} color="#2563eb" />
            <span className="cell-label">Passengers</span>
          </div>
          <span className="cell-value">{passengers} Penumpang</span>
        </div>

        <div className="journey-grid-cell">
          <div className="cell-header">
            <ShieldCheck size={13} color="#10b981" />
            <span className="cell-label">Class</span>
          </div>
          <span className="cell-value">{travelClass} Class</span>
        </div>
      </div>

      {/* Flight Est Details */}
      <div className="trip-estimate-line">
        <span>Est. Durasi: {flightDetails.durationText}</span>
        <span className="dot-divider">•</span>
        <span>Jarak: ~{flightDetails.distanceKm} km</span>
        <span className="dot-divider">•</span>
        <span className="direct-badge">Penerbangan Langsung</span>
      </div>
    </motion.div>
  );
}
