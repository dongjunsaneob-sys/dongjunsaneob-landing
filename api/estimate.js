const UPSTREAM_ESTIMATE_API = 'https://dongjunsaneob-landing.vercel.app/api/estimate';

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'OPTIONS, POST');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'OPTIONS, POST');
    return res.status(405).end();
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const payload = Buffer.concat(chunks);

    const upstreamResponse = await fetch(UPSTREAM_ESTIMATE_API, {
      method: 'POST',
      headers: {
        'content-type': req.headers['content-type'] || 'application/octet-stream',
        'content-length': String(payload.length),
      },
      body: payload,
    });

    const responseBody = await upstreamResponse.arrayBuffer();
    const contentType = upstreamResponse.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);
    return res.status(upstreamResponse.status).send(Buffer.from(responseBody));
  } catch (error) {
    console.error('Estimate request proxy failed:', error);
    return res.status(502).json({ error: 'estimate_submission_unavailable' });
  }
};
