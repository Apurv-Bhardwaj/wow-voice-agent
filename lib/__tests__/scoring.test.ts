import { describe, it, expect } from 'vitest';
import { scoreTranscript } from '../scoring';

describe('scoreTranscript', () => {
  it('returns score 0 and unclear intent when transcript has no relevant content', () => {
    const result = scoreTranscript([{ role: 'user', content: 'hello there' }]);
    expect(result.score).toBe(0);
    expect(result.qualified).toBe(false);
    expect(result.intent).toBe('unclear');
    expect(result.geography_fit).toBe(false);
    expect(result.budget_fit).toBe(false);
    expect(result.timeline_fit).toBe(false);
  });

  it('detects investment intent from keyword "invest"', () => {
    const result = scoreTranscript([{ role: 'user', content: 'I want to invest in property' }]);
    expect(result.intent).toBe('investment');
    expect(result.score).toBe(25);
  });

  it('detects investment intent from keyword "appreciation"', () => {
    const result = scoreTranscript([{ role: 'user', content: 'looking for appreciation potential' }]);
    expect(result.intent).toBe('investment');
    expect(result.score).toBe(25);
  });

  it('detects self_use intent from keyword "weekend"', () => {
    const result = scoreTranscript([{ role: 'user', content: 'looking for a weekend home' }]);
    expect(result.intent).toBe('self_use');
    expect(result.score).toBe(25);
  });

  it('detects self_use intent from keyword "family"', () => {
    const result = scoreTranscript([{ role: 'user', content: 'it is for the family' }]);
    expect(result.intent).toBe('self_use');
    expect(result.score).toBe(25);
  });

  it('detects geography fit from keyword "nandi"', () => {
    const result = scoreTranscript([{ role: 'user', content: 'I know the nandi hills area' }]);
    expect(result.geography_fit).toBe(true);
    expect(result.score).toBe(25);
  });

  it('does not set geography_fit when "too far" is present alongside nandi', () => {
    const result = scoreTranscript([{ role: 'user', content: 'nandi is too far for me' }]);
    expect(result.geography_fit).toBe(false);
  });

  it('detects budget fit from keyword "crore" without budget-objection phrases', () => {
    const result = scoreTranscript([{ role: 'user', content: 'yes one crore is fine for my budget' }]);
    expect(result.budget_fit).toBe(true);
    expect(result.score).toBe(25);
  });

  it('does not set budget_fit when "too expensive" is present', () => {
    const result = scoreTranscript([{ role: 'user', content: 'that price is too expensive' }]);
    expect(result.budget_fit).toBe(false);
  });

  it('does not set budget_fit when "out of budget" is present', () => {
    const result = scoreTranscript([{ role: 'user', content: 'that is out of budget for me' }]);
    expect(result.budget_fit).toBe(false);
  });

  it('detects timeline fit from keyword "2029"', () => {
    const result = scoreTranscript([{ role: 'user', content: '2029 possession is fine with me' }]);
    expect(result.timeline_fit).toBe(true);
    expect(result.score).toBe(25);
  });

  it('does not set timeline_fit when "too long" is present', () => {
    const result = scoreTranscript([{ role: 'user', content: '2029 is too long to wait' }]);
    expect(result.timeline_fit).toBe(false);
  });

  it('marks qualified true when score is exactly 50', () => {
    const result = scoreTranscript([
      { role: 'user', content: 'invest in nandi hills area' },
    ]);
    expect(result.score).toBe(50);
    expect(result.qualified).toBe(true);
  });

  it('accumulates score across multiple messages', () => {
    const result = scoreTranscript([
      { role: 'user', content: 'I want to invest' },
      { role: 'user', content: 'I know nandi hills' },
      { role: 'user', content: 'price is within budget, around 1 crore' },
      { role: 'user', content: '2029 is fine with me' },
    ]);
    expect(result.score).toBe(100);
    expect(result.qualified).toBe(true);
  });
});
