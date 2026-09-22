import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Check,
  RotateCcw,
  MessageSquare,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { getEducationTopic, EDUCATION_TOPICS } from '../../data/education';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/feedback/EmptyState';
import './Education.css';

export default function EducationArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const topic = getEducationTopic(slug);

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  if (!topic) {
    return (
      <EmptyState
        title="Guide not found"
        description="We couldn't find the requested educational article."
        action={{ label: 'Back to all topics', onClick: () => navigate('/education'), icon: <ArrowLeft size={16} /> }}
      />
    );
  }

  const handleSelectOption = (questionIdx, optIdx) => {
    if (submittedQuiz) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIdx]: optIdx }));
  };

  const relatedTopics = EDUCATION_TOPICS.filter((t) => t.slug !== topic.slug).slice(0, 3);

  return (
    <div className="education-article-page">
      {/* Sticky Back Bar for Mobile */}
      <div className="education-article-nav">
        <Link to="/education" className="edu-back-link">
          <ArrowLeft size={16} />
          <span>All security topics</span>
        </Link>
      </div>

      <article className="education-article-body">
        {/* Article Header */}
        <header className="article-header">
          <div className="article-meta-badge">
            <BookOpen size={14} />
            <span>{topic.readTime}</span>
          </div>
          <h1 className="article-title">{topic.title}</h1>
          <p className="article-lead">{topic.summary}</p>
        </header>

        {/* 1. What it is */}
        <section className="article-section">
          <h2 className="article-section-title">1. What it is</h2>
          <div className="article-paragraphs">
            {topic.whatItIs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* 2. Warning signs */}
        <section className="article-section">
          <h2 className="article-section-title">2. Warning signs to look for</h2>
          <div className="warning-signs-box">
            {topic.warningSigns.map((sign, i) => (
              <div key={i} className="warning-sign-item">
                <AlertTriangle size={18} className="warning-sign-icon" />
                <span>{sign}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. What to do */}
        <section className="article-section">
          <h2 className="article-section-title">3. What you should do</h2>
          <div className="action-items-box action-items-box--dos">
            {topic.whatToDo.map((todo, i) => (
              <div key={i} className="action-item-row">
                <div className="action-item-badge action-item-badge--do">
                  <CheckCircle2 size={16} />
                </div>
                <span>{todo}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. What not to do */}
        <section className="article-section">
          <h2 className="article-section-title">4. What NOT to do</h2>
          <div className="action-items-box action-items-box--donts">
            {topic.whatNotToDo.map((notDo, i) => (
              <div key={i} className="action-item-row">
                <div className="action-item-badge action-item-badge--dont">
                  <XCircle size={16} />
                </div>
                <span>{notDo}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Practice Quiz */}
        {topic.quiz && topic.quiz.length > 0 && (
          <section className="article-section article-quiz-section">
            <Card padding="lg" className="quiz-card">
              <div className="quiz-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} style={{ color: 'var(--color-primary)' }} />
                  <h3 className="quiz-title">Spot the Scam — Knowledge Check</h3>
                </div>
                <span className="quiz-badge">Interactive Practice</span>
              </div>

              <div className="quiz-questions-list">
                {topic.quiz.map((q, qIdx) => {
                  const userAnswer = selectedAnswers[qIdx];
                  const isAnswered = userAnswer !== undefined;
                  const isCorrect = isAnswered && userAnswer === q.correctIndex;

                  return (
                    <div key={qIdx} className="quiz-question-block">
                      <p className="quiz-question-text">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="quiz-options-list">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAnswer === optIdx;
                          let optionClass = 'quiz-option';

                          if (submittedQuiz) {
                            if (optIdx === q.correctIndex) {
                              optionClass += ' quiz-option--correct';
                            } else if (isSelected && !isCorrect) {
                              optionClass += ' quiz-option--wrong';
                            }
                          } else if (isSelected) {
                            optionClass += ' quiz-option--selected';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              className={optionClass}
                              onClick={() => handleSelectOption(qIdx, optIdx)}
                              disabled={submittedQuiz}
                            >
                              <span className="quiz-option-radio">
                                {submittedQuiz && optIdx === q.correctIndex ? (
                                  <Check size={12} strokeWidth={3} />
                                ) : null}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {submittedQuiz && (
                        <div className={`quiz-explanation ${isCorrect ? 'quiz-explanation--correct' : 'quiz-explanation--wrong'}`}>
                          <strong>{isCorrect ? 'Correct! ' : 'Not quite. '}</strong>
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="quiz-footer">
                {!submittedQuiz ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setSubmittedQuiz(true)}
                    disabled={Object.keys(selectedAnswers).length === 0}
                  >
                    Check my answers
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      setSubmittedQuiz(false);
                      setSelectedAnswers({});
                    }}
                    icon={<RotateCcw size={14} />}
                  >
                    Try quiz again
                  </Button>
                )}
              </div>
            </Card>
          </section>
        )}

        {/* Footer CTAs and Related Topics */}
        <footer className="article-footer">
          <div className="article-cta-box">
            <h3 className="article-cta-title">Received a suspicious message?</h3>
            <p className="article-cta-desc">Put your security knowledge to the test by running a live scan.</p>
            <Button variant="primary" size="lg" to="/scan/message" icon={<MessageSquare size={18} />}>
              Scan a message now
            </Button>
          </div>

          <div className="related-topics-block">
            <h4 className="related-topics-title">Related guides</h4>
            <div className="related-chips">
              {relatedTopics.map((rel) => (
                <Link key={rel.slug} to={`/education/${rel.slug}`} className="related-chip-link">
                  {rel.title}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
