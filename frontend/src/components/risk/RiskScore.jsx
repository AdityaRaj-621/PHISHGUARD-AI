import React, { useState, useEffect } from 'react';
import { getRiskMeta } from '../../utils/risk';
import RiskMeter from './RiskMeter';
import './RiskScore.css';

export default function RiskScore({
  score = null,
  level = 'UNKNOWN',
  size = 'lg',
  showMeter = true,
  showDisclaimer = true,
  animate = false,
  className = ''
}) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const meta = getRiskMeta(level || score);

  useEffect(() => {
    if (!animate || score === null || score === undefined) {
      setDisplayScore(score);
      return;
    }

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setDisplayScore(score);
      return;
    }

    let startTime = null;
    const duration = 800; // 800ms per spec §22 & §42
    let animId = null;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * Number(score)));

      if (progress < 1) {
        animId = requestAnimationFrame(animateCount);
      } else {
        setDisplayScore(score);
      }
    };

    animId = requestAnimationFrame(animateCount);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [score, animate]);

  const isUnknown = score === null || score === undefined;

  return (
    <div className={`risk-score risk-score--${size} ${className}`}>
      <div className="risk-score__number-row">
        <span
          className="risk-score__numeral"
          style={{ color: meta.color }}
        >
          {isUnknown ? '—' : displayScore}
        </span>
        {!isUnknown && <span className="risk-score__denom">/ 100</span>}
      </div>

      {showMeter && (
        <RiskMeter
          score={isUnknown ? null : displayScore}
          level={level}
        />
      )}

      {showDisclaimer && size === 'lg' && (
        <p className="risk-score__disclaimer">
          Detected indicators and analysis signals — not absolute proof.
        </p>
      )}
    </div>
  );
}
