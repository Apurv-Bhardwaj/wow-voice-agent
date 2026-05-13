import { CtaOutcome } from './types';

export function detectCtaOutcome(
  transcripts: Array<{ role: string; content: string }>
): CtaOutcome {
  const text = transcripts.map((t) => t.content).join(' ').toLowerCase();

  const followUpSignals = [
    'follow',
    'property expert',
    'reach out',
    'call you',
    'schedule',
    'book',
    'morning',
    'afternoon',
    'evening',
    'tomorrow',
    'next week',
    'connect you',
  ];

  const brochureSignals = ['whatsapp', 'brochure', 'send you', 'send the details'];

  const declinedSignals = [
    'not interested',
    'no thank',
    "don't want",
    'not looking',
    'remove me',
    'not now',
  ];

  if (followUpSignals.some((s) => text.includes(s))) return 'follow_up_booked';
  if (brochureSignals.some((s) => text.includes(s))) return 'brochure_sent';
  if (declinedSignals.some((s) => text.includes(s))) return 'declined';
  return 'unclear';
}
