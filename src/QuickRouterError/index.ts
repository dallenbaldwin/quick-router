/**
 * Copyright Dallen Baldwin 2022 - now
 * Distributed under the Boost Software License, Version 1.0.
 * (See accompanying file ./LICENSE or copy at https://www.boost.org/LICENSE_1_0.txt)
 */

import { ClientError, ServerError, ErrorCode } from '../constants/errors';

interface QuickRouterErrorExtensions {
  /**
   * metadata associated with a `QuickRouterError`
   */
  extras?: Record<string, any>;
  /**
   * the HTTP error code associated with the error
   *
   * client errors are typically thrown when the error is the fault of
   * the requesting client
   *
   * server errors are typically thrown when the error is the fault of
   * the server
   */
  code?: ErrorCode;
}

export interface QuickRouterErrorOptions extends QuickRouterErrorExtensions {
  /**
   * the desired error message
   */
  message: string;
}

type StaticQuickRouterError = (
  message: string,
  extras?: QuickRouterErrorExtensions['extras']
) => QuickRouterError;

export interface QuickRouterError extends Error, QuickRouterErrorExtensions {
  code: ErrorCode;
  /**
   * `Error.stack` is an optional string, containing a newline separated
   * block of error traces
   *
   * `traces` are those, but presented as a list of strings
   */
  traces: string[];
}

/**
 * a customized error object for `QuickRouter` requests which includes
 * an HTTP error code and extra metadata to send back to the client
 *
 * if used in conjunction with a `QuickRouter`, the code and extras will
 * be unwrapped from the error and used to respond to the client
 *
 * if no code is provided in the options, the default code will be
 * `ServerError.INTERNAL_SERVER_ERROR`
 */
export class QuickRouterError extends Error {
  /**
   * creates a new `QuickRouterError` with the supplied message
   * and code of `ServerError.INTERNAL_SERVER_ERROR`
   * @param message the desired error message
   */
  constructor(message: string);
  /**
   * creates a new `QuickRouterError` with the supplied options
   * @param options `QuickRouterErrorOptions` to configure the error
   */
  constructor(options: QuickRouterErrorOptions);
  constructor(error: string | QuickRouterErrorOptions) {
    if (typeof error === 'string') {
      super(error);
      this.code = ServerError.INTERNAL_SERVER_ERROR;
    } else {
      const { message, code, extras } = error;
      super(message);
      this.code = code ?? ServerError.INTERNAL_SERVER_ERROR;
      this.extras = extras;
    }
    this.name = 'QuickRouterError';
    this.traces =
      this.stack
        ?.split(/\n +at/)
        .map((s) => s.trim())
        .map((s) => s.replace(process.cwd(), ''))
        .filter((e) => !e.toLowerCase().includes('quickroutererror')) ?? [];
  }

  /**
   * transforms an unknown error into a `QuickRouterError`
   *
   * @param err an error returned from a try/catch block
   * @param options additional options to include with the generated error
   */
  static fromUnknown = (
    err: unknown,
    options?: QuickRouterErrorExtensions
  ): QuickRouterError => {
    const rest = options ?? {};
    if (err instanceof QuickRouterError) return err;
    else if (err instanceof Error)
      return new QuickRouterError({ message: err.message, ...rest });
    else if (typeof err === 'string')
      return new QuickRouterError({ message: err, ...rest });
    else if (err === null)
      return new QuickRouterError({ message: 'null error', ...rest });
    else if (err === undefined)
      return new QuickRouterError({ message: 'undefined error', ...rest });
    else return new QuickRouterError({ message: JSON.stringify(err), ...rest });
  };

  /**
   * The server cannot or will not process the request due to something
   * that is perceived to be a client error
   *
   * (e.g., malformed request syntax, invalid request message framing,
   * or deceptive request routing).
   * @param message a message describing why the request is bad
   * @param extras optional metadata to include with the error
   * @returns `QuickRouterError` for `ClientError.BAD_REQUEST`
   */
  static BadRequest: StaticQuickRouterError = (message, extras) =>
    new QuickRouterError({ message, code: ClientError.BAD_REQUEST, extras });

  /**
   * Although the HTTP standard specifies "unauthorized",
   * semantically this response means "unauthenticated".
   *
   * That is, the client must authenticate itself to get the
   * requested response.
   * @param message a message describing why the request is unauthorized
   * @param extras optional metadata to include with the error
   * @returns `QuickRouterError` for `ClientError.UNAUTHORIZED`
   */
  static Unauthorized: StaticQuickRouterError = (message, extras) =>
    new QuickRouterError({ message, code: ClientError.UNAUTHORIZED, extras });

  /**
   * The client does not have access rights to the content; that is,
   * it is unauthorized, so the server is refusing to give the
   * requested resource.
   *
   * Unlike 401 Unauthorized, the client's identity is known to
   * the server.
   * @param message a message describing why the request is forbidden
   * @param extras optional metadata to include with the error
   * @returns `QuickRouterError` for `ClientError.FORBIDDEN`
   */
  static Forbidden: StaticQuickRouterError = (message, extras) =>
    new QuickRouterError({ message, code: ClientError.FORBIDDEN, extras });

  /**
   * The server can not find the requested resource.
   *
   * In the browser, this means the URL is not recognized.
   *
   * In an API, this can also mean that the endpoint is valid
   * but the resource itself does not exist.
   *
   * Servers may also send this response instead of 403 Forbidden
   * to hide the existence of a resource from an unauthorized client.
   *
   * This response code is probably the most well known due to
   * its frequent occurrence on the web.
   * @param message a message describing which resource was not found
   * @param extras optional metadata to include with the error
   * @returns `QuickRouterError` for `ClientError.NOT_FOUND`
   */
  static NotFound: StaticQuickRouterError = (message, extras) =>
    new QuickRouterError({ message, code: ClientError.NOT_FOUND, extras });

  /**
   * This response is sent on an idle connection by some servers,
   * even without any previous request by the client.
   *
   * It means that the server would like to shut down this
   * unused connection.
   *
   * This response is used much more since some browsers,
   * like Chrome, Firefox 27+, or IE9, use HTTP pre-connection
   * mechanisms to speed up surfing.
   *
   * Also note that some servers merely shut down the
   * connection without sending this message.
   * @param message a message describing why the request timed out
   * @param extras optional metadata to include with the error
   * @returns `QuickRouterError` for `ClientError.REQUEST_TIMEOUT`
   */
  static RequestTimeout: StaticQuickRouterError = (message, extras) =>
    new QuickRouterError({
      message,
      code: ClientError.REQUEST_TIMEOUT,
      extras,
    });

  /**
   * This response is sent when the requested content
   * has been permanently deleted from server, with no
   * forwarding address.
   *
   * Clients are expected to remove their caches and links
   * to the resource.
   *
   * The HTTP specification intends this status code to be used
   * for "limited-time, promotional services".
   *
   * APIs should not feel compelled to indicate resources
   * that have been deleted with this status code.
   * @param message a message describing which resource is gone
   * @param extras optional metadata to include with the error
   * @returns `QuickRouterError` for `ClientError.GONE`
   */
  static Gone: StaticQuickRouterError = (message, extras) =>
    new QuickRouterError({ message, code: ClientError.GONE, extras });

  /**
   * This error response means that the server, while working as a
   * gateway to get a response needed to handle the request, got an
   * invalid response.
   * @param message a message describing the error received from the upstream server
   * @param extras optional metadata to include with the error
   * @returns `QuickRouterError` for `ServerError.BAD_GATEWAY`
   */
  static BadGateway: StaticQuickRouterError = (message, extras) =>
    new QuickRouterError({ message, code: ServerError.BAD_GATEWAY, extras });

  /**
   * The server is not ready to handle the request.
   *
   * Common causes are a server that is down for maintenance
   * or that is overloaded.
   *
   * Note that together with this response, a user-friendly
   * page explaining the problem should be sent.
   *
   * This response should be used for temporary conditions
   * and the Retry-After HTTP header should, if possible,
   * contain the estimated time before the recovery of the service.
   *
   * The webmaster must also take care about the caching-related
   * headers that are sent along with this response, as these
   * temporary condition responses should usually not be cached.
   * @param message a message describing why the service is unavailable
   * @param extras optional metadata to include with the error
   * @returns `QuickRouterError` for `ServerError.SERVICE_UNAVAILABLE`
   */
  static ServiceUnavailable: StaticQuickRouterError = (message, extras) =>
    new QuickRouterError({
      message,
      code: ServerError.SERVICE_UNAVAILABLE,
      extras,
    });

  /**
   * This error response is given when the server is acting as a
   * gateway and cannot get a response in time.
   * @param message a message describing why the gateway timed out
   * @param extras optional metadata to include with the error
   * @returns `QuickRouterError` for `ServerError.GATEWAY_TIMEOUT`
   */
  static GatewayTimeout: StaticQuickRouterError = (message, extras) =>
    new QuickRouterError({
      message,
      code: ServerError.GATEWAY_TIMEOUT,
      extras,
    });
}
