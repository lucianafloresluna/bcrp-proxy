const https = require('https');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const path = req.query.path;
  if (!path) {
    res.status(400).json({ error: 'Falta path' });
    return;
  }

  const bcrpUrl = 'https://estadisticas.bcrp.gob.pe/estadisticas/series/api/' + path;

  try {
    const data = await new Promise((resolve, reject) => {
      https.get(bcrpUrl, { headers: { 'User-Agent': 'BCRPDashboard/1.0' } }, (resp) => {
        let body = '';
        resp.on('data', chunk => body += chunk);
        resp.on('end', () => {
          try { resolve(JSON.parse(body)); }
          catch(e) { reject(new Error('JSON parse error: ' + body.substring(0, 100))); }
        });
      }).on('error', reject);
    });

    res.setHeader('Cache-Control', 's-maxage=900');
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
