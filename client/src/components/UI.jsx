import { Link } from 'react-router-dom';

export function Eyebrow({ children }) { return <p className="eyebrow"><span className="eyebrow-dash" />{children}</p>; }
export function SectionTitle({ number, title, aside }) { return <div className="section-title"><h2><span>{number}</span>{title}</h2>{aside && <p>{aside}</p>}</div>; }
export function Button({ children, to, onClick, variant = 'primary', className = '' }) {
  const classes = `button button-${variant} ${className}`;
  return to ? <Link to={to} className={classes}>{children}<span aria-hidden="true">↗</span></Link> : <button type="button" onClick={onClick} className={classes}>{children}<span aria-hidden="true">↗</span></button>;
}
export function PageIntro({ index, title, description, tag }) {
  return <div className="page-intro"><div><p className="eyebrow"><span className="eyebrow-dash" />{index} — {tag}</p><h1>{title}</h1><p className="intro-copy">{description}</p></div><div className="intro-stamp"><span>MR</span><small>CONFIDENTIAL<br />CASE FILE</small></div></div>;
}
export function Panel({ children, className = '' }) { return <section className={`panel ${className}`}>{children}</section>; }
export function ErrorNotice({ children, onRetry }) {
  if (!children) return null;
  return <div className="api-notice api-error" role="alert"><span>{children}</span>{onRetry && <button type="button" onClick={onRetry}>Try again ↗</button>}</div>;
}
export function LoadingState({ children = 'Loading case file…' }) {
  return <div className="api-notice api-loading" role="status"><span className="loading-spinner" />{children}</div>;
}
