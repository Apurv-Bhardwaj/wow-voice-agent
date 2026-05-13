import { describe, it, expect } from 'vitest';
import { isValidIndianPhone } from '../validation';

describe('isValidIndianPhone', () => {
  it('accepts a valid +91 number starting with 9', () => {
    expect(isValidIndianPhone('+919876543210')).toBe(true);
  });

  it('accepts a valid +91 number starting with 8', () => {
    expect(isValidIndianPhone('+918765432109')).toBe(true);
  });

  it('accepts a valid +91 number starting with 6', () => {
    expect(isValidIndianPhone('+916234567890')).toBe(true);
  });

  it('rejects number without +91 prefix', () => {
    expect(isValidIndianPhone('9876543210')).toBe(false);
  });

  it('rejects number with only +91 and 9 digits', () => {
    expect(isValidIndianPhone('+91987654321')).toBe(false);
  });

  it('rejects number starting with digit 5 after +91', () => {
    expect(isValidIndianPhone('+915876543210')).toBe(false);
  });

  it('rejects number starting with digit 0 after +91', () => {
    expect(isValidIndianPhone('+910876543210')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidIndianPhone('')).toBe(false);
  });
});
