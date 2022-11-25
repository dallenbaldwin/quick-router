/**
 * Copyright Dallen Baldwin 2022 - now
 * Distributed under the Boost Software License, Version 1.0.
 * (See accompanying file ./LICENSE or copy at https://www.boost.org/LICENSE_1_0.txt)
 */

/**
 * A union type that encompasses all successful response codes
 */
export type SuccessCode = Information | Success | Redirection;

/**
 * Names, codes, and descriptions take from [mdn](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses)
 */
export enum Information {
  /**
   * This interim response indicates that the client should continue
   * the request or ignore the response if the request is already
   * finished.
   */
  CONTINUE = '100',
  /**
   * This code is sent in response to an Upgrade request
   * header from the client and indicates the protocol the server
   * is switching to.
   */
  SWITCHING_PROTOCOLS = '101',
  /**
   * [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)
   *
   * This code indicates that the server has received and is
   * processing the request, but no response is available yet.
   */
  PROCESSING = '102',
  /**
   * This status code is primarily intended to be used with the
   * Link header, letting the user agent start preloading resources
   * while the server prepares a response.
   */
  EARLY_HINTS = '103',
}

/**
 * names, codes, and descriptions take from [mdn](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses)
 */
export enum Success {
  /**
   * The request succeeded. The result meaning of "success" depends
   * on the HTTP method:
   *
   * - `GET`: The resource has been fetched and transmitted in the message body.
   * - `HEAD`: The representation headers are included in the response without any message body.
   * - `PUT` or `POST`: The resource describing the result of the action is transmitted in the message body.
   * - `TRACE`: The message body contains the request message as received by the server.
   */
  OK = '200',
  /**
   * The request succeeded, and a new resource was created as a result.
   *
   * This is typically the response sent after POST requests,
   * or some PUT requests.
   */
  CREATED = '201',
  /**
   * The request has been received but not yet acted upon.
   *
   * It is noncommittal, since there is no way in HTTP to later send
   * an asynchronous response indicating the outcome of the request.
   *
   * It is intended for cases where another process or server handles
   * the request, or for batch processing.
   */
  ACCEPTED = '202',
  /**
   * This response code means the returned metadata is not exactly
   * the same as is available from the origin server, but is collected
   * from a local or a third-party copy.
   *
   * This is mostly used for mirrors or backups of another resource.
   *
   * Except for that specific case, the 200 OK response is preferred
   * to this status.
   */
  NON_AUTHORITATIVE_INFORMATION = '203',
  /**
   * There is no content to send for this request, but the headers
   * may be useful.
   *
   * The user agent may update its cached headers for this resource
   * with the new ones.
   */
  NO_CONTENT = '204',
  /**
   * Tells the user agent to reset the document which sent this request.
   */
  RESET_CONTENT = '205',
  /**
   * This response code is used when the Range header is sent from
   * the client to request only part of a resource.
   */
  PARTIAL_CONTENT = '206',
  /**
   * [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)
   *
   * Conveys information about multiple resources, for situations
   * where multiple status codes might be appropriate.
   */
  MULTI_STATUS = '207',
  /**
   * [WebDAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)
   *
   * Used inside a <dav:propstat> response element to avoid repeatedly
   * enumerating the internal members of multiple bindings to the
   * same collection.
   */
  ALREADY_REPORTED = '208',
  /**
   * [HTTP Delta encoding](https://datatracker.ietf.org/doc/html/rfc3229)
   *
   * The server has fulfilled a GET request for the resource, and
   * the response is a representation of the result of one or more
   * instance-manipulations applied to the current instance.
   */
  IM_USED = '226',
}

/**
 * names, codes, and descriptions take from [mdn](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses)
 */
export enum Redirection {
  /**
   * The request has more than one possible response.
   *
   * The user agent or user should choose one of them.
   *
   * (There is no standardized way of choosing one of the responses,
   * but HTML links to the possibilities are recommended so the user
   * can pick.)
   */
  MULTIPLE_CHOICES = '300',
  /**
   * The URL of the requested resource has been changed permanently.
   *
   * The new URL is given in the response.
   */
  MOVED_PERMANENTLY = '301',
  /**
   * This response code means that the URI of requested resource
   * has been changed temporarily.
   *
   * Further changes in the URI might be made in the future.
   *
   * Therefore, this same URI should be used by the client in
   * future requests.
   */
  FOUND = '302',
  /**
   * The server sent this response to direct the client to get the
   * requested resource at another URI with a `GET` request.
   */
  SEE_OTHER = '303',
  /**
   * This is used for caching purposes.
   *
   * It tells the client that the response has not been modified,
   *
   * so the client can continue to use the same cached version of the
   * response.
   */
  NOT_MODIFIED = '304',
  /**
   * Defined in a previous version of the HTTP specification to
   * indicate that a requested response must be accessed by a proxy.
   *
   * @deprecated
   * deprecated due to security concerns regarding in-band configuration
   * of a proxy.
   */
  USE_PROXY = '305',
  /**
   * @deprecated
   * This response code is no longer used; it is just reserved.
   *
   * It was used in a previous version of the HTTP/1.1 specification.
   */
  UNUSED = '306',
  /**
   * The server sends this response to direct the client to get the
   * requested resource at another URI with same method that was used
   * in the prior request.
   *
   * This has the same semantics as the 302 Found HTTP response code,
   * with the exception that the user agent must not change the
   * HTTP method used: if a `POST` was used in the first request, a
   * `POST` must be used in the second request.
   */
  TEMPORARY_REDIRECT = '307',
  /**
   * This means that the resource is now permanently located at
   * another URI, specified by the Location: HTTP Response header.
   *
   * This has the same semantics as the 301 Moved Permanently
   * HTTP response code, with the exception that the user agent
   * must not change the HTTP method used: if a `POST` was used in the
   * first request, a `POST` must be used in the second request.
   */
  PERMANENT_REDIRECT = '308',
}
