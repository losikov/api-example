import * as express from 'express'
import {writeJsonResponse} from '@exmpl/utils/express'
 
export function hello(req: express.Request, res: express.Response): void {
  const name = req.query.name || 'stranger'
  writeJsonResponse(res, 200, {"message": `Hello, ${name}!`})
}


export function goodbye(req: express.Request, res: express.Response): void {
  const userId = res.locals.auth.userId
  writeJsonResponse(res, 200, {"message": `Goodbye, ${userId}!`})
}
