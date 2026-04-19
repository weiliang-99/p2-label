'use client'

import { useState, useCallback } from 'react'
import { Plus, Trash2, Printer, Send, Save, FileText, X, Check, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fmtMYR, fmtDateMY, addDays, today, calcLineTotal, calcDiscount, calcSST, generateNumber } from '@/lib/sales'
import { SURFACE, INPUT_STYLE } from '@/lib/theme'

interface LineItem {
  id: string; description: string; quantity: number; unit: string
  unit_price: number; discount_pct: number; line_total: number
}

const CLIENTS = [
  { id: '1', company_name: 'Kopi & Co Sdn Bhd',    contact: 'Alex Tan',    email: 'alex@kopico.my',      phone: '+601112345678', address: '12, Jalan SS2/24, Petaling Jaya, 47500 Selangor' },
  { id: '2', company_name: 'Beauty Lah Malaysia',    contact: 'Sarah Lim',   email: 'sarah@beautylah.my',  phone: '+601198765432', address: '88, Jalan Bukit Bintang, 55100 Kuala Lumpur' },
  { id: '3', company_name: 'TechStart Ventures',     contact: 'David Chong', email: 'david@techstart.my',  phone: '+601156789012', address: 'A-12-3, Cyberjaya, 63000 Selangor' },
  { id: '4', company_name: 'Makan King Restaurant',  contact: 'Ali Hassan',  email: 'ali@makanking.my',    phone: '+601134567890', address: '5, Jalan Masjid, Shah Alam, 40000 Selangor' },
  { id: '5', company_name: 'Bloom Florist & Events', contact: 'Priya Menon', email: 'priya@bloomevents.my', phone: '+601167890123', address: '23, Jalan Telawi 3, Bangsar, 59100 Kuala Lumpur' },
]

const PRODUCTS = [
  { id: '1', name: 'Starter Social Media Package',  unit_price: 800,  unit: 'month', category: 'Package', description: '8 posts/month · 2 platforms · EN captions' },
  { id: '2', name: 'Growth Social Media Package',   unit_price: 1500, unit: 'month', category: 'Package', description: '16 posts + 4 stories · 3 platforms · Bilingual' },
  { id: '3', name: 'Premium Social Media Package',  unit_price: 2800, unit: 'month', category: 'Package', description: '24 posts + 8 stories + 2 Reels · All platforms' },
  { id: '4', name: 'Social Media Post (Graphic)',   unit_price: 150,  unit: 'post',  category: 'Ad-hoc',  description: 'Single static post with copywriting' },
  { id: '5', name: 'Short Video / Reel',            unit_price: 450,  unit: 'video', category: 'Ad-hoc',  description: 'Up to 60 seconds edited video' },
  { id: '6', name: 'Content Calendar Planning',     unit_price: 500,  unit: 'month', category: 'Service', description: 'Monthly content strategy + calendar' },
  { id: '7', name: 'Copywriting (Bilingual)',        unit_price: 80,   unit: 'post',  category: 'Service', description: 'EN + ZH captions per post' },
  { id: '8', name: 'Extra Revision',                unit_price: 50,   unit: 'round', category: 'Service', description: 'Additional revision beyond package allowance' },
]

const TERMS_TEMPLATES = [
  { label: 'Standard',        value: 'Payment terms: 50% deposit upon confirmation. Balance due upon delivery.\nValidity: This quotation is valid for 14 days from date of issue.\nRevision policy: Revisions are subject to the agreed package terms.' },
  { label: '3-Month Package', value: 'Payment terms: Full payment monthly, due on the 1st of each month.\nThis is a 3-month contract. Early termination subject to 1-month notice.\nValidity: Quote valid for 14 days. Prices locked for contract duration.' },
  { label: 'Ad-hoc',          value: 'Payment terms: 100% payment upon confirmation.\nDelivery: 3–5 business days after payment cleared.\nRevisions: 2 rounds included. Additional at RM 50/round.' },
]

const newLine = (): LineItem => ({
  id: Math.random().toString(36).slice(2),
  description: '', quantity: 1, unit: 'month',
  unit_price: 0, discount_pct: 0, line_total: 0,
})


export default function NewQuotePage() {
  const quoteNumber = generateNumber('QT', 6)
  const issueDate   = today()

  const [clientId, setClientId]         = useState('')
  const [clientSearch, setClientSearch] = useState('')
  const [showClients, setShowClients]   = useState(false)
  const [validDays, setValidDays]       = useState(14)
  const [lines, setLines]               = useState<LineItem[]>([newLine()])
  const [discountType, setDiscountType] = useState<'none' | 'percentage' | 'fixed'>('none')
  const [discountValue, setDiscountValue] = useState(0)
  const [sstEnabled, setSstEnabled]     = useState(true)
  const [sstRate, setSstRate]           = useState(8)
  const [terms, setTerms]               = useState(TERMS_TEMPLATES[0].value)
  const [showProducts, setShowProducts] = useState<string | null>(null)
  const [productSearch, setProductSearch] = useState('')
  const [saved, setSaved]               = useState(false)

  const selectedClient = CLIENTS.find(c => c.id === clientId)
  const filteredClients = CLIENTS.filter(c =>
    c.company_name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.contact.toLowerCase().includes(clientSearch.toLowerCase())
  )

  const subtotal      = lines.reduce((s, l) => s + l.line_total, 0)
  const discountAmt   = calcDiscount(subtotal, discountType, discountValue)
  const sstAmount     = sstEnabled ? calcSST(subtotal, discountAmt, sstRate) : 0
  const grandTotal    = subtotal - discountAmt + sstAmount
  const validUntil    = addDays(issueDate, validDays)

  const updateLine = useCallback((id: string, field: keyof LineItem, raw: string | number) => {
    setLines(prev => prev.map(l => {
      if (l.id !== id) return l
      const updated = { ...l, [field]: raw }
      updated.line_total = calcLineTotal(Number(updated.quantity), Number(updated.unit_price), Number(updated.discount_pct))
      return updated
    }))
  }, [])

  const addLine    = () => setLines(p => [...p, newLine()])
  const removeLine = (id: string) => setLines(p => p.filter(l => l.id !== id))

  const applyProduct = (lineId: string, prod: typeof PRODUCTS[0]) => {
    setLines(prev => prev.map(l => {
      if (l.id !== lineId) return l
      const updated = { ...l, description: prod.name, unit_price: prod.unit_price, unit: prod.unit }
      updated.line_total = calcLineTotal(updated.quantity, updated.unit_price, updated.discount_pct)
      return updated
    }))
    setShowProducts(null); setProductSearch('')
  }

  const [errors, setErrors] = useState<{ client?: boolean; lines?: boolean }>({})

  const handleSave = () => {
    const hasClient = !!clientId
    const hasLines  = lines.some(l => l.description.trim().length > 0)
    if (!hasClient || !hasLines) {
      setErrors({ client: !hasClient, lines: !hasLines })
      setTimeout(() => setErrors({}), 1500)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; }
          .print-area { box-shadow: none !important; border: none !important; }
        }
        @media screen { .print-only { display: none; } }
      `}</style>

      <div className="no-print h-full flex flex-col" style={{ background: '#0a0a0a' }}>
        {/* Top bar */}
        <div className="no-print flex items-center justify-between px-8 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0d0d0d' }}>
          <div>
            <p className="font-label text-[12px] uppercase tracking-[0.2em] mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Sales]</p>
            <h1 className="font-display text-3xl" style={{ letterSpacing: '0.05em' }}>NEW QUOTATION — {quoteNumber}</h1>
            <p className="font-label text-[12px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
              报价单 · Issued {fmtDateMY(issueDate)} · Valid until {fmtDateMY(validUntil)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {saved && <span className="font-label text-[13px] uppercase tracking-widest" style={{ color: '#e0ee7d' }}>✓ Saved</span>}
            <button onClick={handleSave}
              className="px-4 py-2 font-label text-[13px] uppercase tracking-widest flex items-center gap-1.5 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', color: 'rgba(255,255,255,0.6)' }}>
              <Save size={11} /> Save Draft
            </button>
            <button onClick={() => { const t = document.title; document.title = quoteNumber; window.print(); document.title = t }}
              className="px-4 py-2 font-label text-[13px] uppercase tracking-widest flex items-center gap-1.5 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', color: 'rgba(255,255,255,0.6)' }}>
              <Printer size={11} /> Print / PDF
            </button>
            <button className="px-4 py-2 font-label text-[13px] uppercase tracking-widest font-bold text-black flex items-center gap-1.5"
              style={{ background: '#e0ee7d', borderRadius: '999px' }}>
              <Send size={11} /> Send to Client
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: Form */}
          <div className="no-print flex-1 overflow-y-auto px-8 py-6 space-y-6">

            {/* Quote info */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Quote Number', content: <input value={quoteNumber} readOnly className="w-full px-3 py-2.5 text-lg" style={{ ...INPUT_STYLE, background: '#141414', borderRadius: '16px', color: 'rgba(255,255,255,0.65)' }} /> },
                { label: 'Issue Date',   content: <input type="date" defaultValue={issueDate} className="w-full px-3 py-2.5 text-lg" style={{ ...INPUT_STYLE, borderRadius: '16px' }} /> },
                { label: 'Valid (days)', content: <input type="number" value={validDays} onChange={e => setValidDays(Number(e.target.value))} min={1} className="w-full px-3 py-2.5 text-lg" style={{ ...INPUT_STYLE, borderRadius: '16px' }} /> },
              ].map(f => (
                <div key={f.label}>
                  <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{f.label}</label>
                  {f.content}
                </div>
              ))}
            </div>

            {/* Client selector */}
            <div>
              <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Client 客户</label>
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.6)' }} />
                    <input value={clientSearch} onFocus={() => setShowClients(true)}
                      onChange={e => { setClientSearch(e.target.value); setShowClients(true) }}
                      placeholder="Search client..."
                      className={cn('w-full pl-8 pr-3 py-2.5 text-lg dark-input', errors.client && 'field-error')}
                      style={{ ...INPUT_STYLE, borderRadius: '16px' }} />
                  </div>
                  <button className="px-3 py-2 font-label text-[13px] uppercase tracking-widest flex items-center gap-1 transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: 'rgba(255,255,255,0.7)' }}>
                    <Plus size={10} /> New
                  </button>
                </div>
                {showClients && (
                  <div className="absolute top-full mt-1 left-0 right-0 z-20 overflow-hidden dropdown-enter"
                    style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px' }}>
                    {filteredClients.map(c => (
                      <button key={c.id} onClick={() => { setClientId(c.id); setClientSearch(c.company_name); setShowClients(false) }}
                        className="w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(224,238,125,0.05)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                        <div>
                          <p className="text-lg font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{c.company_name}</p>
                          <p className="font-label text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{c.contact} · {c.email}</p>
                        </div>
                        {clientId === c.id && <Check size={12} style={{ color: '#e0ee7d' }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedClient && (
                <div className="mt-2 p-3 font-label text-[13px]"
                  style={{ background: 'rgba(224,238,125,0.05)', border: '1px solid rgba(224,238,125,0.15)', borderRadius: '16px', color: 'rgba(255,255,255,0.55)' }}>
                  <p><strong style={{ color: '#e0ee7d' }}>{selectedClient.company_name}</strong> · {selectedClient.contact}</p>
                  <p className="mt-0.5">{selectedClient.address}</p>
                  <p>{selectedClient.phone} · {selectedClient.email}</p>
                </div>
              )}
            </div>

            {/* Line Items */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <label className="block font-label text-[12px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Line Items 项目明细
                </label>
                {errors.lines && <span className="error-text">At least one item required</span>}
              </div>
              <div style={{ border: errors.lines ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden' }}>
                <div className="grid font-label text-[12px] uppercase tracking-[0.1em]"
                  style={{ gridTemplateColumns: '1fr 80px 90px 100px 80px 90px 36px', background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)' }}>
                  {['Description', 'Qty', 'Unit', 'Unit Price', 'Disc %', 'Total', ''].map((h, i) => (
                    <div key={i} className="px-3 py-2.5">{h}</div>
                  ))}
                </div>

                {lines.map((line) => (
                  <div key={line.id} className="grid items-center"
                    style={{ gridTemplateColumns: '1fr 80px 90px 100px 80px 90px 36px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="relative px-2 py-1.5">
                      <div className="flex gap-1">
                        <input value={line.description}
                          onChange={e => updateLine(line.id, 'description', e.target.value)}
                          placeholder="Add description or search products..."
                          className="flex-1 px-2 py-1.5 text-lg min-w-0"
                          style={{ background: 'transparent', border: '1px solid transparent', color: 'rgba(255,255,255,0.75)', outline: 'none' }}
                          onFocus={e => ((e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)')}
                          onBlur={e => ((e.target as HTMLElement).style.borderColor = 'transparent')} />
                        <button onClick={() => setShowProducts(showProducts === line.id ? null : line.id)}
                          className="p-1.5 shrink-0 transition-colors"
                          style={{ color: 'rgba(255,255,255,0.55)', borderRadius: '12px' }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#e0ee7d')}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)')}>
                          <FileText size={12} />
                        </button>
                      </div>
                      {showProducts === line.id && (
                        <div className="absolute top-full left-0 z-30 w-80 overflow-hidden mt-1 dropdown-enter"
                          style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px' }}>
                          <div className="p-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <input autoFocus value={productSearch} onChange={e => setProductSearch(e.target.value)}
                              placeholder="Search products..."
                              className="w-full px-2 py-1.5 font-label text-[13px]"
                              style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', borderRadius: '12px' }} />
                          </div>
                          <div className="max-h-52 overflow-y-auto">
                            {PRODUCTS.filter(p => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase())).map(p => (
                              <button key={p.id} onClick={() => applyProduct(line.id, p)}
                                className="w-full text-left px-3 py-2.5 transition-colors"
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(224,238,125,0.05)')}
                                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.8)' }}>{p.name}</p>
                                    <p className="font-label text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{p.description}</p>
                                  </div>
                                  <span className="font-label text-[13px] whitespace-nowrap" style={{ color: '#e0ee7d' }}>
                                    RM {p.unit_price}/{p.unit}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Qty */}
                    <input type="number" value={line.quantity} step="0.5" min="0.01"
                      onChange={e => updateLine(line.id, 'quantity', e.target.value)}
                      className="px-2 py-1.5 text-lg mx-1 text-center w-full"
                      style={{ background: 'transparent', border: '1px solid transparent', color: 'rgba(255,255,255,0.7)', outline: 'none', borderRadius: '12px' }}
                      onFocus={e => ((e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)')}
                      onBlur={e => ((e.target as HTMLElement).style.borderColor = 'transparent')} />
                    {/* Unit */}
                    <select value={line.unit} onChange={e => updateLine(line.id, 'unit', e.target.value)}
                      className="px-1 py-1.5 text-[12px] mx-1 w-full font-label"
                      style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)', outline: 'none', borderRadius: '12px' }}>
                      {['month','post','video','set','hour','round','pcs'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    {/* Unit Price */}
                    <input type="number" value={line.unit_price} step="50" min="0"
                      onChange={e => updateLine(line.id, 'unit_price', e.target.value)}
                      className="px-2 py-1.5 text-lg mx-1 text-right w-full"
                      style={{ background: 'transparent', border: '1px solid transparent', color: 'rgba(255,255,255,0.7)', outline: 'none', borderRadius: '12px' }}
                      onFocus={e => ((e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)')}
                      onBlur={e => ((e.target as HTMLElement).style.borderColor = 'transparent')} />
                    {/* Disc % */}
                    <input type="number" value={line.discount_pct} step="5" min="0" max="100"
                      onChange={e => updateLine(line.id, 'discount_pct', e.target.value)}
                      className="px-2 py-1.5 text-lg mx-1 text-center w-full"
                      style={{ background: 'transparent', border: '1px solid transparent', color: 'rgba(255,255,255,0.7)', outline: 'none', borderRadius: '12px' }}
                      onFocus={e => ((e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)')}
                      onBlur={e => ((e.target as HTMLElement).style.borderColor = 'transparent')} />
                    <p className="px-3 text-lg font-semibold text-right" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {fmtMYR(line.line_total)}
                    </p>
                    <button onClick={() => removeLine(line.id)} disabled={lines.length === 1}
                      className="flex items-center justify-center transition-colors disabled:opacity-0"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#f87171')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)')}>
                      <X size={13} />
                    </button>
                  </div>
                ))}

                <div className="p-2">
                  <button onClick={addLine}
                    className="flex items-center gap-1.5 font-label text-[13px] uppercase tracking-widest px-3 py-2 transition-colors"
                    style={{ color: 'rgba(255,255,255,0.65)', borderRadius: '12px' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#e0ee7d')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}>
                    <Plus size={11} /> Add Line Item
                  </button>
                </div>
              </div>
            </div>

            {/* Discount + SST */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Discount 折扣
                </label>
                <div className="flex gap-2">
                  <select value={discountType} onChange={e => setDiscountType(e.target.value as typeof discountType)}
                    className="flex-1 px-3 py-2.5 text-lg"
                    style={{ ...INPUT_STYLE, borderRadius: '16px' }}>
                    <option value="none">No Discount</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (RM)</option>
                  </select>
                  {discountType !== 'none' && (
                    <input type="number" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))}
                      min={0} placeholder={discountType === 'percentage' ? '10' : '200'}
                      className="w-24 px-3 py-2.5 text-lg"
                      style={{ ...INPUT_STYLE, borderRadius: '16px' }} />
                  )}
                </div>
              </div>
              <div>
                <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  SST Tax
                </label>
                <div className="flex gap-2 items-center">
                  <button onClick={() => setSstEnabled(!sstEnabled)}
                    className="w-10 h-5 relative transition-colors shrink-0"
                    style={{ background: sstEnabled ? '#e0ee7d' : 'rgba(255,255,255,0.1)', borderRadius: '9999px' }}>
                    <div className="absolute top-0.5 w-4 h-4 transition-transform"
                      style={{ background: sstEnabled ? '#000' : 'rgba(255,255,255,0.5)', borderRadius: '50%', transform: sstEnabled ? 'translateX(21px)' : 'translateX(2px)' }} />
                  </button>
                  <span className="text-lg" style={{ color: 'rgba(255,255,255,0.55)' }}>{sstEnabled ? 'SST Enabled' : 'SST Disabled'}</span>
                  {sstEnabled && (
                    <div className="flex items-center gap-1 ml-2">
                      <input type="number" value={sstRate} onChange={e => setSstRate(Number(e.target.value))} min={0} max={16}
                        className="w-14 px-2 py-1.5 text-lg"
                        style={{ ...INPUT_STYLE, borderRadius: '12px' }} />
                      <span className="text-lg" style={{ color: 'rgba(255,255,255,0.65)' }}>%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Terms */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-label text-[12px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Terms & Conditions
                </label>
                <select onChange={e => setTerms(e.target.value)}
                  className="font-label text-[12px] uppercase tracking-widest px-2 py-1 transition-colors"
                  style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)', outline: 'none', borderRadius: '12px' }}>
                  <option value="">Load template...</option>
                  {TERMS_TEMPLATES.map(t => <option key={t.label} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <textarea value={terms} onChange={e => setTerms(e.target.value)} rows={4}
                className="w-full px-3 py-2.5 text-lg resize-none"
                style={{ ...INPUT_STYLE, borderRadius: '16px' }} />
            </div>
          </div>

          {/* RIGHT: Live Preview */}
          <div className="no-print w-96 overflow-y-auto" style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', background: '#0d0d0d' }}>
            <div className="sticky top-0 px-4 pt-4 pb-2 z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0d0d0d' }}>
              <p className="font-label text-[12px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.65)' }}>Live Preview 预览</p>
            </div>
            <div className="p-4">
              <QuotePreview
                quoteNumber={quoteNumber} issueDate={issueDate} validUntil={validUntil}
                client={selectedClient} lines={lines} subtotal={subtotal}
                discountType={discountType} discountAmt={discountAmt}
                sstEnabled={sstEnabled} sstRate={sstRate} sstAmount={sstAmount}
                grandTotal={grandTotal} terms={terms}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Printable version */}
      <div className="print-only p-12 bg-white min-h-screen">
        <QuotePreview
          quoteNumber={quoteNumber} issueDate={issueDate} validUntil={validUntil}
          client={selectedClient} lines={lines} subtotal={subtotal}
          discountType={discountType} discountAmt={discountAmt}
          sstEnabled={sstEnabled} sstRate={sstRate} sstAmount={sstAmount}
          grandTotal={grandTotal} terms={terms} print
        />
      </div>
    </>
  )
}

function QuotePreview({
  quoteNumber, issueDate, validUntil, client, lines,
  subtotal, discountType, discountAmt, sstEnabled, sstRate,
  sstAmount, grandTotal, terms, print = false
}: {
  quoteNumber: string; issueDate: string; validUntil: string
  client: typeof CLIENTS[0] | undefined; lines: LineItem[]
  subtotal: number; discountType: string; discountAmt: number
  sstEnabled: boolean; sstRate: number; sstAmount: number; grandTotal: number
  terms: string; print?: boolean
}) {
  return (
    <div className={cn('bg-white rounded-xl overflow-hidden print-area', print ? 'text-lg' : 'text-sm shadow-sm')}>
      <div className="px-6 pt-6 pb-4" style={{ background: '#0a0a0a' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="w-9 h-9 flex items-center justify-center mb-2 font-display text-lg text-black" style={{ background: '#e0ee7d', borderRadius: '999px' }}>P2</div>
            <p className="text-white font-bold text-lg">P2 Label</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>No. 88, Jalan 33, Pong Hill</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>47100 Subang Jaya, Selangor</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>hello@p2label.com</p>
          </div>
          <div className="text-right">
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Quotation</p>
            <p className="text-white font-bold text-xl">{quoteNumber}</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, marginTop: 6 }}>Issued: {fmtDateMY(issueDate)}</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10 }}>Valid until: {fmtDateMY(validUntil)}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Bill To</p>
        {client ? (
          <div>
            <p className="font-bold text-slate-900">{client.company_name}</p>
            <p className="text-slate-500">{client.contact}</p>
            <p className="text-slate-500">{client.address}</p>
            <p className="text-slate-500">{client.phone} · {client.email}</p>
          </div>
        ) : <p className="text-slate-300 italic">Select a client...</p>}
      </div>

      <div className="px-6 py-4">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-200">
              {['Description','Qty','Unit Price','Amount'].map((h, i) => (
                <th key={h} className={cn('py-2 text-slate-400 font-semibold uppercase tracking-wide', i > 0 ? 'text-right' : 'text-left')} style={{ fontSize: 9, width: i === 0 ? 'auto' : i === 1 ? 40 : 80 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lines.filter(l => l.description).map(line => (
              <tr key={line.id} className="border-b border-slate-100">
                <td className="py-2 text-slate-700">
                  {line.description}
                  {line.discount_pct > 0 && <span className="text-green-600 ml-1">(-{line.discount_pct}%)</span>}
                </td>
                <td className="py-2 text-right text-slate-600">{line.quantity} {line.unit}</td>
                <td className="py-2 text-right text-slate-600">{fmtMYR(line.unit_price)}</td>
                <td className="py-2 text-right font-semibold text-slate-800">{fmtMYR(line.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 border-t border-slate-200 pt-3 space-y-1.5">
          <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="text-slate-700 font-medium">{fmtMYR(subtotal)}</span></div>
          {discountType !== 'none' && discountAmt > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discountType === 'percentage' ? `${(discountAmt / subtotal * 100).toFixed(0)}%` : 'Fixed'})</span>
              <span>-{fmtMYR(discountAmt)}</span>
            </div>
          )}
          {sstEnabled && <div className="flex justify-between text-slate-500"><span>SST ({sstRate}%)</span><span>{fmtMYR(sstAmount)}</span></div>}
          <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-200 pt-2 mt-1">
            <span>Grand Total</span>
            <span style={{ color: '#e0ee7d', WebkitTextFillColor: '#b5c036' }}>{fmtMYR(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Payment Details</p>
        <p className="text-slate-600 text-sm">Bank: <strong>Maybank</strong></p>
        <p className="text-slate-600 text-sm">Account: <strong>5123 4567 8901</strong> (P2 Label Sdn Bhd)</p>
      </div>

      {terms && (
        <div className="px-6 py-3 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Terms & Conditions</p>
          <p className="text-slate-500 whitespace-pre-line leading-relaxed" style={{ fontSize: 9 }}>{terms}</p>
        </div>
      )}

      <div className="px-6 py-3 border-t border-slate-100 flex justify-between items-center">
        <p className="text-slate-300" style={{ fontSize: 9 }}>Generated by P2 Label Business Hub</p>
        <p className="text-slate-300" style={{ fontSize: 9 }}>{quoteNumber}</p>
      </div>
    </div>
  )
}
