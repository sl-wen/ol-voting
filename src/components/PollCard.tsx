// src/components/PollCard.tsx
import type { Poll } from '../types'
import { Link } from 'react-router-dom'

interface PollCardProps {
  poll: Poll
}

export function PollCard({ poll }: PollCardProps) {
  return (
    <div className="card">
      <h2>{poll.title}</h2>
      {poll.description && (
        <p className="text-secondary mb-2">{poll.description}</p>
      )}
      <div className="text-secondary text-sm mb-4">
        {poll.options.length} 个选项 · 
        {poll.allow_multiple ? ' 允许多选' : ' 单选'} · 
        {new Date(poll.created_at).toLocaleDateString('zh-CN')}
      </div>
      <Link to={`/poll/${poll.id}`} className="btn btn-primary">
        进入投票
      </Link>
    </div>
  )
}
