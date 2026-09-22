// src/utils/indicators.js
export const INDICATOR_TYPES = {
  urgency: {
    icon: 'Clock',
    title: 'Urgent language',
    description: 'The message pressures you to act immediately, which stops you from checking.'
  },
  credential_request: {
    icon: 'KeyRound',
    title: 'Request for sensitive details',
    description: "It asks for an OTP, password, PIN or card details. Real organisations don't ask for these."
  },
  financial_request: {
    icon: 'IndianRupee',
    title: 'Payment request',
    description: 'It asks you to pay a fee, deposit, or transfer money.'
  },
  threat_language: {
    icon: 'AlertOctagon',
    title: 'Threat or consequence',
    description: 'It threatens account suspension, penalties or legal action.'
  },
  reward_bait: {
    icon: 'Gift',
    title: 'Prize or reward claim',
    description: 'It promises winnings, cash or guaranteed returns.'
  },
  suspicious_url: {
    icon: 'Link2Off',
    title: 'Suspicious link',
    description: 'The link has characteristics commonly seen in phishing pages.'
  },
  url_no_https: {
    icon: 'Unlock',
    title: 'No secure connection',
    description: "The link doesn't use HTTPS, so data sent to it isn't protected."
  },
  url_ip_host: {
    icon: 'Server',
    title: 'Numeric address',
    description: 'The link points to a raw IP address instead of a domain name.'
  },
  url_lookalike: {
    icon: 'Copy',
    title: 'Lookalike domain',
    description: 'The domain imitates a well-known brand with small changes.'
  },
  url_shortener: {
    icon: 'Minimize2',
    title: 'Shortened link',
    description: 'A shortener hides the real destination.'
  },
  sender_mismatch: {
    icon: 'UserX',
    title: "Sender doesn't match",
    description: "The display name and the actual sending domain don't match."
  },
  impersonation: {
    icon: 'Building2',
    title: 'Brand impersonation',
    description: 'It presents itself as a known company or authority.'
  },
  grammar: {
    icon: 'SpellCheck',
    title: 'Unusual wording',
    description: 'Wording or formatting is inconsistent with official communication.'
  },
  attachment: {
    icon: 'Paperclip',
    title: 'Attachment mentioned',
    description: "It refers to an attachment — don't open files you didn't expect."
  }
};

export function getIndicatorMeta(type) {
  return INDICATOR_TYPES[type] || {
    icon: 'Info',
    title: 'Suspicious indicator',
    description: 'An anomaly was detected during the security scan.'
  };
}
