import { useEffect, useState } from 'react';
import { Button, ErrorNotice, LoadingState, PageIntro, Panel } from '../components/UI.jsx';
import { discoverClue, getApiErrorMessage, getCase, requestHint } from '../services/api.js';

const evidenceIcons = { messages: 'MSG', image: 'IMG', cctv: 'CCTV', document: 'DOC', other: 'FILE' };
const suspectColors = ['rose', 'olive', 'blue', 'gold'];
const initialsFor = (name = '') => name.split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join('').toUpperCase();

export default function InvestigationPage({ caseId, setCaseData, onAccuse }) {
  const [caseData, setLocalCase] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [workingId, setWorkingId] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  const [hints, setHints] = useState([]);

  const loadCase = async () => {
    if (!caseId) {
      setError('No active case was found. Start a new mystery first.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await getCase(caseId);
      setLocalCase(response.case);
      setCaseData(response.case);
      setSelectedId((current) => current || response.case.evidence[0]?.id || '');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'The case could not be loaded.'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadCase(); }, [caseId]);

  const selected = caseData?.evidence?.find((item) => item.id === selectedId) || caseData?.evidence?.[0];
  const relatedClues = caseData?.clues?.filter((clue) => clue.relatedEvidenceId === selected?.id) || [];
  const discoveredCount = caseData?.clues?.filter((clue) => clue.discovered).length || 0;
  const hintLimit = caseData?.difficulty === 'Easy' ? 2 : 3;
  const hintCount = caseData?.usedHints || 0;

  const logClue = async (clueId) => {
    setWorkingId(clueId);
    setActionError('');
    try {
      const response = await discoverClue(caseId, clueId);
      setLocalCase(response.case);
      setCaseData(response.case);
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError, 'This clue could not be logged.'));
    } finally {
      setWorkingId('');
    }
  };

  const getHint = async () => {
    setHintLoading(true);
    setActionError('');
    try {
      const response = await requestHint(caseId);
      setHints((current) => [...current, response.hint]);
      setLocalCase((current) => current ? { ...current, usedHints: response.usedHints } : current);
      setCaseData((current) => current ? { ...current, usedHints: response.usedHints } : current);
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError, 'A hint could not be retrieved.'));
    } finally {
      setHintLoading(false);
    }
  };

  if (loading) return <main className="content subpage"><LoadingState>Retrieving the case file...</LoadingState></main>;
  if (error || !caseData) return <main className="content subpage"><PageIntro index="03" tag="ACTIVE INVESTIGATION" title={<>The case file<br /><em>is unavailable.</em></>} description="We couldn't retrieve this investigation from the case archive." /><ErrorNotice onRetry={loadCase}>{error || 'Case data is unavailable.'}</ErrorNotice><Button to="/create">Start a new case</Button></main>;

  return <main className="content subpage investigation-page">
    <PageIntro index="03" tag="ACTIVE INVESTIGATION" title={<>{caseData.title}</>} description={caseData.description} />
    <div className="case-ribbon"><span>OPENED <b>{new Date(caseData.createdAt).toLocaleString()}</b></span><span>CASE ID <b>{caseData.id.slice(-8).toUpperCase()}</b></span><span>DIFFICULTY <b>{caseData.difficulty.toUpperCase()}</b></span><span className="progress-ribbon"><b>{discoveredCount}</b> / {caseData.clues.length} CLUES FOUND</span></div>
    <div className="investigation-layout">
      <aside className="suspect-column">
        <div className="column-heading"><h2>Persons of interest</h2><span>{String(caseData.suspects.length).padStart(2, '0')}</span></div>
        <div className="suspect-list">{caseData.suspects.map((suspect, index) => <article className="suspect-card" key={suspect.id}><div className={`suspect-avatar avatar-${suspectColors[index % suspectColors.length]}`}>{initialsFor(suspect.name)}</div><div className="suspect-info"><span className="suspect-number">SUSPECT {String(index + 1).padStart(2, '0')}</span><h3>{suspect.name}</h3><p>{suspect.relationship}</p></div><span className="suspect-arrow">↗</span><div className="suspect-detail">{suspect.description} {suspect.background}</div></article>)}</div>
        <Panel className="hint-card"><span className="hint-icon">✳</span><div className="hint-card-title"><span>NEED A NUDGE?</span><small>{Math.max(0, hintLimit - hintCount)} HINT{hintLimit - hintCount === 1 ? '' : 'S'} LEFT</small></div><p>Hints guide your investigation. Each one reduces your final score by 10 points.</p>{hints.map((hint, index) => <div className="hint-reveal" key={`${index}-${hint}`}>{hint}</div>)}<button className="hint-button" disabled={hintLoading || hintCount >= hintLimit} onClick={getHint}>{hintLoading ? 'Retrieving hint...' : hintCount < hintLimit ? 'Request a hint ↗' : 'No hints remaining'}</button></Panel>
      </aside>
      <section className="evidence-column">
        <div className="column-heading"><h2>The evidence room</h2><span>{String(caseData.evidence.length).padStart(2, '0')} ITEMS</span></div>
        <div className="evidence-tabs">{caseData.evidence.map((item) => <button key={item.id} className={`evidence-tab ${selected?.id === item.id ? 'tab-active' : ''}`} onClick={() => setSelectedId(item.id)}><span>{evidenceIcons[item.type] || evidenceIcons.other}</span><small>{item.type}</small></button>)}</div>
        {selected && <Panel className="evidence-viewer">
          <div className="evidence-toolbar"><span><i className="live-dot" /> EVIDENCE LOGGED</span><span>{selected.title}</span></div>
          <div className={`evidence-art evidence-${selected.type}`}>
            {selected.mediaUrl ? <img className="evidence-media" src={selected.mediaUrl} alt={selected.title} /> : <div className="evidence-paper"><span className="paper-label">{selected.type.toUpperCase()} · CASE EVIDENCE</span><div className="paper-rule" /><h3>{selected.title}</h3><p>{selected.content}</p></div>}
            <span className="evidence-corner">{selected.type}</span>
          </div>
          <div className="evidence-description"><div><span className="evidence-type">{selected.type.toUpperCase()} <i>·</i> CASE EVIDENCE</span><h3>{selected.title}</h3><p>{selected.description}</p></div></div>
          <div className="clue-list"><div className="clue-list-heading"><span>LINKED CLUES</span><small>{relatedClues.length} IN THIS EVIDENCE</small></div>{relatedClues.length ? relatedClues.map((clue) => <div className="clue-row" key={clue.id}><div><strong>{clue.title}</strong><p>{clue.discovered ? clue.description : 'Examine this detail to add its clue to your notes.'}</p></div><button className={`discover-button ${clue.discovered ? 'found' : ''}`} disabled={workingId === clue.id || clue.discovered} onClick={() => logClue(clue.id)}>{workingId === clue.id ? 'LOGGING...' : clue.discovered ? '✓ DISCOVERED' : '＋ DISCOVER'}</button></div>) : <p className="no-clues">No linked clues in this evidence item.</p>}</div>
        </Panel>}
        <ErrorNotice>{actionError}</ErrorNotice>
        <div className="bottom-actions"><span><b>{discoveredCount}</b> clues added to your board <i>·</i> every detail matters</span><Button onClick={onAccuse}>Make an accusation</Button></div>
      </section>
    </div>
  </main>;
}
