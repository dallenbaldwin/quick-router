import { RequestHandler, Request } from "express";
import { defaultExtras } from "../util/defaultExtras";
import { ErrorCode } from "../constants/errors";
import { QuickRouterError } from "../QuickRouterError";
import { Success, SuccessCode } from "../constants/successes";

export interface HideDefaultExtras {
  /**
   * hide the request `params` object
   */
  params?: boolean;
  /**
   * hide the request `query` object
   */
  query?: boolean;
  /**
   * hide the request `body` object
   */
  body?: boolean;
}

export interface OnError {
  /**
   * a custom error code
   *
   * defaults to `ServerError.INTERNAL_SERVER_ERROR`
   */
  code?: ErrorCode;
  /**
   * a custom message to send back in the response
   */
  message: string;
  /**
   * any additional metadata to include in the response
   */
  extras?: Record<string, any>;
  /**
   * don't include default extras with the provided `extras` or at all
   * if no `extras` are provided
   */
  hideDefaultExtras?: boolean | HideDefaultExtras;
}

export interface OnErrorInput {
  /**
   * the request object
   */
  req: Request;
  /**
   * the error returned
   */
  err: unknown;
}

export interface HandlerOptions {
  /**
   * logic to execute as part of the response
   *
   * automatically wrapped in a `try/catch`
   */
  handler: (req: Request) => Promise<unknown>;
  /**
   * a custom code to send on success
   *
   * defaults to `200`
   */
  code?: SuccessCode;
  /**
   * custom logic to implement for errors
   *
   * if you want the error to fall through again, return `undefined`
   *
   * by default
   * - uses `500` for the code
   * - returns `message` from `ServerUtil.toError`
   * - returns `body`, `params`, `query` from `req` in `extras`
   */
  onError?: (input: OnErrorInput) => OnError | undefined;
}

/**
 * executes a request handler defined in the `HandlerOptions`
 *
 * if an error is thrown during the execution of `HandlerOptions.handler`,
 * it will be automatically parsed as a `QuickRouterError`
 *
 * if `HandlerOptions.onError` is defined any provided `OnError` properties
 * will modify the returned error
 *
 * @param options `HandlerOptions` to configure how responses are handled
 */
export const handler =
  (options: HandlerOptions): RequestHandler =>
  async (req, res) => {
    const { handler, code, onError } = options;
    let response: any;
    let statusCode: SuccessCode | ErrorCode = code ?? Success.OK;
    try {
      const data = await handler(req);
      response = { data };
    } catch (err) {
      let { message, traces, stack, code, extras } =
        QuickRouterError.fromUnknown(err);
      statusCode = code;
      extras = { ...defaultExtras(req), ...extras };
      if (onError)
        try {
          // catch errors returned in `onError`
          const custom = onError({ req, err });
          if (custom?.message) message = custom.message;
          if (custom?.code) statusCode = custom.code;
          if (custom?.extras) extras = { ...extras, ...custom.extras };
          if (custom?.hideDefaultExtras) {
            if (custom.hideDefaultExtras === true) extras = custom.extras;
            else {
              const { body, params, query } = custom.hideDefaultExtras;
              if (body && extras["body"]) delete extras["body"];
              if (params && extras["params"]) delete extras["params"];
              if (query && extras["query"]) delete extras["query"];
            }
          }
        } catch (err) {
          const parsed = QuickRouterError.fromUnknown(err);
          message = parsed.message;
          traces = parsed.traces;
          stack = parsed.stack;
        }
      response = { message, extras, traces, stack };
    } finally {
      res.status(+statusCode).send(response);
    }
  };
