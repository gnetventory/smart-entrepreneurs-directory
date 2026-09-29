// ─── Stage Definitions ────────────────────────────────────────────────────────
export const STAGES = {
  idea: {
    label: 'Idea Phase',
    color: 'slate',
    bg: 'bg-stone-100 dark:bg-stone-800',
    text: 'text-stone-700 dark:text-stone-300',
    border: 'border-stone-300 dark:border-stone-700',
    icon: '💡',
  },
  starting: {
    label: 'Starting',
    color: 'emerald',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-300 dark:border-emerald-700',
    icon: '🌱',
  },
  running: {
    label: 'Running',
    color: 'amber',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-700',
    icon: '⚙️',
  },
  growing: {
    label: 'Growing',
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
};

// ─── Map Tile Providers & API Configuration ────────────────────────────────────
export const MAP_TILE_PRESETS = [
  {
    id: 'carto_voyager',
    name: 'CartoDB Voyager (Warm & Vibrant)',
    description: 'Crisp typography and warm colors. Supports your Carto API key',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://carto.com/" target="_blank">CARTO</a> &copy; OpenStreetMap',
    requiresKey: false,
    keyParam: 'api_key',
  },
  {
    id: 'esri_world',
    name: 'Esri World Street Map (100% Free, No Watermark)',
    description: 'High-resolution worldwide street cartography — 100% Free, No key needed',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
    requiresKey: false,
  },
  {
    id: 'osm_standard',
    name: 'OpenStreetMap Standard (100% Free, No Watermark)',
    description: 'Classic OpenStreetMap cartography — 100% Free, No key needed',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    requiresKey: false,
  },
  {
    id: 'carto_positron',
    name: 'CartoDB Positron (Light Minimal)',
    description: 'Clean light grey minimal tiles. Supports your Carto API key',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://carto.com/" target="_blank">CARTO</a> &copy; OpenStreetMap',
    requiresKey: false,
    keyParam: 'api_key',
  },
  {
    id: 'carto_dark',
    name: 'CartoDB Dark Matter (Dark Cyber)',
    description: 'Sleek dark theme tiles. Supports your Carto API key',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://carto.com/" target="_blank">CARTO</a> &copy; OpenStreetMap',
    requiresKey: false,
    keyParam: 'api_key',
  },
  {
    id: 'mapbox_custom',
    name: 'Mapbox Custom Style',
    description:
      'High-res vector styles (50k free views/mo) — Requires Mapbox Access Token (pk...)',
    url: 'https://api.mapbox.com/styles/v1/{styleId}/tiles/256/{z}/{x}/{y}@2x?access_token={apiKey}',
    attribution: '&copy; <a href="https://www.mapbox.com/" target="_blank">Mapbox</a>',
    requiresKey: true,
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

// ─── Seed / Demo Members ─────────────────────────────────────────────────────
export const SEED_MEMBERS = [
  {
    id: 'seed-1',
    name: 'Maria Silva',
    role: 'Digital Marketing Specialist',
    business:
      'GreenBrand Studio – Sustainable branding & marketing agency helping eco-conscious startups build their identity',
    stage: 'running',
    lookingFor:
      'Partnerships with sustainability-focused startups, and investors interested in green economy brands',
    canHelp:
      'Brand strategy, social media campaigns, content creation, SEO, and connecting with local suppliers in South America',
    location: { country: 'Brazil', city: 'São Paulo' },
    phone: '',
    tags: ['Marketing', 'Sustainability', 'Branding', 'Content Creation'],
    originalLanguage: 'en',
    originalText: '',
    createdAt: new Date(Date.now() - 35 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 35 * 864e5).toISOString(),
  },
  {
    id: 'seed-2',
    name: 'Ahmed Hassan',
    role: 'Mobile App Developer & Tech Entrepreneur',
    business:
      'HalalGo – Food delivery platform connecting Muslim consumers with certified halal restaurants across the Middle East',
    stage: 'growing',
    lookingFor:
      'Series A investors, experienced growth hackers, and restaurant partnerships in Turkey and Malaysia',
    canHelp:
      'Mobile app development (React Native, Flutter), API architecture, cloud infrastructure, and navigating the MENA startup ecosystem',
    location: { country: 'Egypt', city: 'Cairo' },
    phone: '',
    tags: ['Mobile Apps', 'Food Tech', 'E-commerce'],
    originalLanguage: 'en',
    originalText: '',
    createdAt: new Date(Date.now() - 20 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 864e5).toISOString(),
  },
  {
    id: 'seed-3',
    name: 'Priya Patel',
    role: 'E-commerce Strategist & Marketplace Builder',
    business:
      'ArtisanBazaar – Online marketplace connecting Indian artisans and craftspeople directly with global buyers',
    stage: 'starting',
    lookingFor:
      'Technical co-founder, supply chain logistics partner, and digital marketing expertise for international markets',
    canHelp:
      'E-commerce strategy, product sourcing, vendor management, marketplace operations, and South Asian market insights',
    location: { country: 'India', city: 'Mumbai' },
    phone: '',
    tags: ['E-commerce', 'Marketplace', 'Design'],
    originalLanguage: 'en',
    originalText: '',
    createdAt: new Date(Date.now() - 10 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 864e5).toISOString(),
  },
  {
    id: 'seed-4',
    name: 'Carlos Mendoza',
    role: 'FinTech Innovator & Financial Inclusion Advocate',
    business:
      'PagoFácil – Digital wallet and micro-lending platform targeting the unbanked population in Latin America',
    stage: 'idea',
    lookingFor:
      'Banking/regulatory compliance expert, angel investment of $50k–$100k, and fintech mentors with LATAM experience',
    canHelp:
      'Business plan development, financial modeling, pitch deck preparation, and LATAM entrepreneur network connections',
    location: { country: 'Mexico', city: 'Mexico City' },
    phone: '',
    tags: ['FinTech', 'Finance'],
    originalLanguage: 'en',
    originalText: '',
    createdAt: new Date(Date.now() - 5 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 864e5).toISOString(),
  },
  {
    id: 'seed-5',
    name: 'Sofia Kowalski',
    role: 'EdTech Founder & Language Learning Expert',
    business:
      'LinguaPath – AI-powered language learning platform for adult professionals who need business English skills',
    stage: 'running',
    lookingFor:
      'B2B partnerships with HR departments, content creators in multiple languages, and expansion into German & Czech markets',
    canHelp:
      'EdTech product design, curriculum development, user acquisition for educational products, and European market knowledge',
    location: { country: 'Poland', city: 'Warsaw' },
    phone: '',
    tags: ['EdTech', 'AI/ML', 'SaaS', 'Education'],
    originalLanguage: 'en',
    originalText: '',
    createdAt: new Date(Date.now() - 2 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
];

// ─── Navigation Tabs ──────────────────────────────────────────────────────────
export const NAV_TABS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'BarChart3',
    description: 'Executive intelligence & KPI ribbon',
  },
  { id: 'directory', label: 'Directory', icon: 'Users', description: 'Browse all members' },
  { id: 'add', label: 'Add Member', icon: 'UserPlus', description: 'AI parser & manual form' },
  { id: 'matchmaker', label: 'Matchmaker', icon: 'Sparkles', description: 'AI match suggestions' },
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
