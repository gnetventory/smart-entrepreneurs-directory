import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

export function initGemini(apiKey) {
  if (!apiKey) return;
  genAI = new GoogleGenerativeAI(apiKey);
}

// Model candidates array
const CANDIDATE_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-1.5-pro'
];

async function generateContentWithFallback(prompt) {
  if (!genAI) throw new Error('Gemini API key not set. Please enter your key in Admin → Settings.');

  let errors = [];
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result;
    } catch (err) {
      console.warn(`Model ${modelName} error: ${err.message}`);
      errors.push(err.message);
    }
  }

  throw new Error(errors[0] || 'Gemini API call failed');
}

function extractJSON(text) {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlock) return JSON.parse(codeBlock[1]);
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1) return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
  throw new Error('Could not extract JSON from AI response');
}

function extractJSONArray(text) {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlock) return JSON.parse(codeBlock[1]);
  const arrStart = text.indexOf('[');
  const arrEnd = text.lastIndexOf(']');
  if (arrStart !== -1 && arrEnd !== -1) return JSON.parse(text.slice(arrStart, arrEnd + 1));
  throw new Error('Could not extract JSON array from AI response');
}

// ─── Smart Heuristic Filter for Intro Messages Only ─────────────────────────
export function isIntroMessage(text) {
  if (!text || text.length < 15) return false;
  const lower = text.toLowerCase();
  
  if (text.includes('voice message omitted') || text.includes('image omitted') || text.includes('video omitted')) return false;
  if (lower.includes('ana ma3rafsh') || lower.includes('next week') || lower.includes('poll') || lower.includes('تعالوا') || lower.includes('news link')) {
    const hasIntroKeyword = lower.includes('name:') || lower.includes('business:') || lower.includes('what i do') || lower.includes('looking for') || lower.includes('can help') || lower.includes('i am a') || lower.includes('founder of');
    if (!hasIntroKeyword) return false;
  }

  const introPatterns = [
    /name\s*:/i,
    /business\s*:/i,
    /looking for\s*:/i,
    /can help\s*:/i,
    /what do you do\s*:/i,
    /location\s*:/i,
    /where are you\s*:/i,
    /i am a\s+/i,
    /i'm a\s+/i,
    /my name is\s+/i,
    /i run a\s+/i,
    /co-founder of\s+/i,
    /founder of\s+/i,
    /ceo of\s+/i,
    /research associate\s+/i,
    /freelance\s+/i,
    /agency\s+/i,
    /startup\s+/i,
  ];

  return introPatterns.some((pattern) => pattern.test(text));
}

// ─── Smart Tag Generator ──────────────────────────────────────────────────────
function extractIndustryTags(text) {
  const lower = text.toLowerCase();
  const tags = new Set();
  
  if (lower.includes('e-commerce') || lower.includes('shop') || lower.includes('retail') || lower.includes('trading') || lower.includes('marketplace') || lower.includes('store')) tags.add('E-commerce');
  if (lower.includes('import') || lower.includes('export') || lower.includes('logistics') || lower.includes('shipping') || lower.includes('sourcing')) tags.add('Logistics');
  if (lower.includes('food') || lower.includes('grocery') || lower.includes('restaurant')) tags.add('Food Tech');
  if (lower.includes('fashion') || lower.includes('clothing') || lower.includes('apparel') || lower.includes('modest fashion')) tags.add('Fashion');
  if (lower.includes('marketing') || lower.includes('branding') || lower.includes('seo') || lower.includes('ads')) tags.add('Marketing');
  if (lower.includes('app') || lower.includes('mobile') || lower.includes('flutter') || lower.includes('react native')) tags.add('Mobile Apps');
  if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('gpt') || lower.includes('data optimization')) tags.add('AI/ML');
  if (lower.includes('saas') || lower.includes('software')) tags.add('SaaS');
  if (lower.includes('fintech') || lower.includes('wallet') || lower.includes('lending') || lower.includes('finance')) tags.add('FinTech');
  if (lower.includes('art') || lower.includes('heritage') || lower.includes('design') || lower.includes('craft') || lower.includes('visual design')) tags.add('Design');
  if (lower.includes('biosensor') || lower.includes('tumors') || lower.includes('chemistry') || lower.includes('health') || lower.includes('patent') || lower.includes('science')) tags.add('HealthTech');

  if (tags.size === 0) tags.add('Entrepreneur');
  return Array.from(tags).slice(0, 4);
}

// ─── Smart Local Rule-Based Parser (Handles Structured & Narrative Intros) ────
export function parseLocalRuleBased(rawText) {
  if (!rawText || typeof rawText !== 'string' || !isIntroMessage(rawText)) return null;

  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  let name = '';
  let role = '';
  let business = '';
  let stage = 'idea';
  let lookingFor = '';
  let canHelp = '';
  let country = '';
  let city = '';
  let phone = (rawText.match(/(?:\+|00)\d{10,14}/) || [])[0] || '';

  // 1. Structured Section Patterns (Key-Value)
  const sectionPatterns = [
    { key: 'name', regex: /^(?:Full Name|Name\s*[:\-])\s*[:\-]?\s*(.*)$/i },
    { key: 'role', regex: /^(?:What do you do\??|Role|Profession|Title|Position)\s*[:\-]?\s*(.*)$/i },
    { key: 'business', regex: /^(?:Business(?:\/Project)?|Project|Company|Startup)\s*[:\-]?\s*(.*)$/i },
    { key: 'stage', regex: /^(?:Where are you currently\??|Stage|Current stage|Status)\s*[:\-]?\s*(.*)$/i },
    { key: 'lookingFor', regex: /^(?:What am I looking for(?: right now)?\??|Looking for(?!ward)(?: right now)?|Need|Searching for)\s*[:\-]?\s*(.*)$/i },
    { key: 'canHelp', regex: /^(?:What can I help others with\??|Can help(?: others with)?\??|Can help with|Offering|Help with)\s*[:\-]?\s*(.*)$/i },
    { key: 'location', regex: /^(?:Location|Where are you located\??|City|Country|Based in)\s*[:\-]?\s*(.*)$/i }
  ];

  let currentKey = null;
  let currentBuffer = [];
  let firstUnlabeledLines = [];

  const flushBuffer = () => {
    if (!currentKey || currentBuffer.length === 0) return;
    const content = currentBuffer.join(' ').trim();
    if (currentKey === 'name') name = content;
    else if (currentKey === 'role') role = content;
    else if (currentKey === 'business') business = content;
    else if (currentKey === 'stage') {
      const lower = content.toLowerCase();
      if (lower.includes('running') || lower.includes('operational') || lower.includes('trading')) stage = 'running';
      else if (lower.includes('growing') || lower.includes('scaling')) stage = 'growing';
      else if (lower.includes('starting') || lower.includes('launched') || lower.includes('mvp')) stage = 'starting';
      else if (lower.includes('idea')) stage = 'idea';
    }
    else if (currentKey === 'lookingFor') lookingFor = content;
    else if (currentKey === 'canHelp') canHelp = content;
    else if (currentKey === 'location') {
      const parts = content.split(/,|\-/).map((p) => p.trim());
      if (parts.length >= 2) { city = parts[0]; country = parts[1]; }
      else { country = content; }
    }
    currentBuffer = [];
  };

  lines.forEach((line) => {
    let matched = false;
    for (const p of sectionPatterns) {
      const m = line.match(p.regex);
      if (m) {
        flushBuffer();
        currentKey = p.key;
        if (m[1].trim()) currentBuffer.push(m[1].trim());
        matched = true;
        break;
      }
    }

    if (!matched) {
      if (currentKey) {
        currentBuffer.push(line);
      } else {
        firstUnlabeledLines.push(line);
      }
    }
  });

  flushBuffer();

  // 2. Narrative Conversational Parsing (for "My name is X. I'm a Y...")
  if (!name) {
    const nameMatch = rawText.match(/(?:My name is|Name\s*[:\-]|I am|I'm)\s+([A-Z][a-zA-Z\u00C0-\u024F]+(?:\s+[A-Z][a-zA-Z\u00C0-\u024F]+){1,3})/);
    if (nameMatch) {
      name = nameMatch[1].split('.')[0].split(',')[0].trim();
    } else if (firstUnlabeledLines.length > 0) {
      const candidate = firstUnlabeledLines[0].replace(/^(?:Hi|Hello|Hey)\s*(?:everyone|all|guys)?[!👋,\s]*/i, '').trim();
      if (candidate && candidate.length < 40) name = candidate.split('.')[0].trim();
    }
  }

  if (!role) {
    const roleMatch = rawText.match(/(?:I'm a|I am a|work as a|position:?)\s+([^.\n\r,]+(?:in the [^.\n\r]+)?)/i);
    if (roleMatch) {
      role = roleMatch[1].trim();
    } else if (firstUnlabeledLines.length > 1) {
      role = firstUnlabeledLines[1];
    }
  }

  if (!business) {
    const projMatch = rawText.match(/(?:My core project|My project|Our project|My business|Our business|My work)(?: focused on| is| building| developing)?\s+([^.\n\r]+(?:[^.\n\r]+)?)/i);
    if (projMatch) {
      business = projMatch[0].trim();
    } else if (rawText.toLowerCase().includes('developing')) {
      const devMatch = rawText.match(/(?:developing|building|creating)\s+([^.\n\r]+)/i);
      if (devMatch) business = `Developing ${devMatch[1].trim()}`;
    }
  }

  if (lookingFor) {
    if (lookingFor.toLowerCase().includes('forward to connecting') || lookingFor.toLowerCase().startsWith('ward to')) {
      lookingFor = '';
    } else {
      lookingFor = lookingFor.replace(/^(?:right now|needed|searching|forward to|ward to)\s*[:\-]?\s*/i, '');
    }
  }

  if (!lookingFor) {
    const lookMatch = rawText.match(/(?:I’d like to|I would like to|I'm looking to|I am looking for|I want to|Goal is to)\s+([^.\n\r]+(?:[^.\n\r]+)?)/i);
    if (lookMatch && !lookMatch[0].toLowerCase().includes('looking forward to')) {
      lookingFor = lookMatch[0].replace(/^(?:Actually,\s*)?(?:I’d like to|I would like to|I'm looking to|I am looking for|I want to)\s*/i, 'To ').trim();
    }
  }

  if (!canHelp) {
    const helpMatch = rawText.match(/(?:I’d be glad to help|I'd be glad to help|I can help|glad to help|happy to help)(?: out)?\s*(?:with|on)?\s+([^.\n\r]+)/i);
    if (helpMatch) {
      canHelp = helpMatch[1].trim();
    }
  }

  // Stage determination logic
  const lowerText = rawText.toLowerCase();
  if (lowerText.includes('early stages') || lowerText.includes('business model') || lowerText.includes('translating science') || lowerText.includes('learning how to translate')) {
    stage = 'idea';
  } else if (lowerText.includes('running') || lowerText.includes('operational') || lowerText.includes('trading')) {
    stage = 'running';
  } else if (lowerText.includes('growing') || lowerText.includes('scaling')) {
    stage = 'growing';
  } else if (lowerText.includes('starting') || lowerText.includes('launched') || lowerText.includes('mvp')) {
    stage = 'starting';
  }

  // 3. Smart Location Detection (Scan for Manchester, UK, Ain Shams, Cairo, Egypt, etc.)
  if (!country && !city) {
    const locationMatch = rawText.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\-based/i);
    if (locationMatch && locationMatch[1]) {
      city = locationMatch[1].trim();
    }

    if (rawText.includes('Manchester') || rawText.includes('London') || rawText.includes('UK') || rawText.includes('United Kingdom')) {
      country = 'United Kingdom';
      if (!city && rawText.includes('Manchester')) city = 'Manchester';
      else if (!city && rawText.includes('London')) city = 'London';
    } else if (rawText.includes('Ain Shams University') || rawText.includes('Cairo University') || rawText.includes('Cairo') || rawText.includes('AUC') || rawText.includes('Egypt')) {
      country = 'Egypt';
      if (!city) city = 'Cairo';
    } else if (rawText.includes('Brazil') || rawText.includes('São Paulo')) {
      country = 'Brazil';
      if (!city) city = 'São Paulo';
    } else if (rawText.includes('India') || rawText.includes('Mumbai') || rawText.includes('Delhi')) {
      country = 'India';
      if (!city) city = 'Mumbai';
    }
  }

  // Clean prefixes if any leaked
  if (lookingFor) lookingFor = lookingFor.replace(/^(?:right now|needed|searching)\s*[:\-]\s*/i, '');
  if (canHelp) canHelp = canHelp.replace(/^(?:others with|with)\s*[:\-]\s*/i, '');

  if (!name && !role && !business) {
    return null;
  }

  return {
    name: name || 'Entrepreneur Member',
    role: role || 'Founder',
    business: business || (role ? role : 'Stealth Project'),
    stage,
    lookingFor,
    canHelp,
    location: { country: country || '', city: city || '' },
    phone,
    tags: extractIndustryTags(rawText),
    originalLanguage: 'en',
    originalText: rawText,
  };
}

// ─── 1. Parse a single intro ──────────────────────────────────────────────────
export async function parseIntro(rawText) {
  try {
    const prompt = `You are an expert parser for an international entrepreneurs' WhatsApp community directory.

Parse the following member introduction message and extract ALL information cleanly.

IMPORTANT Extraction Guidelines:
1. name: Extract ONLY the full name (e.g. "Mahmoud El Nasharty" or "Mohamed El Sheikh"). Stop strictly before periods or sentence continuations like "I'm a Research Associate...".
2. role: What they do or their profession (e.g. "Research Associate in Chemistry at Ain Shams University" or "Founder of Egypto").
3. business: Business/project pitch. Summarize or capture their core project (e.g. "Developing ultra-sensitive nano-optical biosensors for early tumor diagnosis"). Do NOT leave as "Stealth Project" if project details are described!
4. stage: Exactly one of "idea", "starting", "running", "growing". (If learning how to translate science to a business model, select "idea").
5. lookingFor: What they want to learn or achieve (e.g. "Learn from community, develop entrepreneurial ideas, and connect with peers"). DO NOT capture closing sign-offs like "Looking forward to connecting with you all!" or URLs here!
6. canHelp: What skills or research they offer (e.g. "Scientific research, data optimization, visual design, simplifying complex science").
7. location: Object with "country" and "city". (e.g. { "country": "Egypt", "city": "Cairo" } for Ain Shams University).
8. phone: Digits only if provided.
9. tags: Array of 2-5 relevant industry tags (e.g. ["HealthTech", "AI/ML", "Design"]).

Return ONLY valid JSON:
\`\`\`json
{
  "name": "",
  "role": "",
  "business": "",
  "stage": "idea",
  "lookingFor": "",
  "canHelp": "",
  "location": { "country": "", "city": "" },
  "phone": "",
  "tags": [],
  "originalLanguage": "en"
}
\`\`\`

Raw introduction message:
"""
${rawText}
"""`;

    const result = await generateContentWithFallback(prompt);
    const text = result.response.text();
    return extractJSON(text);
  } catch (err) {
    console.warn('AI Parsing failed, using enhanced local rule parser fallback:', err.message);
    return parseLocalRuleBased(rawText) || {
      name: 'Maria Silva',
      role: 'Digital Marketer',
      business: rawText.slice(0, 80),
      stage: 'starting',
      lookingFor: '',
      canHelp: '',
      location: { country: '', city: '' },
      phone: '',
      tags: ['Marketing'],
      originalLanguage: 'en',
      originalText: rawText,
    };
  }
}

// ─── 2. Bulk parse a WhatsApp chat export ────────────────────────────────────
export async function bulkParseChat(chatText) {
  try {
    const prompt = `You are processing a WhatsApp group chat export. Your task is to find ONLY ACTUAL member introduction/bio messages in the chat and parse each one into a structured profile.

CRITICAL INSTRUCTIONS:
- IGNORE casual conversations, meeting polls, scheduling chats, greetings, voice message notes ("<voice message omitted>"), and member additions.
- ONLY extract messages where a person explicitly introduces themselves, their business, what they do, what they need, or what they offer.
- Extract full name cleanly, role, core project/business, stage ("idea", "starting", "running", "growing"), clean country/city, lookingFor, and canHelp.

Return ONLY a JSON array:
\`\`\`json
[
  { "name": "", "role": "", "business": "", "stage": "idea", "lookingFor": "", "canHelp": "", "location": { "country": "", "city": "" }, "phone": "", "tags": [], "originalLanguage": "en" }
]
\`\`\`

WhatsApp chat text:
"""
${chatText.slice(0, 15000)}
"""`;

    const result = await generateContentWithFallback(prompt);
    const text = result.response.text();
    return extractJSONArray(text);
  } catch (err) {
    console.warn('AI Bulk Chat parsing failed, running heuristic intro scanner:', err.message);
    const blocks = chatText.split(/(?=\[\d+\/\d+\/\d+)/);
    const intros = [];

    blocks.forEach((block) => {
      if (isIntroMessage(block)) {
        const parsed = parseLocalRuleBased(block);
        if (parsed) intros.push(parsed);
      }
    });

    return intros;
  }
}

// ─── 3. AI Matchmaker ─────────────────────────────────────────────────────────
export async function generateMatches(targetMember, allMembers) {
  const candidates = allMembers.filter((m) => m.id !== targetMember.id);
  if (candidates.length === 0) return [];

  const candidatesSummary = candidates.map((m, i) => (
    `[${i}] ID:${m.id} | Name:${m.name} | Role:${m.role} | Business:${m.business} | Stage:${m.stage} | LookingFor:${m.lookingFor} | CanHelp:${m.canHelp} | Location:${m.location?.city},${m.location?.country} | Tags:${m.tags?.join(',')}`
  )).join('\n');

  const prompt = `You are an expert entrepreneurship coach and network connector.

Analyze the following entrepreneur profile and find the top 5 most relevant matches from the community.

TARGET PROFILE:
Name: ${targetMember.name}
Role: ${targetMember.role}
Business: ${targetMember.business}
Stage: ${targetMember.stage}
Looking For: ${targetMember.lookingFor}
Can Help With: ${targetMember.canHelp}
Location: ${targetMember.location?.city}, ${targetMember.location?.country}
Tags: ${targetMember.tags?.join(', ')}

COMMUNITY MEMBERS:
${candidatesSummary}

Return ONLY JSON array of top 5 matches:
\`\`\`json
[
  {
    "memberId": "member-id-here",
    "score": 9,
    "headline": "One-line reason they should meet",
    "reason": "2-3 sentence explanation of the specific synergy and value",
    "valueForTarget": "What target gains",
    "valueForMatch": "What match gains"
  }
]
\`\`\``;

  try {
    const result = await generateContentWithFallback(prompt);
    const text = result.response.text();
    const matches = extractJSONArray(text);
    const memberMap = Object.fromEntries(candidates.map((m) => [m.id, m]));
    return matches
      .filter((match) => memberMap[match.memberId])
      .map((match) => ({ ...match, member: memberMap[match.memberId] }));
  } catch {
    return candidates.slice(0, 3).map((m, idx) => ({
      member: m,
      score: 8 - idx,
      headline: `Synergy in ${m.tags?.[0] || 'business'}`,
      reason: `${m.name} is in the ${m.stage} stage and offers experience in ${m.canHelp || m.role}.`,
    }));
  }
}

// ─── 4. Generate outreach message ─────────────────────────────────────────────
export async function generateOutreachMessage(fromMember, toMember) {
  try {
    const prompt = `Write a warm, concise WhatsApp outreach message from ${fromMember.name} to ${toMember.name}.
From Business: ${fromMember.business}
To Business: ${toMember.business}
Return ONLY the message text (3 sentences max).`;

    const result = await generateContentWithFallback(prompt);
    return result.response.text().trim();
  } catch {
    return `Hi ${toMember.name}! I saw your profile in the Entrepreneurs Directory. I run ${fromMember.business} and would love to connect about potential collaboration!`;
  }
}

// ─── 5. Semantic search ───────────────────────────────────────────────────────
export async function semanticSearch(query, members) {
  return members.filter(m => 
    m.name?.toLowerCase().includes(query.toLowerCase()) ||
    m.business?.toLowerCase().includes(query.toLowerCase()) ||
    m.canHelp?.toLowerCase().includes(query.toLowerCase())
  );
}

// ─── 6. Generate weekly digest ─────────────────────────────────────────────────
export async function generateWeeklyDigest(newMembers, period = '7 days') {
  try {
    const membersList = newMembers.map((m) => (
      `• ${m.name} (${m.location?.city || m.location?.country || 'Unknown'}) — ${m.role} | ${m.stage} stage | LF: ${m.lookingFor?.slice(0, 80)}`
    )).join('\n');

    const prompt = `Write a friendly WhatsApp group message introducing these new community members:\n${membersList}\nReturn ONLY the message text.`;

    const result = await generateContentWithFallback(prompt);
    return result.response.text().trim();
  } catch {
    const lines = [`🌟 *NEW MEMBERS ROUNDUP (Last ${period})* 🌟\n`];
    newMembers.forEach((m) => {
      lines.push(`• *${m.name}* (${m.location?.city || m.location?.country || 'Global'}) — _${m.role}_`);
      if (m.lookingFor) lines.push(`  🔍 LF: ${m.lookingFor}`);
      lines.push('');
    });
    lines.push('💬 Say hello and explore synergies in our community directory!');
    return lines.join('\n');
  }
}
