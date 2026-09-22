// src/services/mock/fixtures/scans.js

export const INITIAL_MOCK_SCANS = [
  {
    id: 481,
    scan_type: 'message',
    status: 'completed',
    input_text: 'URGENT: Your bank account will be blocked today. Verify your account immediately using the link below and enter your OTP.\nhttp://secure-hdfc-verify.co/otp',
    input_meta: { sender: null, subject: null, url: 'http://secure-hdfc-verify.co/otp' },
    risk_score: 92,
    risk_level: 'HIGH',
    threat_type: 'phishing',
    summary: 'This message shows several strong signs of a phishing attempt. Treat it as unsafe until you verify directly.',
    analysis_mode: 'rules_ai',
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
    ai_analysis: {
      threat_type: 'phishing',
      ai_score: 88,
      confidence: 0.82,
      explanation: 'The message combines severe deadline pressure, an account block threat, and an explicit request for an OTP, which together match classic bank-impersonation phishing schemes.',
      key_signals: ['Deadline pressure', 'OTP request', 'Lookalike banking domain', 'Unencrypted HTTP endpoint'],
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
      suspicious_keywords: ['secure', 'verify', 'otp'],
      reputation: null
    },
    created_at: '2026-03-20T11:02:00Z'
  },
  {
    id: 480,
    scan_type: 'url',
    status: 'completed',
    input_text: 'http://194.26.29.112:8080/secure/login',
    input_meta: { url: 'http://194.26.29.112:8080/secure/login' },
    risk_score: 95,
    risk_level: 'CRITICAL',
    threat_type: 'phishing',
    summary: 'This shows the pattern of a confirmed scam type. Do not interact with it.',
    analysis_mode: 'rules_ai',
    score_breakdown: { rule_score: 98, ai_score: 92, weights: { rule: 0.6, ai: 0.4 } },
    indicators: [
      { id: 1, indicator_type: 'url_ip_host', title: 'Numeric address', description: 'The link points directly to a raw IP address instead of a domain name.', severity: 'high', evidence: '194.26.29.112' },
      { id: 2, indicator_type: 'url_no_https', title: 'No secure connection', description: 'Unencrypted plain HTTP communication.', severity: 'high', evidence: 'http://' }
    ],
    recommendations: [
      { id: 1, title: 'Do not visit this IP address', description: 'Raw IP addresses with login forms are overwhelmingly malicious.', priority: 'critical' },
      { id: 2, title: 'Block the sender', description: 'Block the source communication that provided this link.', priority: 'high' }
    ],
    ai_analysis: {
      threat_type: 'phishing',
      ai_score: 92,
      confidence: 0.91,
      explanation: 'Direct IP host with unencrypted protocol masquerading as a secure login endpoint.',
      key_signals: ['Raw IP address', 'Unencrypted HTTP', 'Suspicious port 8080'],
      status: 'ok'
    },
    url_analysis: {
      url: 'http://194.26.29.112:8080/secure/login',
      https: false,
      domain: '194.26.29.112',
      subdomain_count: 0,
      length: 38,
      ip_host: true,
      has_encoded_chars: false,
      suspicious_keywords: ['secure', 'login'],
      reputation: null
    },
    created_at: '2026-03-20T09:40:00Z'
  },
  {
    id: 479,
    scan_type: 'message',
    status: 'completed',
    input_text: 'Congratulations! You have been selected for Amazon remote data entry job. Pay ₹2,500 registration fee to confirm: http://amazon-careers-india.in/pay',
    input_meta: { url: 'http://amazon-careers-india.in/pay' },
    risk_score: 88,
    risk_level: 'CRITICAL',
    threat_type: 'job_scam',
    summary: 'This shows the pattern of a confirmed scam type. Do not interact with it.',
    analysis_mode: 'rules_ai',
    indicators: [
      { id: 1, indicator_type: 'financial_request', title: 'Payment request', description: 'It asks you to pay a registration fee for employment.', severity: 'high', evidence: 'Pay ₹2,500 registration fee' },
      { id: 2, indicator_type: 'impersonation', title: 'Brand impersonation', description: 'Impersonates Amazon without an official corporate email/portal.', severity: 'high', evidence: 'Amazon remote data entry' }
    ],
    recommendations: [
      { id: 1, title: 'Never pay registration fees for jobs', description: 'Genuine employers never ask for advance payments or training deposits.', priority: 'critical' },
      { id: 2, title: 'Report fake recruiter', description: 'Report the sender contact to cybercrime authorities.', priority: 'high' }
    ],
    ai_analysis: {
      threat_type: 'job_scam',
      ai_score: 88,
      confidence: 0.85,
      explanation: 'Typical advance-fee employment fraud utilizing high salary promises to extract upfront fees.',
      key_signals: ['Upfront fee demand', 'High salary promise', 'Unverified domain'],
      status: 'ok'
    },
    created_at: '2026-03-19T16:15:00Z'
  },
  {
    id: 478,
    scan_type: 'message',
    status: 'completed',
    input_text: 'IndiaPost: Your parcel #IN984210 is held due to pending customs duty of ₹45. Pay now at http://indiapost-customs-duty.top/fee',
    input_meta: { url: 'http://indiapost-customs-duty.top/fee' },
    risk_score: 85,
    risk_level: 'CRITICAL',
    threat_type: 'delivery_scam',
    summary: 'This shows the pattern of a confirmed scam type. Do not interact with it.',
    analysis_mode: 'rules_ai',
    indicators: [
      { id: 1, indicator_type: 'url_lookalike', title: 'Lookalike domain', description: 'Uses .top extension mimicking postal service.', severity: 'high', evidence: 'indiapost-customs-duty.top' },
      { id: 2, indicator_type: 'financial_request', title: 'Customs fee request', description: 'Asks for small nominal fee to capture payment details.', severity: 'high', evidence: 'customs duty of ₹45' }
    ],
    recommendations: [
      { id: 1, title: 'Do not pay customs via SMS links', description: 'Verify international parcel tracking directly on indiapost.gov.in.', priority: 'critical' }
    ],
    ai_analysis: {
      threat_type: 'delivery_scam',
      ai_score: 85,
      confidence: 0.88,
      explanation: 'Phishing campaign impersonating postal service with nominal fee bait.',
      key_signals: ['Postal impersonation', '.top TLD', 'Fee bait'],
      status: 'ok'
    },
    created_at: '2026-03-19T14:30:00Z'
  },
  {
    id: 477,
    scan_type: 'email',
    status: 'completed',
    input_text: 'Dear customer, your invoice #INV-8891 of ₹14,200 is overdue. Immediate clearance required to avoid suspension.',
    input_meta: { sender: 'billing@quick-invoices-notice.com', subject: 'FINAL NOTICE: Invoice #INV-8891', url: 'http://quick-invoices-portal.com/pay' },
    risk_score: 72,
    risk_level: 'HIGH',
    threat_type: 'phishing',
    summary: 'Several strong scam indicators were found. Treat this as unsafe until you verify directly.',
    analysis_mode: 'rules_ai',
    indicators: [
      { id: 1, indicator_type: 'threat_language', title: 'Suspension threat', description: 'Pressures with immediate suspension threats.', severity: 'high', evidence: 'avoid suspension' },
      { id: 2, indicator_type: 'sender_mismatch', title: "Sender doesn't match", description: 'Sending address is not from a registered billing vendor.', severity: 'medium', evidence: 'quick-invoices-notice.com' }
    ],
    recommendations: [
      { id: 1, title: 'Verify invoice with procurement', description: 'Check with your accounting department directly.', priority: 'high' }
    ],
    ai_analysis: {
      threat_type: 'phishing',
      ai_score: 72,
      confidence: 0.74,
      explanation: 'Fake invoice notice with urgency and unverified billing portal.',
      key_signals: ['Urgent payment demand', 'Unrecognized sender domain'],
      status: 'ok'
    },
    created_at: '2026-03-18T18:20:00Z'
  },
  {
    id: 476,
    scan_type: 'url',
    status: 'completed',
    input_text: 'https://bit.ly/3xClaims-Verify-Now',
    input_meta: { url: 'https://bit.ly/3xClaims-Verify-Now' },
    risk_score: 55,
    risk_level: 'MEDIUM',
    threat_type: 'phishing',
    summary: 'Some suspicious signals were found. Verify through an official channel before acting.',
    analysis_mode: 'rules_ai',
    indicators: [
      { id: 1, indicator_type: 'url_shortener', title: 'Shortened link', description: 'A shortener hides the real destination URL.', severity: 'medium', evidence: 'bit.ly/3xClaims-Verify-Now' }
    ],
    recommendations: [
      { id: 1, title: 'Expand shortened URLs', description: 'Use URL expansion tools or official bookmarks rather than clicking blind redirects.', priority: 'normal' }
    ],
    ai_analysis: {
      threat_type: 'phishing',
      ai_score: 55,
      confidence: 0.65,
      explanation: 'URL shortening obfuscates destination; caution advised.',
      key_signals: ['Shortened link', 'Hidden destination'],
      status: 'ok'
    },
    created_at: '2026-03-18T10:15:00Z'
  },
  {
    id: 475,
    scan_type: 'message',
    status: 'completed',
    input_text: 'Special offer! Double your crypto in 24 hours with our automated trading robot. Join VIP group: https://t.me/crypto_double_vip',
    input_meta: { url: 'https://t.me/crypto_double_vip' },
    risk_score: 78,
    risk_level: 'HIGH',
    threat_type: 'investment_scam',
    summary: 'Several strong scam indicators were found. Treat this as unsafe until you verify directly.',
    analysis_mode: 'rules_ai',
    indicators: [
      { id: 1, indicator_type: 'reward_bait', title: 'Unrealistic return claim', description: 'Promises guaranteed 100% returns in 24 hours.', severity: 'high', evidence: 'Double your crypto in 24 hours' }
    ],
    recommendations: [
      { id: 1, title: 'Avoid guaranteed return schemes', description: 'Guaranteed high returns are mathematically impossible in genuine finance.', priority: 'critical' }
    ],
    ai_analysis: {
      threat_type: 'investment_scam',
      ai_score: 78,
      confidence: 0.86,
      explanation: 'Classic crypto doubling scheme funneling users into Telegram trading channels.',
      key_signals: ['Guaranteed returns', 'Telegram funnel'],
      status: 'ok'
    },
    created_at: '2026-03-17T15:00:00Z'
  },
  {
    id: 474,
    scan_type: 'message',
    status: 'completed',
    input_text: 'Instagram Security: Your account @tech_dev will be deleted in 24h due to copyright infringement. Appeal here: http://instagram-copyright-appeal.cc',
    input_meta: { url: 'http://instagram-copyright-appeal.cc' },
    risk_score: 75,
    risk_level: 'HIGH',
    threat_type: 'social_media_scam',
    summary: 'Several strong scam indicators were found. Treat this as unsafe until you verify directly.',
    analysis_mode: 'rules_ai',
    indicators: [
      { id: 1, indicator_type: 'impersonation', title: 'Instagram impersonation', description: 'Impersonates Meta/Instagram security.', severity: 'high', evidence: 'Instagram Security' },
      { id: 2, indicator_type: 'url_lookalike', title: 'Phishing domain', description: 'Third-party .cc domain.', severity: 'high', evidence: 'instagram-copyright-appeal.cc' }
    ],
    recommendations: [
      { id: 1, title: 'Check in-app support inbox', description: 'Meta never sends copyright appeals via direct messages.', priority: 'critical' }
    ],
    ai_analysis: {
      threat_type: 'social_media_scam',
      ai_score: 75,
      confidence: 0.81,
      explanation: 'Credential harvesting campaign targeting social media account takeovers.',
      key_signals: ['Account deletion threat', 'Copyright claim lure'],
      status: 'ok'
    },
    created_at: '2026-03-17T11:45:00Z'
  },
  {
    id: 473,
    scan_type: 'message',
    status: 'completed',
    input_text: '489201 is your Swiggy login OTP. Do not share this code with anyone, including delivery partners.',
    input_meta: {},
    risk_score: 12,
    risk_level: 'LOW',
    threat_type: 'safe',
    summary: 'No strong scam indicators were found. Stay cautious anyway — absence of signals isn\'t proof it\'s genuine.',
    analysis_mode: 'rules_ai',
    indicators: [],
    recommendations: [
      { id: 1, title: 'Keep OTP confidential', description: 'Use only on the official Swiggy application.', priority: 'info' }
    ],
    ai_analysis: {
      threat_type: 'safe',
      ai_score: 12,
      confidence: 0.94,
      explanation: 'Standard system OTP notification explicitly advising not to share the code with anyone.',
      key_signals: ['Standard OTP format', 'Explicit confidentiality warning'],
      status: 'ok'
    },
    created_at: '2026-03-16T19:10:00Z'
  },
  {
    id: 472,
    scan_type: 'email',
    status: 'completed',
    input_text: 'Here is your weekly GitHub developer summary with trending repositories and notifications.',
    input_meta: { sender: 'notifications@github.com', subject: 'Your weekly GitHub summary' },
    risk_score: 8,
    risk_level: 'LOW',
    threat_type: 'safe',
    summary: 'No strong scam indicators were found. Stay cautious anyway — absence of signals isn\'t proof it\'s genuine.',
    analysis_mode: 'rules_ai',
    indicators: [],
    recommendations: [
      { id: 1, title: 'Standard newsletter', description: 'No immediate action necessary.', priority: 'info' }
    ],
    ai_analysis: {
      threat_type: 'safe',
      ai_score: 8,
      confidence: 0.96,
      explanation: 'Legitimate transactional newsletter with verified DKIM/SPF domain reputation.',
      key_signals: ['Verified sender', 'Informational content'],
      status: 'ok'
    },
    created_at: '2026-03-15T12:00:00Z'
  },
  {
    id: 471,
    scan_type: 'message',
    status: 'failed',
    input_text: 'Hello test message with incomplete transmission...',
    input_meta: {},
    risk_score: null,
    risk_level: 'UNKNOWN',
    threat_type: 'unknown',
    summary: "PhishGuard couldn't complete the analysis for this item.",
    analysis_mode: 'rules_only',
    indicators: [],
    recommendations: [
      { id: 1, title: 'Resubmit full text', description: 'Submit the complete message text for a reliable scan.', priority: 'info' }
    ],
    ai_analysis: {
      threat_type: 'unknown',
      ai_score: null,
      confidence: null,
      explanation: 'Analysis timed out before completing.',
      key_signals: [],
      status: 'failed'
    },
    created_at: '2026-03-14T08:30:00Z'
  },
  {
    id: 470,
    scan_type: 'url',
    status: 'completed',
    input_text: 'https://support.apple.com/billing-inquiry',
    input_meta: { url: 'https://support.apple.com/billing-inquiry' },
    risk_score: 5,
    risk_level: 'LOW',
    threat_type: 'safe',
    summary: 'No strong scam indicators were found. Stay cautious anyway — absence of signals isn\'t proof it\'s genuine.',
    analysis_mode: 'rules_ai',
    indicators: [],
    recommendations: [
      { id: 1, title: 'Verified official domain', description: 'apple.com is a verified high-reputation domain.', priority: 'info' }
    ],
    ai_analysis: {
      threat_type: 'safe',
      ai_score: 5,
      confidence: 0.98,
      explanation: 'Official Apple domain with HTTPS encryption and recognized certificates.',
      key_signals: ['Verified root domain', 'Valid HTTPS'],
      status: 'ok'
    },
    url_analysis: {
      url: 'https://support.apple.com/billing-inquiry',
      https: true,
      domain: 'apple.com',
      subdomain_count: 1,
      length: 42,
      ip_host: false,
      has_encoded_chars: false,
      suspicious_keywords: [],
      reputation: 'trusted'
    },
    created_at: '2026-03-14T07:15:00Z'
  }
];
