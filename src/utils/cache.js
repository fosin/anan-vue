import Qs from 'qs'

const MemoryCache = {
  data: {},
  set(key, value, maxAge) {
    this.data[key] = {
      maxAge: maxAge || 0,
      value,
      now: Date.now()
    }
  },
  get(key) {
    const cachedItem = this.data[key]
    if (!cachedItem) return null
    const isExpired = Date.now() - cachedItem.now > cachedItem.maxAge
    isExpired && this.delete(key)
    return isExpired ? null : cachedItem.value
  },
  delete(key) {
    return delete this.data[key]
  },
  clear() {
    this.data = {}
  }
}

function generateReqKey(config) {
  const { method, url, params, data } = config
  return [method, url, Qs.stringify(params), Qs.stringify(data)].join('&')
}

function isCacheLike(cache) {
  return !!(
    cache.set &&
    cache.get &&
    cache.delete &&
    cache.clear &&
    typeof cache.get === 'function' &&
    typeof cache.set === 'function' &&
    typeof cache.delete === 'function' &&
    typeof cache.clear === 'function'
  )
}

export function cacheAdapterEnhancer(adapter, options) {
  const {
    maxAge,
    enabledByDefault = true,
    cacheFlag = 'cache',
    defaultCache = MemoryCache
  } = options
  return (config) => {
    // eslint-disable-next-line no-unused-vars
    const { url, method, params, forceUpdate } = config
    const useCache =
      config[cacheFlag] !== undefined && config[cacheFlag] !== null
        ? config[cacheFlag]
        : enabledByDefault
    if (method === 'get' && useCache) {
      const cache = isCacheLike(useCache) ? useCache : defaultCache
      const requestKey = generateReqKey(config)
      let responsePromise = cache.get(requestKey)
      if (!responsePromise || forceUpdate) {
        responsePromise = (async() => {
          try {
            return await adapter(config)
          } catch (reason) {
            cache.delete(requestKey)
            throw reason
          }
        })()
        cache.set(requestKey, responsePromise, maxAge)
        return responsePromise
      }
      return responsePromise
    }

    return adapter(config)
  }
}
