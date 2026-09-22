// src/utils/copy.js

export const RISK_SUMMARIES = {
  LOW: "No strong scam indicators were found. Stay cautious anyway — absence of signals isn't proof it's genuine.",
  MEDIUM: "Some suspicious signals were found. Verify through an official channel before acting.",
  HIGH: "Several strong scam indicators were found. Treat this as unsafe until you verify directly.",
  CRITICAL: "This shows the pattern of a confirmed scam type. Do not interact with it.",
  UNKNOWN: "PhishGuard couldn't complete the analysis for this item."
};

export const BANNED_STRINGS = [
  'definitely',
  '100%',
  'guaranteed safe',
  'confirmed malicious',
  'virus-free',
  'certified'
];

/**
 * Validates copy during dev to ensure honest, non-misleading reporting
 */
export function guardCopy(text) {
  if (typeof text !== 'string') return text;
  if (import.meta.env?.DEV) {
    const lower = text.toLowerCase();
    for (const banned of BANNED_STRINGS) {
      if (lower.includes(banned)) {
        console.warn(`[PhishGuard Guard] Banned certainty string "${banned}" detected in content.`);
      }
    }
  }
  return text;
}

/**
 * Hedged phrasing for AI classifications
 */
export function getHedgedClassification(threatType) {
  if (!threatType) return 'Unable to classify';
  const t = threatType.toLowerCase();
  if (t.includes('phish')) return 'Likely phishing';
  if (t.includes('scam')) return `Likely ${threatType.replace(/_/g, ' ')}`;
  if (t === 'safe' || t === 'none' || t === 'legitimate') return 'No clear scam pattern identified';
  if (t === 'unknown') return 'Unable to classify';
  return `Potential ${threatType.replace(/_/g, ' ')}`;
}

export function getConfidenceLabel(confidence) {
  if (confidence === null || confidence === undefined) return null;
  const val = Number(confidence);
  const normalized = val > 1 ? val / 100 : val;
  if (normalized < 0.5) return 'Low confidence';
  if (normalized <= 0.75) return 'Moderate confidence';
  return 'High confidence';
}
