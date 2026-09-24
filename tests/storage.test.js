import { describe, it, expect, beforeEach } from 'vitest';
import {
  getMembers,
  saveMembers,
  addMember,
  addMembers,
  updateMember,
  deleteMember,
  clearAllData,
  getExchangePosts,
  addExchangePost,
} from '../src/utils/storage';

describe('storage.js unit tests', () => {
  beforeEach(() => {
    localStorage.clear();
    clearAllData();
  });

  it('getMembers initializes with seed members if empty', () => {
    const members = getMembers();
    expect(members.length).toBeGreaterThan(0);
  });

  it('addMember inserts new member at the top', () => {
    const newMember = { name: 'Test User', role: 'Tester', business: 'Test Co' };
    const added = addMember(newMember);
    expect(added.id).toBeDefined();
    expect(getMembers()[0].name).toBe('Test User');
  });

  it('addMembers deduplicates members by name', () => {
    saveMembers([{ id: '1', name: 'Existing Member' }]);
    const batch = [
      { name: 'Existing Member', role: 'Duplicate' },
      { name: 'Unique Member', role: 'New' },
    ];
    const added = addMembers(batch);
    expect(added.length).toBe(1);
    expect(added[0].name).toBe('Unique Member');
  });

  it('updateMember modifies member correctly', () => {
    const added = addMember({ name: 'Update Target', role: 'Old Role' });
    const updated = updateMember(added.id, { role: 'New Role' });
    expect(updated.role).toBe('New Role');
  });

  it('deleteMember removes member correctly', () => {
    const added = addMember({ name: 'Delete Target' });
    deleteMember(added.id);
    const members = getMembers();
    expect(members.find((m) => m.id === added.id)).toBeUndefined();
  });

  it('addExchangePost adds post with 30-day expiry', () => {
    const post = addExchangePost({ type: 'need', title: 'Need React Dev', contact: '12345' });
    expect(post.expiresAt).toBeDefined();
    expect(new Date(post.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });
});
