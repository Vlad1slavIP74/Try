export const clearCache = matcher =>
  Object.keys(require.cache).forEach(key => {
    if (key.match(matcher)) {
      delete require.cache[key]
    }
  })
