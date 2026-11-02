import { useEffect, useState } from 'react';
import { Button, ErrorNotice, LoadingState, PageIntro, Panel } from '../components/UI.jsx';
import { getApiErrorMessage, getCase, submitAccusation } from '../services/api.js';

const palette = ['rose', 'olive', 'blue', 'gold'];
const initialsFor = (name = '') => name.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase();

export default function AccusationPage({ caseId, caseData: initialCase, onCase, onComplete }) {
  const [caseData, setCaseData] = useState(initialCase);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const loadCase = async () => {
    if (!caseId) { setError('No active case was found. Start a new mystery first.'); setLoading(false); return; }
    setLoading(true); setError('');
    try { const response = await getCase(caseId); setCaseData(response.case); onCase(response.case); }
    catch (requestError) { setError(getApiErrorMessage(requestError, 'The case could not be loaded.')); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadCase(); }, [caseId]);

  const accuse = async () => {
    if (!selectedId) return;
    setSubmitting(true); setSubmitError('');
    try {
      const response = await submitAccusation(caseId, selectedId);
      onComplete(response.result);
    } catch (requestError) { setSubmitError(getApiErrorMessage(requestError, 'Your accusation could not be submitted.')); }
    finally { setSubmitting(false); }
  };

  if (loading) return <main className="content subpage"><LoadingState>Loading the suspects from your case file…</LoadingState></main>;
  if (error || !caseData) return <main className="content subpage"><PageIntro index="04" tag="THE MOMENT OF TRUTH" title={<>The suspects<br /><em>are unavailable.</em></>} description="We couldn't retrieve the active case." /><ErrorNotice onRetry={loadCase}>{error || 'Case data is unavailable.'}</ErrorNotice><Button to="/investigate">Return to investigation</Button></main>;

  return <main className="content subpage accusation-page"><PageIntro index="04" tag="THE MOMENT OF TRUTH" title={<>Someone in this case<br />is <em>lying.</em></>} description={`You have reviewed “${caseData.title}.” Choose the suspect you believe is responsible. Your accusation is final.`} /><div className="accusation-layout"><section><div className="column-heading"><h2>Who do you accuse?</h2><span>SELECT ONE</span></div><div className="accused-list">{caseData.suspects.map((suspect, index) => <button type="button" key={suspect.id} className={`accused-option ${selectedId === suspect.id ? 'accused-selected' : ''}`} disabled={submitting} onClick={() => setSelectedId(suspect.id)}><span className="accused-index">{String(index + 1).padStart(2, '0')}</span><span className={`suspect-avatar avatar-${palette[index % palette.length]}`}>{initialsFor(suspect.name)}</span><span className="accused-name"><strong>{suspect.name}</strong><small>{suspect.relationship}</small></span><span className="radio-mark">{selectedId === suspect.id && '✓'}</span></button>)}</div><div className="accusation-submit"><p>Your accusation is final. Once submitted, the backend reveals the solution and calculates your score.</p><button type="button" disabled={!selectedId || submitting} className={`button button-primary ${!selectedId || submitting ? 'button-disabled' : ''}`} onClick={accuse}>{submitting ? <><span className="loading-spinner" />Submitting…</> : <>Submit final accusation <span aria-hidden="true">↗</span></>}</button></div><ErrorNotice>{submitError}</ErrorNotice></section><Panel className="theory-card"><p className="eyebrow"><span className="eyebrow-dash" />YOUR CASE NOTES</p><div className="theory-quote">“A good detective doesn't ask who had the opportunity. They ask who needed the truth to stay buried.”</div><div className="theory-byline">FIELD NOTE <span>·</span> CASE {caseData.id.slice(-8).toUpperCase()}</div><div className="theory-divider" /><div className="theory-status"><span>YOUR ACCUSATION</span><strong className={selectedId ? '' : 'unselected'}>{caseData.suspects.find((item) => item.id === selectedId)?.name || 'Awaiting your decision'}</strong></div><div className="theory-status"><span>EVIDENCE REVIEWED</span><strong>{caseData.evidence.length} ITEMS</strong></div><div className="theory-seal">THE<br />ROOM<br /><em>AWAITS</em></div></Panel></div></main>;
}
