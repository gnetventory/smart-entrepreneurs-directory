import crypto from 'crypto';

// Hash helper using SHA-256
function sha256(str) {
  return crypto.createHash('sha256').update(String(str)).digest('hex');
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

    // Configured admin password from environment
    const envPassword = String(process.env.ADMIN_PASSWORD || process.env.ADMIN_PIN || '').trim();
    
    // In production, ADMIN_PASSWORD must be configured.
    // If not set, we default to the legacy fallback for safety during initial deployment
    const configuredTarget = envPassword || '1234';

    const submittedHash = sha256(submittedPassword);
    const targetHash = sha256(configuredTarget);

    const isMatch =
      submittedPassword === configuredTarget ||
      submittedHash === targetHash ||
      submittedHash === configuredTarget;

    if (isMatch) {
      const sessionToken = crypto.randomBytes(24).toString('hex');
      return res.status(200).json({
        success: true,
        token: sessionToken,
        timestamp: Date.now(),
      });
    }

    return res.status(401).json({ error: 'Invalid password' });
  } catch (err) {
    return res.status(500).json({ error: 'Authentication error: ' + err.message });
  }
}
