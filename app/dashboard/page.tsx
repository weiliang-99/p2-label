'use client'

import Link from 'next/link'
import { PenSquare, Calendar, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { MALAYSIAN_HOLIDAYS, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { SURFACE } from '@/lib/theme'

const stats = [
  { label: 'Posts This Month', labelZh: '本月贴文',   value: '12',    change: '+3 vs last month', icon: PenSquare,    color: '#3b82f6' },
  { label: 'Total Engagements', labelZh: '总互动数',  value: '4,821', change: '+18% this week',  icon: TrendingUp,   color: '#e0ee7d' },
  { label: 'Avg Engagement',    labelZh: '平均互动率', value: '6.2%',  change: 'Industry avg: 3%', icon: CheckCircle, color: '#e0ee7d' },
  { label: 'Pending Approval',  labelZh: '待审批',    value: '2',     change: 'Needs attention',  icon: AlertCircle,  color: '#ef4444' },
]

const recentPosts = [
  { id: '1', title: 'CNY Countdown Post',    platform: 'Instagram', status: 'scheduled',    scheduledAt: '25 Jan 18:00', category: 'Festive Posts' },
  { id: '2', title: 'Product Launch Teaser', platform: 'Facebook',  status: 'draft',        scheduledAt: '—',            category: 'Product Showcase' },
  { id: '3', title: 'Behind The Scenes',     platform: 'TikTok',    status: 'published',    scheduledAt: '20 Jan 12:00', category: 'Brand Content' },
  { id: '4', title: 'Client Testimonial',    platform: 'LinkedIn',  status: 'pending_review',scheduledAt: '26 Jan 09:00',category: 'Brand Content' },
]

const STATUS: Record<string, { bg: string; text: string }> = {
  draft:          { bg: 'bg-white/8',        text: 'text-white/50' },
  pending_review: { bg: 'bg-amber-500/15',   text: 'text-amber-400' },
  approved:       { bg: 'bg-blue-500/15',    text: 'text-blue-300' },
  scheduled:      { bg: 'bg-[#e0ee7d]/15',   text: 'text-[#e0ee7d]' },
  published:      { bg: 'bg-[#e0ee7d]/15',   text: 'text-[#e0ee7d]' },
  failed:         { bg: 'bg-red-500/15',     text: 'text-red-400' },
}

const upcomingHolidays = MALAYSIAN_HOLIDAYS.filter(h => new Date(h.date) >= new Date()).slice(0, 4)

export default function DashboardPage() {
  return (
    <div className="p-8 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-label text-[12px] uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            [Marketing · January 2025]
          </p>
          <h1 className="font-display text-7xl leading-none" style={{ color: '#ffffff', letterSpacing: '0.04em' }}>
            DASHBOARD
          </h1>
          <p className="text-lg mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
            营销总览 · Here&apos;s what&apos;s happening today
          </p>
        </div>
        <Link
          href="/posts/create"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-85 font-label"
          style={{ background: '#e0ee7d', borderRadius: '999px' }}
        >
          <PenSquare size={13} />
          Create Post
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8 stagger">
        {stats.map(s => (
          <div key={s.label} className="p-5 dark-card" style={SURFACE}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-label text-[13px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {s.label}
              </p>
              <s.icon size={13} className={s.label === 'Pending Approval' ? 'badge-pulse' : ''} style={{ color: s.color }} />
            </div>
            <p className="font-display text-5xl leading-none mb-2 count-up" style={{ color: s.color, letterSpacing: '0.02em' }}>
              {s.value}
            </p>
            <p className="font-label text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="col-span-2" style={SURFACE}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Recent]</p>
              <h2 className="font-semibold text-white text-lg">Content Posts</h2>
            </div>
            <Link href="/calendar" className="font-label text-[12px] uppercase tracking-widest transition-colors hover:text-white" style={{ color: '#e0ee7d' }}>
              Calendar →
            </Link>
          </div>
          <div>
            {recentPosts.map(post => {
              const sc = STATUS[post.status] || STATUS.draft
              return (
                <div key={post.id}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-white truncate">{post.title}</p>
                    <p className="font-label text-[13px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      {post.platform} · {post.category}
                    </p>
                  </div>
                  <p className="font-label text-[12px] whitespace-nowrap flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <Clock size={10} /> {post.scheduledAt}
                  </p>
                  <span className={cn('font-label text-[13px] px-2 py-0.5 uppercase tracking-widest', sc.bg, sc.text)}>
                    {post.status.replace('_', ' ')}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="px-5 py-3">
            <Link href="/posts/create"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold uppercase tracking-widest text-black font-label"
              style={{ background: '#e0ee7d', borderRadius: '999px' }}>
              <PenSquare size={11} /> New Post
            </Link>
          </div>
        </div>

        {/* Upcoming Dates */}
        <div style={SURFACE}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Malaysia]</p>
            <h2 className="font-semibold text-white text-lg">Upcoming Dates 🇲🇾</h2>
            <p className="font-label text-[13px] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Plan your content ahead</p>
          </div>
          <div>
            {upcomingHolidays.map(h => (
              <div key={h.date} className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-2xl">{h.emoji}</span>
                <div>
                  <p className="text-lg font-medium text-white">{h.name}</p>
                  <p className="font-label text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{formatDate(h.date)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3">
            <Link href="/calendar" className="font-label text-[12px] uppercase tracking-widest transition-colors" style={{ color: '#e0ee7d' }}>
              Full Calendar →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 p-5" style={SURFACE}>
        <div className="flex items-center gap-3 mb-4">
          <p className="font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>[Quick Actions]</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { href: '/posts/create', label: 'Create Post',      emoji: '✍️' },
            { href: '/calendar',     label: 'Calendar',         emoji: '📅' },
            { href: '/templates',    label: 'Templates',        emoji: '📋' },
            { href: '/analytics',    label: 'Analytics',        emoji: '📊' },
            { href: '/media',        label: 'Media Library',    emoji: '🖼️' },
            { href: '/hashtags',     label: 'Hashtags',         emoji: '#️⃣' },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-white hover:border-white/20"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.75)',
                background: 'transparent',
              }}>
              <span>{a.emoji}</span>
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
