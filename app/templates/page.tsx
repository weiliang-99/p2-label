'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Copy, FileText, Sparkles } from 'lucide-react'
import { SURFACE } from '@/lib/theme'

const TEMPLATES = [
  { id: '1', name: 'CNY Greeting',       category: 'Festive Posts',    platforms: ['instagram','facebook'], caption_en: '🧧 Wishing you and your loved ones a prosperous Chinese New Year! May this year bring you health, happiness and abundance. 恭喜发财!\n\n#ChineseNewYear #CNY2025 #P2Label', caption_zh: '🧧 祝您和您的家人新年快乐、身体健康、万事如意！恭喜发财，红包拿来！\n\n#新年快乐 #CNY2025 #P2Label', uses: 8,  emoji: '🧧', accent: '#e0ee7d' },
  { id: '2', name: 'Product Launch',      category: 'Product Showcase', platforms: ['instagram','facebook','linkedin'], caption_en: '✨ Exciting news! We\'re thrilled to introduce {{product_name}} — {{product_tagline}}.\n\nAvailable now at {{price}}. Limited stocks!\n\n👉 DM us or link in bio to order.', caption_zh: '✨ 激动人心！我们隆重推出 {{product_name}}。\n\n现在以 {{price}} 发售，数量有限！\n\n👉 私信我们订购。', uses: 15, emoji: '🚀', accent: '#a78bfa' },
  { id: '3', name: 'Testimonial Post',    category: 'Brand Content',    platforms: ['instagram','linkedin'], caption_en: '⭐⭐⭐⭐⭐\n\n"{{client_quote}}" — {{client_name}}, {{client_company}}\n\nWe\'re grateful for clients who trust us.\n\n📩 DM us today!', caption_zh: '⭐⭐⭐⭐⭐\n\n"{{client_quote}}" — {{client_name}}，{{client_company}}\n\n📩 今日私信我们！', uses: 11, emoji: '💬', accent: '#34d399' },
  { id: '4', name: 'Hari Raya Greeting',  category: 'Festive Posts',    platforms: ['instagram','facebook','tiktok'], caption_en: '🌙 Selamat Hari Raya Aidilfitri! Maaf Zahir & Batin 🤲\n\nFrom all of us at P2 Label 💛', caption_zh: '🌙 祝各位穆斯林朋友开斋节快乐！\n\nP2 Label 全体员工祝您节日愉快 💛', uses: 6,  emoji: '🌙', accent: '#fb923c' },
  { id: '5', name: 'Tips & Education',    category: 'Educational',      platforms: ['instagram','linkedin'], caption_en: '💡 {{tip_number}} Tips for {{topic}}\n\n{{tip_1}}\n{{tip_2}}\n{{tip_3}}\n\nFollow @P2Label for more marketing tips!', caption_zh: '💡 {{tip_number}} 个关于 {{topic}} 的技巧\n\n关注 @P2Label 获取更多营销技巧！', uses: 9,  emoji: '📚', accent: '#60a5fa' },
  { id: '6', name: 'Flash Sale',          category: 'Promotions',       platforms: ['instagram','facebook','tiktok'], caption_en: '🔥 FLASH SALE! 🔥\n\n{{discount}}% OFF on {{product}} — TODAY ONLY!\n\n⏰ Offer ends at {{end_time}}', caption_zh: '🔥 闪购特卖！\n\n{{product}} 低至 {{discount}}% 折扣——仅限今天！\n\n⏰ 优惠截止 {{end_time}}', uses: 20, emoji: '🛍️', accent: '#f87171' },
]

const CATEGORIES = ['All', 'Festive Posts', 'Product Showcase', 'Brand Content', 'Educational', 'Promotions']
const PLATFORM_LABELS: Record<string, string> = { instagram: 'IG', facebook: 'FB', linkedin: 'LI', tiktok: 'TT' }

export default function TemplatesPage() {
  const [filter, setFilter] = useState('All')
  const [preview, setPreview] = useState<string | null>(null)
  const [lang, setLang] = useState<'en' | 'zh'>('en')

  const filtered = TEMPLATES.filter(t => filter === 'All' || t.category === filter)
  const previewTemplate = TEMPLATES.find(t => t.id === preview)

  return (
    <div className="p-8" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-label text-[13px] uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            [Marketing]
          </p>
          <h1 className="font-display text-5xl" style={{ letterSpacing: '0.05em' }}>TEMPLATES</h1>
          <p className="font-label text-[13px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
            内容模板 · {TEMPLATES.length} ready-to-use templates
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 font-label text-[13px] uppercase tracking-widest font-bold text-black"
          style={{ background: '#e0ee7d', borderRadius: '999px' }}>
          <Plus size={11} /> New Template
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className="px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-all"
            style={filter === cat
              ? { background: '#e0ee7d', color: '#000', borderRadius: '999px' }
              : { border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', borderRadius: '12px' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

      {/* Template Grid */}
      <div className="grid grid-cols-3 gap-5">
        {filtered.map(t => (
          <div key={t.id} className="overflow-hidden transition-all"
            style={{ ...SURFACE, borderRadius: '20px' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)')}>
            {/* Header */}
            <div className="p-4" style={{ background: `${t.accent}10`, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{t.emoji}</span>
                <div>
                  <p className="font-medium text-lg" style={{ color: 'rgba(255,255,255,0.85)' }}>{t.name}</p>
                  <p className="font-label text-[12px] uppercase tracking-widest mt-0.5" style={{ color: t.accent }}>{t.category}</p>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="p-4">
              <p className="text-[13px] leading-relaxed line-clamp-3 whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {t.caption_en}
              </p>

              <div className="flex gap-1.5 mt-3">
                {t.platforms.map(p => (
                  <span key={p} className="font-label text-[12px] px-1.5 py-0.5"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', borderRadius: '10px' }}>
                    {PLATFORM_LABELS[p]}
                  </span>
                ))}
                <span className="ml-auto font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Used {t.uses}×</span>
              </div>

              <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button onClick={() => setPreview(t.id)}
                  className="flex-1 py-1.5 font-label text-[13px] uppercase tracking-widest flex items-center justify-center gap-1 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', borderRadius: '16px' }}>
                  <FileText size={10} /> Preview
                </button>
                <Link href={`/posts/create?template=${t.id}`}
                  className="flex-1 py-1.5 font-label text-[13px] uppercase tracking-widest font-bold text-black flex items-center justify-center gap-1"
                  style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                  <Sparkles size={10} /> Use
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {preview && previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg modal-enter" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{previewTemplate.emoji}</span>
                <h3 className="font-display text-2xl" style={{ letterSpacing: '0.05em' }}>{previewTemplate.name.toUpperCase()}</h3>
              </div>
              <button onClick={() => setPreview(null)} className="text-2xl leading-none" style={{ color: 'rgba(255,255,255,0.6)' }}>×</button>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                {(['en','zh'] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className="px-3 py-1 font-label text-[13px] uppercase tracking-widest transition-colors"
                    style={lang === l ? { background: '#e0ee7d', color: '#000', borderRadius: '999px' } : { color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                    {l === 'en' ? 'English' : 'Chinese'}
                  </button>
                ))}
              </div>
              <div className="p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px' }}>
                <p className="text-lg leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {lang === 'en' ? previewTemplate.caption_en : previewTemplate.caption_zh}
                </p>
              </div>
              <p className="font-label text-[12px] uppercase tracking-widest mt-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Variables like {'{{product_name}}'} will be replaced when you use this template.
              </p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => navigator.clipboard.writeText(lang === 'en' ? previewTemplate.caption_en : previewTemplate.caption_zh)}
                  className="flex-1 py-2 font-label text-[13px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', borderRadius: '16px' }}>
                  <Copy size={11} /> Copy Caption
                </button>
                <Link href={`/posts/create?template=${previewTemplate.id}`}
                  className="flex-1 py-2 font-label text-[13px] uppercase tracking-widest font-bold text-black flex items-center justify-center gap-1.5"
                  style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                  <Sparkles size={11} /> Use Template
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
