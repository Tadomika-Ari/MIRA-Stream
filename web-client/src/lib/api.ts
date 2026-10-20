const defaultApiBase = 'http://localhost:8000'
const storageKey = 'mira-stream-api-base'

export function normalizeApiBase(value: string) {
  const trimmed = value.trim().replace(/\/$/, '')
  if (!trimmed) return defaultApiBase
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `http://${trimmed}`
}

export function getApiBase() {
  return normalizeApiBase(localStorage.getItem(storageKey) || defaultApiBase)
}

export function setApiBase(value: string) {
  const normalized = normalizeApiBase(value)
  localStorage.setItem(storageKey, normalized)
  return normalized
}

export { defaultApiBase }
