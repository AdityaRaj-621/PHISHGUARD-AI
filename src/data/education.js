// src/data/education.js

export const EDUCATION_TOPICS = [
  {
    slug: 'phishing',
    title: 'How phishing works',
    summary: 'Understand the core psychology and tricks behind digital deception.',
    readTime: '3 min read',
    icon: 'ShieldAlert',
    whatItIs: [
      'Phishing is a form of social engineering where attackers impersonate trusted institutions like banks, employers, postal services, or government agencies to trick you into revealing sensitive information or transferring money.',
      'Attackers rely on emotional triggers — especially fear, urgency, greed, or curiosity — to make you act quickly before checking whether the communication is genuine.',
      'Modern phishing has evolved beyond crude spelling errors to realistic templates, cloned websites, and tailored messages sent via SMS, WhatsApp, Telegram, or email.'
    ],
    warningSigns: [
      'Urgent language demanding immediate action within minutes or hours',
      'Requests for passwords, OTPs, PIN numbers, or card CVVs',
      'Sender email address or phone number has slight spelling discrepancies',
      'Generic greetings like "Dear Customer" combined with serious account warnings',
      'Links that direct to unfamiliar or unverified web domains',
      'Unsolicited payment requests or unexpected parcel customs fees'
    ],
    whatToDo: [
      'Pause and take a deep breath before responding to any urgent claim.',
      'Inspect the actual sender address and full destination URL independently.',
      'Contact the organisation directly through their official app or verified phone number.',
      'Report phishing messages to national cybercrime authorities and relevant service providers.',
      'Use multi-factor authentication (MFA) with authenticator apps rather than SMS where possible.'
    ],
    whatNotToDo: [
      'Never click links or download unexpected attachments from unknown senders.',
      'Never share an OTP, PIN, or banking password over chat, SMS, or phone call.',
      'Do not call phone numbers provided directly inside suspicious messages.',
      'Do not forward suspicious chains or prize messages to family and friends.'
    ],
    quiz: [
      {
        question: 'What is the primary psychological tactic used by phishing attacks?',
        options: ['Creating an artificial sense of urgency or fear', 'Offering complex technical arguments', 'Sending messages only late at night', 'Asking for simple general knowledge'],
        correctIndex: 0,
        explanation: 'Urgency bypasses critical thinking and prompts quick, unverified actions.'
      },
      {
        question: 'Which of the following should you NEVER share with anyone, even a bank representative?',
        options: ['Your full name', 'One-Time Password (OTP)', 'City of residence', 'General email address'],
        correctIndex: 1,
        explanation: 'Legitimate organizations and banks will never ask for your OTP or password.'
      }
    ]
  },
  {
    slug: 'fake-urls',
    title: 'How to spot a fake link',
    summary: 'Learn how to dissect domain names and recognize deceptive lookalikes.',
    readTime: '4 min read',
    icon: 'Link2Off',
    whatItIs: [
      'Scammers register domain names that visually mimic legitimate brands (such as paypa1.com or secure-hdfc-portal.co) to trick victims into entering passwords or credit card numbers.',
      'They also use raw IP addresses (like http://194.26.29.112) or URL shortening services (like bit.ly) to mask where their deceptive links actually lead.',
      'Simply looking at the link preview or protocol is not enough — knowing how to read the exact root domain is crucial for digital safety.'
    ],
    warningSigns: [
      'Character substitutions (like number 1 replacing letter l, or 0 replacing O)',
      'Hyphenated brand names with extra words (e.g., netflix-verify-account.com)',
      'Unusual domain extensions (.top, .xyz, .cc, .work) used for critical financial services',
      'A link that displays as an IP address with numbers and colons',
      'Links where the visible link text in an email points to a completely different destination URL'
    ],
    whatToDo: [
      'Look at the core domain directly before the first single slash (/), which indicates the real website host.',
      'Type the official website address directly into your browser bookmark or address bar.',
      'Use PhishGuard AI URL Scanner to inspect suspicious links safely without visiting them.',
      'Check whether the website uses valid HTTPS encryption, though remember HTTPS alone does not guarantee legitimacy.'
    ],
    whatNotToDo: [
      'Never click on links inside unexpected SMS or chat messages to log in to accounts.',
      'Do not assume a green padlock or "https://" means a site is safe — scammers also get free SSL certificates.',
      'Do not open shortened links (bit.ly, tinyurl) unless you trust the verified sender.'
    ],
    quiz: [
      {
        question: 'In the URL "https://secure-login.hdfcbank.com.scam-domain.top/auth", what is the actual destination domain?',
        options: ['hdfcbank.com', 'secure-login.hdfcbank.com', 'scam-domain.top', 'auth'],
        correctIndex: 2,
        explanation: 'The actual domain is always the part immediately preceding the first single slash path separator.'
      }
    ]
  },
  {
    slug: 'otp-safety',
    title: 'Why you never share an OTP',
    summary: 'The critical role of One-Time Passwords as your last line of defense.',
    readTime: '3 min read',
    icon: 'KeyRound',
    whatItIs: [
      'A One-Time Password (OTP) is a temporary security code generated by your bank or service provider to authenticate high-risk actions such as money transfers, logins, or password resets.',
      'Because OTPs bypass standard password checks, acquiring your OTP is the number one goal of financial phishing campaigns.',
      'No legitimate company, bank manager, government official, or courier delivery driver will ever ask you to read or forward your OTP.'
    ],
    warningSigns: [
      'A caller claiming to be a bank fraud investigator asking for the OTP "to cancel a fraudulent charge"',
      'A message promising cash rewards or cashback if you enter an OTP received on your phone',
      'A buyer on OLX/marketplace asking you to scan a QR code or provide an OTP to "receive money"',
      'A delivery agent claiming they need an OTP before handing over a parcel that you did not order'
    ],
    whatToDo: [
      'Read the full SMS text accompanying the OTP carefully — it states the exact amount and purpose.',
      'Immediately lock or freeze your card/account via official mobile banking if you suspect an OTP leak.',
      'Report unauthorized OTP requests to your bank\'s fraud monitoring helpline.',
      'Switch to hardware security keys or authenticator apps (TOTP) wherever supported.'
    ],
    whatNotToDo: [
      'Never share an OTP with anyone over a phone call, chat, or email under any circumstances.',
      'Do not enter OTPs on third-party websites opened from SMS links.',
      'Never approve a UPI payment request to "receive" funds — receiving money never requires an OTP or PIN.'
    ],
    quiz: [
      {
        question: 'Does receiving money via UPI or online banking ever require entering your UPI PIN or OTP?',
        options: ['Yes, always', 'Only for transactions above ₹10,000', 'No, never', 'Only for international payments'],
        correctIndex: 2,
        explanation: 'Receiving money requires zero PINs or OTPs. Entering a PIN or OTP only authorizes money leaving your account.'
      }
    ]
  },
  {
    slug: 'banking-scams',
    title: 'Bank and payment scams',
    summary: 'Recognize account freeze threats, fake KYC updates, and payment gateway impersonations.',
    readTime: '4 min read',
    icon: 'Building2',
    whatItIs: [
      'Banking scams prey on fear by claiming your bank account, PAN card link, or debit card has been suspended, blocked, or expired.',
      'The message directs you to a fake banking portal designed to capture your net banking customer ID, password, and transaction OTPs in real time.',
      'These scams often spoof the alphanumeric sender ID to make the SMS appear inside your legitimate bank message thread.'
    ],
    warningSigns: [
      'Claims that your account will be suspended within 24 hours unless you complete KYC updates',
      'SMS containing non-official links asking to download an APK or screen-sharing app',
      'Alphanumeric SMS headers containing personal mobile numbers rather than registered corporate sender IDs',
      'Requests to deposit a "refundable processing fee" to release a frozen transfer'
    ],
    whatToDo: [
      'Always access your bank solely through the official mobile application or bookmarked URL.',
      'Visit your nearest bank branch or dial the number printed on the back of your debit card for verification.',
      'Keep transaction alerts enabled for both SMS and registered email.',
      'Report fraudulent SMS to your telecommunications carrier and cybercrime helpline (1930 in India).'
    ],
    whatNotToDo: [
      'Do not click links in SMS regarding KYC, PAN linking, or account deactivation.',
      'Never install third-party APK files or apps like AnyDesk, TeamViewer, or QuickSupport on caller advice.',
      'Do not transfer money to "secure test accounts" suggested by alleged police or bank officers.'
    ],
    quiz: [
      {
        question: 'If you receive an SMS saying your bank account is blocked, what is the safest next action?',
        options: ['Click the link in the message immediately', 'Call the number listed on the back of your bank card', 'Reply with your account number', 'Forward the message to your friends'],
        correctIndex: 1,
        explanation: 'Directly calling the verified helpline on the back of your card ensures you speak with genuine bank staff.'
      }
    ]
  },
  {
    slug: 'job-scams',
    title: 'Fake job and internship offers',
    summary: 'Spot fake employment offers demanding upfront fees, tasks, or security deposits.',
    readTime: '3 min read',
    icon: 'Briefcase',
    whatItIs: [
      'Job and internship scams target students and job seekers with lucrative work-from-home, part-time data entry, or social media rating positions offering high daily payouts.',
      'Once hooked, victims are asked to pay "registration fees", "security deposits", or "documentation charges" before receiving assignments or salary.',
      'Legitimate employers will never ask a candidate to pay money to secure a job or internship.'
    ],
    warningSigns: [
      'Unsolicited job offers sent via WhatsApp or Telegram without prior interviews or applications',
      'Unrealistically high salaries for simple tasks like liking videos or typing captchas',
      'Demands for upfront registration, laptop security deposits, or background check fees',
      'Company emails coming from generic Gmail or Yahoo accounts rather than official domains'
    ],
    whatToDo: [
      'Research the hiring company on official careers portals, LinkedIn, and corporate websites.',
      'Insist on written offer letters from verified company email addresses.',
      'Check company registration credentials and physical office addresses independently.'
    ],
    whatNotToDo: [
      'Never pay money to apply, interview, or receive training for any job.',
      'Do not share copies of national ID cards or bank passbooks with unverified recruiters.',
      'Avoid participating in "prepaid task" groups on Telegram promising investment returns.'
    ],
    quiz: [
      {
        question: 'A recruiter on WhatsApp asks for ₹1,500 to send your appointment letter. What should you do?',
        options: ['Pay it because it is a small amount', 'Refuse and report the sender, as genuine jobs never charge fees', 'Negotiate a discount', 'Share your bank card details'],
        correctIndex: 1,
        explanation: 'Any demand for money in exchange for employment is a scam indicator.'
      }
    ]
  },
  {
    slug: 'investment-scams',
    title: 'Investment and trading scams',
    summary: 'Protect yourself against "guaranteed returns", fake crypto platforms, and pig-butchering scams.',
    readTime: '4 min read',
    icon: 'TrendingUp',
    whatItIs: [
      'Investment scams promise guaranteed, above-market returns on stocks, forex, gold, or cryptocurrency with zero risk.',
      'Victims are directed to counterfeit trading dashboards displaying fabricated profits to encourage larger deposits, before withdrawals are permanently locked behind "tax fees".',
      'Known internationally as romance or pig-butchering schemes, scammers often build rapport over weeks before introducing the fake investment opportunity.'
    ],
    warningSigns: [
      'Promises of guaranteed daily returns (e.g., "Earn 10% daily guaranteed with AI trading")',
      'Exclusive invitation-only WhatsApp or Telegram trading signal channels',
      'Requests to transfer funds to personal UPI IDs or cryptocurrency wallets rather than registered brokers',
      'Demands for advance "withdrawal clearance fees" when attempting to cash out profits'
    ],
    whatToDo: [
      'Verify that investment brokers are officially registered with statutory regulators (e.g., SEBI, SEC, FCA).',
      'Remember the fundamental rule of finance: high returns always entail higher risk; guaranteed returns do not exist.',
      'Consult licensed independent financial advisors before transferring large sums.'
    ],
    whatNotToDo: [
      'Never invest money through unofficial APK apps distributed outside Google Play or Apple App Store.',
      'Do not trust online strangers or dating app matches who offer unsolicited investment advice.',
      'Never pay additional money to "unlock" an account that has restricted your withdrawal.'
    ],
    quiz: [
      {
        question: 'Which phrase is a classic red flag for financial scams?',
        options: ['Past performance is no guarantee of future results', 'Guaranteed 20% return every month with zero risk', 'Investments are subject to market risks', 'Consult your financial advisor'],
        correctIndex: 1,
        explanation: 'No legitimate investment can guarantee high returns without risk.'
      }
    ]
  },
  {
    slug: 'delivery-scams',
    title: 'Parcel and delivery scams',
    summary: 'Identify fake customs fees, missed delivery notices, and postal SMS traps.',
    readTime: '3 min read',
    icon: 'Package',
    whatItIs: [
      'Delivery phishing messages claim a package cannot be delivered due to an incorrect address, unpaid customs duty, or rescheduling fee.',
      'Because e-commerce shopping is ubiquitous, millions of people receive these messages while genuinely waiting for a delivery, increasing response rates.',
      'The included link leads to a cloned courier website demanding payment of a nominal fee (e.g., ₹25 or $2), capturing credit card credentials in the process.'
    ],
    warningSigns: [
      'SMS with vague tracking numbers asking to "update address within 12 hours"',
      'Links with domains ending in .top, .live, .shop instead of official courier domains (indiapost.gov.in, fedex.com)',
      'Demands for small re-delivery fees to release standard domestic parcels',
      'Threats that the parcel will be destroyed if you do not pay immediately'
    ],
    whatToDo: [
      'Check tracking status exclusively on the shopping app where you placed your order.',
      'Copy the tracking ID and enter it on the official postal or courier website manually.',
      'Scan suspicious delivery SMS using PhishGuard AI before interacting.'
    ],
    whatNotToDo: [
      'Never click links in SMS claiming a parcel is stuck at customs or the local depot.',
      'Do not enter card details on unverified web forms to pay small courier charges.',
      'Never call unknown phone numbers provided in delivery failure SMS messages.'
    ],
    quiz: [
      {
        question: 'You receive an SMS: "Your parcel #9812 is held. Pay ₹30 to release: http://post-pkg.top". What should you do?',
        options: ['Pay ₹30 since it is a small amount', 'Do not click the link; check your real order on the store app', 'Call the number from the SMS', 'Reply with your home address'],
        correctIndex: 1,
        explanation: 'Always verify orders through your genuine shopping app, never through unsolicited links.'
      }
    ]
  },
  {
    slug: 'fake-support',
    title: 'Fake customer support',
    summary: 'Avoid fraudulent support numbers on search engines and social media channels.',
    readTime: '3 min read',
    icon: 'Headphones',
    whatItIs: [
      'Cybercriminals create fake helpline numbers and social media support handles for popular banks, payment apps, and airlines.',
      'When users search Google for "customer care number", SEO-poisoned scam sites appear at the top, connecting callers directly to fraudsters.',
      'The fake agent claims to help with a refund or transaction issue while subtly instructing the user to install screen-sharing software or authorize money transfers.'
    ],
    warningSigns: [
      'Customer support numbers found on random forums, Google Maps listings, or non-official websites',
      'Support agents instructing you to download remote access apps (AnyDesk, TeamViewer)',
      'Agents asking for your PIN, passwords, or requesting you to make a small payment to receive a refund',
      'Support accounts on Twitter/X with misspelled handles and recent creation dates'
    ],
    whatToDo: [
      'Only find support contact details inside the official verified mobile application or official website.',
      'Hang up immediately if an agent asks you to install remote control software.',
      'Verify official social media accounts with verified badges before reaching out.'
    ],
    whatNotToDo: [
      'Never trust helpline phone numbers found through simple search engine image or text results.',
      'Do not share your phone screen during a banking support call.',
      'Never approve a UPI request to receive customer service refunds.'
    ],
    quiz: [
      {
        question: 'A support representative asks you to install AnyDesk so they can help refund your money. What should you do?',
        options: ['Install it quickly', 'Hang up immediately — genuine support never asks for remote screen access', 'Ask them for their employee ID first', 'Give them your computer password instead'],
        correctIndex: 1,
        explanation: 'Remote access software gives scammers full visibility and control over your device and banking apps.'
      }
    ]
  },
  {
    slug: 'social-media-scams',
    title: 'Social media and account takeover',
    summary: 'Recognize copyright infringement warnings, account verification scams, and friend impersonations.',
    readTime: '3 min read',
    icon: 'Users',
    whatItIs: [
      'Social media scams aim to hijack high-follower accounts or trick users into sending money to compromised friends.',
      'Common vectors include fake copyright violation DMs, "help me vote in a contest" messages, and deceptive blue badge verification forms.',
      'Once inside, attackers lock out the real owner, enable two-factor authentication to their own devices, and promote crypto scams to the account\'s followers.'
    ],
    warningSigns: [
      'Direct messages claiming your Instagram/Facebook account will be deleted for copyright infringement in 24 hours',
      'A friend suddenly messaging you asking for money or requesting you to forward an SMS code they "accidentally sent you"',
      'Links asking you to log into Instagram or Discord through an external third-party form',
      'Messages asking you to vote for an influencer or tournament by providing your phone number'
    ],
    whatToDo: [
      'Enable two-factor authentication (2FA) using an authenticator app (Google Authenticator, Bitwarden).',
      'Review active login sessions regularly in your social media account settings.',
      'Contact friends through a phone call if they message asking for urgent financial assistance.'
    ],
    whatNotToDo: [
      'Never click links in DMs claiming copyright violations — platforms send official notifications in-app.',
      'Never forward login verification codes or password reset codes to anyone.',
      'Do not reuse the same password across social media and your primary email.'
    ],
    quiz: [
      {
        question: 'You receive an Instagram DM: "Copyright violation on your post. Appeal in 24h at http://meta-appeal.link". What is this?',
        options: ['An official Meta notice', 'A classic phishing scam designed to steal your Instagram credentials', 'A harmless survey', 'A system update'],
        correctIndex: 1,
        explanation: 'Meta never sends copyright notices via direct message; all official notices appear in the in-app support inbox.'
      }
    ]
  },
  {
    slug: 'account-security',
    title: 'Protecting your accounts',
    summary: 'Essential digital hygiene, strong password managers, and multi-factor authentication.',
    readTime: '3 min read',
    icon: 'Lock',
    whatItIs: [
      'Defense in depth means configuring your online accounts so that even if one password is compromised in a data breach, your accounts remain protected.',
      'By combining unique long passwords with hardware or app-based multi-factor authentication, you eliminate over 99% of automated credential stuffing attacks.',
      'Maintaining vigilant cyber habits is a proactive discipline that keeps your identity and finances secure.'
    ],
    warningSigns: [
      'Using the same password across multiple websites and email accounts',
      'Receiving unexpected "login attempt from new device" alerts in your email',
      'Browser warning about compromised passwords saved in keychain',
      'Relying solely on SMS for 2-factor authentication without backup codes'
    ],
    whatToDo: [
      'Use a reputable password manager to generate and store 16+ character unique passwords.',
      'Enable Multi-Factor Authentication (MFA) on all primary email, banking, and social accounts.',
      'Keep your device operating systems, browsers, and antivirus software updated.',
      'Regularly check HaveIBeenPwned to monitor whether your email has appeared in data leaks.'
    ],
    whatNotToDo: [
      'Never use dictionary words, birthdays, or repetitive digits in passwords.',
      'Do not store plain-text passwords in unencrypted notes or text documents.',
      'Never ignore security warnings displayed by your browser or operating system.'
    ],
    quiz: [
      {
        question: 'Which method is the most secure for two-factor authentication?',
        options: ['SMS text message', 'Authenticator app (TOTP) or hardware security key', 'Security question about your first pet', 'Email verification code'],
        correctIndex: 1,
        explanation: 'Authenticator apps and hardware keys cannot be intercepted via SIM-swapping attacks.'
      }
    ]
  }
];

export function getEducationTopic(slug) {
  return EDUCATION_TOPICS.find((t) => t.slug === slug) || null;
}
