/**
 * Copyright Dallen Baldwin 2022 - now
 * Distributed under the Boost Software License, Version 1.0.
 * (See accompanying file ./LICENSE or copy at https://www.boost.org/LICENSE_1_0.txt)
 */

import { QuickRouter, EndpointOptions } from './QuickRouter';
import { QuickRouterError, QuickRouterErrorOptions } from './QuickRouterError';
import { ErrorCode, ServerError, ClientError } from './constants/errors';
import {
  SuccessCode,
  Information,
  Redirection,
  Success,
} from './constants/successes';

export {
  ErrorCode,
  ServerError,
  ClientError,
  SuccessCode,
  Success,
  Information,
  Redirection,
  QuickRouter,
  EndpointOptions,
  QuickRouterError,
  QuickRouterErrorOptions,
};

import { testingApp } from './tests';
testingApp();
