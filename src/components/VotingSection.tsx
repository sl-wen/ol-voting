// src/components/VotingSection.tsx
import { useState, useEffect, useMemo } from 'react'
import type { Poll, VoteCount } from '../types'
import { useSupabase } from '../hooks/useSupabase'
import { getOrCreateFingerprint } from '../utils/fingerprint'
import { hasVotedLocally, markVotedLocally } from '../utils/voteCheck'
import { ResultChart } from './ResultChart'

interface VotingSectionProps {
  poll: Poll
}

export function VotingSection({ poll }: VotingSectionProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  
  const { checkUserHasVoted, createVote, countVotesByOption } = useSupabase()
  const fingerprint = useMemo(() => getOrCreateFingerprint(), [])

  useEffect(() => {
    async function checkVoteStatus() {
      // 先检查本地存储
      if (hasVotedLocally(poll.id)) {
        setHasVoted(true)
      } else {
        // 再检查数据库
        try {
          const voted = await checkUserHasVoted(poll.id, fingerprint)
          if (voted) {
            markVotedLocally(poll.id)
            setHasVoted(true)
          }
        } catch (e) {
          console.error('检查投票状态失败', e)
        }
      }
      
      // 加载投票结果（即使没投也能看，因为实时公开）
      try {
        await loadResults()
      } catch (e) {
        console.error('加载投票结果失败', e)
        setError(e instanceof Error ? e.message : '加载投票结果失败')
      } finally {
        setChecking(false)
      }
    }
    
    checkVoteStatus()
  }, [poll.id, fingerprint, checkUserHasVoted])

  async function loadResults() {
    const counts = await countVotesByOption(poll.id)
    let total = 0
    Object.values(counts).forEach(c => total += c)
    
    const voteCountsArr: VoteCount[] = poll.options.map(option => ({
      optionId: option.id,
      count: counts[option.id] || 0,
      percentage: total === 0 ? 0 : (counts[option.id] || 0) / total * 100,
    }))
    
    setVoteCounts(voteCountsArr)
    setTotalVotes(total)
  }

  function toggleOption(id: string) {
    if (hasVoted) return
    
    if (poll.allow_multiple) {
      // 多选模式
      if (selected.includes(id)) {
        setSelected(selected.filter(s => s !== id))
      } else {
        setSelected([...selected, id])
      }
    } else {
      // 单选模式
      setSelected([id])
    }
  }

  async function handleVote() {
    if (selected.length === 0) {
      setError('请至少选择一个选项')
      return
    }
    if (!poll.allow_multiple && selected.length > 1) {
      setError('这是单选投票，只能选择一个选项')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 双重检查
      if (hasVotedLocally(poll.id)) {
        setError('你已经投过票了 (24 小时内不能重复投票)')
        return
      }
      const votedCheck = await checkUserHasVoted(poll.id, fingerprint)
      if (votedCheck) {
        markVotedLocally(poll.id)
        setError('你已经投过票了')
        return
      }

      // 获取客户端IP (Supabase 会记录，这里简化处理)
      const voterIp = ''

      await createVote({
        poll_id: poll.id,
        selected_options: selected,
        voter_ip: voterIp,
        voter_fingerprint: fingerprint,
      })

      // 标记本地已投票
      markVotedLocally(poll.id)
      setHasVoted(true)
      
      // 重新加载结果
      await loadResults()
    } catch (e) {
      setError(e instanceof Error ? e.message : '投票失败')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return <div className="mt-4 text-center">加载中...</div>
  }

  return (
    <div>
      {!hasVoted && (
        <div className="card mt-4">
          <h3>请投票</h3>
          {poll.options.map(option => {
            const isSelected = selected.includes(option.id)
            return (
              <div
                key={option.id}
                className={`
                  mt-2 cursor-pointer border
                  ${isSelected ? 'border-2 border-primary' : 'border-gray'}
                `}
                style={{ cursor: 'pointer', borderRadius: 'var(--radius)', padding: '0.75rem' }}
                onClick={() => toggleOption(option.id)}
              >
                <div className="checkbox">
                  {poll.allow_multiple ? (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOption(option.id)}
                    />
                  ) : (
                    <input
                      type="radio"
                      name="poll-option"
                      checked={isSelected}
                      onChange={() => toggleOption(option.id)}
                    />
                  )}
                  <span>{option.text}</span>
                </div>
              </div>
            )
          })}

          {error && <div className="text-error mt-2">{error}</div>}

          <button
            className="btn btn-primary btn-block mt-4"
            onClick={handleVote}
            disabled={loading}
          >
            {loading ? '提交中...' : '提交投票'}
          </button>
        </div>
      )}

      {hasVoted && (
        <div className="mt-4 mb-2 text-success card p-3">
          ✅ 你已成功投票
        </div>
      )}

      <ResultChart poll={poll} voteCounts={voteCounts} totalVotes={totalVotes} />
    </div>
  )
}
