// ─── Executive Analytics & Matchmaking Engine ────────────────────────────────
// Powering the Executive KPI Ribbon, Supply/Demand Matrix, Network Gaps & Match Radar

export const CAPABILITY_VERTICALS = [
  {
    id: 'capital',
    label: 'Funding & Investors',
    icon: '💰',
    keywords: [
      'fund',
      'invest',
      'capital',
      'angel',
      'vc',
      'venture',
      'seed',
      'series a',
      'grants',
      'تمويل',
      'مستثمر',
    ],
  },
  {
    id: 'tech_dev',
    label: 'Tech, AI & Co-Founders',
    icon: '💻',
    keywords: [
      'tech',
      'cto',
      'co-founder',
      'developer',
      'dev',
      'software',
      'ai',
      'ml',
      'full-stack',
      'app',
      'web',
      'devops',
      'برمجة',
      'شريك تقني',
      'تطوير',
    ],
  },
  {
    id: 'growth_marketing',
    label: 'Growth, Sales & Marketing',
    icon: '📈',
    keywords: [
      'market',
      'sale',
      'growth',
      'lead',
      'b2b',
      'seo',
      'customer acquisition',
      'brand',
      'ads',
      'تسويق',
      'مبيعات',
    ],
  },
  {
    id: 'ops_logistics',
    label: 'Operations & Supply Chain',
    icon: '📦',
    keywords: [
      'supply chain',
      'logistic',
      'operation',
      'manufactur',
      'shipping',
      'warehouse',
      'import',
      'export',
      'سلاسل إمداد',
      'شحن',
      'لوجستي',
    ],
  },
  {
    id: 'legal_finance',
    label: 'Legal, Tax & Structuring',
    icon: '⚖️',
    keywords: [
      'legal',
      'law',
      'contract',
      'tax',
      'account',
      'audit',
      'structure',
      'compliance',
      'قانوني',
      'محاسبة',
      'ضرائب',
    ],
  },
  {
    id: 'advisory_strategy',
    label: 'Mentorship & Strategy',
    icon: '🧭',
    keywords: [
      'mentor',
      'advisor',
      'strateg',
      'pitch',
      'board',
      'consult',
      'guidance',
      'استشارة',
      'إرشاد',
    ],
  },
  {
    id: 'talent_hiring',
    label: 'Hiring & Executive Talent',
    icon: '👥',
    keywords: [
      'hire',
      'hiring',
      'talent',
      'recruit',
      'designer',
      'product manager',
      'team',
      'توظيف',
      'فريق عمل',
    ],
  },
  {
    id: 'partnerships',
    label: 'B2B Distribution & Deals',
    icon: '🤝',
    keywords: [
      'partner',
      'distribution',
      'enterprise',
      'channel',
      'synergy',
      'b2b deal',
      'شراكة',
      'توزيع',
    ],
  },
];

/**
 * Categorize a text snippet (Need or Offer) into capability verticals
 */
export function categorizeText(text = '') {
  const lower = text.toLowerCase();
  const matched = [];
  for (const v of CAPABILITY_VERTICALS) {
    if (v.keywords.some((k) => lower.includes(k))) {
      matched.push(v.id);
    }
  }
  return matched;
}

/**
 * Calculate full executive intelligence dataset
 */
export function computeExecutiveAnalytics(members = []) {
  const total = members.length;
  if (total === 0) {
    return {
      total: 0,
      monthlyVelocity: 0,
      monthlyGrowthRate: 0,
      synergyIndex: 0,
      activeAsksCount: 0,
      activeOffersCount: 0,
      stageCounts: { idea: 0, starting: 0, running: 0, growing: 0 },
      stageRatios: '0 : 0 : 0 : 0',
      matrix: [],
      networkGaps: [],
      topDistricts: [],
      topIndustries: [],
      highIntentStream: [],
    };
  }

  // 1. Stage split & growth velocity
  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  let newLast30Days = 0;
  const stageCounts = { idea: 0, starting: 0, running: 0, growing: 0 };
  let activeAsksCount = 0;
  let activeOffersCount = 0;

  members.forEach((m) => {
    if (stageCounts[m.stage] !== undefined) stageCounts[m.stage]++;
    if (m.lookingFor && m.lookingFor.trim().length > 3) activeAsksCount++;
    if (m.canHelp && m.canHelp.trim().length > 3) activeOffersCount++;
    const created = new Date(m.createdAt).getTime();
    if (now - created <= thirtyDaysMs) newLast30Days++;
  });

  const monthlyGrowthRate =
    total > newLast30Days ? Math.round((newLast30Days / (total - newLast30Days)) * 100) : 100;

  const stageRatios = `${stageCounts.idea} : ${stageCounts.starting} : ${stageCounts.running} : ${stageCounts.growing}`;

  // 2. Supply vs. Demand Matrix across Capability Verticals
  const demandCounts = {};
  const supplyCounts = {};
  CAPABILITY_VERTICALS.forEach((v) => {
    demandCounts[v.id] = 0;
    supplyCounts[v.id] = 0;
  });

  members.forEach((m) => {
    const demVerts = categorizeText(`${m.lookingFor || ''} ${m.tags?.join(' ') || ''}`);
    const supVerts = categorizeText(`${m.canHelp || ''} ${m.role || ''} ${m.business || ''}`);

    demVerts.forEach((vId) => {
      if (demandCounts[vId] !== undefined) demandCounts[vId]++;
    });
    supVerts.forEach((vId) => {
      if (supplyCounts[vId] !== undefined) supplyCounts[vId]++;
    });
  });

  const matrix = CAPABILITY_VERTICALS.map((v) => {
    const demand = demandCounts[v.id] || 0;
    const supply = supplyCounts[v.id] || 0;
    const demandPct = activeAsksCount > 0 ? Math.round((demand / activeAsksCount) * 100) : 0;
    const supplyPct = activeOffersCount > 0 ? Math.round((supply / activeOffersCount) * 100) : 0;
    const gap = demand - supply;

    return {
      ...v,
      demand,
      supply,
      demandPct,
      supplyPct,
      gap,
      status: gap > 0 ? 'deficit' : gap < 0 ? 'surplus' : 'balanced',
    };
  }).sort((a, b) => b.demand - a.demand);

  // 3. Network Gap Identification (Actionable Intelligence Alerts)
  const networkGaps = [];
  matrix.forEach((item) => {
    if (item.demand >= 2 && item.supply === 0) {
      networkGaps.push({
        type: 'critical_deficit',
        severity: 'high',
        vertical: item.label,
        icon: item.icon,
        message: `Critical Gap: ${item.demand} founders seeking ${item.label}, but 0 community members currently offer this.`,
        action: 'Recruit/Invite advisors in this domain',
      });
    } else if (item.demand >= 3 && item.supply <= 2) {
      const deficitPct = Math.round(((item.demand - item.supply) / item.demand) * 100);
      networkGaps.push({
        type: 'high_deficit',
        severity: 'medium',
        vertical: item.label,
        icon: item.icon,
        message: `High Supply Deficit: ${item.demand} founders seeking ${item.label} with only ${item.supply} provider (${deficitPct}% shortage).`,
        action: 'Prioritize matchmaking for this vertical',
      });
    } else if (item.supply >= 4 && item.demand <= 1) {
      networkGaps.push({
        type: 'supply_surplus',
        severity: 'opportunity',
        vertical: item.label,
        icon: item.icon,
        message: `High Capability Surplus: ${item.supply} experts offering ${item.label} ready for immediate collaboration.`,
        action: 'Broadcast available expertise to community',
      });
    }
  });

  // 4. Synergy Index Calculation (% of members who have at least one complementary peer in network)
  let synergisticMembersCount = 0;
  members.forEach((memberA) => {
    const aLooking = (memberA.lookingFor || '').toLowerCase();
    const aOffers = (memberA.canHelp || '').toLowerCase();
    if (!aLooking && !aOffers) return;

    const hasSynergy = members.some((memberB) => {
      if (memberB.id === memberA.id) return false;
      const bOffers = (memberB.canHelp || '').toLowerCase();
      const bLooking = (memberB.lookingFor || '').toLowerCase();

      // Check if A's looking matches B's offers OR A's offers match B's looking
      const match1 =
        aLooking.length > 3 &&
        bOffers.length > 3 &&
        bOffers.split(' ').some((w) => w.length > 3 && aLooking.includes(w));
      const match2 =
        aOffers.length > 3 &&
        bLooking.length > 3 &&
        aOffers.split(' ').some((w) => w.length > 3 && bLooking.includes(w));
      return match1 || match2;
    });

    if (hasSynergy) synergisticMembersCount++;
  });

  const synergyIndex = total > 0 ? Math.round((synergisticMembersCount / total) * 100) : 0;

  // 5. Geographic Concentration (Districts / Hubs)
  const districtCounts = {};
  members.forEach((m) => {
    const loc = m.location || {};
    const district = loc.district || loc.city || loc.country || 'Unspecified';
    districtCounts[district] = (districtCounts[district] || 0) + 1;
  });

  const topDistricts = Object.entries(districtCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / total) * 100),
    }));

  // 6. Industry Clustering
  const industryCounts = {};
  members.forEach((m) => {
    (m.tags || []).forEach((t) => {
      industryCounts[t] = (industryCounts[t] || 0) + 1;
    });
  });

  const topIndustries = Object.entries(industryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / total) * 100),
    }));

  // 7. High-Intent "Need / Offer" Stream
  const highIntentStream = [];
  members.forEach((m) => {
    if (m.lookingFor && m.lookingFor.trim().length > 3) {
      highIntentStream.push({
        id: `need-${m.id}`,
        memberId: m.id,
        memberName: m.name,
        memberRole: m.role,
        memberStage: m.stage,
        memberLocation: m.location,
        type: 'need',
        text: m.lookingFor,
        verticals: categorizeText(m.lookingFor),
        createdAt: m.updatedAt || m.createdAt,
      });
    }
    if (m.canHelp && m.canHelp.trim().length > 3) {
      highIntentStream.push({
        id: `offer-${m.id}`,
        memberId: m.id,
        memberName: m.name,
        memberRole: m.role,
        memberStage: m.stage,
        memberLocation: m.location,
        type: 'offer',
        text: m.canHelp,
        verticals: categorizeText(m.canHelp),
        createdAt: m.updatedAt || m.createdAt,
      });
    }
  });

  highIntentStream.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return {
    total,
    monthlyVelocity: newLast30Days,
    monthlyGrowthRate,
    synergyIndex,
    activeAsksCount,
    activeOffersCount,
    stageCounts,
    stageRatios,
    matrix,
    networkGaps,
    topDistricts,
    topIndustries,
    highIntentStream,
  };
}

/**
 * Compute synergy match score between target member and candidate member (0 to 100%)
 */
export function computeMemberSynergy(targetMember, candidateMember) {
  if (!targetMember || !candidateMember || targetMember.id === candidateMember.id) return 0;

  let score = 20; // baseline compatibility

  // 1. Need <-> Offer Match (Highest weight: 45pts)
  const targetNeeds = (targetMember.lookingFor || '').toLowerCase();
  const candOffers = (candidateMember.canHelp || '').toLowerCase();
  const targetOffers = (targetMember.canHelp || '').toLowerCase();
  const candNeeds = (candidateMember.lookingFor || '').toLowerCase();

  const needOfferMatch1 =
    targetNeeds &&
    candOffers &&
    candOffers.split(' ').some((w) => w.length > 3 && targetNeeds.includes(w));
  const needOfferMatch2 =
    targetOffers &&
    candNeeds &&
    targetOffers.split(' ').some((w) => w.length > 3 && candNeeds.includes(w));

  if (needOfferMatch1 && needOfferMatch2) score += 45;
  else if (needOfferMatch1 || needOfferMatch2) score += 30;

  // 2. Shared Industry / Tag Synergy (20pts)
  const tTags = targetMember.tags || [];
  const cTags = candidateMember.tags || [];
  const sharedTags = tTags.filter((t) => cTags.includes(t));
  if (sharedTags.length >= 2) score += 20;
  else if (sharedTags.length === 1) score += 12;

  // 3. Location Proximity (10pts)
  const tLoc = targetMember.location || {};
  const cLoc = candidateMember.location || {};
  if (tLoc.city && cLoc.city && tLoc.city.toLowerCase() === cLoc.city.toLowerCase()) {
    score += 10;
  } else if (
    tLoc.country &&
    cLoc.country &&
    tLoc.country.toLowerCase() === cLoc.country.toLowerCase()
  ) {
    score += 5;
  }

  // 4. Complementary Stage bonus (5pts)
  if (
    (targetMember.stage === 'growing' &&
      (candidateMember.stage === 'starting' || candidateMember.stage === 'idea')) ||
    (candidateMember.stage === 'growing' &&
      (targetMember.stage === 'starting' || targetMember.stage === 'idea'))
  ) {
    score += 5;
  }

  return Math.min(99, Math.max(15, score));
}
