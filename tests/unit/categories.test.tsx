// =============================================================================
// YYC3-Learning-Platform — Categories & Constants Tests
// =============================================================================
// Tests the CATEGORY_TITLES constant and CategoryKey type.
// =============================================================================

import { describe, it, expect } from 'vitest';
import { CATEGORY_TITLES, type CategoryKey } from '../../constants/categories';

describe('CATEGORY_TITLES', () => {
  it('should contain all expected category keys', () => {
    const expectedKeys: CategoryKey[] = [
      'dashboard',
      'live',
      'discussion',
      'ecom',
      'seo',
      'ia',
      'branding',
      'copywriting',
      'analytics',
      'ads',
      'services',
      'certificates',
    ];

    for (const key of expectedKeys) {
      expect(CATEGORY_TITLES).toHaveProperty(key);
    }
  });

  it('should have non-empty string values for all entries', () => {
    Object.entries(CATEGORY_TITLES).forEach(([key, value]) => {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should have exactly 12 categories', () => {
    expect(Object.keys(CATEGORY_TITLES)).toHaveLength(12);
  });

  it('should include certificates (Phase 2 addition)', () => {
    expect(CATEGORY_TITLES.certificates).toBe('Certificats');
  });

  it('should use consistent naming convention', () => {
    // All keys should be lowercase
    Object.keys(CATEGORY_TITLES).forEach(key => {
      expect(key).toBe(key.toLowerCase());
    });
  });
});
