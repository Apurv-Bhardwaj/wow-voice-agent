import { describe, it, expect } from 'vitest';
import { detectCtaOutcome } from '../cta';

describe('detectCtaOutcome', () => {
  it('returns follow_up_booked when lead agrees to speak with property expert', () => {
    const result = detectCtaOutcome([{ role: 'user', content: 'yes connect me with a property expert' }]);
    expect(result).toBe('follow_up_booked');
  });

  it('returns follow_up_booked when lead gives a time preference', () => {
    const result = detectCtaOutcome([{ role: 'user', content: 'morning works for me' }]);
    expect(result).toBe('follow_up_booked');
  });

  it('returns follow_up_booked when lead says afternoon', () => {
    const result = detectCtaOutcome([{ role: 'user', content: 'call me in the afternoon' }]);
    expect(result).toBe('follow_up_booked');
  });

  it('returns follow_up_booked when follow keyword present', () => {
    const result = detectCtaOutcome([{ role: 'assistant', content: 'I will have someone follow up with you' }]);
    expect(result).toBe('follow_up_booked');
  });

  it('returns brochure_sent when lead asks for whatsapp', () => {
    const result = detectCtaOutcome([{ role: 'user', content: 'send it on whatsapp please' }]);
    expect(result).toBe('brochure_sent');
  });

  it('returns brochure_sent when brochure keyword present', () => {
    const result = detectCtaOutcome([{ role: 'user', content: 'can you send the brochure' }]);
    expect(result).toBe('brochure_sent');
  });

  it('returns declined when lead says not interested', () => {
    const result = detectCtaOutcome([{ role: 'user', content: 'I am not interested thank you' }]);
    expect(result).toBe('declined');
  });

  it('returns declined when lead says no thank you', () => {
    const result = detectCtaOutcome([{ role: 'user', content: 'no thank you I have to go' }]);
    expect(result).toBe('declined');
  });

  it('returns unclear when no CTA signals are present', () => {
    const result = detectCtaOutcome([{ role: 'user', content: 'tell me more about the plot sizes' }]);
    expect(result).toBe('unclear');
  });

  it('returns unclear for empty transcript', () => {
    const result = detectCtaOutcome([]);
    expect(result).toBe('unclear');
  });

  it('prioritises follow_up_booked over brochure_sent when both signals present', () => {
    const result = detectCtaOutcome([
      { role: 'user', content: 'yes call me in the morning, also send the brochure on whatsapp' },
    ]);
    expect(result).toBe('follow_up_booked');
  });

  it('accumulates signals across multiple messages', () => {
    const result = detectCtaOutcome([
      { role: 'assistant', content: 'Would you like a follow up call?' },
      { role: 'user', content: 'yes afternoon is fine' },
    ]);
    expect(result).toBe('follow_up_booked');
  });
});
