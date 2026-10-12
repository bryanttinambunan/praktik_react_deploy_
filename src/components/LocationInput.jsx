import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, PlaneTakeoff, PlaneLanding, ChevronDown, Check, Sparkles } from 'lucide-react';
import { CITIES } from '../data/destinations';

export default function LocationInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'from', // 'from' | 'to'
  otherValue,
  isError = false,
  errorMessage,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = CITIES.filter((city) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      city.name.toLowerCase().includes(q) ||
      city.code.toLowerCase().includes(q) ||
      city.airport.toLowerCase().includes(q);
    return matchesSearch;
  });

  const handleSelectCity = (city) => {
    onChange(city.name);
    setSearchQuery('');
    setIsOpen(false);
  };

  const IconComponent = type === 'from' ? PlaneTakeoff : PlaneLanding;
  const accentColor = type === 'from' ? '#2563eb' : '#0ea5e9';

  return (
    <div
      ref={containerRef}
      className={`location-input-container ${isError ? 'has-error' : ''}`}
      style={{ position: 'relative', width: '100%' }}
    >
      <div className="location-label-wrapper">
        <label className="location-label">
          <span className="label-bullet" style={{ backgroundColor: accentColor }} />
          {label}
        </label>
        {value && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="selected-code-tag"
          >
            {CITIES.find((c) => c.name.toLowerCase() === value.toLowerCase())?.code || 'AIR'}
          </motion.span>
        )}
      </div>

      {/* Input Box with Micro-interactions */}
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
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <motion.div
          animate={{
            color: isFocused ? '#2563eb' : isError ? '#ef4444' : '#64748b',
            scale: isFocused ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="input-leading-icon"
        >
          <IconComponent size={19} />
        </motion.div>

        <input
          type="text"
          value={isOpen ? searchQuery : value}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
            setSearchQuery('');
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          placeholder={placeholder}
          aria-label={label}
          className="location-native-input"
        />

        <motion.button
          type="button"
          tabIndex={-1}
          aria-label="Toggle dropdown"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="dropdown-chevron-btn"
        >
          <ChevronDown size={17} color="#94a3b8" />
        </motion.button>
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

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="dropdown-popover"
          >
            <div className="dropdown-header">
              <span className="dropdown-title">Destinasi Populer</span>
              <span className="dropdown-hint">Pilih atau cari kota</span>
            </div>

            <div className="dropdown-scroll-list">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => {
                  const isSelected = city.name.toLowerCase() === value.toLowerCase();
                  const isOther = city.name.toLowerCase() === (otherValue || '').toLowerCase();

                  return (
                    <motion.div
                      key={city.id}
                      whileHover={{ backgroundColor: '#f1f5f9', x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelectCity(city)}
                      className={`dropdown-item ${isSelected ? 'selected' : ''} ${
                        isOther ? 'disabled-suggestion' : ''
                      }`}
                    >
                      <div className="item-left">
                        <div
                          className="item-badge"
                          style={{
                            backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                            color: isSelected ? '#2563eb' : '#475569',
                          }}
                        >
                          <MapPin size={14} />
                          <span>{city.code}</span>
                        </div>
                        <div className="item-info">
                          <div className="item-name-row">
                            <span className="item-city-name">{city.name}</span>
                            {city.popular && (
                              <span className="popular-chip">
                                <Sparkles size={10} /> Populer
                              </span>
                            )}
                          </div>
                          <span className="item-airport">{city.airport}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="item-check-icon"
                        >
                          <Check size={16} color="#2563eb" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className="dropdown-empty">
                  <span>Tidak ada kota bernama "{searchQuery}"</span>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(searchQuery);
                      setIsOpen(false);
                    }}
                    className="use-custom-btn"
                  >
                    Gunakan "{searchQuery}"
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
