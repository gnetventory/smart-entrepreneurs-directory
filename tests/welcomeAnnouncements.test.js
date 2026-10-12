import { describe, it, expect } from 'vitest';
import {
  isRecentlyJoined,
  getRecentMembers,
  cleanPhoneNumber,
  getWhatsAppGroupShareUrl,
  getWhatsAppDirectChatUrl,
  getMemberWelcomeIcebreakerUrl,
  generateWelcomeAnnouncement,
  generateDirectWelcome,
} from '../src/utils/welcomeAnnouncements';

describe('welcomeAnnouncements utility tests', () => {
  const mockMember = {
    id: 'mem-101',
    name: 'Mohamed Moselhy (محمد مصيلحي)',
    role: 'Managing Partner',
    business: 'Phoenix Growth Partners',
    stage: 'scaling',
    location: { city: 'Cairo', country: 'Egypt' },
    lookingFor: 'Strategic partnerships and commercial clients',
    canHelp: 'Business development, scaling strategy, investment readiness',
    phone: '+20 100 123 4567',
    linkedin: 'https://linkedin.com/in/moselhy',
    website: 'https://phoenixgrowth.agency',
    tags: ['Consulting', 'Growth', 'Business Development'],
    createdAt: new Date().toISOString(),
  };

  describe('isRecentlyJoined', () => {
    it('returns true for member created today', () => {
      expect(isRecentlyJoined({ createdAt: new Date().toISOString() })).toBe(true);
    });

    it('returns false for member created 30 days ago', () => {
      const past = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      expect(isRecentlyJoined({ createdAt: past }, 14)).toBe(false);
    });

    it('returns false for member without createdAt', () => {
      expect(isRecentlyJoined({})).toBe(false);
      expect(isRecentlyJoined(null)).toBe(false);
    });
  });

  describe('cleanPhoneNumber', () => {
    it('cleans Egyptian local phone starting with 01', () => {
      expect(cleanPhoneNumber('01001234567')).toBe('201001234567');
    });

    it('cleans international phone with spaces and dashes', () => {
      expect(cleanPhoneNumber('+20 100-123-4567')).toBe('201001234567');
    });

    it('handles empty input gracefully', () => {
      expect(cleanPhoneNumber('')).toBe('');
      expect(cleanPhoneNumber(null)).toBe('');
    });
  });

  describe('WhatsApp URL builders', () => {
    it('generates valid WhatsApp group share link', () => {
      const url = getWhatsAppGroupShareUrl('Hello World!');
      expect(url).toBe('https://api.whatsapp.com/send?text=Hello%20World!');
    });

    it('generates valid WhatsApp direct chat link with phone', () => {
      const url = getWhatsAppDirectChatUrl('+20 100 123 4567', 'Welcome!');
      expect(url).toContain('https://api.whatsapp.com/send?phone=201001234567');
      expect(url).toContain('text=Welcome!');
    });

    it('generates personalized 1-click peer welcome icebreaker', () => {
      const url = getMemberWelcomeIcebreakerUrl(mockMember);
      expect(url).toContain('https://api.whatsapp.com/send?phone=201001234567');
      expect(url).toContain(encodeURIComponent('محمد'));
      expect(url).toContain(encodeURIComponent('Phoenix Growth Partners'));
    });
  });

  describe('generateWelcomeAnnouncement', () => {
    it('generates Egyptian Arabic founder announcement by default', () => {
      const text = generateWelcomeAnnouncement(mockMember, { tone: 'egyptian' });
      expect(text).toContain('رحّبوا معانا بإنضمام عضو جديد لمجتمع BGM');
      expect(text).toContain('Phoenix Growth Partners');
      expect(text).toContain('Managing Partner');
      expect(text).toContain('Cairo');
      expect(text).toContain('محتاج / بيدوّر على');
      expect(text).toContain('يقدر يفيد المجتمع في');
      expect(text).toContain('?member=mem-101');
    });

    it('generates English announcement when tone is english', () => {
      const text = generateWelcomeAnnouncement(mockMember, { tone: 'english' });
      expect(text).toContain('WELCOME NEW BGM COMMUNITY MEMBER');
      expect(text).toContain('Phoenix Growth Partners');
      expect(text).toContain('Role:');
      expect(text).toContain('Currently Looking For:');
      expect(text).toContain('Smart Directory Card:');
    });

    it('generates Formal Arabic announcement when tone is arabic', () => {
      const text = generateWelcomeAnnouncement(mockMember, { tone: 'arabic' });
      expect(text).toContain('إعلان انضمام عضو جديد إلى مجتمع رواد الأعمال BGM');
      expect(text).toContain('يبحث حالياً عن:');
      expect(text).toContain('يمكنه تقديم المساعدة في:');
    });

    it('incorporates custom AI hook when provided', () => {
      const customHook = 'Specialist in scaling enterprise revenue models across MENA.';
      const text = generateWelcomeAnnouncement(mockMember, {
        tone: 'english',
        customHook,
      });
      expect(text).toContain(customHook);
    });
  });

  describe('generateDirectWelcome', () => {
    it('generates Egyptian direct welcome message to the founder', () => {
      const msg = generateDirectWelcome(mockMember, { tone: 'egyptian' });
      expect(msg).toContain('منور مجتمع رواد الأعمال BGM');
      expect(msg).toContain('?member=mem-101');
    });

    it('generates English direct welcome message to the founder', () => {
      const msg = generateDirectWelcome(mockMember, { tone: 'english' });
      expect(msg).toContain('Welcome to the BGM Entrepreneurs Community');
      expect(msg).toContain('?member=mem-101');
    });
  });

  describe('getRecentMembers', () => {
    it('returns filtered active recent members', () => {
      const list = [
        { id: '1', name: 'A', status: 'active', createdAt: new Date().toISOString() },
        { id: '2', name: 'B', status: 'active', createdAt: new Date().toISOString() },
        { id: '3', name: 'C', status: 'pending', createdAt: new Date().toISOString() },
        { id: '4', name: 'D', status: 'rejected', createdAt: new Date().toISOString() },
      ];
      const recent = getRecentMembers(list, 14, 5);
      expect(recent.length).toBe(2);
      expect(recent.map((m) => m.id)).toEqual(['1', '2']);
    });
  });
});
