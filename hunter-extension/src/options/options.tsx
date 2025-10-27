function qs<T extends HTMLElement = HTMLElement>(sel: string): T {
  const el = document.querySelector(sel) as T | null;
  if (!el) throw new Error(`Missing element: ${sel}`);
  return el;
}

function setStatus(text: string, ok = true) {
  const s = qs('#status');
  s.textContent = text;
  s.setAttribute('style', `margin-top:8px;color:${ok ? '#9cd3ff' : '#ef5350'}`);
}

async function loadSettings() {
  chrome.storage.local.get(['OPENAI_API_KEY', 'OPENAI_MODEL'], (res) => {
    (qs<HTMLInputElement>('#apiKey')).value = res.OPENAI_API_KEY || '';
    (qs<HTMLSelectElement>('#model')).value = res.OPENAI_MODEL || 'gpt-4o-mini';
  });
}

async function saveSettings() {
  const apiKey = (qs<HTMLInputElement>('#apiKey')).value.trim();
  const model = (qs<HTMLSelectElement>('#model')).value;
  if (!apiKey) {
    setStatus('API key is required', false);
    return;
  }
  chrome.storage.local.set({ OPENAI_API_KEY: apiKey, OPENAI_MODEL: model }, () => {
    setStatus('Saved!');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  qs<HTMLButtonElement>('#save').addEventListener('click', saveSettings);
});