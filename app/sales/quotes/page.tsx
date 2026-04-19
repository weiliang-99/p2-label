'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Plus, Search, ChevronDown, ChevronUp,
  Eye, Send, FileCheck, Trash2, MoreHorizontal, Download, Copy
} from 'lucide-react'
import { fmtMYR, fmtDateMY, STATUS_COLORS } from '@/lib/sales'
import { cn } from '@/lib/utils'
import { SURFACE } from '@/lib/theme'

type Status = 'all' | 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'

interface Quote {
  id: string; number: string; client: string; amount: number
  status: string; date: string; validUntil: string; items: number
}

const QUOTES: Quote[] = [
  { id: '1', number: 'QT-2025-0001', client: 'Kopi & Co Sdn Bhd',      amount: 1620,  status: 'accepted', date: '2025-01-05', validUntil: '2025-02-05', items: 3 },
  { id: '2', number: 'QT-2025-0002', client: 'Beauty Lah Malaysia',     amount: 3024,  status: 'sent',     date: '2025-01-10', validUntil: '2025-02-10', items: 5 },
  { id: '3', number: 'QT-2025-0003', client: 'TechStart Ventures',      amount: 4644,  status: 'draft',    date: '2025-01-18', validUntil: '2025-02-18', items: 6 },
  { id: '4', number: 'QT-2025-0004', client: 'Makan King Restaurant',   amount: 864,   status: 'accepted', date: '2025-01-12', validUntil: '2025-02-12', items: 2 },
  { id: '5', number: 'QT-2025-0005', client: 'Bloom Florist & Events',  amount: 3024,  status: 'rejected', date: '2025-01-08', validUntil: '2025-01-22', items: 4 },
  { id: '6', number: 'QT-2025-0006', client: 'GreenEarth Solutions',    amount: 7200,  status: 'viewed',   date: '2025-01-20', validUntil: '2025-02-20', items: 8 },
  { id: '7', number: 'QT-2024-0021', client: 'Nasi Lemak Brothers',     amount: 1440,  status: 'expired',  date: '2024-12-01', validUntil: '2024-12-15', items: 3 },
  { id: '8', number: 'QT-2024-0020', client: 'Kedai Buku Ilmu',         amount: 960,   status: 'accepted', date: '2024-12-10', validUntil: '2025-01-10', items: 2 },
]

const STATUS_TABS: { key: Status; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'draft', label: 'Draft' }, { key: 'sent', label: 'Sent' },
  { key: 'viewed', label: 'Viewed' }, { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' }, { key: 'expired', label: 'Expired' },
]

type SortKey = 'date' | 'amount' | 'client' | 'number'
type SortDir = 'asc' | 'desc'


export default function QuotesPage() {
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatus]   = useState<Status>('all')
  const [sortKey, setSortKey]       = useState<SortKey>('date')
  const [sortDir, setSortDir]       = useState<SortDir>('desc')
  const [selected, setSelected]     = useState<Set<string>>(new Set())
  const [actionMenu, setActionMenu] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let q = [...QUOTES]
    if (statusFilter !== 'all') q = q.filter(r => r.status === statusFilter)
    if (search) {
      const s = search.toLowerCase()
      q = q.filter(r => r.client.toLowerCase().includes(s) || r.number.toLowerCase().includes(s))
    }
    q.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'date')   cmp = a.date.localeCompare(b.date)
      if (sortKey === 'amount') cmp = a.amount - b.amount
      if (sortKey === 'client') cmp = a.client.localeCompare(b.client)
      if (sortKey === 'number') cmp = a.number.localeCompare(b.number)
      return sortDir === 'asc' ? cmp : -cmp
    })
    return q
  }, [search, statusFilter, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map(q => q.id)))
  }

  const toggleOne = (id: string) => {
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronDown size={10} style={{ color: 'rgba(255,255,255,0.55)' }} />
    return sortDir === 'asc'
      ? <ChevronUp size={10} style={{ color: '#e0ee7d' }} />
      : <ChevronDown size={10} style={{ color: '#e0ee7d' }} />
  }

  const countByStatus = (s: string) => QUOTES.filter(q => q.status === s).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-label text-[12px] uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            [Sales · Documents]
          </p>
          <h1 className="font-display text-7xl leading-none" style={{ letterSpacing: '0.04em' }}>
            QUOTATIONS
          </h1>
          <p className="text-lg mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
            报价单 · {QUOTES.length} total · {countByStatus('accepted')} accepted
          </p>
        </div>
        <Link href="/sales/quotes/new"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black font-label hover:opacity-85 transition-opacity"
          style={{ background: '#e0ee7d', borderRadius: '999px' }}>
          <Plus size={13} /> New Quotation
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-0 mb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {STATUS_TABS.map(t => (
          <button key={t.key} onClick={() => setStatus(t.key)}
            className="px-4 py-2 font-label text-[13px] uppercase tracking-widest transition-colors relative"
            style={{
              color: statusFilter === t.key ? '#e0ee7d' : 'rgba(255,255,255,0.35)',
              borderBottom: statusFilter === t.key ? '2px solid #e0ee7d' : '2px solid transparent',
              marginBottom: '-1px',
            }}>
            {t.label}
            {t.key !== 'all' && (
              <span className="ml-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                ({countByStatus(t.key)})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + Bulk Actions */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.6)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search client or quote number..."
            className="pl-8 pr-3 py-2 text-lg outline-none transition-colors"
            style={{
              background: '#181818', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', width: 280,
            }} />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 ml-4">
            <span className="font-label text-[13px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>{selected.size} selected</span>
            <button className="px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
              <Download size={11} className="inline mr-1" /> Export
            </button>
            <button className="px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-colors"
              style={{ border: '1px solid rgba(239,68,68,0.4)', color: 'rgba(239,68,68,0.8)' }}>
              <Trash2 size={11} className="inline mr-1" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={SURFACE}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0d0d0d' }}>
              <th className="px-4 py-3 w-10">
                <input type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  style={{ accentColor: '#e0ee7d' }} />
              </th>
              {[
                { key: 'number' as SortKey, label: 'Quote #' },
                { key: 'client' as SortKey, label: 'Client' },
                { key: 'date' as SortKey,   label: 'Date' },
              ].map(col => (
                <th key={col.key} className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort(col.key)}
                    className="flex items-center gap-1 font-label text-[13px] uppercase tracking-widest transition-colors"
                    style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {col.label} <SortIcon k={col.key} />
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 text-left font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>Valid Until</th>
              <th className="px-4 py-3 text-left">
                <button onClick={() => toggleSort('amount')} className="flex items-center gap-1 font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Amount <SortIcon k="amount" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>Status</th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  No quotations found
                </td>
              </tr>
            )}
            {filtered.map(q => {
              const sc = STATUS_COLORS[q.status]
              const isSelected = selected.has(q.id)
              return (
                <tr key={q.id}
                  className="transition-colors"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: isSelected ? 'rgba(224,238,125,0.04)' : 'transparent',
                  }}
                  onMouseEnter={e => !isSelected && ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => !isSelected && ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleOne(q.id)} style={{ accentColor: '#e0ee7d' }} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-label text-[12px] text-white">{q.number}</span>
                    <p className="font-label text-[13px] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{q.items} items</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-lg font-semibold text-white">{q.client}</p>
                  </td>
                  <td className="px-4 py-3 font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.7)' }}>{fmtDateMY(q.date)}</td>
                  <td className="px-4 py-3 font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.7)' }}>{fmtDateMY(q.validUntil)}</td>
                  <td className="px-4 py-3">
                    <span className="font-display text-2xl" style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '0.02em' }}>{fmtMYR(q.amount)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('font-label text-[13px] px-2 py-0.5 uppercase tracking-widest', sc.bg, sc.text)}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 relative">
                    <button onClick={() => setActionMenu(actionMenu === q.id ? null : q.id)}
                      className="p-1 transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <MoreHorizontal size={15} />
                    </button>
                    {actionMenu === q.id && (
                      <div className="absolute right-8 top-1 z-20 py-1 w-44"
                        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)' }}>
                        {[
                          { icon: Eye, label: 'View / Edit', action: () => setActionMenu(null) },
                          { icon: Copy, label: 'Duplicate', action: () => setActionMenu(null) },
                        ].map(item => (
                          <button key={item.label} onClick={item.action}
                            className="w-full flex items-center gap-2.5 px-3 py-2 font-label text-[12px] uppercase tracking-wider transition-colors text-left hover:text-white"
                            style={{ color: 'rgba(255,255,255,0.75)' }}>
                            <item.icon size={11} /> {item.label}
                          </button>
                        ))}
                        {q.status === 'draft' && (
                          <button onClick={() => setActionMenu(null)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 font-label text-[12px] uppercase tracking-wider text-blue-300 text-left"
                            style={{ color: 'rgba(147,197,253,0.9)' }}>
                            <Send size={11} /> Mark as Sent
                          </button>
                        )}
                        {q.status === 'accepted' && (
                          <button onClick={() => setActionMenu(null)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 font-label text-[12px] uppercase tracking-wider text-left"
                            style={{ color: '#e0ee7d' }}>
                            <FileCheck size={11} /> Convert to Invoice
                          </button>
                        )}
                        <button onClick={() => setActionMenu(null)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 font-label text-[12px] uppercase tracking-wider text-left"
                          style={{ color: 'rgba(255,255,255,0.75)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                          <Download size={11} /> Download PDF
                        </button>
                        <button onClick={() => setActionMenu(null)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 font-label text-[12px] uppercase tracking-wider text-left"
                          style={{ color: 'rgba(239,68,68,0.8)' }}>
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="font-label text-[13px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Showing {filtered.length} of {QUOTES.length}
        </span>
        <span className="font-label text-[13px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Total: <span style={{ color: '#e0ee7d' }}>{fmtMYR(filtered.reduce((s, q) => s + q.amount, 0))}</span>
        </span>
      </div>
    </div>
  )
}
