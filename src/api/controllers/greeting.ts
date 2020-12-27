import * as express from "express";
import { writeJsonResponse } from "@exmpl/utils/express";
import GreetingService from "@exmpl/api/services/greeting";
import logger from "@exmpl/utils/logger";
import User from "@exmpl/api/models/user_pg";

export async function hello(req: express.Request, res: express.Response) {
  const name = req.query.name || "stranger";
  writeJsonResponse(res, 200, { message: `Hello, ${name}!` });
}

export function goodbye(req: express.Request, res: express.Response): void {
  const userId = res.locals.auth.userId;
  GreetingService.goodbye(userId)
    .then((message) => {
      writeJsonResponse(res, 200, message);
    })
    .catch((err) => {
      logger.error(`goodbye: ${err}`);
      writeJsonResponse(res, 500, {
        error: {
          type: "internal_server_error",
          message: "Internal Server Error",
        },
      });
    });
}
