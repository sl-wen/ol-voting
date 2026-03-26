import { createClient } from '@supabase/supabase-js'
import { useMemo, useCallback } from 'react'
import type { Poll, Vote } from '../types'

export function useSupabase() {
  const url = import.meta.env.VITE_SUPABASE_URL as string
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
  
  const supabase = useMemo(() => {
    return createClient(url, anonKey)
  }, [url, anonKey])

  const getPolls = useCallback(async (): Promise<Poll[]> => {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }, [supabase])

  const getPollById = useCallback(async (id: string): Promise<Poll | null> => {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }, [supabase])

  const createPoll = useCallback(async (poll: Omit<Poll, 'id' | 'created_at'>): Promise<Poll> => {
    const { data, error } = await supabase
      .from('polls')
      .insert(poll)
      .select()
      .single()
    
    if (error) throw error
    return data
  }, [supabase])

  const getVotesForPoll = useCallback(async (pollId: string): Promise<Vote[]> => {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('poll_id', pollId)
    
    if (error) throw error
    return data || []
  }, [supabase])

  const checkUserHasVoted = useCallback(async (pollId: string, fingerprint: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('voter_fingerprint', fingerprint)
      .limit(1)
    
    if (error) throw error
    return data && data.length > 0
  }, [supabase])

  const createVote = useCallback(async (vote: Omit<Vote, 'id' | 'created_at'>): Promise<Vote> => {
    const { data, error } = await supabase
      .from('votes')
      .insert(vote)
      .select()
      .single()
    
    if (error) throw error
    return data
  }, [supabase])

  const countVotesByOption = useCallback(async (pollId: string): Promise<Record<string, number>> => {
    const { data, error } = await supabase
      .from('votes')
      .select('selected_options')
      .eq('poll_id', pollId)
    
    if (error) throw error
    
    const counts: Record<string, number> = {}
    data?.forEach(vote => {
      vote.selected_options.forEach((optionId: string) => {
        counts[optionId] = (counts[optionId] || 0) + 1
      })
    })
    
    return counts
  }, [supabase])

  return {
    supabase,
    getPolls,
    getPollById,
    createPoll,
    getVotesForPoll,
    checkUserHasVoted,
    createVote,
    countVotesByOption
  }
}
