'use client'

import { useState } from 'react'
import {
  MessageSquare, Sparkles, Send, Copy, Check, RefreshCw,
  Globe, Camera, Mail, Phone, Clock, ChevronDown
} from 'lucide-react'
import { cn, formatDateTime } from '@/lib/utils'
import { SURFACE } from '@/lib/theme'

type Channel = 'whatsapp' | 'instagram' | 'facebook' | 'email' | 'phone'
type TicketType = 'inquiry' | 'complaint' | 'refund' | 'feedback' | 'other'

interface Ticket {
  id: string; ticketNumber: string; customerName: string; customerContact: string
  channel: Channel; type: TicketType; subject: string
  status: 'open' | 'in_progress' | 'pending_customer' | 'resolved'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  lastMessage: string; createdAt: string; unread: boolean
}

const TICKETS: Ticket[] = [
  { id: '1', ticketNumber: 'TKT-0003', customerName: 'David Lim',      customerContact: 'david@abc.com',  channel: 'email',    type: 'inquiry',   subject: 'Pricing for 3-month package?',          status: 'open',        priority: 'normal', lastMessage: 'Hi, I would like to know more about your 3-month social media package pricing...',  createdAt: '2025-01-20T09:30:00', unread: true },
  { id: '2', ticketNumber: 'TKT-0004', customerName: 'Siti Nurhaliza', customerContact: '+601156789012', channel: 'whatsapp', type: 'refund',    subject: 'Request refund for unused posts',       status: 'open',        priority: 'urgent', lastMessage: 'I want to cancel my package and request a refund for the remaining posts.',          createdAt: '2025-01-20T11:15:00', unread: true },
  { id: '3', ticketNumber: 'TKT-0007', customerName: 'Jason Chong',    customerContact: '+601167890123', channel: 'whatsapp', type: 'inquiry',   subject: 'Do you offer TikTok content only?',     status: 'open',        priority: 'normal', lastMessage: 'Hi! I only need TikTok content. Is that possible?',                                 createdAt: '2025-01-20T14:00:00', unread: true },
  { id: '4', ticketNumber: 'TKT-0002', customerName: 'Ahmad Faizal',   customerContact: '+601198765432', channel: 'instagram',type: 'complaint', subject: 'Content delivered late — very unhappy', status: 'in_progress', priority: 'high',   lastMessage: 'This is the second time you are late. Very unprofessional!',                        createdAt: '2025-01-19T16:45:00', unread: false },
  { id: '5', ticketNumber: 'TKT-0006', customerName: 'Priya Krishnan', customerContact: 'priya@xyz.com', channel: 'email',    type: 'complaint', subject: 'Wrong brand colors used in posts',      status: 'in_progress', priority: 'high',   lastMessage: 'The posts you delivered have the wrong shade of purple. Please redo them.',          createdAt: '2025-01-19T10:00:00', unread: false },
]

const QUICK_REPLIES = [
  { id: '1', title: 'Service Inquiry',    shortcut: '/hello',    body_en: 'Hi! 👋 Thank you for reaching out to P2 Label! We specialize in social media content creation for businesses in Malaysia. To better assist you, could you share a bit about your business and which platforms you\'re looking to grow?', body_zh: '您好！👋 感谢您联系 P2 Label！我们专注于为马来西亚企业提供社交媒体内容创作服务。能分享一下您的业务吗？' },
  { id: '2', title: 'Pricing Info',       shortcut: '/price',    body_en: 'Thank you for your interest! 🙏 Our packages start from RM 800/month. Could you let me know your budget range and how many posts per month? I\'ll prepare a tailored proposal!', body_zh: '感谢您的关注！🙏 我们套餐起价 RM 800/月。请告知预算范围及每月所需帖子数量，我会为您定制方案！' },
  { id: '3', title: 'Complaint — Ack',    shortcut: '/sorry',    body_en: 'Hi [Name], I sincerely apologize for the inconvenience. 🙏 I completely understand your frustration. Let me look into this right away and get back to you within 2 hours with a resolution.', body_zh: '[姓名]您好，对于带来的不便，我真诚道歉。🙏 我马上调查并在2小时内给您解决方案。' },
  { id: '4', title: 'Follow Up',          shortcut: '/followup', body_en: 'Hi [Name]! 👋 Just checking in — we\'re still waiting for your feedback/approval. Please let us know if you have any questions so we can proceed!', body_zh: '[姓名]您好！👋 来跟进一下——我们还在等待您的反馈/批准。' },
  { id: '5', title: 'Resolved',           shortcut: '/resolved', body_en: 'Hi [Name]! I\'m glad we could resolve this for you! 🎉 Is there anything else I can help with?', body_zh: '[姓名]您好！很高兴能为您解决问题！🎉 还有其他需要帮助的吗？' },
]

const CHANNEL_ICONS: Record<Channel, { icon: React.ElementType; color: string; label: string }> = {
  whatsapp:  { icon: MessageSquare, color: '#25D366', label: 'WhatsApp' },
  instagram: { icon: Camera,        color: '#E1306C', label: 'Instagram' },
  facebook:  { icon: Globe,         color: '#1877F2', label: 'Facebook' },
  email:     { icon: Mail,          color: '#6366f1', label: 'Email' },
  phone:     { icon: Phone,         color: '#10b981', label: 'Phone' },
}

const PRIORITY_COLOR: Record<string, string> = {
  low: 'rgba(255,255,255,0.2)', normal: 'rgba(147,197,253,0.8)',
  high: 'rgba(251,146,60,0.9)', urgent: 'rgba(248,113,113,0.9)',
}

const TONES = ['Professional', 'Empathetic', 'Friendly', 'Formal']

export default function InboxPage() {
  const [selected, setSelected]         = useState<Ticket>(TICKETS[0])
  const [reply, setReply]               = useState('')
  const [lang, setLang]                 = useState<'en' | 'zh'>('en')
  const [showQuickReplies, setShowQR]   = useState(false)
  const [showAI, setShowAI]             = useState(false)
  const [aiTone, setAiTone]             = useState('Professional')
  const [aiLoading, setAiLoading]       = useState(false)
  const [aiResult, setAiResult]         = useState('')
  const [copied, setCopied]             = useState(false)
  const [sent, setSent]                 = useState(false)

  const channelInfo = CHANNEL_ICONS[selected.channel]
  const ChannelIcon = channelInfo.icon

  const generateAIReply = async () => {
    setAiLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    const replies: Record<TicketType, string> = {
      inquiry:   `Hi ${selected.customerName}! 👋 Thank you for reaching out to P2 Label!\n\nWe'd love to help with "${selected.subject}". We specialize in social media content creation for Malaysian businesses — from Instagram to TikTok. Packages start from RM 800/month.\n\nCould you share your business type and key platforms? I'll prepare a tailored proposal! 😊`,
      complaint: `Hi ${selected.customerName}, I sincerely apologize for the experience. 🙏\n\nI'm personally looking into this right now and will have a resolution within 2 hours. We are committed to making this right.\n\nThank you for your patience.`,
      refund:    `Hi ${selected.customerName}, I understand you'd like to discuss a refund.\n\nCould you share the invoice number and details? Our team will review and respond within 1 business day. 🙏`,
      feedback:  `Hi ${selected.customerName}! Thank you so much for your feedback — it truly means a lot! 🙏\n\nWe'll take your comments seriously as we continue to improve.`,
      other:     `Hi ${selected.customerName}! Thank you for contacting P2 Label. 😊\n\nI've received your message regarding "${selected.subject}" and will look into this right away. Could you share more detail?`,
    }
    setAiResult(replies[selected.type] || replies.other)
    setAiLoading(false)
  }

  const handleSend = () => {
    if (!reply.trim()) return
    setSent(true); setReply('')
    setTimeout(() => setSent(false), 2000)
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4" style={{ background: '#080808', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <p className="font-label text-[13px] uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>[Customer Service]</p>
          <h1 className="font-display text-4xl" style={{ letterSpacing: '0.05em' }}>INBOX</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-label text-[13px] px-2.5 py-1 uppercase tracking-widest" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: 'rgba(248,113,113,0.9)' }}>
            {TICKETS.filter(t => t.unread).length} unread
          </span>
          <span className="font-label text-[13px] px-2.5 py-1 uppercase tracking-widest" style={{ background: 'rgba(224,238,125,0.1)', border: '1px solid rgba(224,238,125,0.25)', color: '#e0ee7d' }}>
            {TICKETS.filter(t => t.status === 'open').length} open
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Ticket list */}
        <div className="w-72 overflow-y-auto scrollbar-thin" style={{ borderRight: '1px solid rgba(255,255,255,0.07)', background: '#0d0d0d' }}>
          {TICKETS.map(t => {
            const ci = CHANNEL_ICONS[t.channel]
            const CI = ci.icon
            const isSelected = selected.id === t.id
            return (
              <button key={t.id} onClick={() => setSelected(t)}
                className="w-full text-left px-4 py-3.5 transition-colors"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: isSelected ? '#181818' : 'transparent',
                  borderLeft: isSelected ? '2px solid #e0ee7d' : '2px solid transparent',
                }}>
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {t.unread && <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ background: '#e0ee7d' }} />}
                    <p className={cn('text-lg', t.unread ? 'font-bold text-white' : 'font-medium text-white/70')}>
                      {t.customerName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CI size={10} style={{ color: ci.color }} />
                    <span className="font-label text-[12px] uppercase tracking-wider px-1 py-0.5"
                      style={{ color: PRIORITY_COLOR[t.priority], border: `1px solid ${PRIORITY_COLOR[t.priority]}44` }}>
                      {t.priority}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium truncate mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.subject}</p>
                <p className="text-sm truncate" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.lastMessage}</p>
                <p className="font-label text-[12px] uppercase tracking-wider mt-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{t.ticketNumber}</p>
              </button>
            )
          })}
        </div>

        {/* RIGHT: Conversation */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Ticket Header */}
          <div className="px-6 py-3.5 flex items-center justify-between" style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center text-sm font-bold"
                style={{ background: channelInfo.color, color: '#000' }}>
                {selected.customerName[0]}
              </div>
              <div>
                <p className="font-semibold text-white text-lg">{selected.customerName}</p>
                <div className="flex items-center gap-2 font-label text-[13px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <ChannelIcon size={9} style={{ color: channelInfo.color }} />
                  <span>{channelInfo.label} · {selected.customerContact} · {selected.ticketNumber}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label text-[12px] px-2 py-0.5 uppercase tracking-wider"
                style={{ color: PRIORITY_COLOR[selected.priority], border: `1px solid ${PRIORITY_COLOR[selected.priority]}44` }}>
                {selected.priority}
              </span>
              <select className="font-label text-[13px] uppercase tracking-wider px-2 py-1.5 outline-none"
                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                <option>open</option><option>in_progress</option><option>pending_customer</option><option>resolved</option>
              </select>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin" style={{ background: '#0a0a0a' }}>
            <div className="flex gap-3">
              <div className="w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: channelInfo.color, color: '#000' }}>
                {selected.customerName[0]}
              </div>
              <div className="max-w-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-white">{selected.customerName}</span>
                  <span className="font-label text-[12px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>{formatDateTime(selected.createdAt)}</span>
                </div>
                <div className="px-4 py-3 text-lg" style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)' }}>
                  {selected.lastMessage}
                </div>
                <p className="font-label text-[12px] uppercase tracking-wider mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>via {channelInfo.label}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <span className="font-label text-[13px] px-3 py-1 uppercase tracking-widest" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}>
                Ticket opened · Assigned to you
              </span>
            </div>
          </div>

          {/* Reply Composer */}
          <div className="px-6 py-4" style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <div className="flex" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                {(['en','zh'] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)}
                    className="px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-colors"
                    style={{ background: lang === l ? '#e0ee7d' : 'transparent', color: lang === l ? '#000' : 'rgba(255,255,255,0.4)' }}>
                    {l === 'en' ? '🇬🇧 EN' : '🇨🇳 ZH'}
                  </button>
                ))}
              </div>

              <div className="relative">
                <button onClick={() => setShowQR(!showQuickReplies)}
                  className="flex items-center gap-1.5 px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-colors hover:border-white/20"
                  style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }}>
                  <MessageSquare size={10} /> Quick Reply <ChevronDown size={8} />
                </button>
                {showQuickReplies && (
                  <div className="absolute bottom-full left-0 mb-2 w-72 z-20"
                    style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>Quick Replies</p>
                    </div>
                    {QUICK_REPLIES.map(qr => (
                      <button key={qr.id} onClick={() => { setReply(lang === 'zh' ? qr.body_zh : qr.body_en); setShowQR(false) }}
                        className="w-full text-left px-3 py-2.5 transition-colors hover:bg-white/5"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-white">{qr.title}</p>
                          <span className="font-label text-[12px]" style={{ color: '#e0ee7d' }}>{qr.shortcut}</span>
                        </div>
                        <p className="font-label text-[12px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.65)' }}>{qr.body_en}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => setShowAI(!showAI)}
                className="flex items-center gap-1.5 px-3 py-1.5 font-label text-[13px] uppercase tracking-widest font-bold text-black transition-opacity hover:opacity-85"
                style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                <Sparkles size={10} /> AI Reply
              </button>

              <div className="ml-auto">
                <button onClick={() => { navigator.clipboard.writeText(reply); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                  disabled={!reply} className="p-1.5 transition-colors disabled:opacity-30"
                  style={{ color: copied ? '#e0ee7d' : 'rgba(255,255,255,0.4)' }}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* AI Box */}
            {showAI && (
              <div className="mb-3 p-4" style={{ background: 'rgba(224,238,125,0.06)', border: '1px solid rgba(224,238,125,0.2)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={12} style={{ color: '#e0ee7d' }} />
                  <p className="font-label text-[13px] uppercase tracking-widest" style={{ color: '#e0ee7d' }}>AI Reply Generator</p>
                  <p className="font-label text-[13px] ml-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    Detected: <span className="capitalize" style={{ color: 'rgba(255,255,255,0.7)' }}>{selected.type}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <p className="font-label text-[13px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>Tone:</p>
                  {TONES.map(t => (
                    <button key={t} onClick={() => setAiTone(t)}
                      className="font-label text-[13px] px-2 py-0.5 uppercase tracking-wider transition-colors"
                      style={{
                        background: aiTone === t ? '#e0ee7d' : 'transparent',
                        color: aiTone === t ? '#000' : 'rgba(255,255,255,0.4)',
                        border: `1px solid ${aiTone === t ? '#e0ee7d' : 'rgba(255,255,255,0.15)'}`,
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
                <button onClick={generateAIReply} disabled={aiLoading}
                  className="w-full py-2 font-label text-[12px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 mb-3 disabled:opacity-60 text-black"
                  style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                  {aiLoading ? <><RefreshCw size={11} className="animate-spin" /> Generating...</> : <><Sparkles size={11} /> Generate Smart Reply</>}
                </button>
                {aiResult && (
                  <div>
                    <div className="p-3 text-sm leading-relaxed whitespace-pre-line max-h-32 overflow-y-auto mb-2" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                      {aiResult}
                    </div>
                    <button onClick={() => { setReply(aiResult); setShowAI(false) }}
                      className="w-full py-1.5 font-label text-[13px] uppercase tracking-widest text-black font-bold"
                      style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                      ↑ Use This Reply
                    </button>
                  </div>
                )}
              </div>
            )}

            <textarea value={reply} onChange={e => setReply(e.target.value)}
              rows={4} placeholder={lang === 'zh' ? '用中文回复客户...' : 'Type your reply...'}
              className="w-full px-3 py-2.5 text-lg resize-none outline-none mb-3"
              style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />

            <div className="flex items-center justify-between">
              <p className="font-label text-[13px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Reply via <span style={{ color: channelInfo.color }}>{channelInfo.label}</span>
              </p>
              <button onClick={handleSend} disabled={!reply.trim()}
                className="flex items-center gap-2 px-5 py-2 font-label text-[12px] uppercase tracking-widest font-bold text-black disabled:opacity-40 hover:opacity-85 transition-opacity"
                style={{ background: '#e0ee7d', borderRadius: '999px' }}>
                {sent ? <><Check size={12}/> Sent!</> : <><Send size={12}/> Send Reply</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
