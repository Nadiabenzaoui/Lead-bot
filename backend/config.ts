const required = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
};

const optional = (key: string, fallback = ''): string =>
  process.env[key] ?? fallback;

export const config = {
  port: parseInt(optional('PORT', '3001')),
  nodeEnv: optional('NODE_ENV', 'development'),

  db: {
    url: required('DATABASE_URL'),
  },

  redis: {
    url: optional('REDIS_URL', 'redis://localhost:6379'),
  },

  jwt: {
    secret: optional('JWT_SECRET', 'super-secret-key'),
  },

  email: {
    host: optional('BREVO_SMTP_HOST', 'smtp-relay.brevo.com'),
    port: parseInt(optional('BREVO_SMTP_PORT', '587')),
    user: optional('BREVO_SMTP_USER'),
    pass: optional('BREVO_SMTP_PASS'),
    fromEmail: optional('FROM_EMAIL'),
    fromName: optional('FROM_NAME'),
  },

  twilio: {
    accountSid: optional('TWILIO_ACCOUNT_SID'),
    authToken: optional('TWILIO_AUTH_TOKEN'),
    phone: optional('TWILIO_PHONE'),
    whatsappFrom: optional('TWILIO_WHATSAPP_FROM'),
  },

  linkedin: {
    cookie: optional('LINKEDIN_COOKIE'),
  },

  telegram: {
    botToken: optional('TELEGRAM_BOT_TOKEN'),
  },

  openai: {
    apiKey: optional('OPENAI_API_KEY'),
  },

  hunter: {
    apiKey: optional('HUNTER_API_KEY'),
  },
};
