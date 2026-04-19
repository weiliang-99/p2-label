'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { cn, MALAYSIAN_HOLIDAYS } from '@/lib/utils'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, isToday
} from 'date-fns'

const MOCK_POSTS = [
  { id: '1', title: 'CNY Countdown', date: '2025-01-25', platform: 'instagram', status: 'scheduled', color: '#e0ee7d' },
  { id: '2', title: 'Brand Story',   date: '2025-01-22', platform: 'facebook',  status: 'published', color: '#60a5fa' },
  { id: '3', title: 'Product Launch',date: '2025-01-28', platform: 'linkedin',  status: 'draft',     color: '#a78bfa' },
  { id: '4', title: 'Raya Promo',    date: '2025-01-29', platform: 'instagram', status: 'scheduled', color: '#e0ee7d' },
  { id: '5', title: 'Team Spotlight',date: '2025-01-30', platform: 'tiktok',    status: 'approved',  color: '#34d399' },
]

const STATUS_CONFIG: Record<string, { color: string; dot: string }> = {
  draft:          { color: 'rgba(255,255,255,0.15)', dot: 'rgba(255,255,255,0.3)' },
  pending_review: { color: 'rgba(251,146,60,0.3)',   dot: '#fb923c' },
  approved:       { color: 'rgba(96,165,250,0.2)',   dot: '#60a5fa' },
  scheduled:      { color: 'rgba(224,238,125,0.2)',  dot: '#e0ee7d' },
  published:      { color: 'rgba(52,211,153,0.15)',  dot: '#34d399' },
  failed:         { color: 'rgba(248,113,113,0.2)',  dot: '#f87171' },
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))
  const [view, setView] = useState<'month' | 'week'>('month')

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const getPostsForDay = (date: Date) => MOCK_POSTS.filter(p => isSameDay(new Date(p.date), date))
  const getHolidayForDay = (date: Date) => MALAYSIAN_HOLIDAYS.find(h => isSameDay(new Date(h.date), date))

  return (
    <div className="p-8 page-enter" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-label text-[13px] uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            [Marketing]
          </p>
          <h1 className="font-display text-5xl" style={{ letterSpacing: '0.05em' }}>CONTENT CALENDAR</h1>
          <p className="font-label text-[13px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
            内容日历 · Plan and schedule your posts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px' }}>
            {(['month', 'week'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-colors"
                style={view === v ? { background: '#e0ee7d', color: '#000' } : { color: 'rgba(255,255,255,0.65)' }}>
                {v}
              </button>
            ))}
          </div>
          <Link href="/posts/create"
            className="flex items-center gap-1.5 px-4 py-2 font-label text-[13px] uppercase tracking-widest font-bold text-black"
            style={{ background: '#e0ee7d', borderRadius: '999px' }}>
            <Plus size={11} /> New Post
          </Link>
        </div>
      </div>

      {/* Calendar nav */}
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-1.5 transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
          <ChevronLeft size={16} />
        </button>
        <h2 className="font-display text-3xl min-w-48 text-center" style={{ letterSpacing: '0.05em' }}>
          {format(currentDate, 'MMMM yyyy').toUpperCase()}
        </h2>
        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-1.5 transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
          <ChevronRight size={16} />
        </button>
        <button onClick={() => setCurrentDate(new Date())}
          className="px-3 py-1 font-label text-[13px] uppercase tracking-widest transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'rgba(255,255,255,0.75)' }}>
          Today
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '16px' }} />

      {/* Calendar Grid */}
      <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
        {/* Weekday headers */}
        <div className="grid grid-cols-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, idx) => (
            <div key={d} className="py-2.5 text-center font-label text-[12px] uppercase tracking-[0.15em]"
              style={{ color: idx >= 5 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.3)', background: idx >= 5 ? 'rgba(255,255,255,0.015)' : undefined }}>
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const posts = getPostsForDay(day)
            const holiday = getHolidayForDay(day)
            const inMonth = isSameMonth(day, currentDate)
            const todayDay = isToday(day)
            const isWeekend = i % 7 >= 5

            return (
              <div key={i}
                className="min-h-24 p-2 transition-colors group cursor-pointer"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  borderRight: '1px solid rgba(255,255,255,0.05)',
                  background: todayDay ? 'rgba(224,238,125,0.04)' : !inMonth ? 'rgba(255,255,255,0.01)' : isWeekend ? 'rgba(255,255,255,0.008)' : 'transparent',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = todayDay ? 'rgba(224,238,125,0.07)' : 'rgba(255,255,255,0.025)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = todayDay ? 'rgba(224,238,125,0.04)' : !inMonth ? 'rgba(255,255,255,0.01)' : isWeekend ? 'rgba(255,255,255,0.008)' : 'transparent')}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-label text-[12px] w-6 h-6 flex items-center justify-center"
                    style={todayDay
                      ? { background: '#e0ee7d', color: '#000', borderRadius: '999px', fontWeight: 700 }
                      : { color: inMonth ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)' }}>
                    {format(day, 'd')}
                  </span>
                  {holiday && <span className="text-sm">{holiday.emoji}</span>}
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={10} style={{ color: 'rgba(255,255,255,0.6)' }} />
                  </button>
                </div>

                {holiday && (
                  <p className="font-label text-[9px] uppercase tracking-widest leading-tight mb-1 truncate"
                    style={{ color: '#fb923c' }}>
                    {holiday.name}
                  </p>
                )}

                {posts.slice(0, 3).map(post => (
                  <div key={post.id}
                    className="font-label text-[12px] px-1.5 py-0.5 mb-0.5 truncate"
                    style={{ background: post.color + '25', color: post.color, borderRadius: '10px' }}>
                    {post.title}
                  </div>
                ))}
                {posts.length > 3 && (
                  <p className="font-label text-[9px]" style={{ color: 'rgba(255,255,255,0.6)' }}>+{posts.length - 3} more</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <p className="font-label text-[12px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>Status:</p>
        {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
            <span className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {s.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
