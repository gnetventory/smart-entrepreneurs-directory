import React, { useState, useMemo } from 'react';
import { Globe, MapPin, Users, Search } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { getCountryFlag } from '../../utils/constants';
import ProfileCard from '../directory/ProfileCard';

export default function WorldMapView() {
  const { members, refreshMembers } = useApp();
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [search, setSearch] = useState('');

  // Group members by country
  const countryStats = useMemo(() => {
    const counts = {};
    members.forEach((m) => {
      const country = m.location?.country?.trim() || 'Unknown';
      counts[country] = (counts[country] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchCountry = selectedCountry === 'all' || (m.location?.country?.trim() || 'Unknown') === selectedCountry;
      const matchSearch = !search || (
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.location?.city?.toLowerCase().includes(search.toLowerCase()) ||
        m.location?.country?.toLowerCase().includes(search.toLowerCase())
      );
      return matchCountry && matchSearch;
    });
  }, [members, selectedCountry, search]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-blue-500/10 via-teal-500/5 to-transparent border-blue-500/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl flex-shrink-0 shadow-lg shadow-blue-600/20">
            <Globe size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Global Community Geographic View</h2>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
              Connect with entrepreneurs near you or explore where your network is concentrated around the globe.
            </p>
          </div>
        </div>
      </div>

      {/* Country Pills */}
      <div className="card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <MapPin size={16} /> Filter by Country ({countryStats.length} Countries)
          </span>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{members.length} Total Members</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setSelectedCountry('all')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
              selectedCountry === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 shadow-md'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-800 hover:border-slate-400'
            }`}
          >
            🌍 All Countries ({members.length})
          </button>
          {countryStats.map(([country, count]) => {
            const flag = getCountryFlag(country);
            const isSelected = selectedCountry === country;
            return (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                <span>{flag}</span>
                <span>{country}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search within map view */}
      <div className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by city, country or member name..."
          className="input pl-12 py-3.5 text-base rounded-2xl"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((m) => (
          <ProfileCard key={m.id} member={m} onDeleted={refreshMembers} onUpdated={refreshMembers} />
        ))}
      </div>
    </div>
  );
}
