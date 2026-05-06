export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'Falta path' });

  const url = `https://estadisticas.bcrp.gob.pe/estadisticas/series/api/${path}`;
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'BCRPDashboard/1.0' } });
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error BCRP', detail: err.message });
  }
}
