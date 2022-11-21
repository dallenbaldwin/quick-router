import { Router } from "express";
import { handler, HandlerOptions } from "./handler";

export interface EndpointOptions extends HandlerOptions {
  /**
   * the REST method to attach to router
   */
  method: "post" | "get" | "delete" | "put";
  /**
   * the endpoint for this router segment
   */
  endpoint: string;
}

export function QuickRouter(endpoints: EndpointOptions[]): Router {
  const router = Router();
  endpoints.forEach(({ method, endpoint, ...options }) => {
    router[method](endpoint, handler(options));
  });
  return router;
}
