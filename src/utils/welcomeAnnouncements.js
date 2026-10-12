import { STAGES, getCountryFlag } from './constants';
import { getMemberWebsites, parseMemberName } from './helpers';

const DEFAULT_APP_URL = 'https://smart-entrepreneurs-directory.vercel.app';

/**
 * Checks if a member joined within the last N days.
 * @param {Object} member
 * @param {number} days
 * @returns {boolean}
 */
export function isRecentlyJoined(member, days = 14) {
  if (!member || !member.createdAt) return false;
  try {
    const createdDate = new Date(member.createdAt);
    if (isNaN(createdDate.getTime())) return false;
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= days;
  } catch {
    return false;
  }
}

/**
 * Retrieves the newest members from the directory.
 * If fewer than minCount have recent createdAt stamps, falls back to the top items.
 * @param {Array} members
 * @param {number} days
 * @param {number} limit
 * @returns {Array}
 */
export function getRecentMembers(members, days = 14, limit = 6) {
  if (!Array.isArray(members) || members.length === 0) return [];
  
  const activeMembers = members.filter(
    (m) => m && m.status !== 'rejected' && m.status !== 'pending'
  );

  const recentlyJoined = activeMembers.filter((m) => isRecentlyJoined(m, days));
  if (recentlyJoined.length >= 2) {
    return recentlyJoined.slice(0, limit);
  }

  // Graceful fallback: return the top members in the list (newest first)
  return activeMembers.slice(0, limit);
}

/**
 * Cleans a phone number for WhatsApp deep link.
 * @param {string} phone
 * @returns {string}
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[^\d+]/g, '');
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.slice(2);
  }
  // If Egyptian local number starting with 01
  if (cleaned.startsWith('01') && cleaned.length === 11) {
    cleaned = '+20' + cleaned.slice(1);
  }
  return cleaned.replace('+', '');
}

/**
 * WhatsApp group/contact picker share URL.
 * @param {string} text
 * @returns {string}
 */
export function getWhatsAppGroupShareUrl(text) {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text || '')}`;
}

/**
 * Direct 1-on-1 WhatsApp chat URL.
 * @param {string} phone
 * @param {string} text
 * @returns {string}
 */
export function getWhatsAppDirectChatUrl(phone, text) {
  const cleaned = cleanPhoneNumber(phone);
  if (!cleaned) {
    return getWhatsAppGroupShareUrl(text);
  }
  return `https://api.whatsapp.com/send?phone=${encodeURIComponent(cleaned)}&text=${encodeURIComponent(text || '')}`;
}

/**
 * Builds a public 1-click WhatsApp icebreaker for community members to welcome a new founder.
 * @param {Object} member
 * @returns {string}
 */
export function getMemberWelcomeIcebreakerUrl(member) {
  if (!member) return '';
  const { arabic, primary } = parseMemberName(member.name);
  const firstName = (arabic || primary || member.name || 'Founder').split(' ')[0];
  const venture = member.business ? ` (${member.business})` : '';

  const message = `أهلاً يا ${firstName}! 👋 شفت بروفايلك في الـ Smart Directory وحبيت أرحب بيك في مجتمع رواد الأعمال BGM${venture}. بالتوفيق ومنور الجروب! 🚀`;
  return getWhatsAppDirectChatUrl(member.phone, message);
}

/**
 * Deterministically generates a community welcome announcement for WhatsApp.
 * @param {Object} member
 * @param {Object} options
 * @returns {string}
 */
export function generateWelcomeAnnouncement(
  member,
  { tone = 'egyptian', customHook = '', appUrl = DEFAULT_APP_URL } = {}
) {
  if (!member) return '';

  const { english, arabic, primary } = parseMemberName(member.name);
  const displayName = english && arabic ? `${english} (${arabic})` : primary || member.name;
  const role = member.role || 'Founder & Entrepreneur';
  const business = member.business || 'Business Venture';
  const stageObj = STAGES[member.stage] || STAGES.starting || { label: 'Active', icon: '🚀' };
  const stageLabel = `${stageObj.icon || '🚀'} ${stageObj.label || 'Active'}`;

  const city = member.location?.city || '';
  const country = member.location?.country || 'Egypt';
  const flag = getCountryFlag(country);
  const locationLabel = [city, country].filter(Boolean).join(', ');

  const tags = Array.isArray(member.tags) && member.tags.length > 0
    ? member.tags.map((t) => `#${t.replace(/\s+/g, '_')}`).join(' ')
    : '';

  const profileUrl = `${appUrl.replace(/\/$/, '')}/?member=${encodeURIComponent(member.id || '')}`;
  const websites = getMemberWebsites(member);
  const websiteLines = websites
    .map((w) => `🌐 ${w.label}: ${w.url}`)
    .join('\n');

  if (tone === 'english') {
    const hookSection = customHook ? `\n💡 *Community Highlight:* ${customHook}\n` : '';
    const needsSection = member.lookingFor ? `\n🎯 *Currently Looking For:* ${member.lookingFor}` : '';
    const offersSection = member.canHelp ? `\n💡 *Can Help With:* ${member.canHelp}` : '';
    const webSection = websiteLines ? `\n${websiteLines}` : '';
    const tagsSection = tags ? `\n🏷️ ${tags}` : '';

    return (
`🌟 *WELCOME NEW BGM COMMUNITY MEMBER!* 🚀

Please give a warm welcome to *${displayName}*! 👏
💼 *Role:* ${role}
🏢 *Venture:* ${business}
📊 *Stage:* ${stageLabel}
📍 *Location:* ${flag} ${locationLabel}
${hookSection}${needsSection}${offersSection}${tagsSection}${webSection}
🔗 *Smart Directory Card:* ${profileUrl}

🤝 *Connect with ${primary.split(' ')[0]}:* If you share synergies or want to collaborate, feel free to reach out and say hello!`
    ).trim();
  }

  if (tone === 'arabic') {
    const hookSection = customHook ? `\n💡 *إضاءة خاصة:* ${customHook}\n` : '';
    const needsSection = member.lookingFor ? `\n🎯 *يبحث حالياً عن:* ${member.lookingFor}` : '';
    const offersSection = member.canHelp ? `\n💡 *يمكنه تقديم المساعدة في:* ${member.canHelp}` : '';
    const webSection = websiteLines ? `\n${websiteLines}` : '';
    const tagsSection = tags ? `\n🏷️ *المجالات:* ${tags}` : '';

    return (
`🌟 *إعلان انضمام عضو جديد إلى مجتمع رواد الأعمال BGM* 🚀

يسعدنا أن نرحب بالزميل/ة *${displayName}*! 👏
💼 *المسمى المهني:* ${role}
🏢 *المشروع / الشركة:* ${business}
📊 *مرحلة المشروع:* ${stageLabel}
📍 *المقر:* ${flag} ${locationLabel}
${hookSection}${needsSection}${offersSection}${tagsSection}${webSection}
🔗 *رابط بطاقة العضوية في المنصة:* ${profileUrl}

🤝 *فرص التواصل والتعاون:* نرجو من الزملاء الترحيب به واستكشاف سبل التعاون المشترك.`
    ).trim();
  }

  // Default: Egyptian Founder Tone (اللهجة المصرية الودودة)
  const hookSection = customHook ? `\n💡 *نبذة وسينرجي سريع:* ${customHook}\n` : '';
  const needsSection = member.lookingFor ? `\n🎯 *محتاج / بيدوّر على:* ${member.lookingFor}` : '';
  const offersSection = member.canHelp ? `\n💡 *يقدر يفيد المجتمع في:* ${member.canHelp}` : '';
  const webSection = websiteLines ? `\n${websiteLines}` : '';
  const tagsSection = tags ? `\n🏷️ ${tags}` : '';

  return (
`🌟 *رحّبوا معانا بإنضمام عضو جديد لمجتمع BGM!* 🚀

يسعدنا نرحب بـ *${displayName}* 👏
💼 *الدور المهني:* ${role}
🏢 *البيزنس / المشروع:* ${business}
📊 *المرحلة:* ${stageLabel}
📍 *المكان:* ${flag} ${locationLabel}
${hookSection}${needsSection}${offersSection}${tagsSection}${webSection}
🔗 *كارت العضوية في الدايركتوري:* ${profileUrl}

🤝 لو شغال في نفس المجال أو شايف فرصة تعاون، ابعتله رحّب بيه وتواصل معاه مباشرة! بالتوفيق للجميع ✨`
  ).trim();
}

/**
 * Generates a direct 1-on-1 welcome message to the new member.
 * @param {Object} member
 * @param {Object} options
 * @returns {string}
 */
export function generateDirectWelcome(
  member,
  { tone = 'egyptian', appUrl = DEFAULT_APP_URL } = {}
) {
  if (!member) return '';
  const { primary } = parseMemberName(member.name);
  const firstName = (primary || member.name || 'Founder').split(' ')[0];
  const profileUrl = `${appUrl.replace(/\/$/, '')}/?member=${encodeURIComponent(member.id || '')}`;

  if (tone === 'english') {
    return (
`Hi ${firstName}! 👋

Welcome to the BGM Entrepreneurs Community! 🌟
Your profile has been published to the Smart Directory:
🔗 ${profileUrl}

Feel free to check out other founders, download your digital vCard, and engage with the group. Glad to have you with us! 🚀`
    ).trim();
  }

  return (
`أهلاً يا ${firstName}! 👋

منور مجتمع رواد الأعمال BGM! 🌟
تم اعتماد ونشر كارت عضويتك في الـ Smart Directory:
🔗 ${profileUrl}

تقدر تشوف باقي أعضاء المجتمع وتحمّل كارتك الرقمي في أي وقت. بالتوفيق ومنورنا جداً! 🚀`
  ).trim();
}
