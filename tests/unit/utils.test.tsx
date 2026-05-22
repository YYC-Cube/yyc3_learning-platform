// =============================================================================
// YYC3-Learning-Platform — Utility Function Tests
// =============================================================================
// Tests the cn() class merging utility (clsx + tailwind-merge).
// =============================================================================

import { describe, it, expect } from 'vitest';
import { cn } from '../../components/ui/utils';

describe('cn() — Tailwind Class Merge Utility', () => {
  // ─── Basic Merging ────────────────────────────────────────────────────

  it('should merge simple class names', () => {
    const result = cn('px-4', 'py-2');
    expect(result).toContain('px-4');
    expect(result).toContain('py-2');
  });

  it('should handle single class name', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
    expect(cn(undefined)).toBe('');
    expect(cn(null)).toBe('');
  });

  // ─── Tailwind Conflict Resolution ─────────────────────────────────────

  it('should resolve conflicting Tailwind classes (last wins)', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).not.toContain('text-red-500');
    expect(result).toContain('text-blue-500');
  });

  it('should resolve padding conflicts', () => {
    const result = cn('px-4', 'px-8');
    expect(result).not.toContain('px-4');
    expect(result).toContain('px-8');
  });

  it('should resolve margin conflicts', () => {
    const result = cn('mt-2', 'mt-6');
    expect(result).toContain('mt-6');
    expect(result).not.toContain('mt-2');
  });

  // ─── Conditional Classes (clsx behavior) ──────────────────────────────

  it('should handle conditional class objects', () => {
    const isActive = true;
    const result = cn('base-class', { 'bg-blue-500': isActive, 'bg-gray-500': !isActive });
    expect(result).toContain('base-class');
    expect(result).toContain('bg-blue-500');
    expect(result).not.toContain('bg-gray-500');
  });

  it('should handle false conditions', () => {
    const result = cn('base', { 'hidden': false, 'visible': true });
    expect(result).toContain('base');
    expect(result).toContain('visible');
    expect(result).not.toContain('hidden');
  });

  // ─── Array Inputs ────────────────────────────────────────────────────

  it('should handle array inputs', () => {
    const result = cn(['px-4', 'py-2'], 'text-white');
    expect(result).toContain('px-4');
    expect(result).toContain('py-2');
    expect(result).toContain('text-white');
  });

  // ─── Deep Sea Blue Theme Classes ─────────────────────────────────────

  it('should handle platform-specific deep sea blue theme classes', () => {
    const result = cn(
      'bg-[#020617]',
      'border-blue-500/30',
      'shadow-[0_0_15px_rgba(59,130,246,0.1)]',
      'text-blue-400'
    );
    expect(result).toContain('bg-[#020617]');
    expect(result).toContain('text-blue-400');
  });

  // ─── Glassmorphism Classes ────────────────────────────────────────────

  it('should handle backdrop-blur and opacity classes', () => {
    const result = cn('backdrop-blur-xl', 'bg-white/5', 'border', 'border-white/10');
    expect(result).toContain('backdrop-blur-xl');
    expect(result).toContain('bg-white/5');
  });

  // ─── Responsive Prefixes ──────────────────────────────────────────────

  it('should preserve responsive prefixes', () => {
    const result = cn('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    expect(result).toContain('grid-cols-1');
    expect(result).toContain('md:grid-cols-2');
    expect(result).toContain('lg:grid-cols-3');
  });

  // ─── Edge Cases ───────────────────────────────────────────────────────

  it('should handle multiple undefined/null values mixed with valid classes', () => {
    const result = cn(undefined, 'px-4', null, 'py-2', false, 'text-white');
    expect(result).toBe('px-4 py-2 text-white');
  });

  it('should handle deeply nested conditionals', () => {
    const variant = 'primary' as string;
    const result = cn(
      'base',
      variant === 'primary' && 'bg-blue-500',
      variant === 'secondary' && 'bg-gray-500',
      variant === 'danger' && 'bg-red-500'
    );
    expect(result).toContain('bg-blue-500');
    expect(result).not.toContain('bg-gray-500');
    expect(result).not.toContain('bg-red-500');
  });
});
