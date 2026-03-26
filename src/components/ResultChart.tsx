// src/components/ResultChart.tsx
import type { Poll, VoteCount } from '../types'

interface ResultChartProps {
  poll: Poll
  voteCounts: VoteCount[]
  totalVotes: number
}

export function ResultChart({ poll, voteCounts, totalVotes }: ResultChartProps) {
  // 按投票数排序
  const sortedCounts = [...voteCounts].sort((a, b) => b.count - a.count)
  
  return (
    <div className="card mt-4">
      <h3>投票结果 ({totalVotes} 票)</h3>
      {sortedCounts.map(({ optionId, count, percentage }) => {
        const option = poll.options.find(o => o.id === optionId)
        if (!option) return null
        
        return (
          <div key={optionId} className="mt-2">
            <div className="result-text">
              <span>{option.text}</span>
              <span>{count} 票 ({percentage.toFixed(1)}%)</span>
            </div>
            <div className="result-bar-container">
              <div
                className="result-bar"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
