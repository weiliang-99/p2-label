'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Edit2, Trash2, X, Package, Tag, Copy } from 'lucide-react'
import { fmtMYR } from '@/lib/sales'
import { cn } from '@/lib/utils'
import { SURFACE, INPUT_STYLE } from '@/lib/theme'

type PriceUnit = 'per post' | 'per month' | 'per campaign' | 'per hour' | 'per package' | 'per platform'

interface Product {
  id: string; name: string; nameZh: string; category: string
  description: string; unitPrice: number; unit: PriceUnit
  sstApplicable: boolean; active: boolean
}

const PRODUCTS: Product[] = [
  { id: '1',  name: 'Social Media Monthly Management',  nameZh: '社交媒体月度管理',   category: 'Social Media',  description: 'Full management of 1 social media platform — content planning, posting, engagement',                unitPrice: 1200, unit: 'per month',    sstApplicable: true,  active: true },
  { id: '2',  name: 'Content Creation Package',         nameZh: '内容创作套餐',         category: 'Content',       description: '10 social media posts with copywriting, design, and caption in EN & ZH',                         unitPrice: 800,  unit: 'per package',  sstApplicable: true,  active: true },
  { id: '3',  name: 'Instagram Reels Production',       nameZh: 'Instagram 短视频制作', category: 'Video',         description: '1 short-form video (30–60s) — scripting, filming coordination, editing, caption',                unitPrice: 450,  unit: 'per post',     sstApplicable: true,  active: true },
  { id: '4',  name: 'Paid Ads Management — Meta',       nameZh: 'Meta 付费广告管理',    category: 'Advertising',   description: 'Facebook + Instagram paid ads setup, optimization, and monthly reporting',                       unitPrice: 600,  unit: 'per month',    sstApplicable: true,  active: true },
  { id: '5',  name: 'Google Ads Management',            nameZh: 'Google 广告管理',      category: 'Advertising',   description: 'Google Search + Display ads — keyword research, ad copy, bid optimization',                     unitPrice: 700,  unit: 'per month',    sstApplicable: true,  active: true },
  { id: '6',  name: 'Brand Strategy Consultation',      nameZh: '品牌策略咨询',         category: 'Strategy',      description: 'One-time brand positioning, target audience analysis, and content strategy document',             unitPrice: 1500, unit: 'per package',  sstApplicable: true,  active: true },
  { id: '7',  name: 'Single Platform Setup',            nameZh: '单平台设置',           category: 'Social Media',  description: 'Initial setup: profile optimisation, bio, highlights, link-in-bio, pinned post',                unitPrice: 300,  unit: 'per platform', sstApplicable: true,  active: true },
  { id: '8',  name: 'Copywriting (Bilingual)',           nameZh: '双语文案撰写',         category: 'Content',       description: 'Custom bilingual copy (EN + ZH) for posts, ads, or website — per piece',                       unitPrice: 120,  unit: 'per post',     sstApplicable: true,  active: true },
  { id: '9',  name: 'KOL / Influencer Coordination',   nameZh: '网红合作协调',         category: 'Influencer',    description: 'KOL outreach, negotiation, brief, deliverables management — per campaign',                     unitPrice: 2000, unit: 'per campaign', sstApplicable: true,  active: true },
  { id: '10', name: 'Monthly Analytics Report',         nameZh: '月度数据报告',         category: 'Analytics',     description: 'Comprehensive monthly performance report with insights and recommendations',                    unitPrice: 350,  unit: 'per month',    sstApplicable: true,  active: false },
]

const CATEGORIES = ['All', 'Social Media', 'Content', 'Video', 'Advertising', 'Strategy', 'Influencer', 'Analytics']
const PRICE_UNITS: PriceUnit[] = ['per post', 'per month', 'per campaign', 'per hour', 'per package', 'per platform']

type FormState = Omit<Product, 'id' | 'active'>
const emptyForm = (): FormState => ({ name: '', nameZh: '', category: 'Social Media', description: '', unitPrice: 0, unit: 'per month', sstApplicable: true })


const CATEGORY_COLOR: Record<string, string> = {
  'Social Media': '#e0ee7d', 'Content': 'rgba(224,238,125,0.65)', 'Video': 'rgba(224,238,125,0.45)',
  'Advertising': 'rgba(255,255,255,0.5)', 'Strategy': 'rgba(255,255,255,0.35)',
  'Influencer': 'rgba(255,255,255,0.2)', 'Analytics': 'rgba(255,255,255,0.15)',
}

export default function ProductsPage() {
  const [search, setSearch]           = useState('')
  const [category, setCategory]       = useState('All')
  const [showInactive, setShowInactive] = useState(false)
  const [showForm, setShowForm]       = useState(false)
  const [editId, setEditId]           = useState<string | null>(null)
  const [form, setForm]               = useState<FormState>(emptyForm())
  const [previewId, setPreviewId]     = useState<string | null>(null)

  const filtered = useMemo(() => {
    let p = [...PRODUCTS]
    if (!showInactive) p = p.filter(r => r.active)
    if (category !== 'All') p = p.filter(r => r.category === category)
    if (search) {
      const s = search.toLowerCase()
      p = p.filter(r => r.name.toLowerCase().includes(s) || r.description.toLowerCase().includes(s))
    }
    return p
  }, [search, category, showInactive])

  const openAdd  = () => { setEditId(null); setForm(emptyForm()); setShowForm(true) }
  const openEdit = (p: Product) => {
    setEditId(p.id)
    setForm({ name: p.name, nameZh: p.nameZh, category: p.category, description: p.description, unitPrice: p.unitPrice, unit: p.unit, sstApplicable: p.sstApplicable })
    setShowForm(true)
  }

  const preview = previewId ? PRODUCTS.find(p => p.id === previewId) : null

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-label text-[12px] uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>[Sales · Catalog]</p>
          <h1 className="font-display text-7xl leading-none" style={{ letterSpacing: '0.04em' }}>PRODUCTS</h1>
          <p className="text-lg mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
            产品目录 · {PRODUCTS.filter(p => p.active).length} active · {PRODUCTS.filter(p => !p.active).length} inactive
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-black font-label hover:opacity-85 transition-opacity"
          style={{ background: '#e0ee7d', borderRadius: '999px' }}>
          <Plus size={13} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.6)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..." className="pl-8 pr-3 py-2 text-lg"
            style={{ ...INPUT_STYLE, width: 220 }} />
        </div>
        <div className="flex gap-0" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          {CATEGORIES.map((c, i) => (
            <button key={c} onClick={() => setCategory(c)}
              className="px-3 py-2 font-label text-[13px] uppercase tracking-widest transition-colors"
              style={{
                background: category === c ? '#e0ee7d' : 'transparent',
                color: category === c ? '#000' : 'rgba(255,255,255,0.4)',
                borderRight: i < CATEGORIES.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}>
              {c}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 font-label text-[13px] uppercase tracking-widest cursor-pointer ml-auto"
          style={{ color: 'rgba(255,255,255,0.65)' }}>
          <input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)}
            style={{ accentColor: '#e0ee7d' }} />
          Show inactive
        </label>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-2 px-5 py-12 text-center font-label text-[12px] uppercase tracking-widest" style={{ ...SURFACE, color: 'rgba(255,255,255,0.55)' }}>
            No products found
          </div>
        )}
        {filtered.map(p => (
          <div key={p.id} className="p-5 transition-all" style={{ ...SURFACE, opacity: p.active ? 1 : 0.5 }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-label text-[13px] px-1.5 py-0.5 uppercase tracking-wider"
                    style={{ color: CATEGORY_COLOR[p.category] || '#e0ee7d', border: `1px solid ${CATEGORY_COLOR[p.category] || '#e0ee7d'}33` }}>
                    {p.category}
                  </span>
                  {!p.active && (
                    <span className="font-label text-[13px] px-1.5 py-0.5 uppercase tracking-wider"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)' }}>
                      Inactive
                    </span>
                  )}
                  {p.sstApplicable && (
                    <span className="font-label text-[13px] px-1.5 py-0.5 uppercase tracking-wider"
                      style={{ background: 'rgba(224,238,125,0.08)', color: 'rgba(224,238,125,0.6)' }}>
                      SST
                    </span>
                  )}
                </div>
                <p className="font-semibold text-white text-lg">{p.name}</p>
                <p className="font-label text-[13px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.nameZh}</p>
              </div>
              <div className="flex gap-1 ml-3 shrink-0">
                <button onClick={() => setPreviewId(p.id)} className="p-1.5 transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.6)' }}><Tag size={12} /></button>
                <button onClick={() => openEdit(p)} className="p-1.5 transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.6)' }}><Edit2 size={12} /></button>
                <button className="p-1.5" style={{ color: 'rgba(239,68,68,0.5)' }}><Trash2 size={12} /></button>
              </div>
            </div>
            <p className="text-sm mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.7)' }}>{p.description}</p>
            <div className="flex items-end justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '12px', marginTop: '4px' }}>
              <div>
                <p className="font-display text-4xl" style={{ color: '#e0ee7d', letterSpacing: '0.02em' }}>{fmtMYR(p.unitPrice)}</p>
                <p className="font-label text-[13px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{p.unit}</p>
              </div>
              <button onClick={() => openEdit(p)}
                className="flex items-center gap-1.5 px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-colors hover:border-white/25"
                style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }}>
                <Copy size={10} /> Use in Quote
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div>
                <p className="font-semibold text-white text-lg">{preview.name}</p>
                <p className="font-label text-[13px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>{preview.nameZh}</p>
              </div>
              <button onClick={() => setPreviewId(null)} style={{ color: 'rgba(255,255,255,0.65)' }}><X size={18} /></button>
            </div>
            <div className="p-6">
              <p className="text-lg mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>{preview.description}</p>
              <div className="flex items-center justify-between p-4" style={{ background: '#181818' }}>
                <div>
                  <p className="font-label text-[13px] uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Unit Price</p>
                  <p className="font-display text-5xl" style={{ color: '#e0ee7d', letterSpacing: '0.02em' }}>{fmtMYR(preview.unitPrice)}</p>
                  <p className="font-label text-[13px] mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{preview.unit}</p>
                </div>
                <Package size={40} style={{ color: 'rgba(255,255,255,0.05)' }} />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button onClick={() => setPreviewId(null)}
                className="flex-1 py-2.5 font-label text-[12px] uppercase tracking-widest"
                style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }}>
                Close
              </button>
              <button onClick={() => { setPreviewId(null); openEdit(preview) }}
                className="flex-1 py-2.5 font-label text-[12px] uppercase tracking-widest font-bold text-black"
                style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div className="flex items-center justify-between px-6 py-4 sticky top-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#111111' }}>
              <p className="font-display text-3xl" style={{ letterSpacing: '0.05em' }}>
                {editId ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
              </p>
              <button onClick={() => setShowForm(false)} style={{ color: 'rgba(255,255,255,0.65)' }}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: 'name' as const, label: 'Product Name (EN) *', placeholder: 'e.g. Social Media Monthly Management', span: 2 },
                { key: 'nameZh' as const, label: 'Chinese Name 中文名称', placeholder: 'e.g. 社交媒体月度管理', span: 2 },
              ].map(f => (
                <div key={f.key} className={f.span === 2 ? 'col-span-2' : ''}>
                  <label className="font-label text-[13px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{f.label}</label>
                  <input value={form[f.key] as string} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2 text-lg" style={INPUT_STYLE} placeholder={f.placeholder} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label text-[13px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full px-3 py-2 text-lg" style={{ ...INPUT_STYLE, background: '#181818' }}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-label text-[13px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Pricing Unit</label>
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value as PriceUnit }))}
                    className="w-full px-3 py-2 text-lg" style={{ ...INPUT_STYLE, background: '#181818' }}>
                    {PRICE_UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-label text-[13px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Unit Price (MYR) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>RM</span>
                  <input type="number" min={0} value={form.unitPrice || ''} onChange={e => setForm(f => ({ ...f, unitPrice: Number(e.target.value) }))}
                    className="w-full pl-10 pr-3 py-2 text-lg" style={INPUT_STYLE} placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="font-label text-[13px] uppercase tracking-widest block mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 text-lg resize-none" style={INPUT_STYLE}
                  placeholder="What's included in this service..." />
              </div>
              <label className="flex items-center gap-2 font-label text-[13px] uppercase tracking-widest cursor-pointer" style={{ color: 'rgba(255,255,255,0.75)' }}>
                <input type="checkbox" checked={form.sstApplicable} onChange={e => setForm(f => ({ ...f, sstApplicable: e.target.checked }))} style={{ accentColor: '#e0ee7d' }} />
                SST Applicable (8%)
              </label>
            </div>
            <div className="flex gap-3 px-6 py-4 sticky bottom-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#111111' }}>
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 font-label text-[12px] uppercase tracking-widest"
                style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }}>
                Cancel
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 font-label text-[12px] uppercase tracking-widest font-bold text-black"
                style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                {editId ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
