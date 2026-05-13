import { BlandCallOptions, BlandCallResponse } from './types';

const BLAND_API_URL = 'https://api.bland.ai/v1/calls';

export async function createBlandCall(
  options: BlandCallOptions
): Promise<BlandCallResponse> {
  const response = await fetch(BLAND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: process.env.BLAND_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: options.phone_number,
      task: options.system_prompt,
      voice: 'nat',
      first_sentence: `Hi, am I speaking with ${options.lead_name}? This is Meera from Divyasree Developers. I hope I'm not catching you at a bad time?`,
      wait_for_greeting: true,
      record: true,
      ...(options.webhook_url.startsWith('https://') ? { webhook: options.webhook_url } : {}),
      metadata: { lead_id: options.lead_id },
      language: 'en',
      max_duration: 300,
      pronunciation_guide: [
        { word: 'Divyasree', pronunciation: 'Div-yaa-shree' },
        { word: 'Nandi', pronunciation: 'Nun-dhee' },
        { word: 'lakh', pronunciation: 'laakh' },
        { word: 'crore', pronunciation: 'kuh-rohr' },
        { word: 'Devanahalli', pronunciation: 'Day-vuh-nuh-hul-lee' },
        { word: 'Doddaballapura', pronunciation: 'Doh-duh-bul-lah-poo-rah' },
        { word: 'Bengaluru', pronunciation: 'Ben-gah-loo-roo' },
        { word: 'Kempegowda', pronunciation: 'Kem-pay-gow-dah' },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Bland API error ${response.status}: ${errText}`);
  }

  return response.json() as Promise<BlandCallResponse>;
}
