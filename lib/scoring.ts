import { QualificationResult } from './types';

export function scoreTranscript(
  transcripts: Array<{ role: string; content: string }>
): QualificationResult {
  const text = transcripts.map((t) => t.content).join(' ').toLowerCase();

  const result: QualificationResult = {
    intent: 'unclear',
    geography_fit: false,
    budget_fit: false,
    timeline_fit: false,
    score: 0,
    qualified: false,
  };

  // Intent
  if (text.includes('invest') || text.includes('returns') || text.includes('appreciation')) {
    result.intent = 'investment';
    result.score += 25;
  } else if (
    text.includes('self') ||
    text.includes('weekend') ||
    text.includes('family') ||
    text.includes('live')
  ) {
    result.intent = 'self_use';
    result.score += 25;
  }

  // Geography
  if (
    (text.includes('nandi') ||
      text.includes('north bangalore') ||
      text.includes('know the area') ||
      text.includes('devanahalli')) &&
    !text.includes('too far') &&
    !text.includes('not comfortable')
  ) {
    result.geography_fit = true;
    result.score += 25;
  }

  // Budget
  if (
    !text.includes('too expensive') &&
    !text.includes('out of budget') &&
    !text.includes('cannot afford') &&
    (text.includes('budget') ||
      text.includes('price') ||
      text.includes('lakh') ||
      text.includes('crore'))
  ) {
    result.budget_fit = true;
    result.score += 25;
  }

  // Timeline
  if (
    !text.includes('too long') &&
    !text.includes('need immediately') &&
    !text.includes('ready to move now') &&
    (text.includes('2029') ||
      text.includes('okay') ||
      text.includes('fine with') ||
      text.includes('no rush'))
  ) {
    result.timeline_fit = true;
    result.score += 25;
  }

  result.qualified = result.score >= 50;
  return result;
}
