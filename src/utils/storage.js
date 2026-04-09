/** Read a JSON value from localStorage, returning fallback on missing/error */
export const lsGet = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/** Write any value to localStorage as JSON */
export const lsSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage quota exceeded — fail silently
  }
}
