import { handleRequest } from '../server/index.mjs';

/**
 * Vercel Serverless Function Entrypoint
 * Routes incoming API requests seamlessly to the ELARA & CO. backend request handler
 */
export default async function handler(req, res) {
  return handleRequest(req, res);
}

