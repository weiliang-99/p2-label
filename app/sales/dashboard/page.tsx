'use client'

import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  TrendingUp, TrendingDown, Receipt, Users, DollarSign,
  AlertCircle, Plus, ArrowRight
} from 'lucide-react'
import { fmtMYR, fmtDateMY, STATUS_COLORS } from '@/lib/sales'
import { cn } from '@/lib/utils'
import { SURFACE, AXIS_STYLE, GRID_COLOR } from '@/lib/theme'

const MONTHLY_REVENUE = [
  { month: 'Aug', revenue: 4200,  quotes: 5 },
  { month: 'Sep', revenue: 6800,  quotes: 7 },
  { month: 'Oct', revenue: 5500,  quotes: 6 },
  { month: 'Nov', revenue: 9200,  quotes: 11 },
  { month: 'Dec', revenue: 7800,  quotes: 8 },
  { month: 'Jan', revenue: 12480, quotes: 14 },
]

const QUOTES = [
  { id: '1', number: 'QT-2025-0001', client: 'Kopi & Co Sdn Bhd',     amount: 1620,  status: 'accepted', date: '2025-01-05' },
  { id: '2', number: 'QT-2025-0002', client: 'Beauty Lah Malaysia',    amount: 3024,  status: 'sent',     date: '2025-01-10' },
  { id: '3', number: 'QT-2025-0003', client: 'TechStart Ventures',     amount: 4644,  status: 'draft',    date: '2025-01-18' },
  { id: '4', number: 'QT-2025-0004', client: 'Makan King Restaurant',  amount: 864,   status: 'accepted', date: '2025-01-12' },
  { id: '5', number: 'QT-2025-0005', client: 'Bloom Florist & Events', amount: 3024,  status: 'rejected', date: '2025-01-08' },
]

const INVOICES = [
  { id: '1', number: 'INV-2025-0001', client: 'Kopi & Co Sdn Bhd',    amount: 1620, paid: 1620, status: 'paid',    due: '2025-02-05' },
  { id: '2', number: 'INV-2025-0002', client: 'Makan King Restaurant', amount: 864,  paid: 432,  status: 'partial', due: '2025-02-12' },
  { id: '3', number: 'INV-2025-0003', client: 'Beauty Lah Malaysia',   amount: 3024, paid: 0,    status: 'overdue', due: '2025-01-14' },
]

const SOURCE_DATA = [
  { name: 'Instagram',  value: 40, color: '#e0ee7d' },
  { name: 'Referral',   value: 25, color: 'rgba(224,238,125,0.55)' },
  { name: 'Facebook',   value: 15, color: 'rgba(255,255,255,0.55)' },
  { name: 'Google',     value: 12, color: 'rgba(255,255,255,0.14)' },
  { name: 'Other',      value: 8,  color: 'rgba(255,255,255,0.07)' },
]

const thisMonthRevenue = 12480
const lastMonthRevenue = 7800
const revenueGrowth    = Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
const totalOutstanding = INVOICES.filter(i => i.status !== 'paid').reduce((s, i) => s + (i.amount - i.paid), 0)
const acceptanceRate   = Math.round((QUOTES.filter(q => q.status === 'accepted').length / QUOTES.length) * 100)


const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', fontSize: 11 }}>
      <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 4, fontFamily: 'var(--font-space)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
      {payload.map((p: any) => <p key={p.dataKey} style={{ color: '#e0ee7d' }}>{p.value}</p>)}
    </div>
  )
}

export default function SalesDashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-label text-[12px] uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            [Sales · January 2025]
          </p>
          <h1 className="font-display text-7xl leading-none" style={{ letterSpacing: '0.04em' }}>
            SALES OVERVIEW
          </h1>
          <p className="text-lg mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>销售总览 · Revenue & pipeline tracking</p>
        </div>
        <Link href="/sales/quotes/new"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black font-label hover:opacity-85 transition-opacity"
          style={{ background: '#e0ee7d', borderRadius: '999px' }}>
          <Plus size={13} /> New Quotation
        </Link>
      </div>

      {/* Overdue Alert */}
      {INVOICES.some(i => i.status === 'overdue') && (
        <div className="flex items-center gap-3 mb-6 px-5 py-3.5" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertCircle size={14} className="text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="text-lg font-semibold text-red-300">
              {INVOICES.filter(i => i.status === 'overdue').length} overdue invoice — {fmtMYR(INVOICES.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount - i.paid, 0))} outstanding
            </p>
            <p className="font-label text-[13px] mt-0.5 text-red-400/70 uppercase tracking-wider">
              {INVOICES.filter(i => i.status === 'overdue').map(i => i.client).join(' · ')}
            </p>
          </div>
          <Link href="/sales/quotes" className="font-label text-[12px] uppercase tracking-widest text-red-400 flex items-center gap-1 hover:text-red-300">
            View <ArrowRight size={10} />
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Revenue This Month', labelZh: '本月收入',
            value: fmtMYR(thisMonthRevenue),
            sub: `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}% vs last month`,
            icon: DollarSign, color: '#e0ee7d',
            trend: revenueGrowth > 0,
          },
          {
            label: 'Quotes This Month', labelZh: '本月报价单',
            value: '14',
            sub: `${QUOTES.filter(q => q.status === 'accepted').length} accepted`,
            icon: Receipt, color: 'rgba(255,255,255,0.7)',
            trend: true,
          },
          {
            label: 'Acceptance Rate', labelZh: '成交率',
            value: `${acceptanceRate}%`,
            sub: 'Target: 60%',
            icon: TrendingUp, color: acceptanceRate >= 60 ? '#e0ee7d' : 'rgba(245,158,11,0.9)',
            trend: acceptanceRate >= 60,
          },
          {
            label: 'Outstanding', labelZh: '待收款',
            value: fmtMYR(totalOutstanding),
            sub: `${INVOICES.filter(i => i.status !== 'paid').length} invoices pending`,
            icon: AlertCircle, color: totalOutstanding > 5000 ? '#ef4444' : 'rgba(245,158,11,0.9)',
            trend: false,
          },
        ].map(k => (
          <div key={k.label} className="p-5" style={SURFACE}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-label text-[13px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>{k.label}</p>
              <k.icon size={13} style={{ color: k.color }} />
            </div>
            <p className="font-display text-4xl leading-none mb-2 count-up" style={{ color: k.color, letterSpacing: '0.02em' }}>{k.value}</p>
            <div className="flex items-center gap-1">
              {k.trend ? <TrendingUp size={10} style={{ color: '#e0ee7d' }} /> : <TrendingDown size={10} className="text-red-400" />}
              <p className="font-label text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="col-span-2 p-5" style={SURFACE}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Revenue]</p>
              <h2 className="font-semibold text-white text-lg">Monthly Revenue 月度收入</h2>
            </div>
            <p className="font-label text-[12px] uppercase tracking-wider" style={{ color: '#e0ee7d' }}>+{revenueGrowth}% MoM</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
              <XAxis dataKey="month" tick={AXIS_STYLE} stroke="transparent" />
              <YAxis tick={AXIS_STYLE} stroke="transparent" tickFormatter={v => `RM${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" radius={[2,2,0,0]}>
                {MONTHLY_REVENUE.map((_, i) => (
                  <Cell key={i} fill={i === MONTHLY_REVENUE.length - 1 ? '#e0ee7d' : 'rgba(255,255,255,0.1)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Sources */}
        <div className="p-5" style={SURFACE}>
          <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Sources]</p>
          <h2 className="font-semibold text-white text-lg mb-4">Lead Sources 客户来源</h2>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={SOURCE_DATA} cx="50%" cy="50%" innerRadius={36} outerRadius={56} dataKey="value">
                {SOURCE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {SOURCE_DATA.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2" style={{ background: d.color }} />
                  <span className="font-label text-[13px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>{d.name}</span>
                </div>
                <span className="font-label text-[12px] text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Quotes */}
        <div style={SURFACE}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Recent]</p>
              <h2 className="font-semibold text-white text-lg">Quotations 报价单</h2>
            </div>
            <Link href="/sales/quotes" className="font-label text-[12px] uppercase tracking-widest" style={{ color: '#e0ee7d' }}>
              All →
            </Link>
          </div>
          {QUOTES.map(q => {
            const sc = STATUS_COLORS[q.status]
            return (
              <div key={q.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02]"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-white truncate">{q.client}</p>
                  <p className="font-label text-[13px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {q.number} · {fmtDateMY(q.date)}
                  </p>
                </div>
                <p className="font-display text-xl" style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.02em' }}>{fmtMYR(q.amount)}</p>
                <span className={cn('font-label text-[13px] px-2 py-0.5 uppercase tracking-widest', sc.bg, sc.text)}>
                  {q.status}
                </span>
              </div>
            )
          })}
          <div className="px-5 py-3">
            <Link href="/sales/quotes/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold uppercase tracking-widest text-black font-label"
              style={{ background: '#e0ee7d', borderRadius: '999px' }}>
              <Plus size={11} /> New Quote
            </Link>
          </div>
        </div>

        {/* Invoice Tracker */}
        <div style={SURFACE}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Payments]</p>
              <h2 className="font-semibold text-white text-lg">Invoice Tracker 发票追踪</h2>
            </div>
            <Link href="/sales/quotes" className="font-label text-[12px] uppercase tracking-widest" style={{ color: '#e0ee7d' }}>
              All →
            </Link>
          </div>
          {INVOICES.map(inv => {
            const sc = STATUS_COLORS[inv.status]
            const pct = Math.round((inv.paid / inv.amount) * 100)
            return (
              <div key={inv.id} className="px-5 py-4 transition-colors hover:bg-white/[0.02]"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-lg font-semibold text-white">{inv.client}</p>
                    <p className="font-label text-[13px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      {inv.number} · Due {fmtDateMY(inv.due)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl" style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '0.02em' }}>{fmtMYR(inv.amount)}</p>
                    <span className={cn('font-label text-[13px] px-2 py-0.5 uppercase tracking-widest', sc.bg, sc.text)}>
                      {inv.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full" style={{
                      width: `${pct}%`,
                      background: inv.status === 'paid' ? '#e0ee7d' : inv.status === 'overdue' ? '#ef4444' : '#e0ee7d',
                    }} />
                  </div>
                  <span className="font-label text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{pct}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
