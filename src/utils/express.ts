import * as express from 'express'
import {OutgoingHttpHeaders} from 'http'

export function writeJsonResponse(res: express.Response, code: any, payload: any, headers?: OutgoingHttpHeaders | undefined): void {
  const data = typeof payload === 'object' ? JSON.stringify(payload, null, 2) : payload
  res.writeHead(code, {...headers, 'Content-Type': 'application/json'})
  res.end(data)
}
