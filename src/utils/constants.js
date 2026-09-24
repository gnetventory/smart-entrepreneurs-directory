// ─── Stage Definitions ────────────────────────────────────────────────────────
export const STAGES = {
  idea:     { label: 'Idea',          color: 'purple', bg: 'bg-purple-500/20',  text: 'text-purple-400',  border: 'border-purple-500/30', icon: '💡' },
  starting: { label: 'Starting',      color: 'blue',   bg: 'bg-blue-500/20',    text: 'text-blue-400',    border: 'border-blue-500/30',   icon: '🚀' },
  running:  { label: 'Already Running', color: 'emerald', bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: '⚙️' },
  growing:  { label: 'Growing',       color: 'amber',  bg: 'bg-amber-500/20',   text: 'text-amber-400',   border: 'border-amber-500/30',  icon: '📈' },
};

export const STAGE_OPTIONS = ['idea', 'starting', 'running', 'growing'];

// ─── Industry Tags ─────────────────────────────────────────────────────────────
export const INDUSTRY_TAGS = [
  'FinTech', 'EdTech', 'HealthTech', 'E-commerce', 'SaaS', 'AI/ML',
  'Marketing', 'Branding', 'Design', 'Mobile Apps', 'Web Dev',
  'Food Tech', 'Sustainability', 'Logistics', 'Real Estate', 'Travel',
  'Social Media', 'Content Creation', 'Consulting', 'Manufacturing',
  'Agriculture', 'Fashion', 'Retail', 'Media', 'Legal', 'Finance',
  'Healthcare', 'Education', 'Marketplace', 'HR Tech', 'PropTech',
];

// ─── LocalStorage Keys ─────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  MEMBERS:      'sed_members',
  EXCHANGE:     'sed_exchange_posts',
  API_KEY:      'sed_gemini_api_key',
  DARK_MODE:    'sed_dark_mode',
  ADMIN_PIN:    'sed_admin_pin',
  APP_SETTINGS: 'sed_app_settings',
};

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
    business: 'GreenBrand Studio – Sustainable branding & marketing agency helping eco-conscious startups build their identity',
    stage: 'running',
    lookingFor: 'Partnerships with sustainability-focused startups, and investors interested in green economy brands',
    canHelp: 'Brand strategy, social media campaigns, content creation, SEO, and connecting with local suppliers in South America',
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
    business: 'HalalGo – Food delivery platform connecting Muslim consumers with certified halal restaurants across the Middle East',
    stage: 'growing',
    lookingFor: 'Series A investors, experienced growth hackers, and restaurant partnerships in Turkey and Malaysia',
    canHelp: 'Mobile app development (React Native, Flutter), API architecture, cloud infrastructure, and navigating the MENA startup ecosystem',
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
    business: 'ArtisanBazaar – Online marketplace connecting Indian artisans and craftspeople directly with global buyers',
    stage: 'starting',
    lookingFor: 'Technical co-founder, supply chain logistics partner, and digital marketing expertise for international markets',
    canHelp: 'E-commerce strategy, product sourcing, vendor management, marketplace operations, and South Asian market insights',
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
    business: 'PagoFácil – Digital wallet and micro-lending platform targeting the unbanked population in Latin America',
    stage: 'idea',
    lookingFor: 'Banking/regulatory compliance expert, angel investment of $50k–$100k, and fintech mentors with LATAM experience',
    canHelp: 'Business plan development, financial modeling, pitch deck preparation, and LATAM entrepreneur network connections',
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
    business: 'LinguaPath – AI-powered language learning platform for adult professionals who need business English skills',
    stage: 'running',
    lookingFor: 'B2B partnerships with HR departments, content creators in multiple languages, and expansion into German & Czech markets',
    canHelp: 'EdTech product design, curriculum development, user acquisition for educational products, and European market knowledge',
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
  { id: 'directory',    label: 'Directory',      icon: 'Users',          description: 'Browse all members' },
  { id: 'add',          label: 'Add Member',      icon: 'UserPlus',       description: 'AI parser & manual form' },
  { id: 'matchmaker',   label: 'Matchmaker',      icon: 'Sparkles',       description: 'AI match suggestions' },
  { id: 'map',          label: 'World Map',       icon: 'Globe',          description: 'Geographic view' },
  { id: 'exchange',     label: 'Skills Exchange', icon: 'ArrowLeftRight', description: 'Need & offer board' },
  { id: 'dashboard',    label: 'Dashboard',       icon: 'BarChart3',      description: 'Community analytics' },
  { id: 'digest',       label: 'Weekly Digest',   icon: 'FileText',       description: 'WhatsApp digest' },
  { id: 'businesscard', label: 'Business Card',   icon: 'CreditCard',     description: 'Generate shareable card' },
  { id: 'guide',        label: 'User Guide',      icon: 'BookOpen',       description: 'Onboarding & template guide' },
  { id: 'admin',        label: 'Admin',           icon: 'Settings',       description: 'Data & settings' },
];

// ─── Country Flag Map (top common countries) ─────────────────────────────────
export const COUNTRY_FLAGS = {
  'Afghanistan': '🇦🇫', 'Albania': '🇦🇱', 'Algeria': '🇩🇿', 'Argentina': '🇦🇷',
  'Australia': '🇦🇺', 'Austria': '🇦🇹', 'Bahrain': '🇧🇭', 'Bangladesh': '🇧🇩',
  'Belgium': '🇧🇪', 'Brazil': '🇧🇷', 'Canada': '🇨🇦', 'Chile': '🇨🇱',
  'China': '🇨🇳', 'Colombia': '🇨🇴', 'Czech Republic': '🇨🇿', 'Denmark': '🇩🇰',
  'Egypt': '🇪🇬', 'Ethiopia': '🇪🇹', 'Finland': '🇫🇮', 'France': '🇫🇷',
  'Germany': '🇩🇪', 'Ghana': '🇬🇭', 'Greece': '🇬🇷', 'Hungary': '🇭🇺',
  'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Iran': '🇮🇷', 'Iraq': '🇮🇶',
  'Ireland': '🇮🇪', 'Israel': '🇮🇱', 'Italy': '🇮🇹', 'Japan': '🇯🇵',
  'Jordan': '🇯🇴', 'Kenya': '🇰🇪', 'Kuwait': '🇰🇼', 'Lebanon': '🇱🇧',
  'Libya': '🇱🇾', 'Malaysia': '🇲🇾', 'Mexico': '🇲🇽', 'Morocco': '🇲🇦',
  'Netherlands': '🇳🇱', 'New Zealand': '🇳🇿', 'Nigeria': '🇳🇬', 'Norway': '🇳🇴',
  'Oman': '🇴🇲', 'Pakistan': '🇵🇰', 'Peru': '🇵🇪', 'Philippines': '🇵🇭',
  'Poland': '🇵🇱', 'Portugal': '🇵🇹', 'Qatar': '🇶🇦', 'Romania': '🇷🇴',
  'Russia': '🇷🇺', 'Saudi Arabia': '🇸🇦', 'Senegal': '🇸🇳', 'Singapore': '🇸🇬',
  'South Africa': '🇿🇦', 'South Korea': '🇰🇷', 'Spain': '🇪🇸', 'Sudan': '🇸🇩',
  'Sweden': '🇸🇪', 'Switzerland': '🇨🇭', 'Syria': '🇸🇾', 'Taiwan': '🇹🇼',
  'Tanzania': '🇹🇿', 'Thailand': '🇹🇭', 'Tunisia': '🇹🇳', 'Turkey': '🇹🇷',
  'UAE': '🇦🇪', 'Uganda': '🇺🇬', 'UK': '🇬🇧', 'Ukraine': '🇺🇦',
  'United Arab Emirates': '🇦🇪', 'United Kingdom': '🇬🇧', 'United States': '🇺🇸',
  'USA': '🇺🇸', 'Venezuela': '🇻🇪', 'Vietnam': '🇻🇳', 'Yemen': '🇾🇪',
  'Zimbabwe': '🇿🇼',
};

export const getCountryFlag = (country) => COUNTRY_FLAGS[country] || '🌍';
