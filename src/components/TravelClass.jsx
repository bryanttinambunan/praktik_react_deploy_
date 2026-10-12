import React from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, Sparkles } from 'lucide-react';

const CLASSES = [
  {
    id: 'Economy',
    name: 'Economy',
    shortDesc: 'Bagasi 20kg',
    icon: Award,
  },
  {
    id: 'Premium Economy',
    name: 'Premium Economy',
    shortDesc: 'Legroom luas',
    icon: Sparkles,
  },
  {
    id: 'Business',
    name: 'Business',
    shortDesc: 'Lounge & Priority',
    icon: Briefcase,
  },
];

export default function TravelClass({ travelClass, onChange }) {
  return (
    <div className="travel-class-container">
      <div className="location-label-wrapper">
        <label className="location-label">
          <span className="label-bullet" style={{ backgroundColor: '#2563eb' }} />
          Travel Class
        </label>
        <span className="class-badge-pill">{travelClass}</span>
      </div>

      <div className="travel-class-segmented-group" role="radiogroup" aria-label="Travel Class">
        {CLASSES.map((cls) => {
          const isActive = travelClass === cls.id;
          const Icon = cls.icon;

          return (
            <button
              key={cls.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(cls.id)}
              className={`travel-class-btn ${isActive ? 'active' : ''}`}
            >
              {/* Framer Motion layoutId for smooth sliding background indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeClassIndicator"
                  className="travel-class-indicator-bg"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <div className="travel-class-content">
                <div className="class-title-row">
                  <Icon size={14} className="class-icon" />
                  <span className="class-name">{cls.name}</span>
                </div>
                <span className="class-desc">{cls.shortDesc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
