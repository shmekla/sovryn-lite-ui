import { VercelRequest, VercelResponse } from '@vercel/node';

const API_ENABLED = !!process.env.TENDERLY_API_KEY;

export default async (request: VercelRequest, response: VercelResponse) => {
  switch (request.method) {
    case 'GET':
      response.status(200).json({ enabled: API_ENABLED });
      break;
    case 'POST':
      if (API_ENABLED) {
        response.status(200).json({ enabled: API_ENABLED });
      } else {
        response.status(405).json({ error: 'Method Not Allowed' });
      }
      break;
    default:
      response.status(405).json({ error: 'Method Not Allowed' });
      break;
  }
};
