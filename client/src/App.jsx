import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import CreatePage from './pages/CreatePage.jsx';
import InvestigationPage from './pages/InvestigationPage.jsx';
import AccusationPage from './pages/AccusationPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import { createCase, getApiErrorMessage } from './services/api.js';

const links = [
  { to: '/', label: 'Home', number: '01' }, { to: '/create', label: 'New case', number: '02' },
  { to: '/investigate', label: 'Investigation', number: '03' }, { to: '/accuse', label: 'Accusation', number: '04' },
  { to: '/results', label: 'Case file', number: '05' },
];

export default function App() {
  const [scenario, setScenario] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [caseId, setCaseId] = useState(() => window.localStorage.getItem('mysteryCaseId') || '');
  const [caseData, setCaseData] = useState(null);
  const [result, setResult] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const active = links.find((item) => item.to === location.pathname);
  const handleGenerate = async () => {
    try {
      const response = await createCase({ scenario, difficulty });
      setCaseId(response.case.id);
      window.localStorage.setItem('mysteryCaseId', response.case.id);
      setCaseData(response.case);
      setResult(null);
      navigate('/investigate');
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'The case could not be generated. Please try again.'));
    }
  };
  const handleResult = (nextResult) => {
    setResult(nextResult);
    navigate('/results');
  };
  const handleAgain = () => {
    setCaseId('');
    setCaseData(null);
    setResult(null);
    window.localStorage.removeItem('mysteryCaseId');
    navigate('/create');
  };
  return <div className="min-h-screen bg-ink text-paper">
    <header className="site-header">
      <NavLink to="/" className="brand-lockup" aria-label="AI Mystery Room home"><span className="brand-mark">MR</span><span><strong>AI MYSTERY ROOM</strong><small>AN INTERACTIVE INVESTIGATION</small></span></NavLink>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>{item.label}</NavLink>)}</nav>
      <div className="header-case"><span className="live-dot" /> CASE {caseId ? caseId.slice(-8).toUpperCase() : '—'} <span className="header-divider">/</span> <span className="muted">{caseData?.status?.toUpperCase() || (caseId ? 'ACTIVE' : 'NO CASE')}</span></div>
    </header>
    <div className="page-topline"><span>{active?.number ?? '01'} <i>/</i> {active?.label.toUpperCase() ?? 'THE ARCHIVE'}</span><span className="topline-right">{caseData?.title?.toUpperCase() || 'YOUR NEXT CASE IS WAITING'}</span></div>
    <Routes>
      <Route path="/" element={<HomePage onStart={() => navigate('/create')} />} />
      <Route path="/create" element={<CreatePage scenario={scenario} setScenario={setScenario} difficulty={difficulty} setDifficulty={setDifficulty} onGenerate={handleGenerate} />} />
      <Route path="/investigate" element={<InvestigationPage caseId={caseId} caseData={caseData} setCaseData={setCaseData} onAccuse={() => navigate('/accuse')} />} />
      <Route path="/accuse" element={<AccusationPage caseId={caseId} caseData={caseData} onCase={setCaseData} onComplete={handleResult} />} />
      <Route path="/results" element={<ResultsPage caseId={caseId} result={result} onResult={setResult} onCase={setCaseData} onAgain={handleAgain} />} />
      <Route path="*" element={<HomePage onStart={() => navigate('/create')} />} />
    </Routes>
    <footer className="site-footer"><span>THE MYSTERY ROOM <b>·</b> A STORY IS WAITING TO BE SOLVED</span><span>DESIGNED FOR THE CURIOUS <b>✦</b></span></footer>
  </div>;
}
