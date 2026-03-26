// src/components/PollDetail.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Poll } from '../types'
import { useSupabase } from '../hooks/useSupabase'
import { VotingSection } from './VotingSection'
import { Link } from 'react-router-dom'

export function PollDetail() {
  const { id } = useParams<{ id: string }>()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getPollById } = useSupabase()

  useEffect(() => {
    async function loadPoll() {
      if (!id) return
      
      try {
        setLoading(true)
        const data = await getPollById(id)
        setPoll(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }
    
    loadPoll()
  }, [id, getPollById])

  if (loading) {
    return (
      <div className="container">
        <div className="card text-center">加载中...</div>
      </div>
    )
  }

  if (error || !poll) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>投票不存在</h2>
          <p className="text-secondary mt-2">{error}</p>
          <Link to="/">
            <button className="btn btn-primary mt-4">返回首页</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <h1>{poll.title}</h1>
        {poll.description && (
          <p className="text-secondary mb-2">{poll.description}</p>
        )}
        <div className="text-secondary text-sm">
          {poll.options.length} 个选项 · {poll.allow_multiple ? '允许多选' : '单选'}
        </div>
      </div>

      <VotingSection poll={poll} />

      <div className="mt-4">
        <Link to="/">
          <button className="btn btn-secondary">返回首页</button>
        </Link>
      </div>
    </div>
  )
}
