import { Request } from 'express';

/**
 * wraps up the `params`, `query`, and `body` from the `Request` object
 * @param req an `express.Request` object
 * @returns
 */
export const defaultExtras = ({ params, body, query }: Request) => ({
  params,
  query,
  body,
});
