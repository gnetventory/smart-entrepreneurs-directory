import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Unsalted SHA-256
function sha256(str) {
  return crypto.createHash('sha256').update(String(str)).digest('hex');
}

// Client-compatible salted SHA-256
function saltedHash(str) {
  return crypto.createHash('sha256').update(`sed-pin-salt-${str}`).digest('hex');
}

// Read database configuration from repository file
function getDbConfig() {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'directory_db.json');
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading directory_db.json in auth handler:', err);
  }
  return null;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const submittedPassword = String(body?.password || body?.pin || '').trim();
    if (!submittedPassword) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Hash candidates from user input
    const submittedPlain = submittedPassword;
    const submittedRawSha = sha256(submittedPassword);
    const submittedSaltedSha = saltedHash(submittedPassword);

    let isMatch = false;

    // 1. Priority 1: Environment variable configured on hosting platform (Vercel)
    const envPassword = String(process.env.ADMIN_PASSWORD || process.env.ADMIN_PIN || '').trim();
    if (envPassword) {
      const envRawSha = sha256(envPassword);
      const envSaltedSha = saltedHash(envPassword);
      if (
        submittedPlain === envPassword ||
        submittedRawSha === envPassword ||
        submittedRawSha === envRawSha ||
        submittedSaltedSha === envSaltedSha
      ) {
        isMatch = true;
      }
    }

    // 2. Priority 2: Persistent database file (data/directory_db.json)
    if (!isMatch) {
      const db = getDbConfig();
      const dbTarget = db?.niaPIN || db?.adminPIN || '';
      if (dbTarget) {
        if (
          submittedPlain === dbTarget ||
          submittedRawSha === dbTarget ||
          submittedSaltedSha === dbTarget
        ) {
          isMatch = true;
        }
      }
    }

    // NOTE: Strictly NO hardcoded 1234 fallback.
    // Only credentials matching ADMIN_PASSWORD or directory_db.json are authenticated.

    if (isMatch) {
      const sessionToken = crypto.randomBytes(24).toString('hex');
      return res.status(200).json({
        success: true,
        token: sessionToken,
        timestamp: Date.now(),
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid security credentials',
    });
  } catch (err) {
    console.error('Serverless auth error:', err);
    return res.status(500).json({
      success: false,
      error: 'Authentication verification service error',
    });
  }
}
