import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn() utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-4', 'py-2');
    expect(result).toBe('px-4 py-2');
  });

  it('should handle conditional class names', () => {
    const result = cn('base', true && 'conditional', false && 'skipped');
    expect(result).toBe('base conditional');
  });

  it('should merge Tailwind classes and resolve conflicts', () => {
    // twMerge should resolve conflicting Tailwind classes
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4'); // px-4 should override px-2
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle arrays of class names', () => {
    const result = cn(['px-4', 'py-2'], 'bg-red-500');
    expect(result).toBe('px-4 py-2 bg-red-500');
  });

  it('should handle objects with conditional classes', () => {
    const result = cn({
      'px-4': true,
      'py-2': true,
      'hidden': false,
    });
    expect(result).toBe('px-4 py-2');
  });

  it('should handle mixed inputs (strings, arrays, objects)', () => {
    const result = cn(
      'base-class',
      ['array-class-1', 'array-class-2'],
      { 'object-class': true, 'skipped-class': false },
      undefined,
      null
    );
    expect(result).toBe('base-class array-class-1 array-class-2 object-class');
  });

  it('should deduplicate identical classes', () => {
    const result = cn('px-4', 'py-2', 'px-4');
    // twMerge deduplicates but may reorder classes
    expect(result).toContain('px-4');
    expect(result).toContain('py-2');
    expect(result.split(' ').filter(c => c === 'px-4').length).toBe(1);
  });
});
