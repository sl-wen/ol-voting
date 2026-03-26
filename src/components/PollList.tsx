// src/components/PollList.tsx
import { useEffect, useState } from 'react'
import type { Poll } from '../types'
import { PollCard } from './PollCard'
import { useSupabase } from '../hooks/useSupabase'
import { Link } from 'react-router-dom'

export function PollList() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getPolls } = useSupabase()

  useEffect(() => {
    async function loadPolls() {
      try {
        setLoading(true)
        const data = await getPolls()
        setPolls(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }
    loadPolls()
  }, [getPolls])

  if (loading) {
    return (
      <div className="container">
        <div className="card text-center">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="card text-center text-error">加载失败: {error}</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <h1>在线匿名投票</h1>
        <p className="text-secondary mb-4">任何人都可以创建投票，匿名参与，结果实时公开</p>
        <Link to="/create">
          <button className="btn btn-primary btn-block">创建新投票</button>
        </Link>
      </div>
      {polls.length === 0 ? (
        <div className="card text-center text-secondary">
          还没有投票，快来创建第一个吧！
        </div>
      ) : (
        polls.map(poll => <PollCard key={poll.id} poll={poll} />)
      )}
    </div>
  )
}
