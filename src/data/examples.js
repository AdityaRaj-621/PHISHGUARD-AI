// src/data/examples.js

export const MESSAGE_EXAMPLES = [
  {
    title: 'Bank OTP phishing',
    subtitle: 'Urgent account suspension with OTP request',
    content: `URGENT: Your bank account will be blocked today. Verify your account immediately using the link below and enter your OTP.\nhttp://secure-hdfc-verify.co/otp`
  },
  {
    title: 'Fake job & placement offer',
    subtitle: 'Work-from-home registration fee scam',
    content: `Congratulations! You have been shortlisted for Amazon remote data entry executive position. Salary: ₹45,000/month. Please pay ₹2,500 mandatory registration and training kit fee within 2 hours to confirm: http://amazon-careers-india.in/pay`
  },
  {
    title: 'Customs delivery fee scam',
    subtitle: 'Postal parcel holding fee pressure',
    content: `IndiaPost Alert: Your international parcel #IN984210 is held at customs due to unpaid delivery duty of ₹45. Pay immediately to avoid package return: http://indiapost-customs-clearance.top/fee`
  }
];

export const URL_EXAMPLES = [
  {
    title: 'Lookalike banking portal',
    subtitle: 'Domain typosquatting mimicking bank login',
    content: 'http://secure-hdfc-verify.co/otp/login.php'
  },
  {
    title: 'Raw IP address login',
    subtitle: 'Direct IP host with unencrypted protocol',
    content: 'http://194.26.29.112:8080/secure/auth'
  },
  {
    title: 'Shortened redirect link',
    subtitle: 'Masked destination via shortening service',
    content: 'https://bit.ly/3xClaims-Verify-Now'
  }
];

export const EMAIL_EXAMPLES = [
  {
    title: 'Suspicious overdue invoice',
    subtitle: 'Discrepancy in sender domain vs brand',
    sender: 'accounts-billing@quick-invoices-notice.com',
    subject: 'FINAL NOTICE: Outstanding invoice #INV-8891 requires immediate clearance',
    content: `Dear Customer,\n\nOur records indicate your pending invoice #INV-8891 of ₹14,200 is 15 days overdue. Failure to remit payment within 24 hours will lead to service termination and legal recovery charges.\n\nReview and authorize payment via our secure gateway.\n\nThank you,\nFinance Department`,
    url: 'http://quick-invoices-portal.com/pay/INV-8891'
  },
  {
    title: 'Fake tech support alert',
    subtitle: 'Impersonation claiming security breach',
    sender: 'security-team@mail-notification-center.org',
    subject: 'Critical Security Alert: Unauthorized sign-in detected',
    content: `We detected a suspicious login attempt to your email account from an unrecognized IP address in Moscow, Russia.\n\nIf this was not you, reset your master password immediately by clicking the verification link. Failure to respond within 1 hour will result in temporary suspension.`,
    url: 'http://security-account-protect.net/reset'
  },
  {
    title: 'Legitimate service newsletter',
    subtitle: 'Standard newsletter with verified links (LOW risk demo)',
    sender: 'updates@github.com',
    subject: 'Your weekly GitHub developer summary',
    content: `Here is your summary of repository stars, pull requests, and discussions for the week. Visit your dashboard on github.com to review notifications and team updates.`,
    url: 'https://github.com/trending'
  }
];
