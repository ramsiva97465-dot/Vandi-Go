import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapPin, Loader2, Search } from 'lucide-react';

const LocationAutocomplete = ({ placeholder, onSelect, value, icon: Icon = MapPin }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const searchTimeout = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    if (val.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/geo/autocomplete?text=${val}`);
        setSuggestions(res.data);
        setShowDropdown(true);
      } catch (err) {
        console.error('Autocomplete failed', err);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleSelect = (item) => {
    setInputValue(item.label);
    setShowDropdown(false);
    onSelect({
      name: item.label,
      lat: item.lat,
      lng: item.lon
    });
  };

  return (
    <div className="relative group w-full" ref={dropdownRef}>
      <Icon className="absolute left-4 top-4 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 z-10" />
      <input
        required
        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-12 text-sm font-semibold focus:ring-2 focus:ring-blue-100 outline-none"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
      />
      {loading && (
        <div className="absolute right-4 top-4">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        </div>
      )}
      
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-[100] left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-6 py-4 hover:bg-slate-50 flex items-start gap-3 transition-all border-b border-slate-50 last:border-0"
            >
              <MapPin className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-[#0B1E3F] leading-tight">{item.label}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
