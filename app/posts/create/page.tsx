'use client'

import { useState } from 'react'
import {
  Globe, Camera, Building2, Music, Sparkles, Upload,
  Clock, X, Plus, Send, RefreshCw
} from 'lucide-react'
import { cn, PLATFORM_LIMITS } from '@/lib/utils'
import { SURFACE, INPUT_STYLE } from '@/lib/theme'

const PLATFORMS = [
  { id: 'facebook',  label: 'Facebook',  icon: Globe,     color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', icon: Camera,    color: '#E1306C' },
  { id: 'linkedin',  label: 'LinkedIn',  icon: Building2, color: '#0A66C2' },
  { id: 'tiktok',    label: 'TikTok',    icon: Music,     color: 'rgba(255,255,255,0.8)' },
]

const TONES = ['Professional', 'Casual', 'Promotional', 'Inspirational', 'Humorous']

const HASHTAG_SETS = [
  { id: '1', name: 'General Brand',    hashtags: ['#P2Label', '#SocialMedia', '#ContentCreation', '#Malaysia'] },
  { id: '2', name: 'Instagram General', hashtags: ['#instadaily', '#igmalaysia', '#malaysiagram', '#contentcreator'] },
  { id: '3', name: 'CNY Special',      hashtags: ['#ChineseNewYear', '#CNY2025', '#新年快乐', '#MalaysiaCNY'] },
]

type Tab = 'zh' | 'en'
type PreviewPlatform = 'facebook' | 'instagram' | 'linkedin' | 'tiktok'

export default function CreatePostPage() {
  const [title, setTitle] = useState('')
  const [captionZh, setCaptionZh] = useState('')
  const [captionEn, setCaptionEn] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('en')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram'])
  const [scheduledAt, setScheduledAt] = useState('')
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])
  const [customHashtag, setCustomHashtag] = useState('')
  const [previewPlatform, setPreviewPlatform] = useState<PreviewPlatform>('instagram')
  const [showAI, setShowAI] = useState(false)
  const [aiKeywords, setAiKeywords] = useState('')
  const [aiTone, setAiTone] = useState('Professional')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<{ caption_zh: string; caption_en: string; hashtags: string[] }[]>([])
  const [saved, setSaved] = useState(false)

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const addHashtagSet = (hashtags: string[]) => {
    setSelectedHashtags(prev => [...new Set([...prev, ...hashtags])])
  }

  const removeHashtag = (tag: string) => setSelectedHashtags(prev => prev.filter(t => t !== tag))

  const addCustomHashtag = () => {
    const tag = customHashtag.trim().startsWith('#') ? customHashtag.trim() : `#${customHashtag.trim()}`
    if (tag.length > 1) { setSelectedHashtags(prev => [...new Set([...prev, tag])]); setCustomHashtag('') }
  }

  const generateAICaptions = async () => {
    setAiLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setAiSuggestions([
      { caption_en: `🌟 ${aiKeywords} — we're bringing the energy you need! P2 Label is here to amplify your brand's voice across every platform.`, caption_zh: `🌟 ${aiKeywords} — P2 Label 助你让品牌声音响彻每个平台！`, hashtags: ['#P2Label', '#ContentCreation', '#Malaysia'] },
      { caption_en: `✨ Looking for top-notch ${aiKeywords}? P2 Label delivers creative content that connects, engages, and converts. DM us to get started! 🚀`, caption_zh: `✨ 寻找优质的 ${aiKeywords}？P2 Label 提供创意内容！立即私信我们！🚀`, hashtags: ['#P2Label', '#DigitalMarketing', '#KL'] },
      { caption_en: `💡 ${aiKeywords} made easy with P2 Label. We handle your social media so you can focus on growing your business. 📈`, caption_zh: `💡 P2 Label 让 ${aiKeywords} 变得轻松。我们管理你的社交媒体！📈`, hashtags: ['#P2Label', '#SMM', '#MalaysiaBusiness'] },
    ])
    setAiLoading(false)
  }

  const applyAISuggestion = (s: typeof aiSuggestions[0]) => {
    setCaptionEn(s.caption_en); setCaptionZh(s.caption_zh); addHashtagSet(s.hashtags); setShowAI(false)
  }

  const handleSave = async () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const previewCaption = captionEn || captionZh
  const hashtagString = selectedHashtags.join(' ')
  const charLimit = PLATFORM_LIMITS[selectedPlatforms[0] || 'instagram']
  const charCount = (activeTab === 'zh' ? captionZh : captionEn).length

  return (
    <div className="h-full flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0d0d0d' }}>
        <div>
          <p className="font-label text-[12px] uppercase tracking-[0.2em] mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>[Marketing]</p>
          <h1 className="font-display text-3xl" style={{ letterSpacing: '0.05em' }}>CREATE POST</h1>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="font-label text-[13px] uppercase tracking-widest" style={{ color: '#e0ee7d' }}>✓ Saved</span>}
          <button onClick={handleSave}
            className="px-4 py-2 font-label text-[13px] uppercase tracking-widest transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', color: 'rgba(255,255,255,0.6)' }}>
            Save Draft
          </button>
          <button className="px-4 py-2 font-label text-[13px] uppercase tracking-widest transition-colors"
            style={{ border: '1px solid rgba(251,146,60,0.3)', borderRadius: '16px', color: '#fb923c' }}>
            Submit for Review
          </button>
          <button className="px-4 py-2 font-label text-[13px] uppercase tracking-widest font-bold text-black flex items-center gap-1.5"
            style={{ background: '#e0ee7d', borderRadius: '999px' }}>
            <Send size={11} /> Schedule
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Editor */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Post Title <span style={{ color: 'rgba(255,255,255,0.55)' }}>(internal only)</span>
            </label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. CNY Countdown – Week 1"
              className="w-full px-3 py-2.5 text-lg"
              style={{ ...INPUT_STYLE, borderRadius: '16px' }} />
          </div>

          {/* Platform Selector */}
          <div>
            <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Platforms
            </label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => togglePlatform(p.id)}
                  className="flex items-center gap-2 px-3 py-2 font-label text-[13px] uppercase tracking-widest transition-all"
                  style={selectedPlatforms.includes(p.id)
                    ? { background: p.color, color: '#fff', borderRadius: '16px', border: 'none' }
                    : { border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)', borderRadius: '16px' }}>
                  <p.icon size={12} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Caption Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-label text-[12px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.65)' }}>Caption</label>
              <button onClick={() => setShowAI(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 font-label text-[13px] uppercase tracking-widest font-bold text-black"
                style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                <Sparkles size={10} /> AI Generate
              </button>
            </div>

            <div className="flex mb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {([['en', 'English'], ['zh', 'Chinese']] as [Tab, string][]).map(([tab, label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 font-label text-[13px] uppercase tracking-widest transition-colors"
                  style={activeTab === tab
                    ? { borderBottom: '2px solid #e0ee7d', color: '#e0ee7d', marginBottom: '-1px' }
                    : { color: 'rgba(255,255,255,0.65)' }}>
                  {label}
                </button>
              ))}
            </div>

            <textarea
              value={activeTab === 'zh' ? captionZh : captionEn}
              onChange={e => activeTab === 'zh' ? setCaptionZh(e.target.value) : setCaptionEn(e.target.value)}
              rows={6} placeholder={activeTab === 'zh' ? '在这里写你的中文贴文内容...' : 'Write your English caption here...'}
              className="w-full px-3 py-2.5 text-lg resize-none"
              style={{ ...INPUT_STYLE, borderRadius: '16px' }} />

            <div className="flex justify-between mt-1">
              <span className="font-label text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {selectedHashtags.length > 0 ? `+ ${selectedHashtags.length} hashtags` : ''}
              </span>
              <span className="font-label text-[12px]" style={{ color: charCount > charLimit * 0.9 ? '#f87171' : 'rgba(255,255,255,0.3)' }}>
                {charCount} / {charLimit.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Hashtag Manager */}
          <div>
            <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Hashtags
            </label>
            <div className="flex gap-2 mb-3 flex-wrap">
              {HASHTAG_SETS.map(set => (
                <button key={set.id} onClick={() => addHashtagSet(set.hashtags)}
                  className="font-label text-[13px] uppercase tracking-widest px-2.5 py-1.5 flex items-center gap-1 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)', borderRadius: '12px' }}>
                  <Plus size={9} /> {set.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mb-3">
              <input value={customHashtag} onChange={e => setCustomHashtag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomHashtag()}
                placeholder="#yourtag" className="flex-1 px-3 py-2 text-lg"
                style={{ ...INPUT_STYLE, borderRadius: '16px' }} />
              <button onClick={addCustomHashtag} className="px-3 py-2 transition-colors"
                style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '16px', color: 'rgba(255,255,255,0.75)' }}>
                <Plus size={13} />
              </button>
            </div>
            {selectedHashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedHashtags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 font-label text-[13px] px-2 py-1"
                    style={{ background: 'rgba(224,238,125,0.1)', color: '#e0ee7d', borderRadius: '12px' }}>
                    {tag}
                    <button onClick={() => removeHashtag(tag)} style={{ color: 'rgba(224,238,125,0.6)' }}>
                      <X size={9} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Schedule */}
          <div>
            <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Schedule <span style={{ color: 'rgba(255,255,255,0.55)' }}>(GMT+8, Kuala Lumpur)</span>
            </label>
            <div className="flex items-center gap-3">
              <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
                className="flex-1 px-3 py-2.5 text-lg"
                style={{ ...INPUT_STYLE, borderRadius: '16px' }} />
              <div className="flex items-center gap-1 font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <Clock size={11} /> Best: 8am, 12pm, 8pm
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Media
            </label>
            <div className="p-8 text-center cursor-pointer transition-colors"
              style={{ border: '1px dashed rgba(255,255,255,0.12)', borderRadius: '20px' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(224,238,125,0.4)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)')}>
              <Upload size={22} className="mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.55)' }} />
              <p className="text-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>Drop files here or click to upload</p>
              <p className="font-label text-[12px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                JPG, PNG, WebP, MP4 · Max 100MB
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div className="w-72 overflow-y-auto" style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', background: '#0d0d0d' }}>
          <div className="sticky top-0 px-4 pt-4 pb-3 z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0d0d0d' }}>
            <p className="font-label text-[12px] uppercase tracking-[0.2em] mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Preview</p>
            <div className="flex gap-1 flex-wrap">
              {PLATFORMS.filter(p => selectedPlatforms.includes(p.id)).map(p => (
                <button key={p.id} onClick={() => setPreviewPlatform(p.id as PreviewPlatform)}
                  className="font-label text-[12px] uppercase tracking-widest px-2.5 py-1 transition-all"
                  style={previewPlatform === p.id
                    ? { background: p.color, color: '#fff', borderRadius: '12px' }
                    : { border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', borderRadius: '12px' }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <div style={{ ...SURFACE, borderRadius: '20px', overflow: 'hidden' }}>
              <div className="flex items-center gap-2 p-3">
                <div className="w-7 h-7 flex items-center justify-center font-display text-lg text-black"
                  style={{ background: '#e0ee7d', borderRadius: '999px' }}>P2</div>
                <div>
                  <p className="font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.8)' }}>P2 Label</p>
                  <p className="font-label text-[9px]" style={{ color: 'rgba(255,255,255,0.6)' }}>Just now</p>
                </div>
              </div>
              <div className="w-full aspect-square flex items-center justify-center" style={{ background: 'rgba(224,238,125,0.05)' }}>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center text-black font-display text-xl"
                    style={{ background: '#e0ee7d', borderRadius: '999px' }}>🎬</div>
                  <p className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>Media Preview</p>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {previewCaption || <span style={{ color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>Caption will appear here...</span>}
                </p>
                {selectedHashtags.length > 0 && (
                  <p className="font-label text-[13px] mt-1.5 leading-relaxed" style={{ color: '#e0ee7d' }}>{hashtagString}</p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="font-label text-[12px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>Character Count</p>
              {selectedPlatforms.map(pid => {
                const limit = PLATFORM_LIMITS[pid]
                const count = captionEn.length + (selectedHashtags.length > 0 ? hashtagString.length + 1 : 0)
                const pct = Math.min((count / limit) * 100, 100)
                return (
                  <div key={pid}>
                    <div className="flex justify-between font-label text-[12px] mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      <span className="capitalize">{pid}</span>
                      <span style={{ color: count > limit * 0.9 ? '#f87171' : 'rgba(255,255,255,0.4)' }}>{count}/{limit.toLocaleString()}</span>
                    </div>
                    <div className="h-px overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <div style={{ width: `${pct}%`, height: '1px', background: pct > 90 ? '#f87171' : '#e0ee7d' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI Modal */}
      {showAI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg mx-4 overflow-hidden" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 flex items-center justify-center text-black" style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                  <Sparkles size={12} />
                </div>
                <h3 className="font-display text-2xl" style={{ letterSpacing: '0.05em' }}>AI GENERATOR</h3>
              </div>
              <button onClick={() => setShowAI(false)} style={{ color: 'rgba(255,255,255,0.6)' }}><X size={16} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Keywords / Topic
                </label>
                <input value={aiKeywords} onChange={e => setAiKeywords(e.target.value)}
                  placeholder="e.g. social media content, brand identity..."
                  className="w-full px-3 py-2.5 text-lg"
                  style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', borderRadius: '16px' }} />
              </div>

              <div>
                <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Tone</label>
                <div className="flex gap-2 flex-wrap">
                  {TONES.map(t => (
                    <button key={t} onClick={() => setAiTone(t)}
                      className="font-label text-[13px] uppercase tracking-widest px-3 py-1.5 transition-all"
                      style={aiTone === t
                        ? { background: '#e0ee7d', color: '#000', borderRadius: '999px' }
                        : { border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', borderRadius: '12px' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={generateAICaptions} disabled={!aiKeywords || aiLoading}
                className="w-full py-2.5 font-label text-[13px] uppercase tracking-widest font-bold text-black flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                {aiLoading ? <><RefreshCw size={12} className="animate-spin" /> Generating...</> : <><Sparkles size={12} /> Generate Captions</>}
              </button>

              {aiSuggestions.length > 0 && (
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  <p className="font-label text-[12px] uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.65)' }}>Suggestions</p>
                  {aiSuggestions.map((s, i) => (
                    <div key={i} className="p-3 cursor-pointer transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px' }}
                      onClick={() => applyAISuggestion(s)}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(224,238,125,0.3)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)')}>
                      <p className="font-label text-[12px] uppercase tracking-widest mb-1" style={{ color: '#e0ee7d' }}>Option {i + 1}</p>
                      <p className="text-[13px] leading-relaxed mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.caption_en}</p>
                      <p className="text-[12px] leading-relaxed mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.caption_zh}</p>
                      <div className="flex flex-wrap gap-1">
                        {s.hashtags.map(h => (
                          <span key={h} className="font-label text-[12px] px-1.5 py-0.5" style={{ background: 'rgba(224,238,125,0.1)', color: '#e0ee7d', borderRadius: '10px' }}>{h}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
