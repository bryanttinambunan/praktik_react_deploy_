import React, { useMemo, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, MapPin } from 'lucide-react';
import { findCity, getFlightDetails, CITIES } from '../data/destinations';

/* ═══════════════════════════════════════════════════════════════════════════
   REALISTIC INDONESIA SVG MAP
   ViewBox: 0 0 1000 560
   Coordinates derived from actual GeoJSON lon/lat range:
     Longitude: 95°E – 141°E  → x: 0–1000
     Latitude : 6°N  – 11°S   → y: 0–560  (north is top, south is bottom)
   Projection: equirectangular (simple linear mapping)
   ═══════════════════════════════════════════════════════════════════════════ */

const W = 1000;
const H = 560;

// lon/lat → SVG pixel
function ll(lon, lat) {
  const x = ((lon - 95) / (141 - 95)) * W;
  const y = ((6 - lat) / (6 - -11)) * H;
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}
function llPt(lon, lat) {
  return {
    x: ((lon - 95) / (141 - 95)) * W,
    y: ((6 - lat) / (6 - -11)) * H,
  };
}

/* ── Realistic island outlines (key points from actual coastlines) ── */
const ISLANDS = [
  /* ── SUMATRA ─────────────────────────────────────────────── */
  {
    id: 'sumatra',
    points: [
      ll(95.2, 5.7),  ll(96.2, 5.3),  ll(97.5, 4.5),  ll(98.8, 3.8),
      ll(99.5, 2.9),  ll(100.2, 2.0), ll(101.0, 1.2),  ll(102.0, 0.5),
      ll(103.0,-0.2), ll(104.0,-1.0), ll(104.8,-2.0),  ll(105.3,-3.0),
      ll(105.8,-4.0), ll(106.0,-5.0), ll(105.5,-5.5),  ll(104.5,-5.7),
      ll(103.5,-5.2), ll(102.5,-4.5), ll(101.5,-3.8),  ll(100.5,-3.2),
      ll(99.5,-2.5),  ll(98.8,-1.8),  ll(98.0,-1.0),   ll(97.2,-0.5),
      ll(96.5, 0.2),  ll(95.8, 1.0),  ll(95.4, 2.0),   ll(95.2, 3.0),
      ll(95.0, 4.0),  ll(95.2, 5.0),  ll(95.2, 5.7),
    ],
  },
  /* ── JAVA ─────────────────────────────────────────────────── */
  {
    id: 'java',
    points: [
      ll(105.8,-5.8), ll(106.5,-6.0), ll(107.5,-6.2), ll(108.5,-6.5),
      ll(109.5,-6.8), ll(110.5,-6.9), ll(111.5,-7.0), ll(112.5,-7.2),
      ll(113.5,-7.5), ll(114.5,-7.8), ll(114.4,-8.2), ll(113.5,-8.4),
      ll(112.5,-8.2), ll(111.5,-7.9), ll(110.5,-7.7), ll(109.5,-7.5),
      ll(108.5,-7.2), ll(107.5,-7.0), ll(106.5,-6.7), ll(105.8,-6.3),
      ll(105.5,-6.0), ll(105.8,-5.8),
    ],
  },
  /* ── KALIMANTAN (Borneo, Indonesian part) ──────────────────── */
  {
    id: 'kalimantan',
    points: [
      ll(108.0, 1.2),  ll(109.0, 1.8),  ll(110.0, 2.2),  ll(111.0, 2.6),
      ll(112.0, 3.0),  ll(113.0, 3.2),  ll(114.0, 3.4),  ll(115.0, 3.2),
      ll(116.0, 2.8),  ll(117.0, 2.4),  ll(118.0, 1.8),  ll(118.6, 1.0),
      ll(118.8, 0.2),  ll(118.5,-0.5),  ll(117.8,-1.2),  ll(117.0,-1.8),
      ll(116.2,-2.5),  ll(115.5,-3.2),  ll(114.8,-4.0),  ll(114.5,-4.8),
      ll(114.2,-5.5),  ll(113.5,-5.2),  ll(112.5,-5.0),  ll(111.5,-4.5),
      ll(110.5,-3.8),  ll(109.5,-3.0),  ll(108.8,-2.2),  ll(108.5,-1.5),
      ll(108.2,-0.8),  ll(108.0, 0.0),  ll(108.0, 0.8),  ll(108.0, 1.2),
    ],
  },
  /* ── SULAWESI ─────────────────────────────────────────────── */
  {
    id: 'sulawesi-n',
    points: [
      ll(120.0, 1.5),  ll(121.0, 1.8),  ll(122.0, 1.5),  ll(123.0, 0.8),
      ll(124.0, 0.5),  ll(125.0, 1.0),  ll(125.5, 1.5),  ll(124.5, 1.8),
      ll(123.5, 1.5),  ll(122.5, 1.2),  ll(121.5, 1.5),  ll(120.5, 1.2),
      ll(120.0, 1.5),
    ],
  },
  {
    id: 'sulawesi-s',
    points: [
      ll(120.5,-0.5), ll(121.0,-1.0), ll(121.5,-2.0), ll(122.0,-3.0),
      ll(122.5,-4.0), ll(122.8,-5.0), ll(122.5,-5.5), ll(121.5,-5.0),
      ll(120.5,-4.0), ll(120.0,-3.0), ll(119.5,-2.0), ll(119.0,-1.0),
      ll(119.2, 0.0), ll(119.8, 0.5), ll(120.5,-0.5),
    ],
  },
  /* ── BALI ─────────────────────────────────────────────────── */
  {
    id: 'bali',
    points: [
      ll(114.5,-8.1), ll(115.0,-8.0), ll(115.5,-8.2), ll(115.7,-8.6),
      ll(115.3,-8.8), ll(114.7,-8.7), ll(114.4,-8.4), ll(114.5,-8.1),
    ],
  },
  /* ── LOMBOK ───────────────────────────────────────────────── */
  {
    id: 'lombok',
    points: [
      ll(115.9,-8.2), ll(116.3,-8.1), ll(116.6,-8.4), ll(116.5,-8.8),
      ll(116.1,-8.9), ll(115.8,-8.6), ll(115.9,-8.2),
    ],
  },
  /* ── SUMBAWA ──────────────────────────────────────────────── */
  {
    id: 'sumbawa',
    points: [
      ll(116.8,-8.3), ll(117.5,-8.2), ll(118.0,-8.3), ll(118.5,-8.6),
      ll(118.7,-9.0), ll(118.2,-9.2), ll(117.5,-9.0), ll(116.8,-8.7),
      ll(116.8,-8.3),
    ],
  },
  /* ── FLORES ───────────────────────────────────────────────── */
  {
    id: 'flores',
    points: [
      ll(119.5,-8.5), ll(120.2,-8.4), ll(121.0,-8.5), ll(121.8,-8.7),
      ll(122.5,-8.8), ll(123.0,-8.7), ll(122.5,-9.0), ll(121.5,-9.1),
      ll(120.5,-9.0), ll(119.8,-8.8), ll(119.5,-8.5),
    ],
  },
  /* ── TIMOR (West) ─────────────────────────────────────────── */
  {
    id: 'timor',
    points: [
      ll(123.5,-9.3), ll(124.5,-9.2), ll(125.5,-9.4), ll(126.0,-9.7),
      ll(125.5,-10.0),ll(124.5,-10.0),ll(123.5,-9.7), ll(123.0,-9.5),
      ll(123.5,-9.3),
    ],
  },
  /* ── HALMAHERA ────────────────────────────────────────────── */
  {
    id: 'halmahera',
    points: [
      ll(127.5, 1.5),  ll(128.0, 0.8),  ll(128.5, 0.0),  ll(128.8,-0.8),
      ll(128.5,-1.5),  ll(128.0,-1.0),  ll(127.5,-0.5),  ll(127.0, 0.5),
      ll(127.5, 1.5),
    ],
  },
  /* ── PAPUA (Western) ──────────────────────────────────────── */
  {
    id: 'papua',
    points: [
      ll(131.0,-0.5), ll(132.0,-0.2), ll(133.0, 0.2),  ll(134.0, 0.0),
      ll(135.0,-0.2), ll(136.0,-1.0), ll(137.0,-2.0),  ll(138.0,-3.0),
      ll(139.0,-4.0), ll(140.0,-5.0), ll(140.5,-6.0),  ll(141.0,-6.5),
      ll(141.0,-5.0), ll(140.5,-4.0), ll(140.0,-3.0),  ll(139.0,-2.0),
      ll(138.0,-1.0), ll(137.0,-0.5), ll(136.0,-0.5),  ll(135.0,-0.2),
      ll(134.0,-0.5), ll(133.0,-1.0), ll(132.0,-1.0),  ll(131.5,-0.8),
      ll(131.0,-0.5),
    ],
  },
  /* ── BANGKA ───────────────────────────────────────────────── */
  {
    id: 'bangka',
    points: [
      ll(105.7,-1.5), ll(106.2,-1.4), ll(106.7,-1.7), ll(106.8,-2.2),
      ll(106.5,-2.6), ll(105.8,-2.5), ll(105.4,-2.0), ll(105.7,-1.5),
    ],
  },
  /* ── MADURA ───────────────────────────────────────────────── */
  {
    id: 'madura',
    points: [
      ll(112.7,-7.0), ll(113.3,-6.9), ll(113.8,-7.1), ll(113.5,-7.4),
      ll(112.8,-7.4), ll(112.5,-7.2), ll(112.7,-7.0),
    ],
  },
  /* ── SERAM ────────────────────────────────────────────────── */
  {
    id: 'seram',
    points: [
      ll(128.0,-3.0), ll(129.0,-2.8), ll(130.0,-3.0), ll(130.5,-3.5),
      ll(130.0,-4.0), ll(129.0,-3.8), ll(128.0,-3.5), ll(128.0,-3.0),
    ],
  },
];

/* ── City map coordinates (lon/lat) ── */
const CITY_GEO = {
  'Medan':        { lon: 98.67,  lat: 3.58  },
  'Jakarta':      { lon: 106.85, lat: -6.21 },
  'Bandung':      { lon: 107.61, lat: -6.90 },
  'Semarang':     { lon: 110.42, lat: -6.97 },
  'Yogyakarta':   { lon: 110.37, lat: -7.80 },
  'Surabaya':     { lon: 112.75, lat: -7.25 },
  'Bali':         { lon: 115.17, lat: -8.65 },
  'Makassar':     { lon: 119.43, lat: -5.13 },
  'Lombok':       { lon: 116.35, lat: -8.55 },
  'Labuan Bajo':  { lon: 119.88, lat: -8.52 },
  'Singapore':    { lon: 103.82, lat: 1.35  },
  'Tokyo':        { lon: 139.69, lat: 35.68 }, // outside viewbox
};

function cityMapPos(name) {
  const geo = CITY_GEO[name];
  if (!geo) return null;
  return llPt(geo.lon, geo.lat);
}

/* Bezier control point lifted above midpoint */
function arcCtrl(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const d  = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return { cx: mx, cy: my - Math.min(d * 0.32, 110) };
}

function bezierPt(x1, y1, cx, cy, x2, y2, t) {
  const m = 1 - t;
  return {
    x: m * m * x1 + 2 * m * t * cx + t * t * x2,
    y: m * m * y1 + 2 * m * t * cy + t * t * y2,
  };
}

function bezierAngleDeg(x1, y1, cx, cy, x2, y2, t) {
  const m  = 1 - t;
  const tx = 2 * m * (cx - x1) + 2 * t * (x2 - cx);
  const ty = 2 * m * (cy - y1) + 2 * t * (y2 - cy);
  return Math.atan2(ty, tx) * (180 / Math.PI);
}

/* Convert points array ["x,y", ...] to SVG polygon string */
function pts(arr) { return arr.join(' '); }

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function FlightRouteMap({ from, to }) {
  const uid = useId().replace(/:/g, '');

  const fromPos  = useMemo(() => from ? cityMapPos(from)  : null, [from]);
  const toPos    = useMemo(() => to   ? cityMapPos(to)    : null, [to]);
  const hasRoute = Boolean(fromPos && toPos && from !== to);

  const arcPath = useMemo(() => {
    if (!hasRoute) return '';
    const { cx, cy } = arcCtrl(fromPos.x, fromPos.y, toPos.x, toPos.y);
    return `M ${fromPos.x} ${fromPos.y} Q ${cx} ${cy} ${toPos.x} ${toPos.y}`;
  }, [hasRoute, fromPos, toPos]);

  const planeMid = useMemo(() => {
    if (!hasRoute) return null;
    const { cx, cy } = arcCtrl(fromPos.x, fromPos.y, toPos.x, toPos.y);
    const pt = bezierPt(fromPos.x, fromPos.y, cx, cy, toPos.x, toPos.y, 0.5);
    const angle = bezierAngleDeg(fromPos.x, fromPos.y, cx, cy, toPos.x, toPos.y, 0.5);
    return { ...pt, angle };
  }, [hasRoute, fromPos, toPos]);

  const flightDetails = useMemo(
    () => (hasRoute ? getFlightDetails(from, to) : null),
    [hasRoute, from, to]
  );

  const fromCity = useMemo(() => from ? findCity(from) : null, [from]);
  const toCity   = useMemo(() => to   ? findCity(to)   : null, [to]);

  /* All city map positions for dots */
  const allDots = useMemo(
    () =>
      CITIES.filter((c) => CITY_GEO[c.name]).map((c) => ({
        ...c,
        pos: cityMapPos(c.name),
      })),
    []
  );

  return (
    <div className="route-map-wrapper">
      {/* Header */}
      <div className="route-map-header">
        <div className="route-map-title-row">
          <MapPin size={14} color="#2563eb" />
          <span className="route-map-title">Flight Route Map</span>
          {hasRoute && flightDetails && (
            <span className="route-map-badge">{flightDetails.distanceKm.toLocaleString()} km</span>
          )}
        </div>
        {hasRoute ? (
          <span className="route-map-subtitle">
            {from} ({fromCity?.code}) → {to} ({toCity?.code})
          </span>
        ) : (
          <span className="route-map-hint">Pilih kota asal &amp; tujuan untuk melihat rute penerbangan</span>
        )}
      </div>

      {/* Map Canvas */}
      <div className="route-map-canvas-wrapper">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="route-map-svg"
          aria-label="Peta rute penerbangan Indonesia"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        >
          <defs>
            {/* Ocean gradient */}
            <linearGradient id={`ocean-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#cfe8fa" />
              <stop offset="100%" stopColor="#a8d5f0" />
            </linearGradient>
            {/* Land gradient */}
            <linearGradient id={`land-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#c8e6c9" />
              <stop offset="100%" stopColor="#a5d6a7" />
            </linearGradient>
            {/* Glow for active cities */}
            <filter id={`glow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Route line glow */}
            <filter id={`lineGlow-${uid}`} x="-5%" y="-60%" width="110%" height="220%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Drop shadow for islands */}
            <filter id={`shadow-${uid}`} x="-5%" y="-5%" width="115%" height="120%">
              <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#1e40af" floodOpacity="0.12" />
            </filter>
            {/* Subtle vignette on ocean */}
            <radialGradient id={`vignette-${uid}`} cx="50%" cy="50%" r="70%">
              <stop offset="60%" stopColor="transparent" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.08" />
            </radialGradient>
          </defs>

          {/* ── Ocean background ── */}
          <rect width={W} height={H} fill={`url(#ocean-${uid})`} />
          <rect width={W} height={H} fill={`url(#vignette-${uid})`} />

          {/* ── Latitude / Longitude grid ── */}
          {/* Horizontal latitude lines every 5° */}
          {[5, 0, -5, -10].map((lat) => {
            const y = ((6 - lat) / 17) * H;
            return (
              <g key={`lat-${lat}`}>
                <line x1={0} y1={y} x2={W} y2={y}
                  stroke="#93c6e0" strokeWidth="0.6" opacity="0.4" strokeDasharray="4 6" />
                <text x={8} y={y - 3} fontSize="9" fill="#5b9ab0" opacity="0.7" fontWeight="600">
                  {lat >= 0 ? `${lat}°N` : `${-lat}°S`}
                </text>
              </g>
            );
          })}
          {/* Vertical longitude lines every 10° */}
          {[100, 110, 120, 130, 140].map((lon) => {
            const x = ((lon - 95) / 46) * W;
            return (
              <g key={`lon-${lon}`}>
                <line x1={x} y1={0} x2={x} y2={H}
                  stroke="#93c6e0" strokeWidth="0.6" opacity="0.4" strokeDasharray="4 6" />
                <text x={x + 3} y={H - 5} fontSize="9" fill="#5b9ab0" opacity="0.7" fontWeight="600">
                  {lon}°E
                </text>
              </g>
            );
          })}

          {/* ── Equator line ── */}
          {(() => {
            const y = ((6 - 0) / 17) * H;
            return (
              <line x1={0} y1={y} x2={W} y2={y}
                stroke="#2563eb" strokeWidth="1" opacity="0.25" />
            );
          })()}

          {/* ── Island outlines ── */}
          {ISLANDS.map((island) => (
            <polygon
              key={island.id}
              points={pts(island.points)}
              fill={`url(#land-${uid})`}
              stroke="#6abf7b"
              strokeWidth="1.4"
              strokeLinejoin="round"
              filter={`url(#shadow-${uid})`}
            />
          ))}

          {/* ── All city dots (subtle) ── */}
          {allDots.map((city) => {
            if (!city.pos) return null;
            const isFrom = fromCity && city.name === fromCity.name;
            const isTo   = toCity   && city.name === toCity.name;
            const active = isFrom || isTo;
            return (
              <g key={city.id}>
                {active && (
                  <motion.circle
                    cx={city.pos.x} cy={city.pos.y}
                    r={14}
                    fill="none"
                    stroke={isFrom ? '#2563eb' : '#f97316'}
                    strokeWidth="1.5"
                    initial={{ r: 5, opacity: 0.9 }}
                    animate={{ r: 20, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeOut', delay: isTo ? 1 : 0 }}
                  />
                )}
                <circle
                  cx={city.pos.x} cy={city.pos.y}
                  r={active ? 7 : 4}
                  fill={isFrom ? '#2563eb' : isTo ? '#f97316' : '#ffffff'}
                  stroke={isFrom ? '#1d4ed8' : isTo ? '#ea580c' : '#64748b'}
                  strokeWidth={active ? 2 : 1.5}
                  opacity={active ? 1 : 0.65}
                  filter={active ? `url(#glow-${uid})` : undefined}
                />
                <text
                  x={city.pos.x}
                  y={city.pos.y - (active ? 11 : 8)}
                  textAnchor="middle"
                  fontSize={active ? 12 : 9}
                  fontWeight={active ? '800' : '500'}
                  fill={isFrom ? '#1d4ed8' : isTo ? '#ea580c' : '#334155'}
                  opacity={active ? 1 : 0.75}
                >
                  {city.code}
                </text>
              </g>
            );
          })}

          {/* ── Animated route ── */}
          <AnimatePresence>
            {hasRoute && (
              <g key={`route-${from}-${to}`}>
                {/* Ghost dashed */}
                <path d={arcPath} fill="none" stroke="#bfdbfe"
                  strokeWidth="2" strokeDasharray="6 5" opacity="0.5" />

                {/* Animated main path */}
                <motion.path
                  d={arcPath}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  filter={`url(#lineGlow-${uid})`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                />

                {/* Mid-route plane marker */}
                {planeMid && (
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: 0.9, duration: 0.35, type: 'spring' }}
                    style={{ transformOrigin: `${planeMid.x}px ${planeMid.y}px` }}
                  >
                    <motion.g
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                    >
                      {/* Shadow ellipse */}
                      <ellipse cx={planeMid.x} cy={planeMid.y + 12}
                        rx="14" ry="4"
                        fill="#1e3a8a" opacity="0.1" />
                      {/* White circle background */}
                      <circle cx={planeMid.x} cy={planeMid.y} r="15"
                        fill="#ffffff" stroke="#2563eb" strokeWidth="2"
                        filter={`url(#glow-${uid})`} />
                      {/* Inline SVG plane (rotated to match bearing) */}
                      <g transform={`translate(${planeMid.x - 9}, ${planeMid.y - 9}) rotate(${planeMid.angle + 45}, 9, 9)`}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                          stroke="#2563eb" strokeWidth="2.2"
                          strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2l4 4-4 2L3 14l2-1 1.9 3.8 3.8 1.9-1 2 1.3.3 2-4 4 4z" />
                        </svg>
                      </g>
                    </motion.g>
                  </motion.g>
                )}

                {/* Duration label above plane */}
                {planeMid && flightDetails && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.35 }}
                  >
                    <rect
                      x={planeMid.x - 28} y={planeMid.y - 46}
                      width="56" height="20" rx="6"
                      fill="#1d4ed8" opacity="0.92"
                    />
                    <text
                      x={planeMid.x} y={planeMid.y - 32}
                      textAnchor="middle"
                      fontSize="10.5" fontWeight="700" fill="#ffffff"
                    >
                      ✈ {flightDetails.durationText}
                    </text>
                  </motion.g>
                )}
              </g>
            )}
          </AnimatePresence>

          {/* Map border */}
          <rect width={W} height={H} fill="none"
            stroke="#7dd3fc" strokeWidth="1.5" rx="4" opacity="0.6" />
        </svg>

        {/* Legend bar */}
        <div className="route-map-legend">
          {hasRoute ? (
            <>
              <div className="legend-item">
                <span className="legend-dot from-dot" />
                <span>{from} ({fromCity?.code})</span>
              </div>
              <div className="legend-sep">→</div>
              <div className="legend-item">
                <span className="legend-dot to-dot" />
                <span>{to} ({toCity?.code})</span>
              </div>
              {flightDetails && (
                <>
                  <div className="legend-sep">·</div>
                  <div className="legend-item accent">
                    <Plane size={11} />
                    <span>{flightDetails.flightNumber} · {flightDetails.durationText} · {flightDetails.distanceKm.toLocaleString()} km</span>
                  </div>
                </>
              )}
            </>
          ) : (
            <span className="legend-placeholder">
              Peta rute akan muncul setelah kota asal &amp; tujuan dipilih
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
