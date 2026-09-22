import React from 'react';
import './RiskScore.css';

export default function RiskMeter({
  score = 0,
  level = 'UNKNOWN',
  ariaLabel = null,
  className = ''
}) {
  const clampedScore = score === null || score === undefined ? null : Math.max(0, Math.min(100, Number(score)));
  const defaultLabel = clampedScore !== null
    ? `Risk score ${clampedScore} out of 100, ${level.toLowerCase()} risk`
    : 'Risk score not determined';

  // Determine which band is active to apply 100% opacity
  const activeBand = clampedScore === null ? null : (
    clampedScore <= 30 ? 'low' :
    clampedScore <= 60 ? 'medium' :
    clampedScore <= 80 ? 'high' : 'critical'
  );

  return (
    <div
      className={`riskmeter ${className}`}
      role="img"
      aria-label={ariaLabel || defaultLabel}
    >
      <div className="riskmeter__track">
        <span
          className={`riskmeter__band riskmeter__band--low ${activeBand === 'low' ? 'riskmeter__band--active' : ''}`}
          style={{ width: '30%' }}
        />
        <span
          className={`riskmeter__band riskmeter__band--medium ${activeBand === 'medium' ? 'riskmeter__band--active' : ''}`}
          style={{ width: '30%' }}
        />
        <span
          className={`riskmeter__band riskmeter__band--high ${activeBand === 'high' ? 'riskmeter__band--active' : ''}`}
          style={{ width: '20%' }}
        />
        <span
          className={`riskmeter__band riskmeter__band--critical ${activeBand === 'critical' ? 'riskmeter__band--active' : ''}`}
          style={{ width: '20%' }}
        />
        
        {clampedScore !== null && (
          <div
            className="riskmeter__marker"
            style={{ left: `${clampedScore}%` }}
          >
            <div className="riskmeter__marker-triangle" />
            <div className="riskmeter__marker-bar" />
          </div>
        )}
      </div>

      <div className="riskmeter__scale">
        <span>0</span>
        <span>30</span>
        <span>60</span>
        <span>80</span>
        <span>100</span>
      </div>
    </div>
  );
}
