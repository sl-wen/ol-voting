// src/utils/voteCheck.ts
const VOTE_KEY_PREFIX = 'anon-vote-voted-'
const EXPIRY_HOURS = 24

export function hasVotedLocally(pollId: string): boolean {
  const key = VOTE_KEY_PREFIX + pollId
  const voted = localStorage.getItem(key)
  
  if (!voted) return false
  
  const { timestamp } = JSON.parse(voted)
  const now = Date.now()
  const expiryMs = EXPIRY_HOURS * 60 * 60 * 1000
  
  return now - timestamp < expiryMs
}

export function markVotedLocally(pollId: string): void {
  const key = VOTE_KEY_PREFIX + pollId
  localStorage.setItem(key, JSON.stringify({
    timestamp: Date.now()
  }))
}

export function clearLocalVote(pollId: string): void {
  const key = VOTE_KEY_PREFIX + pollId
  localStorage.removeItem(key)
}
