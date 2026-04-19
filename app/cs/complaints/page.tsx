'use client'

import { useState } from 'react'
import {
  Plus, Search, Clock, AlertCircle, CheckCircle2, Circle, ArrowRight,
  MessageSquare, Camera, Globe, Mail, Phone, User
} from 'lucide-react'
import { cn, formatDateTime } from '@/lib/utils'
import { SURFACE, INPUT_STYLE } from '@/lib/theme'

type Status = 'open' | 'in_progress' | 'pending_customer' | 'resolved' | 'closed'
type Priority = 'low' | 'normal' | 'high' | 'urgent'
type TicketType = 'inquiry' | 'complaint' | 'refund' | 'feedback' | 'other'

interface Ticket {
  id: string; ticketNumber: string; customerName: string; channel: string
  type: TicketType; subject: string; status: Status; priority: Priority
  assignedTo: string; createdAt: string; updatedAt: string
  slaHoursLeft: number | null; tags: string[]
}

const TICKETS: Ticket[] = [
  { id: '1', ticketNumber: 'TKT-0004', customerName: 'Siti Nurhaliza', channel: 'whatsapp',  type: 'refund',    subject: 'Request refund for unused posts',       status: 'open',        priority: 'urgent', assignedTo: 'Unassigned', createdAt: '2025-01-20T11:15:00', updatedAt: '2025-01-20T11:15:00', slaHoursLeft: 2,   tags: ['refund','urgent'] },
  { id: '2', ticketNumber: 'TKT-0002', customerName: 'Ahmad Faizal',   channel: 'instagram', type: 'complaint', subject: 'Content delivered late — very unhappy', status: 'in_progress', priority: 'high',   assignedTo: 'Wei Liang',  createdAt: '2025-01-19T16:45:00', updatedAt: '2025-01-20T09:00:00', slaHoursLeft: 3,   tags: ['late','complaint'] },
  { id: '3', ticketNumber: 'TKT-0006', customerName: 'Priya Krishnan', channel: 'email',     type: 'complaint', subject: 'Wrong brand colors in posts',           status: 'in_progress', priority: 'high',   assignedTo: 'Wei Liang',  createdAt: '2025-01-19T10:00:00', updatedAt: '2025-01-20T08:30:00', slaHoursLeft: 5,   tags: ['design','redo'] },
  { id: '4', ticketNumber: 'TKT-0003', customerName: 'David Lim',      channel: 'email',     type: 'inquiry',   subject: 'Pricing for 3-month package?',          status: 'open',        priority: 'normal', assignedTo: 'Unassigned', createdAt: '2025-01-20T09:30:00', updatedAt: '2025-01-20T09:30:00', slaHoursLeft: 20,  tags: ['pricing'] },
  { id: '5', ticketNumber: 'TKT-0007', customerName: 'Jason Chong',    channel: 'whatsapp',  type: 'inquiry',   subject: 'Do you offer TikTok content only?',     status: 'open',        priority: 'normal', assignedTo: 'Unassigned', createdAt: '2025-01-20T14:00:00', updatedAt: '2025-01-20T14:00:00', slaHoursLeft: 20,  tags: ['tiktok'] },
  { id: '6', ticketNumber: 'TKT-0001', customerName: 'Mei Ling Tan',   channel: 'whatsapp',  type: 'inquiry',   subject: 'Interested in social media package',    status: 'resolved',    priority: 'normal', assignedTo: 'Wei Liang',  createdAt: '2025-01-18T10:00:00', updatedAt: '2025-01-19T14:00:00', slaHoursLeft: null,tags: ['package'] },
  { id: '7', ticketNumber: 'TKT-0005', customerName: 'Kevin Wong',     channel: 'facebook',  type: 'feedback',  subject: 'Love the CNY content!',                 status: 'resolved',    priority: 'low',    assignedTo: 'Wei Liang',  createdAt: '2025-01-18T08:00:00', updatedAt: '2025-01-18T16:00:00', slaHoursLeft: null,tags: ['positive'] },
]

const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  open:             { label: 'Open',             color: 'rgba(251,191,36,0.12)',  dot: '#fbbf24', icon: Circle },
  in_progress:      { label: 'In Progress',      color: 'rgba(96,165,250,0.12)', dot: '#60a5fa', icon: ArrowRight },
  pending_customer: { label: 'Pending Customer', color: 'rgba(167,139,250,0.12)',dot: '#a78bfa', icon: Clock },
  resolved:         { label: 'Resolved',         color: 'rgba(224,238,125,0.1)', dot: '#e0ee7d', icon: CheckCircle2 },
  closed:           { label: 'Closed',           color: 'rgba(255,255,255,0.06)',dot: 'rgba(255,255,255,0.3)', icon: CheckCircle2 },
}

const PRIORITY_CONFIG: Record<Priority, { dot: string; textColor: string }> = {
  low:    { dot: 'rgba(255,255,255,0.25)', textColor: 'rgba(255,255,255,0.35)' },
  normal: { dot: '#60a5fa',                textColor: 'rgba(96,165,250,0.8)' },
  high:   { dot: '#fb923c',               textColor: 'rgba(251,146,60,0.9)' },
  urgent: { dot: '#f87171',               textColor: 'rgba(248,113,113,1)' },
}

const TYPE_LABEL: Record<TicketType, string> = {
  inquiry: 'INQ', complaint: 'COMP', refund: 'REF', feedback: 'FB', other: 'OTH',
}

const CHANNEL_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  whatsapp:  { icon: MessageSquare, color: '#25D366' },
  instagram: { icon: Camera,        color: '#E1306C' },
  facebook:  { icon: Globe,         color: '#1877F2' },
  email:     { icon: Mail,          color: '#6366f1' },
  phone:     { icon: Phone,         color: '#10b981' },
}

const COLUMNS: { status: Status; label: string }[] = [
  { status: 'open',             label: 'OPEN' },
  { status: 'in_progress',      label: 'IN PROGRESS' },
  { status: 'pending_customer', label: 'PENDING' },
  { status: 'resolved',         label: 'RESOLVED' },
]

export default function ComplaintsPage() {
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'board' | 'table'>('board')
  const [filterType, setFilterType] = useState<'all' | TicketType>('all')
  const [selected, setSelected] = useState<Ticket | null>(null)

  const filtered = TICKETS.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false
    if (search && !t.customerName.toLowerCase().includes(search.toLowerCase()) &&
        !t.subject.toLowerCase().includes(search.toLowerCase()) &&
        !t.ticketNumber.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const getColumnTickets = (status: Status) => filtered.filter(t => t.status === status)
  const urgentCount = TICKETS.filter(t => t.priority === 'urgent' && t.status !== 'resolved').length
  const slaBreachCount = TICKETS.filter(t => t.slaHoursLeft !== null && t.slaHoursLeft <= 3 && t.status !== 'resolved').length

  return (
    <div className="p-8 h-full flex flex-col page-enter" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-label text-[13px] uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            [Customer Service]
          </p>
          <h1 className="font-display text-5xl" style={{ letterSpacing: '0.05em' }}>COMPLAINT TRACKER</h1>
          <p className="font-label text-[13px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
            客诉追踪 · {TICKETS.filter(t => t.status !== 'resolved' && t.status !== 'closed').length} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px' }}>
            {(['board','table'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-colors"
                style={view === v ? { background: '#e0ee7d', color: '#000' } : { color: 'rgba(255,255,255,0.65)' }}>
                {v}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 font-label text-[13px] uppercase tracking-widest font-bold text-black"
            style={{ background: '#e0ee7d', borderRadius: '999px' }}>
            <Plus size={11} /> New Ticket
          </button>
        </div>
      </div>

      {/* Alerts */}
      {(urgentCount > 0 || slaBreachCount > 0) && (
        <div className="flex gap-3 mb-5">
          {urgentCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 font-label text-[13px] uppercase tracking-widest"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '16px', color: '#f87171' }}>
              <AlertCircle size={12} />
              <span><strong>{urgentCount}</strong> urgent — immediate attention</span>
            </div>
          )}
          {slaBreachCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 font-label text-[13px] uppercase tracking-widest"
              style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)', borderRadius: '16px', color: '#fb923c' }}>
              <Clock size={12} />
              <span><strong>{slaBreachCount}</strong> approaching SLA breach</span>
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.6)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="pl-8 pr-3 py-2 font-label text-[12px] w-52"
            style={{ ...INPUT_STYLE, borderRadius: '16px' }} />
        </div>
        <div className="flex gap-1">
          {(['all','complaint','refund','inquiry','feedback'] as const).map(f => (
            <button key={f} onClick={() => setFilterType(f)}
              className="px-2.5 py-1.5 font-label text-[13px] uppercase tracking-widest transition-colors"
              style={filterType === f
                ? { background: '#e0ee7d', color: '#000', borderRadius: '999px' }
                : { color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
              {f === 'all' ? 'All' : TYPE_LABEL[f as TicketType]}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

      {/* BOARD VIEW */}
      {view === 'board' && (
        <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
          {COLUMNS.map(col => {
            const colTickets = getColumnTickets(col.status)
            const sc = STATUS_CONFIG[col.status]
            return (
              <div key={col.status} className="flex-1 min-w-56 max-w-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                    <h3 className="font-label text-[13px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      {col.label}
                    </h3>
                  </div>
                  <span className="font-label text-[13px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{colTickets.length}</span>
                </div>
                <div className="space-y-2">
                  {colTickets.map(ticket => {
                    const ci = CHANNEL_ICONS[ticket.channel]
                    const CI = ci?.icon || User
                    const pc = PRIORITY_CONFIG[ticket.priority]
                    return (
                      <div key={ticket.id} onClick={() => setSelected(ticket)}
                        className="p-3.5 cursor-pointer dark-card"
                        style={{ ...SURFACE, borderRadius: '20px' }}>
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            {ticket.ticketNumber}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <CI size={9} style={{ color: ci?.color }} />
                            <span className="font-label text-[12px] uppercase tracking-widest" style={{ color: pc.textColor }}>
                              {ticket.priority}
                            </span>
                          </div>
                        </div>
                        <p className="text-[13px] font-medium leading-snug mb-2" style={{ color: 'rgba(255,255,255,0.85)' }}>
                          {ticket.subject}
                        </p>
                        <p className="font-label text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{ticket.customerName}</p>

                        {ticket.slaHoursLeft !== null && (
                          <div className="flex items-center gap-1 mt-2 font-label text-[12px] uppercase tracking-widest"
                            style={{ color: ticket.slaHoursLeft <= 2 ? '#f87171' : ticket.slaHoursLeft <= 5 ? '#fb923c' : 'rgba(255,255,255,0.3)' }}>
                            <Clock size={9} />
                            {ticket.slaHoursLeft}h SLA
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1 mt-2">
                          {ticket.tags.map(tag => (
                            <span key={tag} className="font-label text-[12px] px-1.5 py-0.5"
                              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', borderRadius: '10px' }}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2.5"
                          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 flex items-center justify-center font-label text-[9px] font-bold text-black"
                              style={{ background: ticket.assignedTo === 'Unassigned' ? 'rgba(255,255,255,0.2)' : '#e0ee7d', borderRadius: '10px' }}>
                              {ticket.assignedTo === 'Unassigned' ? '?' : ticket.assignedTo[0]}
                            </div>
                            <span className="font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                              {ticket.assignedTo}
                            </span>
                          </div>
                          <span className="font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                            {new Date(ticket.createdAt).toLocaleDateString('en-MY')}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  {colTickets.length === 0 && (
                    <div className="p-6 text-center" style={{ border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '20px' }}>
                      <p className="font-label text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>No tickets</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {view === 'table' && (
        <div style={{ ...SURFACE, borderRadius: '20px', overflow: 'hidden' }}>
          <div className="grid grid-cols-7 gap-3 px-5 py-3 font-label text-[12px] uppercase tracking-[0.15em]"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#0d0d0d', color: 'rgba(255,255,255,0.65)' }}>
            <span>Ticket</span>
            <span className="col-span-2">Subject / Customer</span>
            <span>Type</span>
            <span>Priority</span>
            <span>Status</span>
            <span>SLA</span>
          </div>
          {filtered.map(t => {
            const sc = STATUS_CONFIG[t.status]
            const pc = PRIORITY_CONFIG[t.priority]
            const ci = CHANNEL_ICONS[t.channel]
            const CI = ci?.icon || User
            return (
              <div key={t.id} onClick={() => setSelected(t)}
                className="grid grid-cols-7 gap-3 px-5 py-3.5 cursor-pointer items-center table-row"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="font-label text-[13px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{t.ticketNumber}</span>
                <div className="col-span-2">
                  <p className="text-[13px] font-medium truncate" style={{ color: 'rgba(255,255,255,0.8)' }}>{t.subject}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <CI size={9} style={{ color: ci?.color }} />
                    <p className="font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{t.customerName}</p>
                  </div>
                </div>
                <span className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {TYPE_LABEL[t.type]}
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: pc.dot }} />
                  <span className="font-label text-[12px] uppercase tracking-widest" style={{ color: pc.textColor }}>{t.priority}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 w-fit" style={{ background: sc.color, borderRadius: '12px' }}>
                  <div className="w-1 h-1 rounded-full" style={{ background: sc.dot }} />
                  <span className="font-label text-[12px] uppercase tracking-widest" style={{ color: sc.dot }}>{sc.label}</span>
                </div>
                <span className={cn('font-label text-[13px]')}
                  style={{ color: t.slaHoursLeft === null ? 'rgba(255,255,255,0.2)' : t.slaHoursLeft <= 2 ? '#f87171' : t.slaHoursLeft <= 5 ? '#fb923c' : 'rgba(255,255,255,0.4)' }}>
                  {t.slaHoursLeft !== null ? `${t.slaHoursLeft}h` : '—'}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Ticket Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSelected(null)} />
          <div className="w-80 h-full overflow-y-auto flex flex-col" style={{ background: '#0d0d0d', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div>
                <p className="font-label text-[12px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {selected.ticketNumber}
                </p>
                <h3 className="text-[13px] font-medium leading-snug" style={{ color: 'rgba(255,255,255,0.85)' }}>{selected.subject}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="text-2xl leading-none" style={{ color: 'rgba(255,255,255,0.6)' }}>×</button>
            </div>
            <div className="p-5 space-y-3 flex-1">
              {[
                { label: 'Customer',  value: selected.customerName },
                { label: 'Channel',   value: selected.channel },
                { label: 'Type',      value: selected.type },
                { label: 'Priority',  value: selected.priority },
                { label: 'Status',    value: STATUS_CONFIG[selected.status].label },
                { label: 'Assigned',  value: selected.assignedTo },
                { label: 'Created',   value: formatDateTime(selected.createdAt) },
                { label: 'Updated',   value: formatDateTime(selected.updatedAt) },
              ].map(row => (
                <div key={row.label} className="flex justify-between pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>{row.label}</span>
                  <span className="font-label text-[13px] capitalize" style={{ color: 'rgba(255,255,255,0.7)' }}>{row.value}</span>
                </div>
              ))}
              {selected.slaHoursLeft !== null && (
                <div className="flex items-center gap-2 p-3 font-label text-[13px] uppercase tracking-widest"
                  style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '16px', color: '#f87171' }}>
                  <Clock size={11} />
                  SLA: {selected.slaHoursLeft} hours remaining
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2 font-label text-[13px] uppercase tracking-widest transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', color: 'rgba(255,255,255,0.6)' }}>
                  Assign to Me
                </button>
                <button className="flex-1 py-2 font-label text-[13px] uppercase tracking-widest font-bold text-black"
                  style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                  Reply
                </button>
              </div>
              <button className="w-full py-2 font-label text-[13px] uppercase tracking-widest"
                style={{ background: 'rgba(224,238,125,0.08)', border: '1px solid rgba(224,238,125,0.2)', borderRadius: '16px', color: '#e0ee7d' }}>
                ✓ Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
