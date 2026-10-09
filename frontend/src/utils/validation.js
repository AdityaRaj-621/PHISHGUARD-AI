// src/utils/validation.js

export function normalizeUrl(raw) {
  const t = (raw || '').trim();
  if (!t) return { ok: false, error: 'Paste a link first.' };
  const withScheme = /^https?:\/\//i.test(t) ? t : `http://${t}`;
  try {
    const u = new URL(withScheme);
    if (!u.hostname.includes('.') && !/^\d+\.\d+\.\d+\.\d+$/.test(u.hostname)) {
      return { ok: false, error: "That doesn't look like a web address. Example: https://example.com/login" };
    }
    return {
      ok: true,
      value: u.href,
      parsed: {
        protocol: u.protocol.replace(':', ''),
        hostname: u.hostname,
        pathname: u.pathname || '/',
        subdomains: u.hostname.split('.').length > 2 ? u.hostname.split('.').length - 2 : 0,
        port: u.port || null,
        search: u.search || ''
      },
      addedScheme: !/^https?:\/\//i.test(t)
    };
  } catch {
    return { ok: false, error: "That doesn't look like a web address. Example: https://example.com/login" };
  }
}

export function validateMessage(text) {
  const t = (text || '').trim();
  if (!t) return { ok: false, error: 'Paste a message first.' };
  if (t.length < 10) return { ok: false, error: "That's too short to analyze. Paste the full message." };
  if (t.length > 5000) return { ok: false, error: "That's longer than 5,000 characters. Paste the important part." };
  return { ok: true, value: t };
}

export function validateEmail(email) {
  const e = (email || '').trim().toLowerCase();
  if (!e) return { ok: false, error: 'Email address is required.' };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(e)) return { ok: false, error: 'Enter a valid email address.' };
  return { ok: true, value: e };
}

export function getPasswordStrength(password) {
  const p = password || '';
  let score = 0;
  if (p.length >= 8) score += 1;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score += 1;
  if (/\d/.test(p)) score += 1;
  if (/[^A-Za-z0-9]/.test(p) || p.length >= 12) score += 1;

  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const segmentCount = Math.min(4, Math.max(p ? 1 : 0, score));
  return {
    score: segmentCount,
    label: labels[segmentCount - 1] || 'Weak',
    isMinValid: p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p)
  };
}
