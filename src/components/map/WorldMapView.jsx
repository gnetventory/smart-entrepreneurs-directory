import React, { useState, useMemo } from 'react';
import {
  Map,
  MapPin,
  Building2,
  Users,
  Search,
  Sparkles,
  Filter,
  Globe,
  RotateCcw,
  ExternalLink,
  Linkedin,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { EGYPT_CITIES, matchEgyptCity } from '../../utils/egyptCities';
import { INDUSTRY_TAGS } from '../../utils/constants';
import EgyptGISMap from './EgyptGISMap';
import ProfileCard from '../directory/ProfileCard';

export default function WorldMapView() {
  const { activeMembers: members, refreshMembers } = useApp();

  // Filter States
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedCityId, setSelectedCityId] = useState('all');
  const [founderSearch, setFounderSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [listSearch, setListSearch] = useState('');

  // Map Focus State
  const [focusedCoords, setFocusedCoords] = useState(null);
  const [focusedMemberId, setFocusedMemberId] = useState(null);

  // 1. Group members by matched Egyptian City Hub
  const { cityCounts, membersByCity, otherMembers, totalEgyptMembers, allIndustries } =
    useMemo(() => {
      const counts = {};
      const byCity = {};
      const others = [];
      const industriesSet = new Set();

      EGYPT_CITIES.forEach((c) => {
        counts[c.id] = 0;
        byCity[c.id] = [];
      });

      let egyptCount = 0;
      const safeMembers = Array.isArray(members) ? members : [];

      safeMembers.forEach((m) => {
        // Collect industries / tags
        if (Array.isArray(m.tags)) {
          m.tags.forEach((t) => industriesSet.add(t));
        }
        if (m.industry) industriesSet.add(m.industry);

        const matchedCityId = matchEgyptCity(m.location);
        if (matchedCityId && counts[matchedCityId] !== undefined) {
          counts[matchedCityId]++;
          byCity[matchedCityId].push(m);
          egyptCount++;
        } else {
          others.push(m);
        }
      });

      // Add fallback industry tags if not yet in set
      INDUSTRY_TAGS.slice(0, 10).forEach((t) => industriesSet.add(t));

      return {
        cityCounts: counts,
        membersByCity: byCity,
        otherMembers: others,
        totalEgyptMembers: egyptCount,
        allIndustries: Array.from(industriesSet).sort(),
      };
    }, [members]);

  // 2. Active Egyptian hubs with >= 1 member
  const activeCities = useMemo(() => {
    return EGYPT_CITIES.filter((c) => (cityCounts[c.id] || 0) > 0).sort(
      (a, b) => (cityCounts[b.id] || 0) - (cityCounts[a.id] || 0)
    );
  }, [cityCounts]);

  // 3. Filtered Members (Applying Industry, City, Founder, Company, and List search)
  const filteredMembers = useMemo(() => {
    const safeMembers = Array.isArray(members) ? members : [];

    return safeMembers.filter((m) => {
      // 1. City match
      const matchedCityId = matchEgyptCity(m.location);
      if (selectedCityId !== 'all') {
        if (selectedCityId === 'others') {
          if (matchedCityId) return false;
        } else {
          if (matchedCityId !== selectedCityId) return false;
        }
      }

      // 2. Industry / Vertical match
      if (selectedIndustry !== 'all') {
        const memberTags = Array.isArray(m.tags) ? m.tags : [];
        const hasTag = memberTags.some((t) => t.toLowerCase() === selectedIndustry.toLowerCase());
        const matchInd = (m.industry || '').toLowerCase() === selectedIndustry.toLowerCase();
        const inBusiness = (m.business || '')
          .toLowerCase()
          .includes(selectedIndustry.toLowerCase());
        if (!hasTag && !matchInd && !inBusiness) return false;
      }

      // 3. Founder Name search
      if (founderSearch.trim()) {
        const q = founderSearch.toLowerCase().trim();
        if (!m.name?.toLowerCase().includes(q)) return false;
      }

      // 4. Company Name search
      if (companySearch.trim()) {
        const q = companySearch.toLowerCase().trim();
        if (!m.business?.toLowerCase().includes(q)) return false;
      }

      // 5. Drawer Quick Search
      if (listSearch.trim()) {
        const q = listSearch.toLowerCase().trim();
        const locStr =
          typeof m.location === 'string'
            ? m.location.toLowerCase()
            : `${m.location?.city || ''} ${m.location?.country || ''}`.toLowerCase();
        const matchName = m.name?.toLowerCase().includes(q);
        const matchRole = m.role?.toLowerCase().includes(q);
        const matchBiz = m.business?.toLowerCase().includes(q);
        const matchLoc = locStr.includes(q);
        if (!matchName && !matchRole && !matchBiz && !matchLoc) return false;
      }

      return true;
    });
  }, [members, selectedCityId, selectedIndustry, founderSearch, companySearch, listSearch]);

  // Dynamic city counts recalculated after industry/founder/company filtering
  const dynamicCityCounts = useMemo(() => {
    const counts = {};
    EGYPT_CITIES.forEach((c) => {
      counts[c.id] = 0;
    });

    filteredMembers.forEach((m) => {
      const cityId = matchEgyptCity(m.location);
      if (cityId && counts[cityId] !== undefined) {
        counts[cityId]++;
      }
    });
    return counts;
  }, [filteredMembers]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedIndustry('all');
    setSelectedCityId('all');
    setFounderSearch('');
    setCompanySearch('');
    setListSearch('');
    setFocusedCoords(null);
    setFocusedMemberId(null);
  };

  // Focus a specific founder on map
  const handleFocusFounder = (member) => {
    setFocusedMemberId(member.id);
    const cityId = matchEgyptCity(member.location);
    if (cityId) {
      const cityObj = EGYPT_CITIES.find((c) => c.id === cityId);
      if (cityObj && cityObj.lat && cityObj.lng) {
        setFocusedCoords({ lat: cityObj.lat, lng: cityObj.lng });
      }
    }
  };

  const selectedCityObj = EGYPT_CITIES.find((c) => c.id === selectedCityId);

  return (
    <div className="space-y-4 animate-fade-in max-w-7xl mx-auto">
      {/* ── 1. Compact Header Banner (Warm Premium Palette) ──────────────────── */}
      <div className="card p-4 sm:p-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-stone-900 text-white border-0 shadow-lg relative overflow-hidden flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-orange-500 text-white rounded-2xl flex-shrink-0 shadow-md shadow-orange-500/30">
            <Map size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-orange-200">
                Alliance Atlas
              </span>
              <span className="text-xs text-emerald-300 font-bold">🇪🇬 Egypt Ecosystem</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight font-display text-white">
              Alliance Atlas & Founder Density
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <div className="text-lg font-black text-orange-300 font-mono leading-none">
              {activeCities.length}
            </div>
            <div className="text-[9px] font-bold text-white/80 uppercase">Active Hubs</div>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <div className="text-lg font-black text-emerald-300 font-mono leading-none">
              {filteredMembers.length}
            </div>
            <div className="text-[9px] font-bold text-white/80 uppercase">Matching Founders</div>
          </div>
        </div>
      </div>

      {/* ── 2. Top Global Filters Bar (Matching Reference Layout) ────────────── */}
      <div className="card p-3.5 sm:p-4 bg-white dark:bg-stone-900 border-stone-200/90 dark:border-stone-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-orange-500" />
            <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Atlas Filter Controls
            </span>
          </div>
          {(selectedIndustry !== 'all' ||
            selectedCityId !== 'all' ||
            founderSearch ||
            companySearch ||
            listSearch) && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} /> Clear all filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Vertical / Industry Dropdown */}
          <div>
            <label className="label text-[10px] mb-1">Industry / Vertical</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="input py-2 text-xs font-semibold cursor-pointer"
            >
              <option value="all">All Verticals (Any)</option>
              {allIndustries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Governorate / City Dropdown */}
          <div>
            <label className="label text-[10px] mb-1">Governorate / City Hub</label>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="input py-2 text-xs font-semibold cursor-pointer"
            >
              <option value="all">🇪🇬 All Egypt Hubs ({totalEgyptMembers})</option>
              {EGYPT_CITIES.map((c) => {
                const count = cityCounts[c.id] || 0;
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} ({count})
                  </option>
                );
              })}
              {otherMembers.length > 0 && (
                <option value="others">🌍 Global / Other ({otherMembers.length})</option>
              )}
            </select>
          </div>

          {/* Founder Name Search */}
          <div>
            <label className="label text-[10px] mb-1">Founder Name</label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                value={founderSearch}
                onChange={(e) => setFounderSearch(e.target.value)}
                placeholder="Filter founder name..."
                className="input pl-8 py-2 text-xs font-medium"
              />
            </div>
          </div>

          {/* Company Name Search */}
          <div>
            <label className="label text-[10px] mb-1">Company / Business</label>
            <div className="relative">
              <Building2
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                placeholder="Filter company..."
                className="input pl-8 py-2 text-xs font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Main Dashboard Body: GIS Map + Right Filter Drawer ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ── Left/Center GIS Map Canvas (8 Columns) ───────────────────────── */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="card overflow-hidden border-stone-200/90 dark:border-stone-800 p-0 shadow-lg">
            <EgyptGISMap
              cityCounts={dynamicCityCounts}
              selectedCityId={selectedCityId}
              onSelectCity={(id) => setSelectedCityId(id === selectedCityId ? 'all' : id)}
              membersByCity={membersByCity}
              focusedCoords={focusedCoords}
            />
          </div>

          {/* Quick Hub Filter Bar Underneath Map */}
          <div className="card p-3 bg-white dark:bg-stone-900 border-stone-200/90 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider flex-shrink-0 mr-1 flex items-center gap-1">
              <MapPin size={12} className="text-orange-500" /> Quick Hubs:
            </span>
            <button
              onClick={() => setSelectedCityId('all')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border flex-shrink-0 cursor-pointer ${
                selectedCityId === 'all'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 border-stone-900 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-orange-300'
              }`}
            >
              All ({members.length})
            </button>
            {activeCities.map((city) => {
              const count = dynamicCityCounts[city.id] || 0;
              const isSelected = selectedCityId === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => setSelectedCityId(city.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                      : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-800 hover:border-orange-300'
                  }`}
                >
                  <span>{city.name.split('&')[0].trim()}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-black ${
                      isSelected
                        ? 'bg-white/30 text-white'
                        : 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right Panel: Filterable Founders & Companies Drawer (4 Columns) ── */}
        <div className="lg:col-span-4 card p-0 border-stone-200/90 dark:border-stone-800 flex flex-col overflow-hidden shadow-lg max-h-[590px]">
          {/* Header styled with Emerald-to-Teal gradient and Orange Badge */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-800 via-teal-800 to-stone-900 text-white flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <h3 className="text-sm font-black tracking-tight font-display text-white">
                  Founders & Companies
                </h3>
              </div>
              <p className="text-[10px] text-emerald-200 font-medium mt-0.5">
                {selectedCityObj ? `Filtered by ${selectedCityObj.name}` : 'Ecosystem Roster'}
              </p>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white font-mono font-black text-xs shadow-sm shadow-orange-500/30">
              {filteredMembers.length}
            </span>
          </div>

          {/* Quick Search inside Right Panel */}
          <div className="p-2.5 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                value={listSearch}
                onChange={(e) => setListSearch(e.target.value)}
                placeholder="Search founders, companies, roles..."
                className="input pl-8 py-1.5 text-xs bg-white dark:bg-stone-900"
              />
            </div>
          </div>

          {/* Scrollable Founders List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 divide-y divide-transparent">
            {filteredMembers.length === 0 ? (
              <div className="p-6 text-center space-y-2 text-stone-500 dark:text-stone-400">
                <div className="text-2xl">🔍</div>
                <div className="text-xs font-extrabold text-stone-800 dark:text-stone-200">
                  No matching founders
                </div>
                <p className="text-[11px] text-stone-500">
                  No members match your current filter selection.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn-secondary mx-auto py-1 px-3 text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredMembers.map((m) => {
                const isFocused = focusedMemberId === m.id;
                const locStr =
                  typeof m.location === 'string'
                    ? m.location
                    : `${m.location?.city || ''}${m.location?.country ? `, ${m.location.country}` : ''}`;

                // Safe social links checks
                const hasValidLinkedin =
                  m.linkedin &&
                  typeof m.linkedin === 'string' &&
                  m.linkedin.includes('linkedin.com');
                const hasValidEmail =
                  m.email && typeof m.email === 'string' && m.email.includes('@');
                const hasValidPhone =
                  m.phone && typeof m.phone === 'string' && m.phone.trim().length > 3;

                return (
                  <div
                    key={m.id}
                    onClick={() => handleFocusFounder(m)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isFocused
                        ? 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-500 ring-1 ring-orange-400/40 shadow-xs'
                        : 'bg-white dark:bg-stone-900/80 border-stone-200/80 dark:border-stone-800 hover:border-orange-300 dark:hover:border-orange-700/60 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                        {m.name
                          .split(' ')
                          .map((w) => w[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-extrabold text-xs text-stone-900 dark:text-stone-100 truncate">
                            {m.name}
                          </h4>
                          {m.stage && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex-shrink-0 capitalize">
                              {m.stage}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] font-bold text-stone-600 dark:text-stone-300 truncate mt-0.5">
                          {m.role || 'Founder'}
                        </div>

                        {m.business && (
                          <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5 flex items-center gap-1">
                            <Building2 size={11} className="text-orange-500 flex-shrink-0" />
                            <span className="truncate">{m.business}</span>
                          </div>
                        )}

                        {/* Location & Tags */}
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {locStr && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                              <MapPin size={9} className="text-orange-500" />
                              {locStr}
                            </span>
                          )}
                          {Array.isArray(m.tags) &&
                            m.tags.slice(0, 2).map((t) => (
                              <span
                                key={t}
                                className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40"
                              >
                                {t}
                              </span>
                            ))}
                        </div>

                        {/* Social / Contact Icons with error handling shading */}
                        <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-stone-100 dark:border-stone-800">
                          {hasValidLinkedin ? (
                            <a
                              href={m.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                              title="LinkedIn Profile"
                            >
                              <Linkedin size={13} />
                            </a>
                          ) : (
                            <span
                              className="text-stone-300 dark:text-stone-700"
                              title="LinkedIn not available"
                            >
                              <Linkedin size={13} />
                            </span>
                          )}

                          {hasValidEmail ? (
                            <a
                              href={`mailto:${m.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-stone-600 dark:text-stone-300 hover:text-orange-500 transition-colors"
                              title={`Email: ${m.email}`}
                            >
                              <Mail size={13} />
                            </a>
                          ) : (
                            <span
                              className="text-stone-300 dark:text-stone-700"
                              title="Email not available"
                            >
                              <Mail size={13} />
                            </span>
                          )}

                          {hasValidPhone ? (
                            <a
                              href={`tel:${m.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-stone-600 dark:text-stone-300 hover:text-emerald-500 transition-colors"
                              title={`Phone: ${m.phone}`}
                            >
                              <Phone size={13} />
                            </a>
                          ) : (
                            <span
                              className="text-stone-300 dark:text-stone-700"
                              title="Phone not available"
                            >
                              <Phone size={13} />
                            </span>
                          )}

                          <span className="text-[10px] text-stone-400 font-semibold ml-auto flex items-center gap-1 group-hover:text-orange-500">
                            Focus on map ➔
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Panel Footer */}
          <div className="p-2.5 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 font-semibold">
            <span>
              Showing {filteredMembers.length} of {members.length}
            </span>
            <button
              onClick={handleResetFilters}
              className="text-orange-600 dark:text-orange-400 font-bold hover:underline cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Detailed Grid of Filtered Member Profile Cards (When filtered) ── */}
      {selectedCityId !== 'all' && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="section-title text-sm">
              {selectedCityObj
                ? `Hub Deep-Dive: ${selectedCityObj.name} (${filteredMembers.length})`
                : `Global / Other Founders (${filteredMembers.length})`}
            </h3>
            <button
              onClick={() => setSelectedCityId('all')}
              className="btn-secondary py-1 px-3 text-xs font-bold"
            >
              Show All Hubs
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((m) => (
              <ProfileCard
                key={m.id}
                member={m}
                onDeleted={refreshMembers}
                onUpdated={refreshMembers}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
