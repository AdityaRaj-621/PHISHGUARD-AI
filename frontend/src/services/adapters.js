// src/services/adapters.js
import { getRiskLevel } from '../utils/risk';
import { RISK_SUMMARIES } from '../utils/copy';

/**
 * Normalizes any backend scan payload into the canonical frontend ScanResult shape (§28 & §34)
 */
export function toScanResult(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      id: 0,
      scan_type: 'message',
      status: 'failed',
      input_text: '',
      input_meta: {},
      risk_score: null,
      risk_level: 'UNKNOWN',
      threat_type: 'unknown',
      summary: RISK_SUMMARIES.UNKNOWN,
      analysis_mode: 'rules_only',
      score_breakdown: null,
      indicators: [],
      recommendations: [],
      ai_analysis: null,
      url_analysis: null,
      created_at: new Date().toISOString()
    };
  }

  const risk_score = raw.risk_score !== undefined && raw.risk_score !== null
    ? Math.max(0, Math.min(100, Number(raw.risk_score)))
    : null;

  const risk_level = raw.risk_level
    ? raw.risk_level.toUpperCase()
    : getRiskLevel(risk_score);

  // Normalize AI confidence if provided as 0-100 instead of 0-1
  let ai_analysis = raw.ai_analysis || null;
  if (ai_analysis && ai_analysis.confidence !== undefined && ai_analysis.confidence > 1) {
    ai_analysis = {
      ...ai_analysis,
      confidence: Number((ai_analysis.confidence / 100).toFixed(2))
    };
  }

  return {
    id: raw.id || Date.now(),
    scan_type: raw.scan_type || 'message',
    status: raw.status || 'completed',
    input_text: raw.input_text || '',
    input_meta: raw.input_meta || {},
    risk_score,
    risk_level,
    threat_type: raw.threat_type || 'unknown',
    summary: raw.summary || RISK_SUMMARIES[risk_level] || RISK_SUMMARIES.UNKNOWN,
    analysis_mode: raw.analysis_mode || 'rules_ai',
    score_breakdown: raw.score_breakdown || null,
    indicators: Array.isArray(raw.indicators) ? raw.indicators : [],
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations : [],
    ai_analysis,
    url_analysis: raw.url_analysis || null,
    created_at: raw.created_at || new Date().toISOString()
  };
}
