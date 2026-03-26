// src/components/CreatePoll.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PollOption } from '../types'
import { useSupabase } from '../hooks/useSupabase'
import { generateRandomId } from '../utils/fingerprint'
import { Link } from 'react-router-dom'

export function CreatePoll() {
  const navigate = useNavigate()
  const { createPoll } = useSupabase()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [allowMultiple, setAllowMultiple] = useState(false)
  const [options, setOptions] = useState<PollOption[]>([
    { id: generateRandomId(), text: '' },
    { id: generateRandomId(), text: '' },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addOption() {
    setOptions([...options, { id: generateRandomId(), text: '' }])
  }

  function removeOption(id: string) {
    if (options.length <= 2) return
    setOptions(options.filter(o => o.id !== id))
  }

  function updateOptionText(id: string, text: string) {
    setOptions(options.map(o => o.id === id ? { ...o, text } : o))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // 验证
    if (!title.trim()) {
      setError('请输入投票标题')
      return
    }
    const validOptions = options.filter(o => o.text.trim())
    if (validOptions.length < 2) {
      setError('至少需要两个有效选项')
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      
      const poll = await createPoll({
        title: title.trim(),
        description: description.trim() || undefined,
        options: validOptions,
        allow_multiple: allowMultiple,
      })

      navigate(`/poll/${poll.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : '创建失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>创建新投票</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>投票标题</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="请输入投票标题"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>投票描述（可选）</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="描述一下这个投票是关于什么的"
              rows={3}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>选项</label>
            {options.map(option => (
              <div key={option.id} className="option-item">
                <input
                  type="text"
                  value={option.text}
                  onChange={e => updateOptionText(option.id, e.target.value)}
                  placeholder="选项内容"
                  disabled={submitting}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    className="btn btn-remove"
                    onClick={() => removeOption(option.id)}
                    disabled={submitting}
                  >
                    删除
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={addOption}
              disabled={submitting}
            >
              + 添加选项
            </button>
          </div>

          <div className="form-group">
            <div className="checkbox">
              <input
                type="checkbox"
                checked={allowMultiple}
                onChange={e => setAllowMultiple(e.target.checked)}
                disabled={submitting}
                id="allow-multiple"
              />
              <label htmlFor="allow-multiple">允许多选</label>
            </div>
          </div>

          {error && (
            <div className="text-error mt-2 mb-4">{error}</div>
          )}

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={submitting}
            >
              {submitting ? '创建中...' : '创建投票'}
            </button>
          </div>
          <div className="mt-2">
            <Link to="/">
              <button type="button" className="btn btn-secondary btn-block">返回首页</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
