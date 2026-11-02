import { useEffect, useState } from 'react';
import { Button, ErrorNotice, LoadingState, PageIntro, Panel } from '../components/UI.jsx';
import { getApiErrorMessage, getCase, getResult } from '../services/api.js';

export default function ResultsPage({ caseId, result: initialResult, onResult, onCase, onAgain }) {
  const [result, setResult] = useState(initialResult);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadResult = async () => {
    if (!caseId) { setError('No submitted case was found.'); setLoading(false); return; }
    setLoading(true); setError('');
    try {
      const [resultResponse, caseResponse] = await Promise.all([getResult(caseId), getCase(caseId)]);
      setResult(resultResponse.result);
      onResult(resultResponse.result);
      setCaseData(caseResponse.case);
      onCase(caseResponse.case);
    } catch (requestError) { setError(getApiErrorMessage(requestError, 'The case result could not be loaded.')); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadResult(); }, [caseId]);

  if (loading) return <main className="content subpage"><LoadingState>Retrieving the final case report…</LoadingState></main>;
  if (error || !result) return <main className="content subpage"><PageIntro index="05" tag="CASE REPORT" title={<>The verdict<br /><em>is unavailable.</em></>} description="Results become available after an accusation has been submitted." /><ErrorNotice onRetry={loadResult}>{error || 'No result is available for this case.'}</ErrorNotice><Button to="/accuse">Submit an accusation</Button></main>;

  const correct = result.correct;
  return <main className="content subpage results-page"><PageIntro index="05" tag="CASE CLOSED" title={correct ? <>Sharp eyes.<br /><em>Sharper instincts.</em></> : <>The truth was<br /><em>closer than it seemed.</em></>} description={caseData?.title ? `The case “${caseData.title}” is closed. Here is the backend's final report.` : 'The case is closed. Here is the backend’s final report.'} /><div className="result-banner"><div className={`result-emblem ${correct ? 'emblem-correct' : ''}`}>{correct ? '✓' : '×'}</div><div className="result-copy"><span className="eyebrow"><span className="eyebrow-dash" />FINAL VERDICT</span><h2>{correct ? 'Your accusation was correct.' : 'Your accusation was incorrect.'}</h2><p>{result.culprit?.name ? <>The culprit was <strong>{result.culprit.name}</strong>.</> : 'The culprit has been identified.'}</p></div><div className="score-block"><span>FINAL SCORE</span><strong>{result.score}</strong><small>POINTS</small></div></div><div className="results-grid"><Panel className="solution-panel"><div className="panel-kicker"><span>THE COMPLETE SOLUTION</span><span>CASE {caseId.slice(-8).toUpperCase()}</span></div><div className="solution-body"><p className="eyebrow"><span className="eyebrow-dash" />WHAT HAPPENED</p><p>{result.explanation}</p>{result.sequenceOfEvents?.length > 0 && <><p className="eyebrow timeline-label"><span className="eyebrow-dash" />SEQUENCE OF EVENTS</p><ol className="event-list">{result.sequenceOfEvents.map((event, index) => <li key={`${index}-${event}`}><span>{String(index + 1).padStart(2, '0')}</span>{event}</li>)}</ol></>}<div className="solution-reveal"><span>THE CULPRIT</span><strong>{result.culprit?.name || 'Revealed in the case report'}</strong><small>{result.accusedSuspect?.name ? `YOUR ACCUSATION: ${result.accusedSuspect.name.toUpperCase()}` : 'FINAL CASE FINDING'}</small></div></div></Panel><aside className="score-panel"><Panel><p className="eyebrow"><span className="eyebrow-dash" />YOUR INVESTIGATION</p><div className="score-row"><span>Correct accusation</span><b>{result.scoring?.correctAccusationPoints > 0 ? `+${result.scoring.correctAccusationPoints}` : '+0'}</b></div><div className="score-row"><span>Clues discovered <small>({result.discoveredClues})</small></span><b>+{result.scoring?.cluePoints ?? 0}</b></div><div className="score-row"><span>Hints used <small>({result.usedHints})</small></span><b className="score-minus">−{result.scoring?.hintPenalty ?? 0}</b></div><div className="score-total"><span>TOTAL SCORE</span><strong>{result.score}</strong></div></Panel><div className="play-again"><p>Another case is waiting in the dark.</p><Button onClick={onAgain}>Open a new case</Button></div></aside></div></main>;
}
