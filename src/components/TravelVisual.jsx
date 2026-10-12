import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { MapPin, Navigation, Compass, Cloud } from 'lucide-react';
import { findCity, getFlightDetails } from '../data/destinations';

export default function TravelVisual({
  from,
  to,
  isBooking,
  onBookingFlightComplete,
}) {
  const containerRef = useRef(null);

  // Parallax motion values (Section 19)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Handle mouse move for light parallax
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width - 0.5;
    const yRel = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xRel * 25);
    mouseY.set(yRel * 20);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Resolve cities
  const fromCity = findCity(from) || {
    name: 'Medan',
    code: 'MDN',
    airport: 'Kualanamu Intl.',
    x: 160,
    y: 200,
  };

  const toCity = React.useMemo(() => {
    if (!to) return null;
    return (
      findCity(to) || {
        name: to,
        code: to.slice(0, 3).toUpperCase(),
        airport: `${to} Airport`,
        x: 620,
        y: 330,
      }
    );
  }, [to]);

  const flightDetails = getFlightDetails(fromCity.name, toCity ? toCity.name : 'Bali');

  // SVG Canvas dimensions: 800 x 500
  const p1 = { x: fromCity.x, y: fromCity.y };
  const p2 = toCity ? { x: toCity.x, y: toCity.y } : { x: p1.x + 360, y: p1.y + 110 };

  // Calculate curve control point (arching upward for realistic flight trajectory)
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;
  const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const archHeight = Math.min(140, Math.max(70, dist * 0.28));
  const ctrlPt = { x: midX, y: midY - archHeight };

  // Bezier path string
  const flightPathD = `M ${p1.x} ${p1.y} Q ${ctrlPt.x} ${ctrlPt.y} ${p2.x} ${p2.y}`;

  // Quadratic Bezier interpolation helper
  const getBezierPointAndAngle = (t) => {
    const inv = 1 - t;
    const x = inv * inv * p1.x + 2 * inv * t * ctrlPt.x + t * t * p2.x;
    const y = inv * inv * p1.y + 2 * inv * t * ctrlPt.y + t * t * p2.y;

    // Tangent vector
    const dx = 2 * inv * (ctrlPt.x - p1.x) + 2 * t * (p2.x - ctrlPt.x);
    const dy = 2 * inv * (ctrlPt.y - p1.y) + 2 * t * (p2.y - ctrlPt.y);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    return { x, y, angle };
  };

  // Flight animation progress (0 to 1 during booking)
  const [bookingFlightT, setBookingFlightT] = useState(0);
  const [destinationPulse, setDestinationPulse] = useState(false);

  // Derived progress: during booking use bookingFlightT, otherwise rest at position
  const flightProgress = isBooking ? bookingFlightT : (toCity ? 0.48 : 0.08);

  // Execute flight animation when booking starts (Section 15)
  useEffect(() => {
    if (!isBooking) return;

    let startTime = null;
    const duration = 2200; // 2.2 seconds smooth flight

    const animateFlight = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawT = Math.min(1, elapsed / duration);

      // Smooth ease-in-out
      const easeT =
        rawT < 0.5 ? 2 * rawT * rawT : -1 + (4 - 2 * rawT) * rawT;

      setBookingFlightT(easeT);

      if (rawT < 1) {
        requestAnimationFrame(animateFlight);
      } else {
        setDestinationPulse(true);
        setTimeout(() => {
          if (onBookingFlightComplete) {
            onBookingFlightComplete();
          }
        }, 400);
      }
    };

    const animId = requestAnimationFrame(animateFlight);
    return () => cancelAnimationFrame(animId);
  }, [isBooking, onBookingFlightComplete]);

  const currentPlane = getBezierPointAndAngle(flightProgress);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="travel-visual-card"
    >
      {/* Visual Header Badge */}
      <div className="visual-top-bar">
        <div className="visual-mode-pill">
          <Navigation size={13} className="pill-nav-icon" />
          <span>Interactive Flight Map</span>
        </div>
        <div className="visual-status-pill">
          <span className="live-radar-dot" />
          <span>{toCity ? 'Route Active' : 'Select Destination'}</span>
        </div>
      </div>

      {/* Main Illustration Canvas */}
      <div className="illustration-canvas-stage">
        {/* Parallax Clouds Background (Sections 18 & 19) */}
        <motion.div
          style={{ x: springX, y: springY }}
          className="parallax-clouds-layer"
        >
          {/* Cloud 1 - Top Left */}
          <motion.div
            animate={{ x: [-25, 25, -25] }}
            transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
            className="floating-cloud cloud-1"
          >
            <Cloud size={62} strokeWidth={1} color="#bae6fd" fill="#f0f9ff" />
          </motion.div>

          {/* Cloud 2 - Top Right */}
          <motion.div
            animate={{ x: [20, -25, 20] }}
            transition={{ repeat: Infinity, duration: 22, ease: 'easeInOut' }}
            className="floating-cloud cloud-2"
          >
            <Cloud size={78} strokeWidth={1} color="#bae6fd" fill="#f0f9ff" />
          </motion.div>

          {/* Cloud 3 - Bottom Center */}
          <motion.div
            animate={{ x: [-18, 18, -18] }}
            transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
            className="floating-cloud cloud-3"
          >
            <Cloud size={54} strokeWidth={1} color="#bae6fd" fill="#f0f9ff" />
          </motion.div>
        </motion.div>

        {/* Decorative Grid & Radar Circles */}
        <svg
          viewBox="0 0 800 500"
          className="travel-svg-canvas"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Linear gradient for flight trail */}
            <linearGradient id="flightTrailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.9" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Subtle Latitude/Longitude Grid lines */}
          <g className="grid-lat-long" stroke="#e2e8f0" strokeDasharray="3 6" strokeWidth="0.8">
            <line x1="60" y1="120" x2="740" y2="120" />
            <line x1="60" y1="240" x2="740" y2="240" />
            <line x1="60" y1="360" x2="740" y2="360" />
            <line x1="200" y1="60" x2="200" y2="440" />
            <line x1="400" y1="60" x2="400" y2="440" />
            <line x1="600" y1="60" x2="600" y2="440" />
          </g>

          {/* Radar Circles around Origin */}
          <circle
            cx={p1.x}
            cy={p1.y}
            r="40"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <circle
            cx={p1.x}
            cy={p1.y}
            r="70"
            fill="none"
            stroke="#bfdbfe"
            strokeWidth="0.6"
            strokeDasharray="4 6"
            opacity="0.4"
          />

          {/* Radar Circles around Destination (if chosen) */}
          {toCity && (
            <>
              <circle
                cx={p2.x}
                cy={p2.y}
                r="40"
                fill="none"
                stroke="#fdba74"
                strokeWidth="0.8"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <circle
                cx={p2.x}
                cy={p2.y}
                r="70"
                fill="none"
                stroke="#fed7aa"
                strokeWidth="0.6"
                strokeDasharray="4 6"
                opacity="0.4"
              />
            </>
          )}

          {/* Flight Path (Sections 5, 7: Step 3 route draws with pathLength) */}
          {toCity && (
            <g>
              {/* Soft background shadow track */}
              <path
                d={flightPathD}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Animated flight trajectory path */}
              <motion.path
                key={`path-${fromCity.id}-${toCity.id}`}
                d={flightPathD}
                fill="none"
                stroke="url(#flightTrailGradient)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
                filter="url(#glow)"
              />

              {/* Real-time active flight progress line when booking */}
              {isBooking && (
                <path
                  d={flightPathD}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: '1000',
                    strokeDashoffset: 1000 * (1 - flightProgress),
                  }}
                />
              )}
            </g>
          )}

          {/* Unselected dashed hint path */}
          {!toCity && (
            <motion.path
              d={`M ${p1.x} ${p1.y} Q ${p1.x + 180} ${p1.y - 70} ${p1.x + 360} ${p1.y + 40}`}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="5 5"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1 }}
            />
          )}

          {/* Origin Location Point (Section 6) */}
          <g className="origin-marker-group">
            {/* Ripple Pulse */}
            <circle cx={p1.x} cy={p1.y} r="18" fill="#dbeafe" opacity="0.6">
              <animate
                attributeName="r"
                values="10;26;10"
                dur="2.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.8;0.1;0.8"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Core Marker Point */}
            <circle cx={p1.x} cy={p1.y} r="7" fill="#2563eb" />
            <circle cx={p1.x} cy={p1.y} r="3" fill="#ffffff" />
          </g>

          {/* Destination Location Point (Section 7) */}
          {toCity && (
            <g className="destination-marker-group">
              {/* Destination Pulse */}
              <circle
                cx={p2.x}
                cy={p2.y}
                r={destinationPulse ? '34' : '20'}
                fill="#ffedd5"
                opacity="0.8"
              >
                <animate
                  attributeName="r"
                  values="10;26;10"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.8;0.1;0.8"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>

              <circle cx={p2.x} cy={p2.y} r="7" fill="#f97316" />
              <circle cx={p2.x} cy={p2.y} r="3" fill="#ffffff" />
            </g>
          )}
        </svg>

        {/* Origin HTML City Tag Overlay (Medan) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{
            position: 'absolute',
            left: `${(p1.x / 800) * 100}%`,
            top: `${(p1.y / 500) * 100}%`,
            transform: 'translate(-50%, -135%)',
          }}
          className="visual-city-pill origin-pill"
        >
          <div className="city-pill-icon origin-icon">
            <MapPin size={12} color="#ffffff" />
          </div>
          <div className="city-pill-text">
            <span className="pill-code">{fromCity.code}</span>
            <span className="pill-name">{fromCity.name}</span>
          </div>
        </motion.div>

        {/* Destination HTML City Tag Overlay (Bali / etc) */}
        {toCity && (
          <motion.div
            key={toCity.id}
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{
              opacity: 1,
              scale: destinationPulse ? [1, 1.15, 1] : 1,
              y: 0,
            }}
            transition={{ duration: 0.45 }}
            style={{
              position: 'absolute',
              left: `${(p2.x / 800) * 100}%`,
              top: `${(p2.y / 500) * 100}%`,
              transform: 'translate(-50%, 35%)',
            }}
            className={`visual-city-pill dest-pill ${destinationPulse ? 'pulsing' : ''}`}
          >
            <div className="city-pill-icon dest-icon">
              <MapPin size={12} color="#ffffff" />
            </div>
            <div className="city-pill-text">
              <span className="pill-code">{toCity.code}</span>
              <span className="pill-name">{toCity.name}</span>
            </div>
          </motion.div>
        )}

        {/* THE MAIN AIRPLANE (Sections 5 & 8 & 15) */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            position: 'absolute',
            left: `${(currentPlane.x / 800) * 100}%`,
            top: `${(currentPlane.y / 500) * 100}%`,
            transform: `translate(-50%, -50%) rotate(${currentPlane.angle}deg)`,
            transition: isBooking ? 'none' : 'transform 0.4s ease-out, left 0.4s ease-out, top 0.4s ease-out',
            zIndex: 10,
          }}
          className="airplane-hero-badge"
        >
          {/* Jet Engine Jetstream trail */}
          <div className={`jet-exhaust-trail ${isBooking ? 'active-thrust' : ''}`} />

          {/* Plane Icon Container */}
          <motion.div
            animate={
              !isBooking
                ? {
                    y: [-2, 2, -2],
                  }
                : {}
            }
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: 'easeInOut',
            }}
            className="plane-svg-body"
          >
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="plane-vector"
            >
              <defs>
                <linearGradient id="planeBodyGrad" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
              <path
                d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"
                fill="url(#planeBodyGrad)"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Flight Info Floating Bubble (Altitude & Non-stop info) */}
        {toCity && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="floating-flight-badge"
          >
            <div className="flight-badge-item">
              <span className="badge-meta-label">DISTANCE</span>
              <span className="badge-meta-val">~{flightDetails.distanceKm} KM</span>
            </div>
            <div className="badge-separator" />
            <div className="flight-badge-item">
              <span className="badge-meta-label">FLIGHT TIME</span>
              <span className="badge-meta-val">{flightDetails.durationText}</span>
            </div>
            <div className="badge-separator" />
            <div className="flight-badge-item">
              <span className="badge-meta-label">STATUS</span>
              <span className="badge-meta-val direct-val">NON-STOP</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Visual Bottom Branding & Caption (Section 4) */}
      <div className="visual-footer-bar">
        <div className="compass-accent-box">
          <Compass size={17} color="#2563eb" />
          <span className="compass-degree">084° ENE • ALT 34,000 FT</span>
        </div>
        <div className="visual-slogan">
          <span className="slogan-lead">AeroJourney</span>
          <span className="slogan-divider">|</span>
          <span className="slogan-text">TRAVEL YOUR WAY</span>
        </div>
      </div>
    </motion.div>
  );
}
