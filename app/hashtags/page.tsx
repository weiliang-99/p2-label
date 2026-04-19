'use client'

import { useState } from 'react'
import { Plus, Copy, Trash2, Check } from 'lucide-react'
import { SURFACE, INPUT_STYLE } from '@/lib/theme'

const INITIAL_SETS = [
  { id: '1', name: 'General Brand',     platform: 'All',       hashtags: ['#P2Label','#SocialMedia','#ContentCreation','#Malaysia','#KL','#Selangor'], usage: 24 },
  { id: '2', name: 'Instagram General', platform: 'Instagram', hashtags: ['#instadaily','#igmalaysia','#malaysiagram','#kualalumpur','#contentcreator','#digitalmarketing'], usage: 18 },
  { id: '3', name: 'CNY Special',       platform: 'All',       hashtags: ['#ChineseNewYear','#CNY2025','#新年快乐','#恭喜发财','#MalaysiaCNY','#过年'], usage: 12 },
  { id: '4', name: 'Raya Promo',        platform: 'All',       hashtags: ['#HariRaya','#RayaSale','#MalaysiaRaya','#SelamatHariRaya','#RayaPromo'], usage: 8 },
  { id: '5', name: 'TikTok Viral',      platform: 'TikTok',    hashtags: ['#fyp','#fypmalaysia','#tiktokmalaysia','#viral','#trending','#contentcreatormy'], usage: 31 },
]

const PLATFORM_COLORS: Record<string, string> = {
  All: '#a78bfa', Instagram: '#E1306C', Facebook: '#1877F2', TikTok: 'rgba(255,255,255,0.7)', LinkedIn: '#0A66C2',
}

export default function HashtagsPage() {
  const [sets, setSets] = useState(INITIAL_SETS)
  const [copied, setCopied] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPlatform, setNewPlatform] = useState('All')
  const [newTags, setNewTags] = useState('')

  const copySet = (id: string, hashtags: string[]) => {
    navigator.clipboard.writeText(hashtags.join(' '))
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const deleteSet = (id: string) => setSets(prev => prev.filter(s => s.id !== id))

  const addSet = () => {
    if (!newName.trim() || !newTags.trim()) return
    const hashtags = newTags.split(/[\s,]+/).map(t => t.startsWith('#') ? t : `#${t}`).filter(Boolean)
    setSets(prev => [...prev, { id: Date.now().toString(), name: newName, platform: newPlatform, hashtags, usage: 0 }])
    setNewName(''); setNewTags(''); setShowNew(false)
  }

  return (
    <div className="p-8 page-enter" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-label text-[13px] uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            [Marketing]
          </p>
          <h1 className="font-display text-5xl" style={{ letterSpacing: '0.05em' }}>HASHTAG MANAGER</h1>
          <p className="font-label text-[13px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
            话题标签管理 · {sets.length} sets
          </p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 font-label text-[13px] uppercase tracking-widest font-bold text-black"
          style={{ background: '#e0ee7d', borderRadius: '999px' }}>
          <Plus size={11} /> New Set
        </button>
      </div>

      {/* New Set Form */}
      {showNew && (
        <div className="mb-6 p-5" style={{ background: '#111111', border: '1px solid rgba(224,238,125,0.2)', borderRadius: '20px' }}>
          <h3 className="font-display text-2xl mb-4" style={{ letterSpacing: '0.05em' }}>CREATE HASHTAG SET</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Set Name
              </label>
              <input value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Deepavali Special"
                className="w-full px-3 py-2 text-lg"
                style={{ ...INPUT_STYLE, borderRadius: '16px' }} />
            </div>
            <div>
              <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Platform
              </label>
              <select value={newPlatform} onChange={e => setNewPlatform(e.target.value)}
                className="w-full px-3 py-2 text-lg"
                style={{ ...INPUT_STYLE, borderRadius: '16px' }}>
                {['All','Instagram','Facebook','TikTok','LinkedIn'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Hashtags <span style={{ color: 'rgba(255,255,255,0.55)' }}>(separate by space or comma)</span>
            </label>
            <textarea value={newTags} onChange={e => setNewTags(e.target.value)}
              rows={3} placeholder="#deepavali #diwali2025 #MalaysiaDeepa..."
              className="w-full px-3 py-2 text-lg resize-none"
              style={{ ...INPUT_STYLE, borderRadius: '16px' }} />
          </div>
          <div className="flex gap-2">
            <button onClick={addSet}
              className="px-4 py-2 font-label text-[13px] uppercase tracking-widest font-bold text-black"
              style={{ background: '#e0ee7d', borderRadius: '999px' }}>
              Save Set
            </button>
            <button onClick={() => setShowNew(false)}
              className="px-4 py-2 font-label text-[13px] uppercase tracking-widest transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', color: 'rgba(255,255,255,0.75)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

      {/* Hashtag Set Cards */}
      <div className="grid grid-cols-2 gap-5">
        {sets.map(set => (
          <div key={set.id} className="p-5 dark-card"
            style={{ ...SURFACE, borderRadius: '20px' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{set.name}</h3>
                  <div className="flex items-center gap-1 px-2 py-0.5" style={{ background: `${PLATFORM_COLORS[set.platform]}20`, borderRadius: '12px' }}>
                    <div className="w-1 h-1 rounded-full" style={{ background: PLATFORM_COLORS[set.platform] }} />
                    <span className="font-label text-[9px] uppercase tracking-widest" style={{ color: PLATFORM_COLORS[set.platform] }}>
                      {set.platform}
                    </span>
                  </div>
                </div>
                <p className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {set.hashtags.length} hashtags · Used {set.usage}×
                </p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => copySet(set.id, set.hashtags)}
                  className="p-1.5 transition-colors"
                  style={copied === set.id
                    ? { background: 'rgba(224,238,125,0.15)', color: '#e0ee7d', borderRadius: '12px' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', borderRadius: '12px' }}>
                  {copied === set.id ? <Check size={12} /> : <Copy size={12} />}
                </button>
                <button onClick={() => deleteSet(set.id)}
                  className="p-1.5 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', borderRadius: '12px' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.12)'; (e.currentTarget as HTMLElement).style.color = '#f87171' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {set.hashtags.map(tag => (
                <span key={tag} className="font-label text-[12px] px-2 py-0.5"
                  style={{ background: 'rgba(224,238,125,0.08)', color: '#e0ee7d', borderRadius: '12px' }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 pt-3 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex-1 h-px overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div style={{ width: `${Math.min(set.usage * 3, 100)}%`, height: '1px', background: '#e0ee7d' }} />
              </div>
              <button onClick={() => copySet(set.id, set.hashtags)}
                className="font-label text-[12px] uppercase tracking-widest whitespace-nowrap transition-colors"
                style={{ color: 'rgba(255,255,255,0.65)' }}>
                Copy all
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
