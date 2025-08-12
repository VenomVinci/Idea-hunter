import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { AnalysisResponse, TranscriptSegment, TopicSummary, QuizQuestion } from '../shared/types';

// Utility: format seconds as mm:ss
function formatTime(seconds: number): string {
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  const m = Math.floor((seconds / 60) % 60).toString().padStart(2, '0');
  const h = Math.floor(seconds / 3600);
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

function getYouTubeVideoId(): string | null {
  try {
    const url = new URL(window.location.href);
    if (url.hostname.includes('youtube.com')) {
      return url.searchParams.get('v');
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchTranscriptFromTimedText(videoId: string): Promise<TranscriptSegment[] | null> {
  const tries = [
    `https://www.youtube.com/api/timedtext?lang=en&fmt=json3&v=${videoId}`,
    `https://www.youtube.com/api/timedtext?lang=en-US&fmt=json3&v=${videoId}`,
    `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}&fmt=json3&kind=asr`
  ];

  for (const url of tries) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      if (!data?.events) continue;
      const segments: TranscriptSegment[] = [];
      for (const ev of data.events) {
        if (!ev.segs || typeof ev.tStartMs !== 'number') continue;
        const text = ev.segs.map((s: any) => s.utf8).join('').replace(/\n+/g, ' ').trim();
        if (!text) continue;
        const startTimeSec = ev.tStartMs / 1000;
        const durationSec = (ev.dDurationMs || 0) / 1000;
        segments.push({ startTimeSec, durationSec, text });
      }
      if (segments.length) return segments;
    } catch (e) {
      // ignore and try next
    }
  }

  return null;
}

function getPlayer(): HTMLVideoElement | null {
  return document.querySelector('video');
}

function jumpTo(second: number) {
  const player = getPlayer();
  if (player) {
    player.currentTime = second;
    player.focus();
  }
}

function Sidebar({ videoId }: { videoId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[] | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>('');

  useEffect(() => {
    // Observe title from DOM
    const titleEl = document.querySelector('h1.title, h1.ytd-watch-metadata');
    setVideoTitle(titleEl?.textContent?.trim() || document.title.replace('- YouTube', '').trim());
  }, [videoId]);

  useEffect(() => {
    let aborted = false;
    (async () => {
      setLoading(true);
      setError(null);
      setAnalysis(null);
      try {
        const tid = videoId;
        if (!tid) throw new Error('No video ID found');
        const tr = await fetchTranscriptFromTimedText(tid);
        if (!tr || tr.length === 0) throw new Error('Could not fetch transcript/captions for this video.');
        if (aborted) return;
        setTranscript(tr);

        const resp = await chrome.runtime.sendMessage({
          type: 'PROCESS_TRANSCRIPT',
          videoId: tid,
          title: videoTitle || document.title,
          transcript: tr,
        });

        if (!resp?.ok) throw new Error(resp?.error || 'Unknown analysis error');
        if (aborted) return;
        setAnalysis(resp.data as AnalysisResponse);
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [videoId]);

  const durationSec = useMemo(() => getPlayer()?.duration || 0, [videoId]);

  return (
    <div>
      <button className="hunter-toggle" onClick={() => setOpen((v) => !v)}>{open ? 'Close Hunter' : 'Open Hunter'}</button>
      <div id="hunter-root" className={`hunter-container ${open ? 'open' : ''}`}>
        <div className="hunter-header">
          <div className="hunter-title">Hunter <span className="hunter-badge">AI</span></div>
          <div className="hunter-actions">
            {loading && <span className="spinner" />}
            {!loading && analysis && (
              <button className="hunter-btn" onClick={() => setOpen(false)}>Hide</button>
            )}
          </div>
        </div>
        <div className="hunter-body">
          {!analysis && !error && (
            <div className="hunter-section">
              <h3>Preparing insights…</h3>
              <div className="small muted">Fetching transcript and analyzing with AI.</div>
            </div>
          )}
          {error && (
            <div className="hunter-section">
              <h3>Error</h3>
              <div className="small" style={{ color: '#ef5350' }}>{error}</div>
              <div className="sep" />
              <div className="small muted">Ensure the video has captions available and your API key is set in Options.</div>
            </div>
          )}
          {analysis && (
            <>
              <div className="hunter-section">
                <h3>Timeline</h3>
                <div className="timeline">
                  <div className="timeline-bar">
                    {analysis.topics.map((t) => (
                      <div
                        key={t.id}
                        className="timeline-marker"
                        style={{ left: `${durationSec ? (t.startTimeSec / durationSec) * 100 : 0}%` }}
                        title={`${t.title} (${formatTime(t.startTimeSec)})`}
                        onClick={() => jumpTo(t.startTimeSec)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="hunter-section">
                <h3>Topics & Summaries</h3>
                {analysis.topics.map((t) => (
                  <TopicCard key={t.id} topic={t} />
                ))}
              </div>

              <div className="hunter-section">
                <h3>Interactive Quiz</h3>
                {analysis.quizzes.map((q) => (
                  <QuizCard key={q.id} quiz={q} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TopicCard({ topic }: { topic: TopicSummary }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="topic-item">
      <div className="topic-title">
        <span>{topic.title}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="topic-meta">{formatTime(topic.startTimeSec)} - {formatTime(topic.endTimeSec)}</span>
          <button className="hunter-btn" onClick={() => jumpTo(topic.startTimeSec)}>Go</button>
          <button className="hunter-btn" onClick={() => setOpen((v) => !v)}>{open ? 'Hide' : 'Details'}</button>
        </div>
      </div>
      {open && (
        <div>
          <div className="topic-summary">{topic.summary}</div>
          {topic.bullets && topic.bullets.length > 0 && (
            <ul className="topic-bullets">
              {topic.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function QuizCard({ quiz }: { quiz: QuizQuestion }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="quiz-item">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div className="quiz-q">{quiz.question}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="muted small">{formatTime(quiz.timestampSec)}</span>
          <button className="hunter-btn" onClick={() => jumpTo(quiz.timestampSec)}>Go</button>
        </div>
      </div>
      <div className="quiz-options">
        {quiz.options.map((opt, idx) => {
          const isCorrect = selected !== null && idx === quiz.correctOptionIndex;
          const isWrong = selected !== null && idx === selected && selected !== quiz.correctOptionIndex;
          return (
            <button
              key={idx}
              className={`quiz-option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
              disabled={selected !== null}
              onClick={() => setSelected(idx)}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && quiz.explanation && (
        <div className="quiz-explain">{quiz.explanation}</div>
      )}
    </div>
  );
}

function mount() {
  const containerId = 'hunter-container-root';
  if (document.getElementById(containerId)) return;

  const rootEl = document.createElement('div');
  rootEl.id = containerId;
  document.documentElement.appendChild(rootEl);

  const videoId = getYouTubeVideoId();
  if (!videoId) return;

  const root = createRoot(rootEl);
  root.render(<Sidebar videoId={videoId} />);
}

// Handle YouTube SPA navigations
const observeUrlChange = () => {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      // Clean old UI and remount
      const rootEl = document.getElementById('hunter-container-root');
      if (rootEl) rootEl.remove();
      setTimeout(() => {
        mount();
      }, 500);
    }
  }).observe(document, { subtree: true, childList: true });
};

mount();
observeUrlChange();