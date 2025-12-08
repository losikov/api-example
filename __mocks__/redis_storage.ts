/* eslint no-bitwise: 0 */

export enum RedisStorageType {
  default = 0,
  returnSet = 1 << 0,
  returnGet = 1 << 1,
  returnDelete = 1 << 2,
  returnAll = returnSet | returnGet | returnDelete,
  callbackSet = 1 << 3,
  callbackGet = 1 << 4,
  callbackDelete = 1 << 5,
  callbackAll = returnSet | returnGet | returnDelete,
}

class RedisStorage {
  private static _instance: RedisStorage

  private _failover: Map<string, RedisStorageType>

  private constructor() {
  	this._failover = new Map()
  }

  public static getInstance(): RedisStorage {
  	if (!RedisStorage._instance) {
  		RedisStorage._instance = new RedisStorage()
  	}
  	return RedisStorage._instance
  }

  public addFailover(token: string, type: RedisStorageType = RedisStorageType.default): this {
  	this._failover.set(token, type)
  	return this
  }

  public clear() {
  	this._failover.clear()
  }

  public has(token: string): boolean {
  	return this._failover.has(token)
  }

  public type(token: string): RedisStorageType {
  	let v = this._failover.get(token)
  	if (v === undefined) v = RedisStorageType.default
  	return v
  }
}

export default RedisStorage.getInstance()
