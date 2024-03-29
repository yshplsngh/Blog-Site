/* The server needs to respond with the Access-Control-Allow-Credentials header in options request
 * The Access-Control-Allow-Credentials header indicates to the client that the HTTP response can be
 * shared when the credentials mode is set to include. If the server's response does not set the
 * Access-Control-Allow-Credentials header to true, the browser reports a network error */

import { whitelist } from "./allowedOrigin";
import { Request, Response, NextFunction } from "express";

const credentials = (req: Request, res: Response, next: NextFunction): void => {
  const origin: string | undefined = req.headers.origin as string | undefined;
  if (origin !== undefined) {
    if (whitelist.includes(origin)) {
      res.header("Access-Control-Allow-Credentials", "true");
    }
  }
  next();
};

export { credentials };
