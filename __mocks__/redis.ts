/* eslint @typescript-eslint/no-explicit-any: 0 */
/* eslint no-bitwise: 0 */

import fst, {RedisStorageType} from './redis_storage'

type Callback<T> = (err: Error | null, reply: T)=> void; 

const redis: any = jest.genMockFromModule('redis')

class RedisClient {
	_callbacks: Map<string, any>

	_storage: Map<string, string>

	constructor() {
		this._callbacks = new Map()
		this._storage = new Map()
	}

	callReconnectCallbacks(): void {
		const error = this._callbacks.get('error')
		if (error !== undefined) error(new Error('mock-redis'))

		const disconnected = this._callbacks.get('disconnected')
		if (disconnected !== undefined) disconnected()
		
		const reconnecting = this._callbacks.get('reconnecting')
		if (reconnecting !== undefined) reconnecting()
		
		const connected = this._callbacks.get('connected')
		if (connected !== undefined) connected()
		
		const ready = this._callbacks.get('ready')
		if (ready !== undefined) ready()
	}

	on(state: string, callback: any): void {
		this._callbacks.set(state, callback)
		if (state === 'ready' || state === 'connected') {
			callback()
		}
	}

	setex(key: string, timeout: number, value: string, callback: Callback<string|null>): boolean {
		if (fst.has(key) || fst.has(value)) {
			if (fst.type(key) & RedisStorageType.returnSet || fst.type(value) & RedisStorageType.returnSet) {
				this.callReconnectCallbacks()
				return false
			} else if (fst.type(key) & RedisStorageType.callbackSet || fst.type(value) & RedisStorageType.callbackSet) {
				callback(new Error('Redis connection error'), null)
				this.callReconnectCallbacks()
				return true
			}
		}
		
		this._storage.set(key, value)
		callback(null, 'Ok')
		return true
	}

	hset(key: string, key2: number, value: string, callback: Callback<string|null>): boolean {
		return this.setex(key, 0, value, callback)
	}

	del(key: string, callback: Callback<string|null>): boolean {
		if (fst.has(key)) {
			if (fst.type(key) & RedisStorageType.returnDelete) {
				this.callReconnectCallbacks()
				return false
			} else if (fst.type(key) & RedisStorageType.callbackDelete) {
				callback(new Error('Redis connection error'), null)
				this.callReconnectCallbacks()
				return true
			}
		}

		this._storage.delete(key)
		callback(null, '1')
		return true
	}

	get(key: string, callback: Callback<string|null>): boolean {
		if (fst.has(key)) {
			if (fst.type(key) & RedisStorageType.returnGet) {
				this.callReconnectCallbacks()
				return false
			} else if (fst.type(key) & RedisStorageType.callbackGet) {
				callback(new Error('Redis connection error'), null)
				this.callReconnectCallbacks()
				return true
			}
		}

		const value = this._storage.get(key)
		callback(null, value !== undefined ? value : null)
		return true
	}

	hmget(key: string, key2: string, callback: Callback<string|null>): boolean {
		return this.get(key, callback)
	}

	quit(cb: ()=> void): void {
		const end = this._callbacks.get('end')
		if (end !== undefined) end()
		cb()
	}
}

function createClient(): RedisClient {
	return new RedisClient()
}

redis.createClient = createClient

module.exports = redis
