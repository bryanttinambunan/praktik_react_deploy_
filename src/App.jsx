import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plane, Shield, Sparkles } from 'lucide-react';
import TravelBackground from './components/TravelBackground';
import IntroFlight from './components/IntroFlight';
import BookingForm from './components/BookingForm';
import SuccessScreen from './components/SuccessScreen';
import './App.css';

// Booking code generator — run once on success, not during render
const generateBookingCode = () =>
  `AJ-${Math.floor(1000 + Math.random() * 9000)}X`;

export default function App() {
  // ── Core App State ──────────────────────────────────────────────
  // Section 23: All required state
  const [started, setStarted] = useState(false);       // Intro → Form transition
  const [passengerName, setPassengerName] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('Economy');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Derived / UI state
  const [error, setError] = useState(null);
  const [bookingCode, setBookingCode] = useState('AJ-0000X');

  // ── Handlers ────────────────────────────────────────────────────

  // Called when user clicks the airplane in IntroFlight
  const handleStartJourney = useCallback(() => {
    // Small delay so the plane take-off animation can play first
    setTimeout(() => setStarted(true), 1200);
  }, []);

  // Validate & Submit booking (Section 17)
  const handleSubmitBooking = useCallback(() => {
    if (!passengerName || !passengerName.trim()) {
      setError('Nama penumpang wajib diisi.');
      return;
    }
    if (!from || !from.trim()) {
      setError('Pilih kota asal keberangkatan.');
      return;
    }
    if (!to || !to.trim()) {
      setError('Pilih kota tujuan perjalanan.');
      return;
    }
    if (from.toLowerCase().trim() === to.toLowerCase().trim()) {
      setError('Kota keberangkatan dan tujuan tidak boleh sama.');
      return;
    }
    if (!departureDate) {
      setError('Pilih tanggal keberangkatan.');
      return;
    }

    setError(null);
    setLoading(true);

    // Simulate booking flight sequence (Section 17)
    setTimeout(() => {
      setLoading(false);
      setBookingCode(generateBookingCode());
      setSuccess(true);
    }, 2600);
  }, [passengerName, from, to, departureDate]);

  // Reset everything for a new booking
  const handleResetBooking = useCallback(() => {
    setSuccess(false);
    setLoading(false);
    setError(null);
    setPassengerName('');
    setFrom('');
    setTo('');
    setDepartureDate('');
    setPassengers(1);
    setTravelClass('Economy');
    setStarted(false); // Go back to intro so user clicks plane again!
  }, []);

  return (
    <div className="travel-app-root">
      {/* ── Atmospheric Background (always visible) ── */}
      <TravelBackground />

      {/* ── Top Navigation Bar ── */}
      <header className="app-top-nav">
        <div className="nav-container">
          <div className="nav-brand-group">
            <div className="brand-logo-badge">
              <Plane size={20} className="brand-plane-icon" />
            </div>
            <div className="brand-text-block">
              <span className="brand-name">AeroJourney</span>
              <span className="brand-tagline">Interactive Travel Experience</span>
            </div>
          </div>
          <div className="nav-meta-group">
            <div className="nav-badge-item">
              <Shield size={14} color="#2563eb" />
              <span>Garansi Harga Terbaik</span>
            </div>
            <div className="nav-badge-item hide-mobile">
              <Sparkles size={14} color="#f59e0b" />
              <span>Tiket Fleksibel</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Stage ── */}
      <main className="main-stage">
        <AnimatePresence mode="wait">
          {/* ── PHASE 1: Intro (Plane Click to Start) ── */}
          {!started && !success && (
            <motion.div
              key="intro-phase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.55 }}
              className="intro-phase-wrapper"
            >
              <IntroFlight onStartJourney={handleStartJourney} />
            </motion.div>
          )}

          {/* ── PHASE 2: Booking Form ── */}
          {started && !success && (
            <motion.div
              key="form-phase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5 }}
              className="form-phase-wrapper"
            >
              {/* Small decorative flying plane on form header (Section 21) */}
              <motion.div
                initial={{ x: '-120%', y: -50, opacity: 0 }}
                animate={{ x: '110%', y: -50, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.4, ease: 'easeOut', delay: 0.3 }}
                className="form-header-plane-flyby"
              >
                <Plane size={28} color="#2563eb" style={{ transform: 'rotate(45deg)' }} />
              </motion.div>

              <BookingForm
                passengerName={passengerName}
                setPassengerName={setPassengerName}
                from={from}
                setFrom={setFrom}
                to={to}
                setTo={setTo}
                departureDate={departureDate}
                setDepartureDate={setDepartureDate}
                passengers={passengers}
                setPassengers={setPassengers}
                travelClass={travelClass}
                setTravelClass={setTravelClass}
                loading={loading}
                onSubmit={handleSubmitBooking}
                error={error}
                setError={setError}
              />
            </motion.div>
          )}

          {/* ── PHASE 3: Success Screen ── */}
          {success && (
            <motion.div
              key="success-phase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="success-phase-wrapper"
            >
              <SuccessScreen
                passengerName={passengerName}
                from={from}
                to={to}
                departureDate={departureDate}
                passengers={passengers}
                travelClass={travelClass}
                bookingCode={bookingCode}
                onReset={handleResetBooking}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── App Footer ── */}
      <footer className="app-minimal-footer">
        <div className="footer-content">
          <span>© 2026 AeroJourney </span>
          <div className="footer-links">
            <a href="#bantuan">Bantuan</a>
            <span className="footer-dot">•</span>
            <a href="#kebijakan">Kebijakan Privasi</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
