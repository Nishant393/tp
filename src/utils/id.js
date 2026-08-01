/** Generates a short unique id, used for bill ids and item row keys. */
export function uid(prefix = '') {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}
