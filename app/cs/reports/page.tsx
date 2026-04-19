'use client'

import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Clock, CheckCircle2, TrendingUp, TrendingDown, AlertCircle, Target } from 'lucide-react'
import { SURFACE, AXIS_STYLE, GRID_COLOR } from '@/lib/theme'

const TIME_RANGES = ['This Week', 'This Month', 'Last 30 Days']

const replySpeedData = [
  { day: 'Mon', avg_reply: 18, target: 30, tickets: 4 },
  { day: 'Tue', avg_reply: 42, target: 30, tickets: 7 },
  { day: 'Wed', avg_reply: 25, target: 30, tickets: 5 },
  { day: 'Thu', avg_reply: 12, target: 30, tickets: 3 },
  { day: 'Fri', avg_reply: 35, target: 30, tickets: 6 },
  { day: 'Sat', avg_reply: 55, target: 30, tickets: 2 },
  { day: 'Sun', avg_reply: 68, target: 30, tickets: 1 },
]

const resolutionData = [
  { day: 'Mon', resolved: 3, pending: 1 },
  { day: 'Tue', resolved: 5, pending: 2 },
  { day: 'Wed', resolved: 4, pending: 1 },
  { day: 'Thu', resolved: 3, pending: 0 },
  { day: 'Fri', resolved: 5, pending: 1 },
  { day: 'Sat', resolved: 2, pending: 0 },
  { day: 'Sun', resolved: 1, pending: 0 },
]

const ticketTypeData = [
  { name: 'Inquiry',   value: 45, color: '#60a5fa' },
  { name: 'Complaint', value: 25, color: '#f87171' },
  { name: 'Refund',    value: 15, color: '#fb923c' },
  { name: 'Feedback',  value: 10, color: '#34d399' },
  { name: 'Other',     value: 5,  color: '#a78bfa' },
]

const channelData = [
  { channel: 'WhatsApp', tickets: 18, color: '#25D366' },
  { channel: 'Email',    tickets: 12, color: '#6366f1' },
  { channel: 'Instagram',tickets: 8,  color: '#E1306C' },
  { channel: 'Facebook', tickets: 5,  color: '#1877F2' },
  { channel: 'TikTok',   tickets: 2,  color: 'rgba(255,255,255,0.75)' },
]

const agentData = [
  { name: 'Wei Liang',   resolved: 18, avg_reply: 22, satisfaction: 94 },
  { name: 'Sarah Tan',   resolved: 12, avg_reply: 31, satisfaction: 88 },
  { name: 'Amir Hassan', resolved: 9,  avg_reply: 18, satisfaction: 96 },
]

const SLA_TARGET = 30


const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '10px 14px' }}>
      {label && <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '9px', fontFamily: 'var(--font-space)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || '#e0ee7d', fontSize: '11px', fontFamily: 'var(--font-space)' }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function CSReportsPage() {
  const [range, setRange] = useState('This Week')

  const avgReplyTime = Math.round(replySpeedData.reduce((s, d) => s + d.avg_reply, 0) / replySpeedData.length)
  const totalTickets  = replySpeedData.reduce((s, d) => s + d.tickets, 0)
  const totalResolved = resolutionData.reduce((s, d) => s + d.resolved, 0)
  const resolutionRate = Math.round((totalResolved / totalTickets) * 100)
  const slaMet = replySpeedData.filter(d => d.avg_reply <= SLA_TARGET).length
  const slaRate = Math.round((slaMet / replySpeedData.length) * 100)

  return (
    <div className="p-8" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-label text-[13px] uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            [Customer Service]
          </p>
          <h1 className="font-display text-5xl" style={{ letterSpacing: '0.05em' }}>CS REPORTS</h1>
          <p className="font-label text-[13px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
            服务报表 · Reply speed & resolution tracking
          </p>
        </div>
        <div className="flex overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px' }}>
          {TIME_RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className="px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-colors"
              style={range === r ? { background: '#e0ee7d', color: '#000' } : { color: 'rgba(255,255,255,0.65)' }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Avg Reply Time', labelZh: '平均回复时间', value: `${avgReplyTime}m`, sub: `Target: ${SLA_TARGET}m`, icon: Clock, accentColor: avgReplyTime <= SLA_TARGET ? '#e0ee7d' : '#f87171', trend: avgReplyTime <= SLA_TARGET ? 'Within target' : 'Exceeds target', up: avgReplyTime <= SLA_TARGET },
          { label: 'SLA Compliance', labelZh: 'SLA 达标率', value: `${slaRate}%`, sub: `${slaMet}/${replySpeedData.length} days met`, icon: Target, accentColor: slaRate >= 80 ? '#e0ee7d' : '#fb923c', trend: slaRate >= 80 ? 'On track' : 'Needs improvement', up: slaRate >= 80 },
          { label: 'Resolution Rate', labelZh: '解决率', value: `${resolutionRate}%`, sub: `${totalResolved}/${totalTickets} tickets`, icon: CheckCircle2, accentColor: '#e0ee7d', trend: '+5% vs last week', up: true },
          { label: 'Open Tickets', labelZh: '待处理', value: '4', sub: '2 high priority', icon: AlertCircle, accentColor: '#fb923c', trend: 'Down from 7', up: true },
        ].map(k => (
          <div key={k.label} className="p-5" style={{ ...SURFACE, borderRadius: '20px' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-label text-[12px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.65)' }}>{k.label}</p>
              <k.icon size={13} style={{ color: k.accentColor }} />
            </div>
            <p className="font-display text-4xl" style={{ color: k.accentColor, letterSpacing: '0.03em' }}>{k.value}</p>
            <p className="font-label text-[13px] mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{k.sub}</p>
            <div className="flex items-center gap-1 mt-2">
              {k.up ? <TrendingDown size={10} style={{ color: '#e0ee7d' }} /> : <TrendingUp size={10} style={{ color: '#f87171' }} />}
              <span className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>{k.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

      {/* Reply Speed Chart */}
      <div className="p-5 mb-5" style={{ ...SURFACE, borderRadius: '20px' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl" style={{ letterSpacing: '0.05em' }}>REPLY SPEED</h2>
            <p className="font-label text-[12px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Average first reply time per day (minutes)
            </p>
          </div>
          <div className="flex items-center gap-4 font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#e0ee7d' }} /> Avg Reply</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#f87171' }} /> Over SLA</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={replySpeedData}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
            <XAxis dataKey="day" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} unit="m" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avg_reply" radius={[3,3,0,0]}>
              {replySpeedData.map((d, i) => (
                <Cell key={i} fill={d.avg_reply > SLA_TARGET ? '#f87171' : '#e0ee7d'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="font-label text-[12px] uppercase tracking-widest mt-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Red bars = exceeded {SLA_TARGET}-minute SLA target
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Resolution Trend */}
        <div className="col-span-2 p-5" style={{ ...SURFACE, borderRadius: '20px' }}>
          <h2 className="font-display text-2xl mb-0.5" style={{ letterSpacing: '0.05em' }}>RESOLUTION TREND</h2>
          <p className="font-label text-[12px] uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Tickets resolved vs pending per day
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={resolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
              <XAxis dataKey="day" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="resolved" stroke="#e0ee7d" strokeWidth={2} dot={{ r: 3, fill: '#e0ee7d' }} name="Resolved" />
              <Line type="monotone" dataKey="pending" stroke="rgba(251,146,60,0.7)" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3, fill: '#fb923c' }} name="Still Open" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket Type Breakdown */}
        <div className="p-5" style={{ ...SURFACE, borderRadius: '20px' }}>
          <h2 className="font-display text-2xl mb-4" style={{ letterSpacing: '0.05em' }}>TICKET TYPES</h2>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={ticketTypeData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value">
                {ticketTypeData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {ticketTypeData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: d.color }} />
                  <span className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>{d.name}</span>
                </div>
                <span className="font-label text-[13px]" style={{ color: 'rgba(255,255,255,0.7)' }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Channel Breakdown */}
        <div className="p-5" style={{ ...SURFACE, borderRadius: '20px' }}>
          <h2 className="font-display text-2xl mb-4" style={{ letterSpacing: '0.05em' }}>BY CHANNEL</h2>
          <div className="space-y-3">
            {channelData.map(c => (
              <div key={c.channel}>
                <div className="flex justify-between mb-1">
                  <span className="font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>{c.channel}</span>
                  <span className="font-label text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{c.tickets}</span>
                </div>
                <div className="h-px overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div style={{ width: `${(c.tickets / 45) * 100}%`, height: '1px', background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="p-5" style={{ ...SURFACE, borderRadius: '20px' }}>
          <h2 className="font-display text-2xl mb-4" style={{ letterSpacing: '0.05em' }}>AGENT PERFORMANCE</h2>
          <div className="space-y-3">
            {agentData.map((a, i) => (
              <div key={a.name} className="flex items-center gap-3 p-3" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                <div className="w-7 h-7 flex items-center justify-center font-label text-[12px] font-bold"
                  style={{ background: i === 0 ? '#e0ee7d' : 'rgba(255,255,255,0.1)', color: i === 0 ? '#000' : 'rgba(255,255,255,0.7)', borderRadius: '12px' }}>
                  {a.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>{a.name}</p>
                  <p className="font-label text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {a.resolved} resolved · {a.avg_reply}m avg
                  </p>
                </div>
                <div className="font-label text-[13px] px-2 py-1"
                  style={{
                    background: a.satisfaction >= 95 ? 'rgba(224,238,125,0.12)' : 'rgba(96,165,250,0.1)',
                    color: a.satisfaction >= 95 ? '#e0ee7d' : '#60a5fa',
                    borderRadius: '12px'
                  }}>
                  {a.satisfaction}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLA Summary */}
      <div className="p-5" style={{ ...SURFACE, borderRadius: '20px' }}>
        <h2 className="font-display text-2xl mb-4" style={{ letterSpacing: '0.05em' }}>SLA SUMMARY</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'First Reply', target: '< 30 minutes', actual: `${avgReplyTime} min avg`, met: avgReplyTime <= 30 },
            { label: 'Resolution',  target: '< 24 hours',   actual: '18.5h avg', met: true },
            { label: 'Complaint Escalation', target: '< 4 hours', actual: '2.8h avg', met: true },
          ].map(s => (
            <div key={s.label} className="p-4" style={{
              background: s.met ? 'rgba(224,238,125,0.05)' : 'rgba(248,113,113,0.05)',
              border: s.met ? '1px solid rgba(224,238,125,0.15)' : '1px solid rgba(248,113,113,0.2)',
              borderRadius: '20px'
            }}>
              <div className="flex items-center gap-2 mb-2">
                {s.met ? <CheckCircle2 size={13} style={{ color: '#e0ee7d' }} /> : <AlertCircle size={13} style={{ color: '#f87171' }} />}
                <p className="font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.label}</p>
              </div>
              <p className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>Target: {s.target}</p>
              <p className="font-display text-3xl mt-1" style={{ color: s.met ? '#e0ee7d' : '#f87171', letterSpacing: '0.03em' }}>{s.actual}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
