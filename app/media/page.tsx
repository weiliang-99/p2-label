'use client'

import { useState } from 'react'
import { Upload, Grid, List, Search, Image, Video } from 'lucide-react'
import { SURFACE } from '@/lib/theme'

const MOCK_MEDIA = [
  { id: '1', name: 'cny-banner.jpg',     type: 'image', size: '2.4 MB', tags: ['CNY','banner'],    emoji: '🧧', accent: '#e0ee7d' },
  { id: '2', name: 'product-shot-1.jpg', type: 'image', size: '1.8 MB', tags: ['product','clean'],  emoji: '📦', accent: '#60a5fa' },
  { id: '3', name: 'team-bts.mp4',       type: 'video', size: '24 MB',  tags: ['team','bts'],       emoji: '🎬', accent: '#a78bfa' },
  { id: '4', name: 'logo-white.png',     type: 'image', size: '0.3 MB', tags: ['brand','logo'],     emoji: '✨', accent: '#e0ee7d' },
  { id: '5', name: 'raya-promo.jpg',     type: 'image', size: '3.1 MB', tags: ['raya','promo'],     emoji: '🌙', accent: '#34d399' },
  { id: '6', name: 'deepavali.jpg',      type: 'image', size: '2.7 MB', tags: ['deepavali','festive'],emoji: '🪔', accent: '#fb923c' },
  { id: '7', name: 'collab-video.mp4',   type: 'video', size: '18 MB',  tags: ['collab'],           emoji: '🤝', accent: '#a78bfa' },
  { id: '8', name: 'testimonial.png',    type: 'image', size: '1.2 MB', tags: ['client','quote'],   emoji: '💬', accent: '#60a5fa' },
]

export default function MediaPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')
  const [selected, setSelected] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const filtered = MOCK_MEDIA.filter(m => {
    if (filter !== 'all' && m.type !== filter) return false
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) &&
        !m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false
    return true
  })

  return (
    <div className="p-8 page-enter" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-label text-[13px] uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            [Marketing]
          </p>
          <h1 className="font-display text-5xl" style={{ letterSpacing: '0.05em' }}>MEDIA LIBRARY</h1>
          <p className="font-label text-[13px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
            媒体库 · {MOCK_MEDIA.length} files
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 font-label text-[13px] uppercase tracking-widest font-bold text-black"
          style={{ background: '#e0ee7d', borderRadius: '999px' }}>
          <Upload size={11} /> Upload Media
        </button>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false) }}
        className="p-8 text-center mb-6 cursor-pointer transition-all"
        style={{
          border: dragging ? '1px dashed rgba(224,238,125,0.5)' : '1px dashed rgba(255,255,255,0.12)',
          background: dragging ? 'rgba(224,238,125,0.04)' : 'transparent',
          borderRadius: '20px',
        }}>
        <Upload size={24} className="mx-auto mb-2" style={{ color: dragging ? '#e0ee7d' : 'rgba(255,255,255,0.2)' }} />
        <p className="text-lg" style={{ color: 'rgba(255,255,255,0.65)' }}>Drag & drop files here</p>
        <p className="font-label text-[12px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
          JPG, PNG, WebP, GIF, MP4 · Max 100MB per file
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.6)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search files or tags..."
            className="w-full pl-8 pr-3 py-2 font-label text-[12px]"
            style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', borderRadius: '16px' }} />
        </div>

        <div className="flex overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px' }}>
          {(['all', 'image', 'video'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-colors"
              style={filter === f ? { background: '#e0ee7d', color: '#000' } : { color: 'rgba(255,255,255,0.65)' }}>
              {f}
            </button>
          ))}
        </div>

        <div className="flex overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px' }}>
          <button onClick={() => setView('grid')} className="p-2 transition-colors"
            style={view === 'grid' ? { background: '#e0ee7d', color: '#000' } : { color: 'rgba(255,255,255,0.65)' }}>
            <Grid size={13} />
          </button>
          <button onClick={() => setView('list')} className="p-2 transition-colors"
            style={view === 'list' ? { background: '#e0ee7d', color: '#000' } : { color: 'rgba(255,255,255,0.65)' }}>
            <List size={13} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(file => (
            <div key={file.id}
              onClick={() => setSelected(selected === file.id ? null : file.id)}
              className="cursor-pointer transition-all overflow-hidden"
              style={{
                ...SURFACE,
                borderRadius: '20px',
                borderColor: selected === file.id ? '#e0ee7d' : 'rgba(255,255,255,0.07)',
              }}>
              <div className="aspect-video flex items-center justify-center relative text-4xl"
                style={{ background: `${file.accent}12` }}>
                {file.emoji}
                {file.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '50%' }}>
                      <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid white', marginLeft: 2 }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-[13px] font-medium truncate" style={{ color: 'rgba(255,255,255,0.8)' }}>{file.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{file.size}</p>
                  <div style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {file.type === 'image' ? <Image size={9} /> : <Video size={9} />}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {file.tags.map(t => (
                    <span key={t} className="font-label text-[9px] px-1.5 py-0.5"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', borderRadius: '10px' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div style={{ ...SURFACE, borderRadius: '20px', overflow: 'hidden' }}>
          <div className="grid grid-cols-5 gap-4 px-4 py-2.5 font-label text-[12px] uppercase tracking-[0.15em]"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#0d0d0d', color: 'rgba(255,255,255,0.65)' }}>
            <span className="col-span-2">File</span>
            <span>Type</span>
            <span>Size</span>
            <span>Tags</span>
          </div>
          {filtered.map(file => (
            <div key={file.id}
              className="grid grid-cols-5 gap-4 px-4 py-3 items-center cursor-pointer table-row"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center text-xl"
                  style={{ background: `${file.accent}15`, borderRadius: '16px' }}>
                  {file.emoji}
                </div>
                <p className="text-[13px] font-medium truncate" style={{ color: 'rgba(255,255,255,0.75)' }}>{file.name}</p>
              </div>
              <span className="font-label text-[13px] uppercase tracking-widest flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {file.type === 'image' ? <Image size={10} /> : <Video size={10} />} {file.type}
              </span>
              <span className="font-label text-[13px]" style={{ color: 'rgba(255,255,255,0.7)' }}>{file.size}</span>
              <div className="flex flex-wrap gap-1">
                {file.tags.map(t => (
                  <span key={t} className="font-label text-[9px] px-1.5 py-0.5"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', borderRadius: '10px' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Image size={36} className="mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.1)' }} />
          <p className="font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>No files found</p>
        </div>
      )}
    </div>
  )
}
