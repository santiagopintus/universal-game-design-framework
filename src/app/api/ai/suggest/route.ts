import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { buildIdeaContext, findFieldSchema, resolveMessage } from '@/lib/aiContext';

type TemperatureMode = 'conservative' | 'creative';

const TEMPERATURE_BY_MODE: Record<TemperatureMode, number> = {
  conservative: 0.4,
  creative: 1.3,
};

const LOCALES = ['en', 'es'] as const;
type Locale = (typeof LOCALES)[number];

type SuggestRequestBody = {
  fieldValueKey?: string;
  locale?: string;
  values?: Record<string, string>;
  temperatureMode?: string;
};

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

function isTemperatureMode(value: unknown): value is TemperatureMode {
  return value === 'conservative' || value === 'creative';
}

function parseSuggestions(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^[\s*\-•\d.)]+/, '').trim())
    .filter(Boolean)
    .slice(0, 3);
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'GEMINI_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  let body: SuggestRequestBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { fieldValueKey, locale, values, temperatureMode } = body;

  if (typeof fieldValueKey !== 'string' || !findFieldSchema(fieldValueKey)) {
    return Response.json({ error: 'Unknown fieldValueKey.' }, { status: 400 });
  }
  if (!isLocale(locale)) {
    return Response.json({ error: 'Invalid locale.' }, { status: 400 });
  }
  if (!isTemperatureMode(temperatureMode)) {
    return Response.json({ error: 'Invalid temperatureMode.' }, { status: 400 });
  }
  if (!values || typeof values !== 'object') {
    return Response.json({ error: 'Invalid values.' }, { status: 400 });
  }

  const fieldSchema = findFieldSchema(fieldValueKey)!;
  // FORM_SCHEMA's keys (e.g. "sections.replayability.fields.replayValue.title")
  // are relative to the 'form' translation namespace, matching how the client
  // calls useTranslations('form') — so scope to that namespace here too.
  const messages = (await import(`../../../../messages/${locale}.json`)).default.form;

  const fieldTitle = resolveMessage(messages, fieldSchema.titleKey);
  const fieldGuide = resolveMessage(messages, fieldSchema.guideKey);
  const ideaContext = buildIdeaContext(messages, values);

  const languageName = locale === 'es' ? 'Spanish' : 'English';

  const prompt = [
    'You are a creative co-pilot helping a game director fill out a structured game design questionnaire.',
    'Here is everything the designer has written so far, across all sections of the questionnaire:',
    '---',
    ideaContext || '(Nothing written yet.)',
    '---',
    `The designer is now working on the field "${fieldTitle}" (guiding question: "${fieldGuide}").`,
    `Suggest exactly 3 short, tactical, concrete suggestions for this field that stay cohesive with everything already written above.`,
    `Respond in ${languageName}, one suggestion per line, with no numbering, bullets, or markdown formatting.`,
  ].join('\n');

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        temperature: TEMPERATURE_BY_MODE[temperatureMode],
        thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
      },
    });

    const suggestions = parseSuggestions(response.text ?? '');
    if (suggestions.length === 0) {
      return Response.json({ error: 'No suggestions were generated.' }, { status: 502 });
    }

    return Response.json({ suggestions });
  } catch (error) {
    console.error('AI suggest route failed:', error);
    return Response.json({ error: 'Failed to reach the AI suggestion service.' }, { status: 502 });
  }
}
