/**
 * Copyright Dallen Baldwin 2022 - now
 * Distributed under the Boost Software License, Version 1.0.
 * (See accompanying file ./LICENSE or copy at https://www.boost.org/LICENSE_1_0.txt)
 */

import { Request } from "express";

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
