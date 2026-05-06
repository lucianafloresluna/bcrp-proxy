export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const path = req.query.path;
  if (!path) {
    res.status(400).json({ error: 'Falta parametro path' });
    return;
  }

  const bcrpUrl = 'https://estadisticas.bcrp.gob.pe/estadisticas/series/api/' + path;

  const response = await fetch(bcrpUrl);
  const data = await response.json();

  res.setHeader('Cache-Control', 's-maxage=900');
  res.status(200).json(data);
}
