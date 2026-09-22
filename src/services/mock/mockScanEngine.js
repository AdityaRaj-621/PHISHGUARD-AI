// src/services/mock/mockScanEngine.js
import { getRiskLevel } from '../../utils/risk';
import { RISK_SUMMARIES } from '../../utils/copy';

export function runMockScan({ content = '', url = '', sender = '', subject = '', body = '', scanType = 'message' }) {
  const fullText = [content, url, sender, subject, body].filter(Boolean).join(' ');

  // 1. Failure simulation hooks (§36)
  if (fullText.includes('FORCE_ERROR')) {
    const err = new Error('Analysis service unavailable.');
    err.response = { status: 500, data: { detail: 'Internal engine error during inspection.' } };
    throw err;
  }

  if (fullText.includes('FORCE_TIMEOUT')) {
    // Return a promise that never resolves or errors out after 35s
    return new Promise((_, reject) => {
      setTimeout(() => {
        const err = new Error('Request timed out.');
        err.code = 'ECONNABORTED';
        reject(err);
      }, 35000);
    });
  }

  const isForceAiFail = fullText.includes('FORCE_AI_FAIL');

  // 2. Canonical Demo Scenario match (§44)
  const isDemoMessage = fullText.includes('URGENT: Your bank account will be blocked today') ||
    (fullText.includes('bank account will be blocked') && fullText.includes('OTP'));

  if (isDemoMessage) {
    return {
      id: Date.now(),
      scan_type: scanType,
      status: 'completed',
      input_text: content || fullText,
      input_meta: { sender: sender || null, subject: subject || null, url: 'http://secure-hdfc-verify.co/otp' },
      risk_score: 92,
      risk_level: 'HIGH',
      threat_type: 'phishing',
      summary: RISK_SUMMARIES.HIGH,
      analysis_mode: isForceAiFail ? 'rules_only' : 'rules_ai',
      score_breakdown: { rule_score: 95, ai_score: 88, weights: { rule: 0.6, ai: 0.4 } },
      indicators: [
        {
          id: 1,
          indicator_type: 'urgency',
          title: 'Urgent language',
          description: 'The message pressures you to act immediately, which stops you from checking.',
          severity: 'medium',
          evidence: 'URGENT: ... blocked today'
        },
        {
          id: 2,
          indicator_type: 'threat_language',
          title: 'Account threat',
          description: 'It threatens that your account will be blocked.',
          severity: 'high',
          evidence: 'will be blocked today'
        },
        {
          id: 3,
          indicator_type: 'credential_request',
          title: 'OTP request',
          description: 'It asks you to enter an OTP. Legitimate banks never ask for this via messages.',
          severity: 'high',
          evidence: 'enter your OTP'
        },
        {
          id: 4,
          indicator_type: 'suspicious_url',
          title: 'Suspicious link',
          description: 'The link uses a lookalike domain without HTTPS encryption.',
          severity: 'high',
          evidence: 'http://secure-hdfc-verify.co/otp'
        }
      ],
      recommendations: [
        { id: 1, title: "Don't click the link", description: "Open your bank's official mobile app instead.", priority: 'critical' },
        { id: 2, title: 'Never share your OTP', description: 'Banks never ask for OTPs or login codes by message.', priority: 'critical' },
        { id: 3, title: 'Verify with your bank', description: 'Call the verified phone number printed on the back of your card.', priority: 'high' },
        { id: 4, title: 'Report the message', description: "Forward it to your bank's fraud reporting desk or cybercrime portal (1930).", priority: 'normal' }
      ],
      ai_analysis: isForceAiFail ? {
        threat_type: 'unknown',
        ai_score: null,
        confidence: null,
        explanation: null,
        key_signals: [],
        status: 'failed'
      } : {
        threat_type: 'phishing',
        ai_score: 88,
        confidence: 0.82,
        explanation: 'The message combines deadline pressure, an account suspension threat, and an explicit request for an OTP, which together match common bank-impersonation phishing.',
        key_signals: ['Deadline pressure', 'OTP request', 'Lookalike banking domain'],
        status: 'ok'
      },
      url_analysis: {
        url: 'http://secure-hdfc-verify.co/otp',
        https: false,
        domain: 'secure-hdfc-verify.co',
        subdomain_count: 1,
        length: 34,
        ip_host: false,
        has_encoded_chars: false,
        suspicious_keywords: ['verify', 'otp'],
        reputation: null
      },
      created_at: new Date().toISOString()
    };
  }

  // 3. Dynamic Rule & AI Analysis Engine for other inputs
  const indicators = [];
  const lower = fullText.toLowerCase();

  let ruleScore = 10;
  let threatType = 'safe';

  // Urgency check
  if (lower.includes('urgent') || lower.includes('immediately') || lower.includes('24 hour') || lower.includes('right now') || lower.includes('act fast')) {
    indicators.push({
      id: 1,
      indicator_type: 'urgency',
      title: 'Urgent language',
      description: 'The message creates false urgency to force quick compliance.',
      severity: 'medium',
      evidence: lower.match(/(urgent|immediately|24 hour|right now|act fast)/i)?.[0] || 'Urgent wording'
    });
    ruleScore += 25;
    threatType = 'phishing';
  }

  // Credential check
  if (lower.includes('otp') || lower.includes('password') || lower.includes('pin') || lower.includes('cvv') || lower.includes('credentials')) {
    indicators.push({
      id: 2,
      indicator_type: 'credential_request',
      title: 'Request for sensitive details',
      description: 'Asks for credentials or verification codes that legitimate organizations do not request.',
      severity: 'high',
      evidence: lower.match(/(otp|password|pin|cvv|credentials)/i)?.[0] || 'OTP request'
    });
    ruleScore += 35;
    threatType = 'otp_scam';
  }

  // Financial request
  if (lower.includes('fee') || lower.includes('pay') || lower.includes('₹') || lower.includes('deposit') || lower.includes('transfer') || lower.includes('$')) {
    indicators.push({
      id: 3,
      indicator_type: 'financial_request',
      title: 'Payment request',
      description: 'Demands advance money, registration fee, or transfer.',
      severity: 'high',
      evidence: lower.match(/(pay ₹?\d+|fee|registration fee|deposit|transfer)/i)?.[0] || 'Payment request'
    });
    ruleScore += 20;
    if (threatType === 'safe') threatType = lower.includes('job') || lower.includes('salary') ? 'job_scam' : 'banking_scam';
  }

  // Threat language
  if (lower.includes('block') || lower.includes('suspend') || lower.includes('legal action') || lower.includes('penalty') || lower.includes('police')) {
    indicators.push({
      id: 4,
      indicator_type: 'threat_language',
      title: 'Account threat or consequence',
      description: 'Threatens service loss or penalties.',
      severity: 'high',
      evidence: lower.match(/(blocked|suspended|legal action|penalty|police)/i)?.[0] || 'Threat'
    });
    ruleScore += 25;
    if (threatType === 'safe') threatType = 'phishing';
  }

  // URL checks
  const extractedUrl = fullText.match(/https?:\/\/[^\s]+/i)?.[0] || (scanType === 'url' ? fullText.trim() : null);
  let urlAnalysis = null;

  if (extractedUrl) {
    const isHttps = extractedUrl.startsWith('https://');
    const isIp = /\d+\.\d+\.\d+\.\d+/.test(extractedUrl);
    const isShortener = /bit\.ly|tinyurl|t\.co|goo\.gl/.test(extractedUrl);
    const isLookalike = /\.top|\.cc|\.xyz|\.work|-verify|-login|-secure/.test(extractedUrl);

    if (!isHttps) {
      indicators.push({
        id: 5,
        indicator_type: 'url_no_https',
        title: 'No secure connection',
        description: "The link doesn't use HTTPS encryption.",
        severity: 'high',
        evidence: 'http://'
      });
      ruleScore += 15;
    }

    if (isIp) {
      indicators.push({
        id: 6,
        indicator_type: 'url_ip_host',
        title: 'Numeric IP address host',
        description: 'Direct IP host instead of domain name.',
        severity: 'high',
        evidence: extractedUrl
      });
      ruleScore += 30;
      threatType = 'phishing';
    }

    if (isShortener) {
      indicators.push({
        id: 7,
        indicator_type: 'url_shortener',
        title: 'Shortened link',
        description: 'Masks true destination.',
        severity: 'medium',
        evidence: extractedUrl
      });
      ruleScore += 15;
    }

    if (isLookalike) {
      indicators.push({
        id: 8,
        indicator_type: 'url_lookalike',
        title: 'Lookalike domain',
        description: 'Imitates a known domain structure.',
        severity: 'high',
        evidence: extractedUrl
      });
      ruleScore += 25;
      threatType = 'phishing';
    }

    urlAnalysis = {
      url: extractedUrl,
      https: isHttps,
      domain: extractedUrl.replace(/https?:\/\//, '').split('/')[0],
      subdomain_count: 1,
      length: extractedUrl.length,
      ip_host: isIp,
      has_encoded_chars: extractedUrl.includes('%'),
      suspicious_keywords: ['verify', 'auth', 'pay'].filter((k) => lower.includes(k)),
      reputation: isLookalike || isIp ? 'untrusted' : 'neutral'
    };
  }

  const finalScore = Math.min(100, Math.max(0, indicators.length === 0 ? (lower.length > 20 ? 8 : 15) : ruleScore));
  const finalLevel = getRiskLevel(finalScore);

  // Recommendations
  const recommendations = [];
  if (finalLevel === 'CRITICAL' || finalLevel === 'HIGH') {
    recommendations.push(
      { id: 1, title: "Don't click any links in it", description: "Open the organisation's app or type the verified address yourself.", priority: 'critical' },
      { id: 2, title: 'Never share OTPs or passwords', description: 'No legitimate organization asks for verification codes by message.', priority: 'critical' },
      { id: 3, title: 'Verify through an official channel', description: 'Contact the institution directly using their published phone number.', priority: 'high' },
      { id: 4, title: 'Report and delete', description: 'Report the message to cybercrime authorities and delete it.', priority: 'normal' }
    );
  } else if (finalLevel === 'MEDIUM') {
    recommendations.push(
      { id: 1, title: 'Verify before taking action', description: 'Check the sender details through an independent channel.', priority: 'high' },
      { id: 2, title: 'Inspect destination links', description: 'Do not enter passwords on unexpected redirect pages.', priority: 'normal' }
    );
  } else {
    recommendations.push(
      { id: 1, title: 'Stay vigilant', description: 'No obvious scam patterns detected. Always verify unexpected payment requests.', priority: 'info' }
    );
  }

  const aiAnalysis = isForceAiFail ? {
    threat_type: 'unknown',
    ai_score: null,
    confidence: null,
    explanation: null,
    key_signals: [],
    status: 'failed'
  } : {
    threat_type: threatType,
    ai_score: finalScore,
    confidence: finalScore > 60 ? 0.84 : 0.65,
    explanation: indicators.length > 0
      ? `Analysis detected ${indicators.length} warning signals including ${indicators.map((i) => i.title.toLowerCase()).join(', ')}.`
      : 'Content did not exhibit typical deceptive or coercive scam patterns.',
    key_signals: indicators.map((i) => i.title),
    status: 'ok'
  };

  return {
    id: Date.now(),
    scan_type: scanType,
    status: 'completed',
    input_text: content || fullText,
    input_meta: { sender: sender || null, subject: subject || null, url: extractedUrl },
    risk_score: finalScore,
    risk_level: finalLevel,
    threat_type: threatType,
    summary: RISK_SUMMARIES[finalLevel] || RISK_SUMMARIES.UNKNOWN,
    analysis_mode: isForceAiFail ? 'rules_only' : 'rules_ai',
    score_breakdown: { rule_score: finalScore, ai_score: finalScore, weights: { rule: 0.6, ai: 0.4 } },
    indicators,
    recommendations,
    ai_analysis: aiAnalysis,
    url_analysis: urlAnalysis,
    created_at: new Date().toISOString()
  };
}
