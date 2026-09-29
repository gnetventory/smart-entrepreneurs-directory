import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EGYPT_CITIES } from '../../utils/egyptCities';
import { MAP_TILE_PRESETS } from '../../utils/constants';
import { useApp } from '../../contexts/AppContext';
import { Maximize2, Minimize2, Layers, Key, Check } from 'lucide-react';

export default function EgyptGISMap({
  cityCounts,
  selectedCityId,
  onSelectCity,
  membersByCity,
  focusedCoords,
}) {
  const { mapConfig, updateMapConfig, notify } = useApp();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersGroupRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(mapConfig?.apiKey || '');

  // 1. Initialize Map on Mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [28.0, 31.0],
        zoom: 6,
        minZoom: 5,
        maxZoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      // Custom Zoom Control at top-left
      L.control.zoom({ position: 'topleft' }).addTo(map);

      // Attribution Control
      L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Ensure tile sizes and viewport are calibrated
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 600);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 1b. Update Tile Layer when mapConfig changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const providerId = mapConfig?.provider || 'esri_world';
    const apiKey = (mapConfig?.apiKey || '').trim();

    let selectedPreset = MAP_TILE_PRESETS.find((p) => p.id === providerId) || MAP_TILE_PRESETS[1];
    let tileUrl = selectedPreset.url;
    let attribution = selectedPreset.attribution;

    if (providerId === 'mapbox_custom') {
      if (apiKey && apiKey.startsWith('pk.')) {
        tileUrl = `https://api.mapbox.com/styles/v1/${mapConfig.styleId || 'mapbox/streets-v12'}/tiles/256/{z}/{x}/{y}@2x?access_token=${apiKey}`;
        attribution = '&copy; <a href="https://www.mapbox.com/" target="_blank">Mapbox</a>';
      } else {
        // Fallback to Esri World Street Map if Mapbox key is missing or invalid
        const fallbackPreset =
          MAP_TILE_PRESETS.find((p) => p.id === 'esri_world') || MAP_TILE_PRESETS[1];
        tileUrl = fallbackPreset.url;
        attribution = fallbackPreset.attribution;
      }
    } else if (selectedPreset.keyParam && apiKey) {
      // CartoDB with API Key: append ?api_key=...
      const separator = tileUrl.includes('?') ? '&' : '?';
      tileUrl = `${tileUrl}${separator}${selectedPreset.keyParam}=${apiKey}`;
    } else if (providerId === 'custom_tile') {
      if (mapConfig?.customTileUrl) {
        tileUrl = mapConfig.customTileUrl;
        attribution = 'Custom Tiles';
      } else {
        const fallbackPreset =
          MAP_TILE_PRESETS.find((p) => p.id === 'esri_world') || MAP_TILE_PRESETS[1];
        tileUrl = fallbackPreset.url;
        attribution = fallbackPreset.attribution;
      }
    }

    const newTileLayer = L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 19,
      maxNativeZoom: 18,
      keepBuffer: 6,
      updateWhenIdle: false,
      updateInterval: 100,
      crossOrigin: true,
      attribution: attribution,
    });

    // Handle tile load errors gracefully
    newTileLayer.on('tileerror', (e) => {
      console.warn('Tile load issue, ensuring map resilience:', e);
    });

    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);
  }, [mapConfig]);

  // 2. Render Markers & Proportional Bubbles whenever counts or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    EGYPT_CITIES.forEach((city) => {
      const count = cityCounts[city.id] || 0;
      const isSelected = selectedCityId === city.id;

      // Color scheme aligned with Warm Premium palette:
      let strokeColor = '#0d9488';
      let fillColor = '#0d9488';
      let badgeBg = 'linear-gradient(135deg, #0d9488, #059669)';

      if (count >= 10) {
        strokeColor = '#ea580c';
        fillColor = '#f97316';
        badgeBg = 'linear-gradient(135deg, #ea580c, #f97316)';
      } else if (count >= 3) {
        strokeColor = '#047857';
        fillColor = '#059669';
        badgeBg = 'linear-gradient(135deg, #059669, #10b981)';
      }

      if (count > 0) {
        const radiusMeters = Math.min(38000, 9500 + Math.sqrt(count) * 6200);

        // 1. Semi-transparent outer heat bubble
        const outerCircle = L.circle([city.lat, city.lng], {
          color: strokeColor,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.45 : 0.22,
          weight: isSelected ? 3 : 1.5,
          radius: radiusMeters,
        });

        // 2. Center badge marker with count
        const bubbleHtml = `
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: ${isSelected ? '#1c1917' : badgeBg};
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Outfit', system-ui, sans-serif;
            font-weight: 900;
            font-size: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            border: 2px solid #ffffff;
            cursor: pointer;
            transform: translate(-50%, -50%);
            transition: transform 0.2s;
          ">
            ${count}
          </div>
        `;

        const centerMarker = L.marker([city.lat, city.lng], {
          icon: L.divIcon({
            className: 'custom-bubble-pin',
            html: bubbleHtml,
            iconSize: [32, 32],
          }),
        });

        // Popup Content
        const popupHtml = `
          <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 4px; min-width: 150px;">
            <div style="font-weight: 800; font-size: 13px; color: #1c1917; margin-bottom: 2px;">
              📍 ${city.name}
            </div>
            <div style="font-size: 11px; color: #78716c; font-weight: 600;">
              ${city.nameAr} · ${city.region}
            </div>
            <div style="margin-top: 6px; padding: 4px 8px; border-radius: 8px; background: #fff7ed; border: 1px solid #fed7aa; color: #c2410c; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: space-between;">
              <span>Founders & Companies</span>
              <span style="font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 900;">${count}</span>
            </div>
            <button id="filter-btn-${city.id}" style="
              margin-top: 8px;
              width: 100%;
              background: #f97316;
              color: #ffffff;
              border: none;
              padding: 5px 10px;
              border-radius: 8px;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
              transition: background 0.15s;
            ">
              Filter Hub Founders ➔
            </button>
          </div>
        `;

        outerCircle.bindPopup(popupHtml);
        centerMarker.bindPopup(popupHtml);

        const handleCityClick = () => {
          onSelectCity(city.id);
        };

        outerCircle.on('click', handleCityClick);
        centerMarker.on('click', handleCityClick);

        outerCircle.on('popupopen', () => {
          const btn = document.getElementById(`filter-btn-${city.id}`);
          if (btn) btn.onclick = () => onSelectCity(city.id);
        });
        centerMarker.on('popupopen', () => {
          const btn = document.getElementById(`filter-btn-${city.id}`);
          if (btn) btn.onclick = () => onSelectCity(city.id);
        });

        markersGroup.addLayer(outerCircle);
        markersGroup.addLayer(centerMarker);
      } else {
        const inactiveDot = L.circleMarker([city.lat, city.lng], {
          radius: 4,
          color: '#a8a29e',
          fillColor: '#ffffff',
          fillOpacity: 0.9,
          weight: 1.5,
        });
        inactiveDot.bindTooltip(`📍 ${city.name} (0 members)`, {
          direction: 'top',
          offset: [0, -4],
        });
        inactiveDot.on('click', () => onSelectCity(city.id));
        markersGroup.addLayer(inactiveDot);
      }
    });
  }, [cityCounts, selectedCityId, onSelectCity]);

  // 3. Handle Zoom/FlyTo when selectedCityId changes or focus requested
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (focusedCoords && focusedCoords.lat && focusedCoords.lng) {
      map.flyTo([focusedCoords.lat, focusedCoords.lng], 11, { duration: 1.2 });
      return;
    }

    if (selectedCityId && selectedCityId !== 'all' && selectedCityId !== 'others') {
      const city = EGYPT_CITIES.find((c) => c.id === selectedCityId);
      if (city) {
        map.flyTo([city.lat, city.lng], 9, { duration: 1.2 });
      }
    } else if (selectedCityId === 'all') {
      map.flyTo([28.0, 31.0], 6, { duration: 1.0 });
    }
  }, [selectedCityId, focusedCoords]);

  // Toggle Fullscreen handler
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);
  };

  const handleSelectStyle = (presetId) => {
    updateMapConfig({
      ...mapConfig,
      provider: presetId,
    });
    setShowStyleMenu(false);
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    updateMapConfig({
      ...mapConfig,
      apiKey: apiKeyInput.trim(),
    });
    setShowKeyInput(false);
    notify?.('Map API Key saved!');
  };

  const currentPreset =
    MAP_TILE_PRESETS.find((p) => p.id === (mapConfig?.provider || 'esri_world')) ||
    MAP_TILE_PRESETS[1];

  return (
    <div
      className={`relative w-full overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-stone-950 p-4'
          : 'h-[520px] rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-md'
      }`}
    >
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Floating Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
        {/* Style Selector Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowStyleMenu((prev) => !prev)}
            className="px-3 py-1.5 rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 shadow-md hover:border-orange-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Layers size={14} className="text-orange-500" />
            <span className="hidden sm:inline">{currentPreset.name.split('(')[0].trim()}</span>
          </button>

          {/* Dropdown Menu */}
          {showStyleMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl p-2 z-[1010] space-y-1 animate-fade-in">
              <div className="px-2 py-1 text-[10px] font-black uppercase text-stone-400">
                Choose Map Tile Style:
              </div>
              {MAP_TILE_PRESETS.map((preset) => {
                const isActive = (mapConfig?.provider || 'esri_world') === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectStyle(preset.id)}
                    className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all flex items-start justify-between gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <div>
                      <div>{preset.name}</div>
                      <div className="text-[10px] font-normal text-stone-400">
                        {preset.description}
                      </div>
                    </div>
                    {isActive && (
                      <Check size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
              <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => {
                    setShowStyleMenu(false);
                    setShowKeyInput(true);
                  }}
                  className="w-full text-center py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center justify-center gap-1"
                >
                  <Key size={12} /> Enter / Edit CARTO Key
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="p-2 rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 shadow-md hover:bg-orange-50 hover:text-orange-600 transition-all cursor-pointer"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Quick CARTO API Key Popover Modal */}
      {showKeyInput && (
        <div className="absolute inset-0 z-[1020] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveApiKey}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-2xl max-w-sm w-full space-y-3 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Key size={15} className="text-orange-500" /> CARTO Basemaps Key
              </h4>
              <button
                type="button"
                onClick={() => setShowKeyInput(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
              Paste your CARTO API key to activate CartoDB Voyager without watermarks.
            </p>
            <input
              type="text"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste CARTO API Key..."
              className="input font-mono text-xs py-2"
              autoFocus
            />
            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowKeyInput(false)}
                className="btn-secondary py-1.5 px-3 text-xs font-bold"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary py-1.5 px-3 text-xs font-bold">
                Save & Apply
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bottom Map Density Legend (Aligned with Warm Premium Theme) */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-200/90 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 shadow-lg flex items-center gap-3 select-none">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 dark:text-stone-400">
          Hub Scale:
        </span>
        <div className="flex items-center gap-1.5 font-mono font-bold text-[11px]">
          <span className="w-3 h-3 rounded-full bg-teal-600/80 inline-block border border-white" />
          <span>1-2</span>
          <span className="text-stone-400 font-normal">━━</span>
          <span className="w-4 h-4 rounded-full bg-emerald-600/80 inline-block border border-white" />
          <span>3-9</span>
          <span className="text-stone-400 font-normal">━━</span>
          <span className="w-5 h-5 rounded-full bg-orange-500/90 inline-block border border-white" />
          <span>10+</span>
        </div>
      </div>
    </div>
  );
}
