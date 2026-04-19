'use client'

import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { TrendingUp, Heart, MessageCircle, Share2, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SURFACE, AXIS_STYLE, GRID_COLOR } from '@/lib/theme'

const TIME_RANGES = ['7 days', '30 days', '90 days']

const engagementData = Array.from({ length: 30 }, (_, i) => ({
  date: `Jan ${i + 1}`,
  likes:    Math.floor(80  + Math.random() * 200),
  comments: Math.floor(10  + Math.random() * 50),
  shares:   Math.floor(5   + Math.random() * 30),
  reach:    Math.floor(500 + Math.random() * 2000),
}))

const platformData = [
  { platform: 'Instagram', posts: 15, engagement: 7.8, reach: 12400 },
  { platform: 'Facebook',  posts: 12, engagement: 4.2, reach: 8900 },
  { platform: 'LinkedIn',  posts: 6,  engagement: 5.1, reach: 3200 },
  { platform: 'TikTok',    posts: 8,  engagement: 9.4, reach: 21000 },
]

const pieData = [
  { name: 'Instagram', value: 38, color: '#e0ee7d' },
  { name: 'TikTok',    value: 24, color: 'rgba(224,238,125,0.5)' },
  { name: 'Facebook',  value: 28, color: 'rgba(255,255,255,0.55)' },
  { name: 'LinkedIn',  value: 10, color: 'rgba(255,255,255,0.08)' },
]

const topPosts = [
  { title: 'CNY Countdown Reel',       platform: 'TikTok',    likes: 1240, comments: 89,  shares: 203, er: '9.4%' },
  { title: '11.11 Sale Announcement',  platform: 'Instagram', likes: 892,  comments: 67,  shares: 145, er: '8.1%' },
  { title: 'Team Behind The Scenes',   platform: 'Instagram', likes: 654,  comments: 112, shares: 88,  er: '7.6%' },
  { title: 'Client Spotlight Story',   platform: 'Facebook',  likes: 445,  comments: 34,  shares: 67,  er: '5.2%' },
  { title: 'Product Launch Teaser',    platform: 'LinkedIn',  likes: 312,  comments: 45,  shares: 89,  er: '6.8%' },
]

const heatmapDays  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const heatmapHours = [6, 8, 10, 12, 14, 16, 18, 20, 22]
const heatmapData  = heatmapDays.map(day => ({
  day,
  hours: heatmapHours.map(h => ({
    hour:  h,
    value: h === 8 || h === 12 || h === 20
      ? Math.floor(60 + Math.random() * 40)
      : Math.floor(10 + Math.random() * 40),
  })),
}))

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', fontSize: 11 }}>
      <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 4, fontFamily: 'var(--font-space)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color || '#e0ee7d' }}>{p.name || p.dataKey}: {p.value}</p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [range, setRange] = useState('30 days')

  const totalLikes    = engagementData.reduce((s, d) => s + d.likes, 0)
  const totalComments = engagementData.reduce((s, d) => s + d.comments, 0)
  const totalShares   = engagementData.reduce((s, d) => s + d.shares, 0)
  const totalReach    = engagementData.reduce((s, d) => s + d.reach, 0)

  return (
    <div className="p-8 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-label text-[12px] uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            [Marketing · Performance]
          </p>
          <h1 className="font-display text-7xl leading-none" style={{ letterSpacing: '0.04em' }}>
            ANALYTICS
          </h1>
          <p className="text-lg mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>数据分析 · Track your performance</p>
        </div>
        <div className="flex" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          {TIME_RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className="px-4 py-2 font-label text-[12px] uppercase tracking-widest transition-colors"
              style={{
                background: range === r ? '#e0ee7d' : 'transparent',
                color: range === r ? '#000' : 'rgba(255,255,255,0.45)',
                borderRight: r !== '90 days' ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6 stagger">
        {[
          { label: 'Total Likes',    value: totalLikes.toLocaleString(),    icon: Heart,         color: '#e0ee7d' },
          { label: 'Comments',       value: totalComments.toLocaleString(), icon: MessageCircle, color: 'rgba(255,255,255,0.7)' },
          { label: 'Shares',         value: totalShares.toLocaleString(),   icon: Share2,        color: 'rgba(255,255,255,0.7)' },
          { label: 'Total Reach',    value: totalReach.toLocaleString(),    icon: Eye,           color: 'rgba(255,255,255,0.7)' },
        ].map(k => (
          <div key={k.label} className="p-5 dark-card" style={SURFACE}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-label text-[13px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>{k.label}</p>
              <k.icon size={13} style={{ color: k.color }} />
            </div>
            <p className="font-display text-5xl leading-none mb-2 count-up" style={{ color: k.color, letterSpacing: '0.02em' }}>{k.value}</p>
            <p className="font-label text-[13px]" style={{ color: '#e0ee7d' }}>
              <TrendingUp size={9} className="inline mr-1" />+12% vs last period
            </p>
          </div>
        ))}
      </div>

      {/* Engagement Trend */}
      <div className="p-5 mb-6" style={SURFACE}>
        <div className="mb-4">
          <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Trend]</p>
          <h2 className="font-semibold text-white text-lg">Engagement Trend 互动趋势</h2>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={engagementData.slice(-14)}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="date" tick={AXIS_STYLE} stroke="transparent" />
            <YAxis tick={AXIS_STYLE} stroke="transparent" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="likes"    stroke="#e0ee7d"                  strokeWidth={1.5} dot={false} name="Likes" />
            <Line type="monotone" dataKey="comments" stroke="rgba(255,255,255,0.5)"    strokeWidth={1.5} dot={false} name="Comments" />
            <Line type="monotone" dataKey="shares"   stroke="rgba(255,255,255,0.25)"   strokeWidth={1.5} dot={false} name="Shares" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-3">
          {[['Likes','#e0ee7d'],['Comments','rgba(255,255,255,0.5)'],['Shares','rgba(255,255,255,0.25)']].map(([l,c]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-5 h-0.5" style={{ background: c }} />
              <span className="font-label text-[13px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Platform Comparison */}
        <div className="col-span-2 p-5" style={SURFACE}>
          <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Platform]</p>
          <h2 className="font-semibold text-white text-lg mb-4">Platform Comparison 平台比较</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
              <XAxis dataKey="platform" tick={AXIS_STYLE} stroke="transparent" />
              <YAxis tick={AXIS_STYLE} stroke="transparent" unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="engagement" fill="#e0ee7d" radius={[2,2,0,0]} name="Engagement %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Split */}
        <div className="p-5" style={SURFACE}>
          <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Split]</p>
          <h2 className="font-semibold text-white text-lg mb-4">Reach by Platform</h2>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ background: d.color }} />
                  <span className="font-label text-[13px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>{d.name}</span>
                </div>
                <span className="font-label text-[12px] text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="p-5 mb-6" style={SURFACE}>
        <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Timing]</p>
        <h2 className="font-semibold text-white text-lg mb-4">Best Posting Time 最佳发布时间 (GMT+8)</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <div className="flex flex-col gap-1 justify-around pt-6">
              {heatmapDays.map(d => (
                <p key={d} className="font-label text-[13px] uppercase w-8" style={{ color: 'rgba(255,255,255,0.65)' }}>{d}</p>
              ))}
            </div>
            <div>
              <div className="flex gap-1 mb-1">
                {heatmapHours.map(h => (
                  <p key={h} className="font-label text-[13px] w-10 text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>{h}:00</p>
                ))}
              </div>
              {heatmapData.map(row => (
                <div key={row.day} className="flex gap-1 mb-1">
                  {row.hours.map(cell => (
                    <div key={cell.hour}
                      className="w-10 h-6 flex items-center justify-center font-label text-[13px]"
                      style={{
                        background: `rgba(224, 238, 125, ${cell.value / 100})`,
                        color: cell.value > 60 ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.2)',
                      }}>
                      {cell.value > 50 ? cell.value : ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="font-label text-[13px] mt-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Peak times: 8am, 12pm, 8pm MYT — Higher value = better engagement
        </p>
      </div>

      {/* Top Posts */}
      <div style={SURFACE}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Top Performers]</p>
          <h2 className="font-semibold text-white text-lg">Top Posts 最佳贴文</h2>
        </div>
        {topPosts.map((p, i) => (
          <div key={i}
            className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
            style={{ borderBottom: i < topPosts.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <span className="font-display text-3xl w-6 text-center" style={{ color: i === 0 ? '#e0ee7d' : 'rgba(255,255,255,0.15)' }}>
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-white truncate">{p.title}</p>
              <p className="font-label text-[13px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{p.platform}</p>
            </div>
            <div className="flex gap-5 font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <span className="flex items-center gap-1"><Heart size={9}/> {p.likes}</span>
              <span className="flex items-center gap-1"><MessageCircle size={9}/> {p.comments}</span>
              <span className="flex items-center gap-1"><Share2 size={9}/> {p.shares}</span>
            </div>
            <span className="font-display text-2xl" style={{ color: '#e0ee7d' }}>{p.er}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
