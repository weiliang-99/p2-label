'use client'

import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { MapPin, TrendingUp, Users, DollarSign, Plus, Edit2, Trash2, X } from 'lucide-react'
import { fmtMYR } from '@/lib/sales'
import { SURFACE, AXIS_STYLE, GRID_COLOR } from '@/lib/theme'

interface Source {
  id: string; name: string; color: string; clients: number
  revenue: number; conversionRate: number; avgDealSize: number
}

const SOURCES: Source[] = [
  { id: '1', name: 'Instagram',  color: '#e0ee7d',               clients: 12, revenue: 18400, conversionRate: 42, avgDealSize: 1533 },
  { id: '2', name: 'Referral',   color: 'rgba(224,238,125,0.6)', clients: 8,  revenue: 24600, conversionRate: 68, avgDealSize: 3075 },
  { id: '3', name: 'Facebook',   color: 'rgba(255,255,255,0.65)',clients: 5,  revenue: 9200,  conversionRate: 35, avgDealSize: 1840 },
  { id: '4', name: 'Google Ads', color: 'rgba(255,255,255,0.55)', clients: 4,  revenue: 14800, conversionRate: 28, avgDealSize: 3700 },
  { id: '5', name: 'TikTok',     color: 'rgba(255,255,255,0.12)',clients: 3,  revenue: 4320,  conversionRate: 22, avgDealSize: 1440 },
  { id: '6', name: 'Walk-in',    color: 'rgba(255,255,255,0.07)',clients: 2,  revenue: 3600,  conversionRate: 55, avgDealSize: 1800 },
]

const MONTHLY_TREND = [
  { month: 'Aug', Instagram: 2, Referral: 1, Facebook: 1, 'Google Ads': 1 },
  { month: 'Sep', Instagram: 3, Referral: 2, Facebook: 2, 'Google Ads': 1 },
  { month: 'Oct', Instagram: 2, Referral: 1, Facebook: 1, 'Google Ads': 2 },
  { month: 'Nov', Instagram: 4, Referral: 2, Facebook: 1, 'Google Ads': 1 },
  { month: 'Dec', Instagram: 3, Referral: 3, Facebook: 2, 'Google Ads': 2 },
  { month: 'Jan', Instagram: 5, Referral: 3, Facebook: 2, 'Google Ads': 2 },
]

const REVENUE_BY_SOURCE = [...SOURCES].sort((a, b) => b.revenue - a.revenue).map(s => ({ name: s.name, revenue: s.revenue, color: s.color }))

type FormState = { name: string; color: string }
const emptyForm = (): FormState => ({ name: '', color: '#e0ee7d' })


const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', fontSize: 11 }}>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-space)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => <p key={p.dataKey} style={{ color: p.color || '#e0ee7d' }}>{p.name}: {p.value}</p>)}
    </div>
  )
}

export default function SourcesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState<string | null>(null)
  const [form, setForm]         = useState<FormState>(emptyForm())

  const totalClients = SOURCES.reduce((s, r) => s + r.clients, 0)
  const totalRevenue = SOURCES.reduce((s, r) => s + r.revenue, 0)
  const bestSource   = SOURCES.reduce((a, b) => a.revenue > b.revenue ? a : b)
  const bestConv     = SOURCES.reduce((a, b) => a.conversionRate > b.conversionRate ? a : b)

  const openAdd  = () => { setEditId(null); setForm(emptyForm()); setShowForm(true) }
  const openEdit = (s: Source) => { setEditId(s.id); setForm({ name: s.name, color: s.color }); setShowForm(true) }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-label text-[12px] uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>[Sales · Acquisition]</p>
          <h1 className="font-display text-7xl leading-none" style={{ letterSpacing: '0.04em' }}>LEAD SOURCES</h1>
          <p className="text-lg mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>客户来源 · Where are your clients coming from?</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black font-label hover:opacity-85 transition-opacity"
          style={{ background: '#e0ee7d', borderRadius: '999px' }}>
          <Plus size={13} /> Add Source
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Clients', value: String(totalClients), sub: 'All sources',            icon: Users,      color: 'rgba(255,255,255,0.7)' },
          { label: 'Total Revenue', value: fmtMYR(totalRevenue), sub: 'Lifetime value',         icon: DollarSign, color: '#e0ee7d' },
          { label: 'Top Channel',   value: bestSource.name,      sub: fmtMYR(bestSource.revenue),icon: MapPin,    color: '#e0ee7d' },
          { label: 'Best Conversion',value: `${bestConv.conversionRate}%`, sub: bestConv.name, icon: TrendingUp, color: 'rgba(255,255,255,0.7)' },
        ].map(k => (
          <div key={k.label} className="p-5" style={SURFACE}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-label text-[13px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>{k.label}</p>
              <k.icon size={13} style={{ color: k.color }} />
            </div>
            <p className="font-display text-4xl leading-none mb-2" style={{ color: k.color, letterSpacing: '0.02em' }}>{k.value}</p>
            <p className="font-label text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Revenue by Source */}
        <div className="p-5" style={SURFACE}>
          <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Revenue]</p>
          <h2 className="font-semibold text-white text-lg mb-4">Revenue by Source</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={REVENUE_BY_SOURCE} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
              <XAxis type="number" tick={AXIS_STYLE} stroke="transparent" tickFormatter={v => `RM${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={AXIS_STYLE} stroke="transparent" width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" radius={[0, 2, 2, 0]}>
                {REVENUE_BY_SOURCE.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="p-5" style={SURFACE}>
          <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Trend]</p>
          <h2 className="font-semibold text-white text-lg mb-4">Monthly New Clients</h2>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={MONTHLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
              <XAxis dataKey="month" tick={AXIS_STYLE} stroke="transparent" />
              <YAxis tick={AXIS_STYLE} stroke="transparent" allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              {['Instagram','Referral','Facebook','Google Ads'].map((key, i) => (
                <Line key={key} type="monotone" dataKey={key}
                  stroke={['#e0ee7d','rgba(224,238,125,0.5)','rgba(255,255,255,0.3)','rgba(255,255,255,0.15)'][i]}
                  strokeWidth={i === 0 ? 2 : 1.5} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-3">
            {['Instagram','Referral','Facebook','Google Ads'].map((key, i) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-4 h-px" style={{ background: ['#e0ee7d','rgba(224,238,125,0.5)','rgba(255,255,255,0.3)','rgba(255,255,255,0.15)'][i] }} />
                <span className="font-label text-[13px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>{key}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source Table */}
      <div style={SURFACE}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="font-label text-[13px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Breakdown]</p>
          <h2 className="font-semibold text-white text-lg">Source Performance</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0d0d0d' }}>
              {['Source','Clients','Revenue','Avg Deal','Conversion','Share',''].map(h => (
                <th key={h} className="px-5 py-3 text-left font-label text-[13px] uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.65)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SOURCES.map(s => {
              const share = Math.round((s.revenue / totalRevenue) * 100)
              return (
                <tr key={s.id} className="transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 shrink-0" style={{ background: s.color }} />
                      <span className="text-lg font-semibold text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.clients}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-display text-2xl" style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '0.02em' }}>{fmtMYR(s.revenue)}</span>
                  </td>
                  <td className="px-5 py-3.5 font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.75)' }}>{fmtMYR(s.avgDealSize)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full" style={{ width: `${s.conversionRate}%`, background: s.color }} />
                      </div>
                      <span className="font-label text-[12px] text-white">{s.conversionRate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.75)' }}>{share}%</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.6)' }}><Edit2 size={12} /></button>
                      <button className="p-1.5" style={{ color: 'rgba(239,68,68,0.5)' }}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-sm" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="font-display text-3xl" style={{ letterSpacing: '0.05em' }}>
                {editId ? 'EDIT SOURCE' : 'ADD SOURCE'}
              </p>
              <button onClick={() => setShowForm(false)} style={{ color: 'rgba(255,255,255,0.65)' }}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="font-label text-[13px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Source Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 text-lg" style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
                  placeholder="e.g. WhatsApp, YouTube..." />
              </div>
              <div>
                <label className="font-label text-[13px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                    className="w-10 h-10 cursor-pointer" style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
                  <span className="font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{form.color}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 font-label text-[12px] uppercase tracking-widest"
                style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }}>
                Cancel
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 font-label text-[12px] uppercase tracking-widest font-bold text-black"
                style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                {editId ? 'Save' : 'Add Source'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
