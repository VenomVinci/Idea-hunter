import type { AnalysisResponse, TranscriptSegment } from '../shared/types';

interface ProcessTranscriptMessage {
  type: 'PROCESS_TRANSCRIPT';
  videoId: string;
  title: string;
  transcript: TranscriptSegment[];
}

chrome.runtime.onMessage.addListener((message: ProcessTranscriptMessage, _sender, sendResponse) => {
  if (message?.type !== 'PROCESS_TRANSCRIPT') return;
  (async () => {
    try {
      const settings = await getSettings();
      if (!settings.apiKey) {
        sendResponse({ ok: false, error: 'Missing OpenAI API key. Set it in the extension Options.' });
        return;
      }

      const analysis = await analyzeTranscriptWithOpenAI(settings.apiKey, settings.model, message.title, message.transcript);
      sendResponse({ ok: true, data: analysis });
    } catch (error: any) {
      console.error('Hunter analyze error', error);
      sendResponse({ ok: false, error: error?.message || String(error) });
    }
  })();

  // Keep the message channel open for async response
  return true;
});

async function getSettings(): Promise<{ apiKey: string | null; model: string }> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['OPENAI_API_KEY', 'OPENAI_MODEL'], (res) => {
      resolve({ apiKey: res.OPENAI_API_KEY || null, model: res.OPENAI_MODEL || 'gpt-4o-mini' });
    });
  });
}

async function analyzeTranscriptWithOpenAI(apiKey: string, model: string, title: string, transcript: TranscriptSegment[]): Promise<AnalysisResponse> {
  const system = `You are Hunter, an assistant that analyzes YouTube tutorial transcripts. You must return a strict JSON object with keys: topics (array), quizzes (array). Do not include any text outside JSON. The JSON schema is:\n{\n  topics: [\n    { id: string, title: string, startTimeSec: number, endTimeSec: number, summary: string, bullets: string[] }\n  ],\n  quizzes: [\n    { id: string, timestampSec: number, question: string, options: string[], correctOptionIndex: number, explanation?: string }\n  ]\n}\nGuidelines:\n- Detect 4-10 key topics spanning the whole video.\n- Use concise titles.\n- Summaries should be 2-4 sentences.\n- Bullets should be 3-5 actionable takeaways.\n- Create 4-8 quiz questions focused on practical understanding.\n- Timestamps must align with the topic or question segment.\n- If transcript is short or unclear, still return a well-structured best effort.`;

  // Concatenate transcript to a compact string with timestamps
  const merged = transcript
    .map((s) => `[${Math.round(s.startTimeSec)}s] ${s.text}`)
    .join('\n');

  // Limit to reasonable size
  const maxChars = 24000;
  const promptTranscript = merged.length > maxChars ? merged.slice(0, maxChars) + '\n...[truncated]...' : merged;

  const user = `Video title: ${title}\n\nTranscript with timestamps (seconds):\n${promptTranscript}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI');

  let parsed: AnalysisResponse;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    console.warn('Non-JSON content from OpenAI, attempting to recover');
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace >= 0) {
      parsed = JSON.parse(content.slice(firstBrace, lastBrace + 1));
    } else {
      throw new Error('Failed to parse JSON response from OpenAI');
    }
  }

  // Basic validation/fallbacks
  parsed.topics = Array.isArray(parsed.topics) ? parsed.topics : [];
  parsed.quizzes = Array.isArray(parsed.quizzes) ? parsed.quizzes : [];

  return parsed;
}