// src/utils/fingerprint.ts
const FINGERPRINT_KEY = 'anon-vote-fingerprint'

export function getOrCreateFingerprint(): string {
  let fingerprint = localStorage.getItem(FINGERPRINT_KEY)
  
  if (!fingerprint) {
    fingerprint = generateRandomId()
    localStorage.setItem(FINGERPRINT_KEY, fingerprint)
  }
  
  return fingerprint
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2) + 
         Date.now().toString(36)
}
