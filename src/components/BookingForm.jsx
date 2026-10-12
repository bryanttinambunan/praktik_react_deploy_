import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, AlertCircle, Sparkles, Loader2, Plane } from 'lucide-react';
import PassengerInput from './PassengerInput';
import LocationInput from './LocationInput';
import DateInput from './DateInput';
import PassengerCounter from './PassengerCounter';
import TravelClass from './TravelClass';
import TripSummary from './TripSummary';
import FlightRouteMap from './FlightRouteMap';

// Stagger container for form items revealing one by one (Section 6 & 21)
const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function BookingForm({
  passengerName, setPassengerName,
  from, setFrom,
  to, setTo,
  departureDate, setDepartureDate,
  passengers, setPassengers,
  travelClass, setTravelClass,
  loading,
  onSubmit,
  error, setError,
}) {
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = () => {
    setIsSwapping(true);
    const temp = from;
    setFrom(to);
    setTo(temp);
    setTimeout(() => setIsSwapping(false), 320);
  };

  const handleQuickRoute = (fromCity, toCity) => {
    setFrom(fromCity);
    setTo(toCity);
    if (error) setError(null);
  };

  const showSummary = passengerName || from || to || departureDate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={
        error
          ? {
              opacity: 1, y: 0, scale: 1,
              x: [0, -6, 6, -6, 6, 0],
              transition: { duration: 0.4 },
            }
          : {
              opacity: 1, y: 0, scale: 1, x: 0,
              transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
            }
      }
      className="booking-form-card"
    >
      {/* Form Heading — Plan Your Journey (Section 7) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="form-header-area"
      >
        <div className="form-header-top-tag">
          <span className="dot-live-indicator" />
          <span>Interactive Flight Reservation</span>
        </div>
        <h1 className="form-main-heading">Plan Your Journey</h1>
        <p className="form-sub-heading">
          Where will your next adventure take you?
        </p>
      </motion.div>

      {/* Error Banner with shake (Section 17 style) */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.28 }}
            className="error-alert-banner"
          >
            <AlertCircle size={18} className="error-icon" />
            <div className="error-text-content">
              <strong>Harap lengkapi data perjalanan</strong>
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Route Presets */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="quick-routes-bar"
      >
        <span className="quick-label">
          <Sparkles size={12} /> Rute Populer:
        </span>
        {[
          { f: 'Medan', t: 'Bali' },
          { f: 'Jakarta', t: 'Bali' },
          { f: 'Surabaya', t: 'Labuan Bajo' },
        ].map((route) => (
          <button
            key={`${route.f}-${route.t}`}
            type="button"
            onClick={() => handleQuickRoute(route.f, route.t)}
            className={`quick-route-chip ${from === route.f && to === route.t ? 'active' : ''}`}
          >
            {route.f} → {route.t}
          </button>
        ))}
      </motion.div>

      {/* Stagger Animated Form Fields (Section 6 & 21) */}
      <motion.div
        variants={formContainerVariants}
        initial="hidden"
        animate="visible"
        className="form-stagger-container"
      >
        {/* 1. Passenger Name (Section 8) */}
        <motion.div variants={formItemVariants}>
          <PassengerInput
            value={passengerName}
            onChange={(v) => { setPassengerName(v); if (error) setError(null); }}
            isError={Boolean(error && !passengerName)}
            errorMessage={error && !passengerName ? 'Nama penumpang wajib diisi' : null}
          />
        </motion.div>

        {/* 2. From + Swap + To (Sections 9 & 10) */}
        <motion.div variants={formItemVariants} className="location-inputs-cluster">
          <div className="location-input-half">
            <LocationInput
              label="From"
              value={from}
              onChange={(v) => { setFrom(v); if (error) setError(null); }}
              placeholder="Departure city"
              type="from"
              otherValue={to}
              isError={Boolean(error && !from)}
              errorMessage={error && !from ? 'Pilih kota asal' : null}
            />
          </div>

          <div className="swap-button-anchor">
            <motion.button
              type="button"
              aria-label="Tukar kota asal dan tujuan"
              animate={{ rotate: isSwapping ? 180 : 0 }}
              whileHover={{ scale: 1.15, backgroundColor: '#eff6ff' }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.25 }}
              onClick={handleSwap}
              className="swap-direction-btn"
            >
              <ArrowUpDown size={15} color="#2563eb" />
            </motion.button>
          </div>

          <div className="location-input-half">
            <LocationInput
              label="To"
              value={to}
              onChange={(v) => { setTo(v); if (error) setError(null); }}
              placeholder="Destination city"
              type="to"
              otherValue={from}
              isError={Boolean(error && !to)}
              errorMessage={error && !to ? 'Pilih kota tujuan' : null}
            />
          </div>
        </motion.div>

        {/* 3. Date & Passengers Row (Sections 12 & 13) */}
        <motion.div variants={formItemVariants} className="form-mid-row">
          <div className="mid-col">
            <DateInput
              value={departureDate}
              onChange={(v) => { setDepartureDate(v); if (error) setError(null); }}
              isError={Boolean(error && !departureDate)}
              errorMessage={error && !departureDate ? 'Pilih tanggal keberangkatan' : null}
            />
          </div>
          <div className="mid-col">
            <PassengerCounter
              passengers={passengers}
              onChange={setPassengers}
            />
          </div>
        </motion.div>

        {/* 4. Travel Class (Section 14) */}
        <motion.div variants={formItemVariants}>
          <TravelClass travelClass={travelClass} onChange={setTravelClass} />
        </motion.div>

        {/* 5. Mini Flight Route Map — visible after both From & To are selected */}
        <AnimatePresence>
          {from && to && from.trim() !== to.trim() && (
            <motion.div
              variants={formItemVariants}
              key={`map-${from}-${to}`}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <FlightRouteMap from={from} to={to} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6. Trip Summary Card — shown after any field is filled (Section 15) */}
        <AnimatePresence>
          {showSummary && (
            <motion.div variants={formItemVariants}>
              <TripSummary
                passengerName={passengerName}
                from={from}
                to={to}
                departureDate={departureDate}
                passengers={passengers}
                travelClass={travelClass}
              />
            </motion.div>
          )}
        </AnimatePresence>


        {/* 6. Book My Flight Button (Section 16 & 17) */}
        <motion.div variants={formItemVariants} className="form-submit-row">
          <motion.button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            whileHover={!loading ? { scale: 1.03, y: -2, boxShadow: '0 14px 32px -4px rgba(37,99,235,0.38)' } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
            transition={{ duration: 0.18 }}
            className={`booking-action-btn ${loading ? 'is-loading' : ''}`}
          >
            {loading ? (
              <span className="btn-inner-loading">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                  className="spinner-icon-box"
                >
                  <Loader2 size={19} />
                </motion.div>
                <span>Booking your flight...</span>
              </span>
            ) : (
              <span className="btn-inner-content">
                <span>Book My Flight</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  className="btn-plane-icon"
                >
                  <Plane size={18} />
                </motion.span>
              </span>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
