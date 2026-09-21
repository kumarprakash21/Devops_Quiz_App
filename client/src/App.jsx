import { useEffect, useRef, useState } from "react";
import { api } from "./api";
import { sections } from "./data";
import "./styles.css";

const tokenKey = "cloudprep-token";

function initials(name = "") { return name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase(); }
function formatDate(value) { return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
function formatDuration(seconds = 0) { const minutes = Math.floor(seconds / 60); const remaining = seconds % 60; return minutes ? `${minutes}m ${String(remaining).padStart(2, "0")}s` : `${remaining}s`; }

function Header({ user, onProfile, onLogout }) {
  return <header className="header"><button className="brand" onClick={user ? onProfile : undefined}><span className="brand-mark"><i/><i/><i/></span>Cloud<span>Prep</span></button>{user && <div className="header-user"><button className="avatar-button" onClick={onProfile}>{initials(user.name)}</button><button className="logout-link" onClick={onLogout}>Sign out</button></div>}</header>;
}

function Auth({ onAuth }) {
  const [registering, setRegistering] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async event => {
    event.preventDefault(); setError("");
    if (registering && form.password !== form.confirm) return setError("Passwords do not match.");
    setBusy(true);
    try {
      const result = registering ? await api.register(form) : await api.login(form);
      localStorage.setItem(tokenKey, result.token); onAuth(result.user);
    } catch (requestError) { setError(requestError.message); }
    finally { setBusy(false); }
  };
  return <main className="auth-layout"><div className="auth-copy"><p className="eyebrow">AZ-104 Azure practice</p><h1>Every question is a fresh challenge.</h1><p>Practise AZ-104 with a shuffled question set, then keep your scores and progress in one profile.</p><div className="feature-list"><span>✦ 100 curated practice questions</span><span>✦ Shuffled questions every attempt</span><span>✦ Persistent score history</span></div></div><form className="auth-card" onSubmit={submit}><p className="eyebrow">{registering ? "Create account" : "Welcome back"}</p><h2>{registering ? "Start your profile" : "Sign in"}</h2><p className="muted">{registering ? "Your progress will be saved to your account." : "Continue your AZ-104 preparation."}</p>{registering && <label>Full name<input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} minLength="2" required placeholder="Your full name" /></label>}<label>Email address<input type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} required placeholder="you@example.com" /></label><label>Password<input type="password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} minLength="6" required placeholder="At least 6 characters" /></label>{registering && <label>Confirm password<input type="password" value={form.confirm} onChange={event => setForm({ ...form, confirm: event.target.value })} minLength="6" required placeholder="Repeat your password" /></label>}<p className="error">{error}</p><button className="button primary" disabled={busy}>{busy ? "Please wait…" : registering ? "Create account" : "Sign in"}</button><p className="switch">{registering ? "Already have an account?" : "New to CloudPrep?"} <button type="button" onClick={() => { setRegistering(!registering); setError(""); }}>{registering ? "Sign in" : "Create an account"}</button></p></form></main>;
}

function Home({ onSections, onProfile }) {
  return <main className="shell"><section className="hero"><p className="eyebrow">Azure certification practice</p><h1>Build confidence.<br/>Master the cloud.</h1><p>Five AZ-104 domains with a shuffled 100-question bank every time you practise.</p></section><div className="section-title"><div><p className="eyebrow">Course library</p><h2>Choose your certification</h2></div><span>1 available</span></div><button className="course-card" onClick={onSections}><div className="course-icon">✦</div><div><span className="pill">Available</span><h3>AZ-104</h3><p>Microsoft Azure Administrator</p><div className="card-meta"><span>5 sections</span><span>100 shuffled questions</span><b>Explore →</b></div></div></button><button className="course-card disabled"><div className="course-icon">◌</div><div><span className="pill muted-pill">Coming soon</span><h3>AZ-900</h3><p>Microsoft Azure Fundamentals</p></div></button></main>;
}

function Sections({ onBack, onStart }) {
  return <main className="shell"><button className="back" onClick={onBack}>← Back to courses</button><div className="section-hero"><div><p className="eyebrow">AZ-104 · Microsoft Azure Administrator</p><h1>Choose a section</h1><p>Each section gives you 20 questions. The API shuffles the curated question bank and avoids repeats during the attempt.</p></div><strong>5<small>sections</small></strong></div><div className="section-grid">{sections.map((section, index) => <button className="section-card" key={section.name} onClick={() => onStart(index)}><div className="section-number">0{index + 1}<span>20 questions</span></div><h2>{section.name}</h2><p>{section.description}</p><b>Start section →</b></button>)}</div></main>;
}

function Quiz({ sectionIndex, user, onBack, onComplete }) {
  const section = sections[sectionIndex];
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [number, setNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const askedIds = useRef([]);
  const startedAt = useRef(Date.now());
  const loadQuestion = async () => { setLoading(true); setError(""); setSelected(null); try { const result = await api.nextQuestion(section.name, askedIds.current); setQuestion(result.question); askedIds.current = [...askedIds.current, result.question.id]; } catch (requestError) { setError(requestError.message); } finally { setLoading(false); } };
  useEffect(() => { loadQuestion(); }, [section.name]);
  useEffect(() => { const timer = window.setInterval(() => setElapsedSeconds(Math.floor((Date.now() - startedAt.current) / 1000)), 1000); return () => window.clearInterval(timer); }, []);
  const next = async () => {
    if (selected === null) return;
    const nextCorrect = correct + (selected === question.answer ? 1 : 0);
    const answerRecord = { question: question.question, options: question.options, selected, correct: question.answer, explanation: question.explanation };
    const nextAnswers = [...answers, answerRecord];
    if (number === 20) {
      setLoading(true);
      try {
        const durationSeconds = Math.max(1, Math.floor((Date.now() - startedAt.current) / 1000));
        const result = await api.saveAttempt({ section: section.name, correct: nextCorrect, total: 20, durationSeconds });
        onComplete({ user: result.user, review: { section: section.name, correct: nextCorrect, total: 20, durationSeconds, answers: nextAnswers } });
      } catch (requestError) { setError(requestError.message); }
      finally { setLoading(false); }
      return;
    }
    setAnswers(nextAnswers); setCorrect(nextCorrect); setNumber(number + 1); await loadQuestion();
  };
  return <main className="shell quiz"><button className="back" onClick={onBack}>← Back to sections</button><div className="quiz-heading"><div><p className="eyebrow">{section.name}</p><h1>Question {number} of 20</h1></div><span className="quiz-time">⏱ {formatDuration(elapsedSeconds)} · {Math.round(((number - 1) / 20) * 100)}%</span></div><div className="progress"><i style={{ width: `${(number / 20) * 100}%` }}/></div>{loading ? <div className="question-card loading"><div className="spinner"/><h2>Shuffling a fresh question…</h2><p>The server is selecting one you have not seen in this attempt.</p></div> : error ? <div className="question-card error-card"><h2>Question unavailable</h2><p>{error}</p><button className="button primary" onClick={loadQuestion}>Try again</button></div> : <div className="question-card"><p className="eyebrow">Fresh question</p><h2>{question.question}</h2><div className="options">{question.options.map((option, index) => <button key={option} className={`option ${selected === index ? "selected" : ""}`} onClick={() => setSelected(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div><div className="question-actions"><span>{selected === null ? "Choose one answer" : "Answer selected"}</span><button className="button primary" disabled={selected === null} onClick={next}>{number === 20 ? "Finish section" : "Next question →"}</button></div></div>}</main>;
}

function Results({ review, onSections, onProfile }) {
  const percentage = Math.round((review.correct / review.total) * 100);
  return <main className="shell results"><div className="result-banner"><div><p className="eyebrow">Assessment complete</p><h1>{percentage >= 70 ? "Strong work — you passed." : "Good start — keep building."}</h1><p>{review.correct} of {review.total} answers correct in {review.section}.</p></div><div className="result-score"><strong>{percentage}%</strong><span>⏱ {formatDuration(review.durationSeconds)}</span></div></div><div className="result-actions"><button className="button primary" onClick={onSections}>Try another section</button><button className="button secondary" onClick={onProfile}>Open profile</button></div><div className="section-title"><div><p className="eyebrow">Answer review</p><h2>Review your answers</h2></div></div><div className="review-list">{review.answers.map((answer, index) => { const isCorrect = answer.selected === answer.correct; return <article className={`review-card ${isCorrect ? "review-correct" : "review-wrong"}`} key={`${index}-${answer.question}`}><div className="review-label">{isCorrect ? "✓ Correct" : "✕ Incorrect"}<span>Question {index + 1}</span></div><h3>{answer.question}</h3><p className={isCorrect ? "answer good" : "answer bad"}><b>Your answer:</b> {answer.options[answer.selected]}</p>{!isCorrect && <p className="answer good"><b>Correct answer:</b> {answer.options[answer.correct]}</p>}<p className="explanation"><b>Why:</b> {answer.explanation}</p></article>; })}</div></main>;
}

function Profile({ user, onBack, onLogout }) {
  const attempts = user.attempts || [];
  const totalCorrect = attempts.reduce((sum, attempt) => sum + attempt.correct, 0);
  const totalQuestions = attempts.reduce((sum, attempt) => sum + attempt.total, 0);
  return <main className="shell"><button className="back" onClick={onBack}>← Back to courses</button><section className="profile-banner"><div className="large-avatar">{initials(user.name)}</div><div><p className="eyebrow">Your profile</p><h1>{user.name}</h1><p>{user.email}</p></div><button className="button ghost" onClick={onLogout}>Sign out</button></section><div className="stats"><article><span>Total attempts</span><strong>{attempts.length}</strong></article><article><span>Passed attempts</span><strong>{attempts.filter(attempt => attempt.passed).length}</strong></article><article><span>Total score</span><strong>{totalCorrect}<small> / {totalQuestions}</small></strong></article></div><div className="section-title"><div><p className="eyebrow">Learning activity</p><h2>Past attempts</h2></div></div>{attempts.length === 0 ? <div className="empty"><h3>No attempts yet</h3><p>Complete your first section and your score will appear here.</p></div> : <div className="attempts">{attempts.map(attempt => <article key={attempt._id || attempt.id}><div><h3>{attempt.section}</h3><p>{formatDate(attempt.completedAt)}</p></div><span className={attempt.passed ? "passed" : "review"}>{attempt.passed ? "Passed" : "Review"}</span><strong>{attempt.percentage}%<small>{attempt.correct} / {attempt.total} · {formatDuration(attempt.durationSeconds)}</small></strong></article>)}</div>}</main>;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [sectionIndex, setSectionIndex] = useState(null);
  const [review, setReview] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => { if (!localStorage.getItem(tokenKey)) return setChecking(false); api.me().then(result => setUser(result.user)).catch(() => localStorage.removeItem(tokenKey)).finally(() => setChecking(false)); }, []);
  const logout = () => { localStorage.removeItem(tokenKey); setUser(null); setPage("home"); };
  const openProfile = async () => { try { const result = await api.me(); setUser(result.user); setPage("profile"); } catch { localStorage.removeItem(tokenKey); setUser(null); } };
  const complete = result => { setUser(result.user); setReview(result.review); setPage("results"); };
  if (checking) return <><Header/><div className="center-loader">Loading CloudPrep…</div></>;
  return <><Header user={user} onProfile={openProfile} onLogout={logout}/>{!user ? <Auth onAuth={account => { setUser(account); setPage("home"); }}/> : page === "home" ? <Home onSections={() => setPage("sections")} onProfile={openProfile}/> : page === "sections" ? <Sections onBack={() => setPage("home")} onStart={index => { setSectionIndex(index); setPage("quiz"); }}/> : page === "quiz" ? <Quiz key={`${sectionIndex}-${Date.now()}`} user={user} sectionIndex={sectionIndex} onBack={() => setPage("sections")} onComplete={complete}/> : page === "results" ? <Results review={review} onSections={() => setPage("sections")} onProfile={openProfile}/> : <Profile user={user} onBack={() => setPage("home")} onLogout={logout}/>}</>;
}
