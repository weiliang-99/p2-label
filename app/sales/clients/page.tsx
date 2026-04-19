'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Phone, Mail, MapPin, Building2, ChevronRight, Edit2, Trash2, MoreHorizontal, X } from 'lucide-react'
import { fmtMYR, fmtDateMY } from '@/lib/sales'
import { cn } from '@/lib/utils'
import { SURFACE, INPUT_STYLE } from '@/lib/theme'

interface Client {
  id: string; name: string; contactPerson: string; email: string; phone: string
  address: string; city: string; industry: string; totalRevenue: number
  quoteCount: number; lastQuote: string; status: 'active' | 'inactive'
}

const CLIENTS: Client[] = [
  { id: '1', name: 'Kopi & Co Sdn Bhd',    contactPerson: 'Tan Wei Ming',   email: 'weiming@kopiandco.my',   phone: '+60 12-345 6789', address: 'No. 12, Jalan Bukit Bintang',         city: 'Kuala Lumpur',  industry: 'F&B',              totalRevenue: 4860, quoteCount: 3, lastQuote: '2025-01-05', status: 'active' },
  { id: '2', name: 'Beauty Lah Malaysia',   contactPerson: 'Siti Aisyah',    email: 'aisyah@beautylah.com.my',phone: '+60 11-234 5678', address: 'Level 5, Menara Pavilion',            city: 'Kuala Lumpur',  industry: 'Beauty',           totalRevenue: 3024, quoteCount: 2, lastQuote: '2025-01-10', status: 'active' },
  { id: '3', name: 'TechStart Ventures',    contactPerson: 'Raj Kumar',      email: 'raj@techstart.my',       phone: '+60 16-789 0123', address: 'Unit 3A, Cyberjaya Tech Park',        city: 'Cyberjaya',     industry: 'Technology',       totalRevenue: 4644, quoteCount: 1, lastQuote: '2025-01-18', status: 'active' },
  { id: '4', name: 'Makan King Restaurant', contactPerson: 'Ahmad Farid',    email: 'farid@makanking.com',    phone: '+60 3-8888 9999', address: 'Lot 22, Jalan Ampang',               city: 'Kuala Lumpur',  industry: 'F&B',              totalRevenue: 1728, quoteCount: 2, lastQuote: '2025-01-12', status: 'active' },
  { id: '5', name: 'Bloom Florist & Events',contactPerson: 'Lisa Ong',       email: 'lisa@bloomevents.my',    phone: '+60 17-456 7890', address: '88, Jalan PJU 1A/3, Ara Damansara', city: 'Petaling Jaya', industry: 'Events',           totalRevenue: 3024, quoteCount: 2, lastQuote: '2025-01-08', status: 'active' },
  { id: '6', name: 'GreenEarth Solutions',  contactPerson: 'David Lim',      email: 'david@greenearth.com.my',phone: '+60 12-678 9012', address: 'No. 5, Jalan Eco Park',              city: 'Shah Alam',     industry: 'Sustainability',   totalRevenue: 7200, quoteCount: 1, lastQuote: '2025-01-20', status: 'active' },
  { id: '7', name: 'Nasi Lemak Brothers',   contactPerson: 'Hafiz Razali',   email: 'hafiz@nasilemakbros.my', phone: '+60 19-345 6789', address: 'No. 3, Jalan Masjid India',          city: 'Kuala Lumpur',  industry: 'F&B',              totalRevenue: 1440, quoteCount: 1, lastQuote: '2024-12-01', status: 'inactive' },
  { id: '8', name: 'Kedai Buku Ilmu',       contactPerson: 'Nurul Ain',      email: 'nurul@kedaibuku.my',     phone: '+60 3-9999 1234', address: 'Lot 5, Kompleks Wawasan',            city: 'Kuala Lumpur',  industry: 'Retail',           totalRevenue: 960,  quoteCount: 1, lastQuote: '2024-12-10', status: 'active' },
]

const INDUSTRIES = ['All', 'F&B', 'Beauty', 'Technology', 'Events', 'Sustainability', 'Retail']
type FormState = { name: string; contactPerson: string; email: string; phone: string; address: string; city: string; industry: string }
const emptyForm = (): FormState => ({ name: '', contactPerson: '', email: '', phone: '', address: '', city: '', industry: 'F&B' })


export default function ClientsPage() {
  const [search, setSearch]       = useState('')
  const [industry, setIndustry]   = useState('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showForm, setShowForm]   = useState(false)
  const [editId, setEditId]       = useState<string | null>(null)
  const [form, setForm]           = useState<FormState>(emptyForm())
  const [actionMenu, setActionMenu] = useState<string | null>(null)

  const filtered = CLIENTS.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.contactPerson.toLowerCase().includes(search.toLowerCase())
    const matchIndustry = industry === 'All' || c.industry === industry
    return matchSearch && matchIndustry
  })

  const selected = CLIENTS.find(c => c.id === selectedId) || null

  const openAdd  = () => { setEditId(null); setForm(emptyForm()); setShowForm(true) }
  const openEdit = (c: Client) => {
    setEditId(c.id)
    setForm({ name: c.name, contactPerson: c.contactPerson, email: c.email, phone: c.phone, address: c.address, city: c.city, industry: c.industry })
    setShowForm(true); setActionMenu(null)
  }

  return (
    <div className="p-8 flex gap-6">
      {/* Left: List */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-label text-[12px] uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>[Sales · Clients]</p>
            <h1 className="font-display text-7xl leading-none" style={{ letterSpacing: '0.04em' }}>CLIENTS</h1>
            <p className="text-lg mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
              客户 · {CLIENTS.length} clients · {CLIENTS.filter(c => c.status === 'active').length} active
            </p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black font-label hover:opacity-85 transition-opacity"
            style={{ background: '#e0ee7d', borderRadius: '999px' }}>
            <Plus size={13} /> Add Client
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.6)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search clients..." className="pl-8 pr-3 py-2 text-lg"
              style={{ ...INPUT_STYLE, width: 220 }} />
          </div>
          <div className="flex gap-0" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            {INDUSTRIES.map(i => (
              <button key={i} onClick={() => setIndustry(i)}
                className="px-3 py-2 font-label text-[13px] uppercase tracking-widest transition-colors"
                style={{
                  background: industry === i ? '#e0ee7d' : 'transparent',
                  color: industry === i ? '#000' : 'rgba(255,255,255,0.4)',
                  borderRight: i !== INDUSTRIES[INDUSTRIES.length-1] ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}>
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Client list */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center font-label text-[12px] uppercase tracking-widest" style={{ ...SURFACE, color: 'rgba(255,255,255,0.55)' }}>
              No clients found
            </div>
          )}
          {filtered.map(c => (
            <div key={c.id} onClick={() => setSelectedId(c.id === selectedId ? null : c.id)}
              className="p-4 cursor-pointer transition-all"
              style={{
                background: selectedId === c.id ? '#181818' : '#111111',
                border: selectedId === c.id ? '1px solid rgba(224,238,125,0.3)' : '1px solid rgba(255,255,255,0.07)',
              }}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 flex items-center justify-center text-black font-bold text-lg shrink-0"
                  style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white truncate">{c.name}</p>
                    <span className="font-label text-[13px] px-1.5 py-0.5 uppercase tracking-wider shrink-0"
                      style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)' }}>
                      {c.industry}
                    </span>
                    {c.status === 'inactive' && (
                      <span className="font-label text-[13px] px-1.5 py-0.5 uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)' }}>
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="font-label text-[13px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {c.contactPerson} · {c.city}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-2xl" style={{ color: '#e0ee7d', letterSpacing: '0.02em' }}>{fmtMYR(c.totalRevenue)}</p>
                  <p className="font-label text-[13px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>{c.quoteCount} quote{c.quoteCount !== 1 ? 's' : ''}</p>
                </div>
                <div className="relative">
                  <button onClick={e => { e.stopPropagation(); setActionMenu(actionMenu === c.id ? null : c.id) }}
                    className="p-1.5 transition-colors" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <MoreHorizontal size={14} />
                  </button>
                  {actionMenu === c.id && (
                    <div className="absolute right-0 top-7 z-20 py-1 w-36"
                      style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)' }}>
                      <button onClick={e => { e.stopPropagation(); openEdit(c) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 font-label text-[12px] uppercase tracking-wider text-left hover:text-white transition-colors"
                        style={{ color: 'rgba(255,255,255,0.75)' }}>
                        <Edit2 size={11} /> Edit
                      </button>
                      <button onClick={e => { e.stopPropagation(); setActionMenu(null) }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 font-label text-[12px] uppercase tracking-wider text-left"
                        style={{ color: 'rgba(239,68,68,0.8)' }}>
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Detail */}
      {selected && (
        <div className="w-72 shrink-0">
          <div className="sticky top-6" style={SURFACE}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>Client Details</p>
              <button onClick={() => setSelectedId(null)} style={{ color: 'rgba(255,255,255,0.65)' }}>
                <X size={14} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 flex items-center justify-center text-black font-bold"
                  style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">{selected.name}</p>
                  <span className="font-label text-[13px] px-1.5 py-0.5 uppercase tracking-wider"
                    style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)' }}>
                    {selected.industry}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { icon: Building2, label: 'Contact', value: selected.contactPerson },
                  { icon: Phone,     label: 'Phone',   value: selected.phone },
                  { icon: Mail,      label: 'Email',   value: selected.email },
                  { icon: MapPin,    label: 'Address', value: `${selected.address}, ${selected.city}` },
                ].map(row => (
                  <div key={row.label} className="flex items-start gap-2.5">
                    <row.icon size={12} className="mt-0.5 shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }} />
                    <div>
                      <p className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>{row.label}</p>
                      <p className="text-sm text-white mt-0.5">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3" style={{ background: '#181818' }}>
                  <p className="font-label text-[12px] uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Revenue</p>
                  <p className="font-display text-2xl" style={{ color: '#e0ee7d' }}>{fmtMYR(selected.totalRevenue)}</p>
                </div>
                <div className="p-3" style={{ background: '#181818' }}>
                  <p className="font-label text-[12px] uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Quotes</p>
                  <p className="font-display text-2xl text-white">{selected.quoteCount}</p>
                </div>
              </div>

              <p className="font-label text-[13px] uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Last quote: {fmtDateMY(selected.lastQuote)}
              </p>

              <div className="space-y-2">
                <button onClick={() => openEdit(selected)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold uppercase tracking-widest text-black font-label"
                  style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                  <Edit2 size={12} /> Edit Client
                </button>
                <Link href="/sales/quotes/new"
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold uppercase tracking-widest font-label transition-colors block text-center hover:border-white/30"
                  style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}>
                  <ChevronRight size={12} /> New Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="font-display text-3xl" style={{ letterSpacing: '0.05em' }}>
                {editId ? 'EDIT CLIENT' : 'ADD CLIENT'}
              </p>
              <button onClick={() => setShowForm(false)} style={{ color: 'rgba(255,255,255,0.65)' }}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="font-label text-[13px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Company Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 text-lg" style={INPUT_STYLE} placeholder="e.g. Kopi & Co Sdn Bhd" />
                </div>
                {[
                  { key: 'contactPerson' as const, label: 'Contact Person', placeholder: 'Full name' },
                  { key: 'phone' as const, label: 'Phone', placeholder: '+60 12-345 6789' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="font-label text-[13px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{f.label}</label>
                    <input value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 text-lg" style={INPUT_STYLE} placeholder={f.placeholder} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="font-label text-[13px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Email</label>
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 text-lg" style={INPUT_STYLE} placeholder="contact@company.com.my" />
                </div>
                {[
                  { key: 'address' as const, label: 'Address', placeholder: 'Street address', span: 2 },
                ].map(f => (
                  <div key={f.key} className={f.span === 2 ? 'col-span-2' : ''}>
                    <label className="font-label text-[13px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{f.label}</label>
                    <input value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 text-lg" style={INPUT_STYLE} placeholder={f.placeholder} />
                  </div>
                ))}
                <div>
                  <label className="font-label text-[13px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>City</label>
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full px-3 py-2 text-lg" style={INPUT_STYLE} placeholder="Kuala Lumpur" />
                </div>
                <div>
                  <label className="font-label text-[13px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Industry</label>
                  <select value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                    className="w-full px-3 py-2 text-lg" style={{ ...INPUT_STYLE, background: '#181818' }}>
                    {INDUSTRIES.filter(i => i !== 'All').map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 font-label text-[12px] uppercase tracking-widest transition-colors hover:border-white/25"
                style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }}>
                Cancel
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 font-label text-[12px] uppercase tracking-widest font-bold text-black"
                style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                {editId ? 'Save Changes' : 'Add Client'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
