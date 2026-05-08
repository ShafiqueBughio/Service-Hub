"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { MdClose, MdSearch, MdMyLocation } from 'react-icons/md';
import 'leaflet/dist/leaflet.css';

const fixLeafletIcon = () => {
  if (typeof window === 'undefined') return;
  const L = require('leaflet');
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

// fly to position — key prop forces re-render when position changes
const MapFlyTo = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([position.lat, position.lng], 14, { duration: 0.8 });
  }, [position.lat, position.lng]);
  return null;
};

const LocationSelector = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const MapPicker = ({ isOpen, onClose, onConfirm, initialPosition }) => {
  const DEFAULT = { lat: 33.6844, lng: 73.0479 }; // Islamabad fallback

  const [selected, setSelected] = useState(
    initialPosition?.lat ? initialPosition : DEFAULT
  );
  const [address, setAddress] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  const [locating, setLocating] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchTimeout = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => { fixLeafletIcon(); }, []);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const reverseGeocode = useCallback(async (lat, lng) => {
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      setAddress(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }
    setGeocoding(false);
  }, []);

  // on open — get current location automatically
  useEffect(() => {
    if (!isOpen) return;

    // if already has a saved position, use that
    if (initialPosition?.lat) {
      setSelected(initialPosition);
      reverseGeocode(initialPosition.lat, initialPosition.lng);
      return;
    }

    // otherwise try to get current location
    if (navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          setSelected({ lat, lng });
          reverseGeocode(lat, lng);
          setLocating(false);
        },
        () => {
          // permission denied or error — use default
          reverseGeocode(DEFAULT.lat, DEFAULT.lng);
          setLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      reverseGeocode(DEFAULT.lat, DEFAULT.lng);
    }
  }, [isOpen]);

  const handleMapClick = useCallback((pos) => {
    setSelected(pos);
    reverseGeocode(pos.lat, pos.lng);
    setSearchQuery('');
  }, [reverseGeocode]);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    setShowResults(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!q.trim()) { setSearchResults([]); return; }

    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=8`
        );
        const data = await res.json();
        setSearchResults(data);
      } catch {
        setSearchResults([]);
      }
      setSearching(false);
    }, 500);
  };

  // select from search results → move map
  const handleResultSelect = (result) => {
    const pos = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    setSelected(pos);                      // ← triggers MapFlyTo
    setAddress(result.display_name);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    setShowResults(false);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setSelected({ lat, lng });
        reverseGeocode(lat, lng);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 5000 }
    );
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div
        className='bg-white rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden'
        style={{ maxHeight: '90dvh' }}
      >
        {/* ── header ── */}
        <div className='flex items-center justify-between px-4 py-3 border-b shrink-0'>
          <h3 className='font-semibold text-gray-800'>Select Service Area</h3>
          <button type='button' onClick={onClose}
            className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors'>
            <MdClose size={20} className='text-gray-600' />
          </button>
        </div>

        {/* ── search bar ── */}
        <div className='px-4 pt-3 pb-2 shrink-0 relative z-[1000]' ref={searchRef}>
          <div className='relative'>
            <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 bg-white transition-colors
              ${showResults && searchResults.length > 0
                ? 'border-primary rounded-b-none border-b-0'
                : 'border-gray-300 focus-within:border-primary'
              }`}
            >
              <MdSearch size={18} className='text-gray-400 shrink-0' />
              <input
                type='text'
                placeholder='Search city, area or address...'
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                className='flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400'
              />
              {searching && (
                <div className='w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0' />
              )}
              {searchQuery && !searching && (
                <button type='button'
                  onClick={() => { setSearchQuery(''); setSearchResults([]); setShowResults(false); }}
                  className='text-gray-400 hover:text-gray-600 shrink-0'>
                  <MdClose size={16} />
                </button>
              )}
            </div>

            {/* suggestions */}
            {showResults && searchResults.length > 0 && (
              <div className='absolute left-0 right-0 bg-white border border-primary border-t-0 rounded-b-xl shadow-xl z-[2000] max-h-52 overflow-y-auto'>
                {searchResults.map((result, idx) => (
                  <button
                    key={result.place_id}
                    type='button'
                    onClick={() => handleResultSelect(result)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-primary/5 transition-colors
                      ${idx < searchResults.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <span className='text-sm font-medium text-gray-900 block'>
                      {result.display_name.split(',')[0]}
                    </span>
                    <span className='text-xs text-gray-400 block truncate'>
                      {result.display_name.split(',').slice(1).join(',').trim()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* use my location */}
          <button
            type='button'
            onClick={handleUseMyLocation}
            disabled={locating}
            className='flex items-center gap-1.5 text-xs text-primary font-medium mt-2 hover:underline disabled:opacity-50'
          >
            {locating
              ? <div className='w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin' />
              : <MdMyLocation size={14} />
            }
            {locating ? 'Getting location...' : 'Use my current location'}
          </button>
        </div>

        {/* ── map ── */}
        <div className='shrink-0 w-full' style={{ height: 'clamp(180px, 35dvh, 300px)' }}>
          {locating ? (
            <div className='w-full h-full flex items-center justify-center bg-gray-50'>
              <div className='flex flex-col items-center gap-2 text-gray-400'>
                <div className='w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin' />
                <span className='text-sm'>Getting your location...</span>
              </div>
            </div>
          ) : (
            <MapContainer
              center={[selected.lat, selected.lng]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <LocationSelector onSelect={handleMapClick} />
              <MapFlyTo position={selected} />
              <Marker position={[selected.lat, selected.lng]} />
            </MapContainer>
          )}
        </div>

        {/* ── selected address ── */}
        <div className='px-4 py-3 bg-gray-50 border-t shrink-0'>
          <p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>Selected location</p>
          <p className='text-sm text-gray-800 leading-5'>
            {geocoding
              ? <span className='text-gray-400 italic text-xs'>Getting address...</span>
              : address || <span className='text-gray-400 italic'>Click on the map to select</span>
            }
          </p>
          <p className='text-xs text-gray-400 mt-1 font-mono'>
            {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}
          </p>
        </div>

        {/* ── confirm ── */}
        <div className='px-4 py-3 border-t shrink-0'>
          <button
            type='button'
            onClick={() => onConfirm({ address, lat: selected.lat, lng: selected.lng })}
            disabled={geocoding || locating}
            className='w-full bg-primary-gradient text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60 transition-opacity'
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPicker;
