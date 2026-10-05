// ─── Stage Definitions ────────────────────────────────────────────────────────
export const STAGES = {
  idea: {
    label: 'Idea Phase',
    tenure: 'Concept',
    color: 'slate',
    bg: 'bg-stone-100 dark:bg-stone-800',
    text: 'text-stone-700 dark:text-stone-300',
    border: 'border-stone-300 dark:border-stone-700',
    icon: '💡',
  },
  starting: {
    label: 'Starting',
    tenure: '<1 Year',
    color: 'emerald',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-700',
    icon: '🌱',
  },
  running: {
    label: 'Running',
    tenure: '1–3 Years',
    color: 'amber',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-700',
    icon: '⚙️',
  },
  growing: {
    label: 'Growing',
    tenure: '3+ Years',
    color: 'indigo',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-300 dark:border-indigo-700',
    icon: '🚀',
  },
};

export const STAGE_OPTIONS = ['idea', 'starting', 'running', 'growing'];

// ─── Industry Tags ─────────────────────────────────────────────────────────────
export const INDUSTRY_TAGS = [
  'FinTech',
  'EdTech',
  'HealthTech',
  'E-commerce',
  'SaaS',
  'AI/ML',
  'Marketing',
  'Branding',
  'Design',
  'Mobile Apps',
  'Web Dev',
  'Food Tech',
  'Sustainability',
  'Logistics',
  'Real Estate',
  'Travel',
  'Social Media',
  'Content Creation',
  'Consulting',
  'Manufacturing',
  'Agriculture',
  'Fashion',
  'Retail',
  'Media',
  'Legal',
  'Finance',
  'Healthcare',
  'Education',
  'Marketplace',
  'HR Tech',
  'PropTech',
];

// ─── LocalStorage Keys ─────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  MEMBERS: 'sed_members',
  EXCHANGE: 'sed_exchange_posts',
  API_KEY: 'sed_gemini_api_key',
  DARK_MODE: 'sed_dark_mode',
  ADMIN_PIN: 'sed_admin_pin',
  APP_SETTINGS: 'sed_app_settings',
  MAP_CONFIG: 'sed_map_config',
  SHEETS_CONFIG: 'sed_sheets_config',
  TOMBSTONES: 'sed_tombstones',
  ADMIN_EMAIL: 'sed_admin_email',
};

// ─── Map Tile Providers & API Configuration ────────────────────────────────────
export const MAP_TILE_PRESETS = [
  {
    id: 'esri_world',
    name: 'Esri World Street Map (100% Free, No Watermark)',
    description: 'High-resolution worldwide street cartography — 100% Free, No key needed',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
    requiresKey: false,
  },
];

// ─── Staleness Threshold ──────────────────────────────────────────────────────
export const STALENESS_DAYS = 90;

// ─── Avatar Gradient Palette ──────────────────────────────────────────────────
export const AVATAR_GRADIENTS = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-violet-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
  'from-cyan-500 to-sky-600',
  'from-red-500 to-orange-600',
  'from-green-500 to-emerald-600',
];

import communityMembersData from '../data/community_members.json';

// ─── Seed / Real Community Members ───────────────────────────────────────────
export const SEED_MEMBERS = communityMembersData.map((m, idx) => ({
  ...m,
  id: m.id || `community-${idx + 1}`,
  createdAt: m.createdAt || new Date(Date.now() - (idx + 1) * 36e5).toISOString(),
  updatedAt: m.updatedAt || new Date().toISOString(),
}));

// ─── Official Member Intake & Update Google Form ──────────────────────────────
export const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeWXJF6cXtxMIQPLK3eKyDtfhdmIIK17oP8f9hS0WGgHysF5g/viewform?usp=header';

// ─── Navigation Tabs ──────────────────────────────────────────────────────────
export const NAV_TABS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'BarChart3',
    description: 'Executive intelligence & KPI ribbon',
  },
  { id: 'directory', label: 'Directory', icon: 'Users', description: 'Browse all members' },
  {
    id: 'radar',
    label: 'Match Radar',
    icon: 'Radio',
    description: 'Interactive synergy matching radar',
  },
  {
    id: 'map',
    label: 'Alliance Atlas',
    icon: 'Globe',
    description: 'Geographic ecosystem & founder distribution',
  },
];

// ─── Country Flag Map (top common countries) ─────────────────────────────────
export const COUNTRY_FLAGS = {
  Afghanistan: '🇦🇫',
  Albania: '🇦🇱',
  Algeria: '🇩🇿',
  Argentina: '🇦🇷',
  Australia: '🇦🇺',
  Austria: '🇦🇹',
  Bahrain: '🇧🇭',
  Bangladesh: '🇧🇩',
  Belgium: '🇧🇪',
  Brazil: '🇧🇷',
  Canada: '🇨🇦',
  Chile: '🇨🇱',
  China: '🇨🇳',
  Colombia: '🇨🇴',
  'Czech Republic': '🇨🇿',
  Denmark: '🇩🇰',
  Egypt: '🇪🇬',
  Ethiopia: '🇪🇹',
  Finland: '🇫🇮',
  France: '🇫🇷',
  Germany: '🇩🇪',
  Ghana: '🇬🇭',
  Greece: '🇬🇷',
  Hungary: '🇭🇺',
  India: '🇮🇳',
  Indonesia: '🇮🇩',
  Iran: '🇮🇷',
  Iraq: '🇮🇶',
  Ireland: '🇮🇪',
  Israel: '🇮🇱',
  Italy: '🇮🇹',
  Japan: '🇯🇵',
  Jordan: '🇯🇴',
  Kenya: '🇰🇪',
  Kuwait: '🇰🇼',
  Lebanon: '🇱🇧',
  Libya: '🇱🇾',
  Malaysia: '🇲🇾',
  Mexico: '🇲🇽',
  Morocco: '🇲🇦',
  Netherlands: '🇳🇱',
  'New Zealand': '🇳🇿',
  Nigeria: '🇳🇬',
  Norway: '🇳🇴',
  Oman: '🇴🇲',
  Pakistan: '🇵🇰',
  Peru: '🇵🇪',
  Philippines: '🇵🇭',
  Poland: '🇵🇱',
  Portugal: '🇵🇹',
  Qatar: '🇶🇦',
  Romania: '🇷🇴',
  Russia: '🇷🇺',
  'Saudi Arabia': '🇸🇦',
  Senegal: '🇸🇳',
  Singapore: '🇸🇬',
  'South Africa': '🇿🇦',
  'South Korea': '🇰🇷',
  Spain: '🇪🇸',
  Sudan: '🇸🇩',
  Sweden: '🇸🇪',
  Switzerland: '🇨🇭',
  Syria: '🇸🇾',
  Taiwan: '🇹🇼',
  Tanzania: '🇹🇿',
  Thailand: '🇹🇭',
  Tunisia: '🇹🇳',
  Turkey: '🇹🇷',
  UAE: '🇦🇪',
  Uganda: '🇺🇬',
  UK: '🇬🇧',
  Ukraine: '🇺🇦',
  'United Arab Emirates': '🇦🇪',
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  USA: '🇺🇸',
  Venezuela: '🇻🇪',
  Vietnam: '🇻🇳',
  Yemen: '🇾🇪',
  Zimbabwe: '🇿🇼',
};

export const getCountryFlag = (country) => COUNTRY_FLAGS[country] || '🌍';
