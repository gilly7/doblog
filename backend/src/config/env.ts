export const env = {
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};
