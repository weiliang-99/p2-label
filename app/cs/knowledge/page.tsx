'use client'

import { useState } from 'react'
import { Search, Plus, BookOpen, ThumbsUp, ThumbsDown, Eye, Tag, ChevronRight, X } from 'lucide-react'
import { SURFACE, INPUT_STYLE } from '@/lib/theme'

const CATEGORIES = [
  { id: '1', name_en: 'Ordering & Payment',  name_zh: '下单与付款',  color: '#60a5fa', count: 2 },
  { id: '2', name_en: 'Our Services',         name_zh: '服务介绍',   color: '#e0ee7d', count: 1 },
  { id: '3', name_en: 'Delivery & Timeline',  name_zh: '交货时间',   color: '#34d399', count: 1 },
  { id: '4', name_en: 'Pricing & Packages',   name_zh: '价格与套餐', color: '#a78bfa', count: 1 },
  { id: '5', name_en: 'Revisions & Refunds',  name_zh: '修改与退款', color: '#f87171', count: 1 },
]

const ARTICLES = [
  { id: '1', category_id: '2', title_en: 'What services does P2 Label offer?', title_zh: 'P2 Label 提供什么服务？', body_en: `P2 Label specializes in social media content creation and management for businesses in Malaysia. Our services include:\n\n• Social Media Content Creation — Professional posts, reels, and stories for Instagram, Facebook, TikTok, and YouTube\n• Content Calendar Planning — Monthly planning and scheduling of your social media posts\n• Graphic Design — Custom visuals, banners, and branded templates\n• Video Production — Short-form videos and reels optimized for each platform\n• Copywriting — Bilingual (English & Chinese) captions and ad copy\n• Social Media Management — Full management of your social accounts\n\nContact us for a custom package tailored to your business needs.`, body_zh: 'P2 Label 专注于为马来西亚企业提供社交媒体内容创作和管理服务。\n\n服务包括：图文内容创作、内容日历规划、平面设计、短视频制作、双语文案撰写、社交媒体全面管理。', tags: ['services','content','social media'], helpful_yes: 42, helpful_no: 3, view_count: 156 },
  { id: '2', category_id: '1', title_en: 'How do I place an order?', title_zh: '如何下单？', body_en: `Placing an order with P2 Label is simple:\n\n1. Contact us via WhatsApp, Instagram DM, or email\n2. Share your requirements — Tell us your business type, target audience, and which platforms you need\n3. Receive a quotation — We will send a detailed package proposal within 1 business day\n4. Confirm and sign — Once you approve the quotation, we send a service agreement\n5. Make a deposit — A 50% deposit is required to start work\n6. Onboarding call — We schedule a briefing call to understand your brand\n\nPayment methods: Bank Transfer, DuitNow, Online Banking.`, body_zh: '下单步骤：\n\n1. 联系我们（WhatsApp/Instagram/电子邮件）\n2. 分享需求\n3. 收到报价单（1 个工作日内）\n4. 确认并签署协议\n5. 支付 50% 定金\n6. 进行入职简报通话\n\n接受银行转账、DuitNow、网上银行付款。', tags: ['order','payment','deposit'], helpful_yes: 38, helpful_no: 5, view_count: 203 },
  { id: '3', category_id: '3', title_en: 'How long does it take to deliver content?', title_zh: '内容需要多长时间交付？', body_en: `Standard delivery timelines:\n\nSocial media post (graphic): 2–3 business days\nMonthly content calendar: 5–7 business days\nShort video / Reel: 5–7 business days\nFull social media package: 7–14 business days\n\nRush orders (24–48 hours) available at +30% fee, subject to availability.\n\nTimelines begin after deposit received and briefing call completed.`, body_zh: '标准交付时间：\n\n图文帖子：2–3 个工作日\n每月内容日历：5–7 个工作日\n短视频/Reel：5–7 个工作日\n完整套餐：7–14 个工作日', tags: ['delivery','timeline','turnaround'], helpful_yes: 29, helpful_no: 2, view_count: 178 },
  { id: '4', category_id: '4', title_en: 'What are your pricing packages?', title_zh: '你们的价格套餐是什么？', body_en: `Starter Package — RM 800/month\n- 8 social media posts\n- 2 platforms\n- Basic captions (English only)\n\nGrowth Package — RM 1,500/month\n- 16 posts + 4 stories\n- 3 platforms\n- Bilingual captions (EN + ZH)\n- Content calendar\n\nPremium Package — RM 2,800/month\n- 24 posts + 8 stories + 2 reels\n- All platforms\n- Bilingual captions + hashtag strategy\n- Monthly strategy call\n\nCustom packages available — contact us for a tailored quote.`, body_zh: '入门套餐 RM 800/月：8 帖子 · 2 平台\n成长套餐 RM 1,500/月：16 帖子 + 4 动态 · 3 平台 · 双语文案\n高级套餐 RM 2,800/月：24 帖子 + 8 动态 + 2 Reels · 全平台', tags: ['pricing','packages','cost'], helpful_yes: 51, helpful_no: 4, view_count: 312 },
  { id: '5', category_id: '5', title_en: 'How many revisions are included?', title_zh: '包含多少次修改？', body_en: `Revisions included per project:\n\n- Starter: 1 round per post\n- Growth: 2 rounds per post\n- Premium: 3 rounds per post\n\nRevisions cover: minor text edits, colour adjustments, image swaps in the same layout.\n\nNot included: complete redesigns, change of concept/direction, requests after final approval.\n\nAdditional revisions: RM 50 per revision.`, body_zh: '修改次数：\n入门：1 次/帖\n成长：2 次/帖\n高级：3 次/帖\n\n修改范围：小文本编辑、颜色调整、图片替换\n不包含：完全重新设计、概念更改\n\n额外修改：每次 RM 50', tags: ['revision','refund','changes'], helpful_yes: 33, helpful_no: 6, view_count: 145 },
]

type Lang = 'en' | 'zh'

export default function KnowledgePage() {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<typeof ARTICLES[0] | null>(null)
  const [lang, setLang] = useState<Lang>('en')
  const [votes, setVotes] = useState<Record<string, 'yes' | 'no' | null>>({})

  const filteredArticles = ARTICLES.filter(a => {
    if (selectedCat && a.category_id !== selectedCat) return false
    if (search) {
      const q = search.toLowerCase()
      return a.title_en.toLowerCase().includes(q) || a.title_zh.includes(q) || a.tags.some(t => t.includes(q))
    }
    return true
  })

  const vote = (id: string, v: 'yes' | 'no') => {
    setVotes(prev => ({ ...prev, [id]: prev[id] === v ? null : v }))
  }

  return (
    <div className="p-8" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-label text-[13px] uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            [Customer Service]
          </p>
          <h1 className="font-display text-5xl" style={{ letterSpacing: '0.05em' }}>KNOWLEDGE BASE</h1>
          <p className="font-label text-[13px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
            知识库 · {ARTICLES.length} articles · {CATEGORIES.length} categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px' }}>
            {(['en','zh'] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className="px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-colors"
                style={lang === l ? { background: '#e0ee7d', color: '#000' } : { color: 'rgba(255,255,255,0.65)' }}>
                {l === 'en' ? 'EN' : 'ZH'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 font-label text-[13px] uppercase tracking-widest font-bold text-black"
            style={{ background: '#e0ee7d', borderRadius: '999px' }}>
            <Plus size={11} /> New Article
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.6)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search knowledge base... 搜索知识库..."
          className="w-full pl-11 pr-4 py-3 text-lg"
          style={{ ...INPUT_STYLE, borderRadius: '20px' }} />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <X size={13} />
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Categories sidebar */}
        <div className="w-52 shrink-0">
          <p className="font-label text-[12px] uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
            [Categories]
          </p>
          <div className="space-y-1">
            <button onClick={() => setSelectedCat(null)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors"
              style={selectedCat === null
                ? { background: '#e0ee7d', color: '#000', borderRadius: '999px' }
                : { color: 'rgba(255,255,255,0.75)', borderRadius: '16px' }}>
              <BookOpen size={12} />
              <span className="font-label text-[13px] uppercase tracking-widest">All Articles</span>
              <span className="ml-auto font-label text-[13px]">{ARTICLES.length}</span>
            </button>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors"
                style={selectedCat === cat.id
                  ? { background: 'rgba(224,238,125,0.1)', borderLeft: '2px solid #e0ee7d', color: '#e0ee7d', borderRadius: '0 6px 6px 0' }
                  : { color: 'rgba(255,255,255,0.7)', borderLeft: '2px solid transparent', borderRadius: '0 6px 6px 0' }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cat.color }} />
                <span className="font-label text-[13px] uppercase tracking-widest truncate">{lang === 'zh' ? cat.name_zh : cat.name_en}</span>
                <span className="ml-auto font-label text-[13px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* Articles list */}
        <div className="flex-1">
          {search && (
            <p className="font-label text-[13px] uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''} for "{search}"
            </p>
          )}
          <div className="space-y-2">
            {filteredArticles.map(article => {
              const cat = CATEGORIES.find(c => c.id === article.category_id)
              const helpfulPct = article.helpful_yes + article.helpful_no > 0
                ? Math.round((article.helpful_yes / (article.helpful_yes + article.helpful_no)) * 100)
                : 0

              return (
                <div key={article.id} onClick={() => setSelectedArticle(article)}
                  className="p-5 cursor-pointer transition-all"
                  style={{ ...SURFACE, borderRadius: '20px' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {cat && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
                            <span className="font-label text-[12px] uppercase tracking-widest" style={{ color: cat.color }}>
                              {lang === 'zh' ? cat.name_zh : cat.name_en}
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        {lang === 'zh' ? article.title_zh : article.title_en}
                      </h3>
                      <p className="text-[13px] leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                        {(lang === 'zh' ? article.body_zh : article.body_en).split('\n')[0]}
                      </p>
                      <div className="flex items-center gap-4 mt-3 font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        <span className="flex items-center gap-1"><Eye size={9} /> {article.view_count} views</span>
                        <span className="flex items-center gap-1"><ThumbsUp size={9} /> {helpfulPct}% helpful</span>
                        <div className="flex gap-1">
                          {article.tags.map(t => (
                            <span key={t} className="px-1.5 py-0.5" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.55)', marginTop: '2px' }} />
                  </div>
                </div>
              )
            })}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16" style={{ ...SURFACE, borderRadius: '20px' }}>
              <BookOpen size={32} className="mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.1)' }} />
              <p className="font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>No articles found</p>
            </div>
          )}
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px' }}>
            <div className="flex items-center justify-between px-6 py-4 sticky top-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#0d0d0d' }}>
              <div className="flex overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px' }}>
                {(['en','zh'] as Lang[]).map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className="px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-colors"
                    style={lang === l ? { background: '#e0ee7d', color: '#000' } : { color: 'rgba(255,255,255,0.65)' }}>
                    {l === 'en' ? 'EN' : 'ZH'}
                  </button>
                ))}
              </div>
              <button onClick={() => setSelectedArticle(null)} className="text-2xl leading-none" style={{ color: 'rgba(255,255,255,0.6)' }}>×</button>
            </div>
            <div className="px-6 py-5">
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {lang === 'zh' ? selectedArticle.title_zh : selectedArticle.title_en}
              </h2>
              <div className="text-lg leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {lang === 'zh' ? selectedArticle.body_zh : selectedArticle.body_en}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {selectedArticle.tags.map(t => (
                  <span key={t} className="font-label text-[12px] px-2 py-0.5 flex items-center gap-1"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', borderRadius: '12px' }}>
                    <Tag size={8} /> {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Was this helpful?
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => vote(selectedArticle.id, 'yes')}
                    className="flex items-center gap-1.5 px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-all"
                    style={votes[selectedArticle.id] === 'yes'
                      ? { background: 'rgba(224,238,125,0.1)', border: '1px solid rgba(224,238,125,0.3)', color: '#e0ee7d', borderRadius: '16px' }
                      : { border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', borderRadius: '16px' }}>
                    <ThumbsUp size={10} /> Yes ({selectedArticle.helpful_yes + (votes[selectedArticle.id] === 'yes' ? 1 : 0)})
                  </button>
                  <button onClick={() => vote(selectedArticle.id, 'no')}
                    className="flex items-center gap-1.5 px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-all"
                    style={votes[selectedArticle.id] === 'no'
                      ? { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', borderRadius: '16px' }
                      : { border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', borderRadius: '16px' }}>
                    <ThumbsDown size={10} /> No ({selectedArticle.helpful_no})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
