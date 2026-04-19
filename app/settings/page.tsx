'use client'

import { useState } from 'react'
import { Save, Check, Globe, Camera, PlayCircle, Music } from 'lucide-react'
import { SURFACE, INPUT_STYLE } from '@/lib/theme'

const PLATFORMS_CONNECT = [
  { id: 'facebook',  label: 'Facebook Page',     icon: Globe,     color: '#1877F2', connected: false },
  { id: 'instagram', label: 'Instagram Business', icon: Camera,   color: '#E1306C', connected: true  },
  { id: 'youtube',  label: 'YouTube Channel',   icon: PlayCircle, color: '#FF0000', connected: false },
  { id: 'tiktok',    label: 'TikTok Business',    icon: Music,     color: 'rgba(255,255,255,0.7)', connected: false },
]

const ACCENT_SWATCHES = ['#e0ee7d','#60a5fa','#34d399','#f87171','#a78bfa','#fb923c']

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [team, setTeam] = useState({
    brand_name: 'P2 Label',
    industry: 'Social Media & Entertainment',
    primary_color: '#e0ee7d',
    default_platforms: ['instagram'],
  })
  const [platforms, setPlatforms] = useState(PLATFORMS_CONNECT)
  const [notifications, setNotifications] = useState([
    { id: 'pub',   label: 'Post published successfully', zh: '贴文发布成功通知', on: true },
    { id: 'appr',  label: 'Post approval requested',    zh: '待审批通知',       on: true },
    { id: 'sched', label: 'Scheduled post reminder',    zh: '定时发布提醒',     on: false },
    { id: 'rep',   label: 'Weekly performance report',  zh: '每周报告',         on: true },
  ])

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  const togglePlatformConnect = (id: string) => setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: !p.connected } : p))
  const toggleNotif = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, on: !n.on } : n))

  return (
    <div className="p-8 max-w-3xl page-enter" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-label text-[13px] uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            [System]
          </p>
          <h1 className="font-display text-5xl" style={{ letterSpacing: '0.05em' }}>SETTINGS</h1>
          <p className="font-label text-[13px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
            设置 · Team and platform configuration
          </p>
        </div>
        <button onClick={save}
          className="flex items-center gap-2 px-4 py-2 font-label text-[13px] uppercase tracking-widest font-bold text-black"
          style={{ background: '#e0ee7d', borderRadius: '999px' }}>
          {saved ? <><Check size={11} /> Saved!</> : <><Save size={11} /> Save Changes</>}
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '24px' }} />

      {/* Brand Settings */}
      <div className="mb-6 p-6" style={{ ...SURFACE, borderRadius: '20px' }}>
        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-1 h-4" style={{ background: '#e0ee7d' }} />
          <h2 className="font-display text-2xl" style={{ letterSpacing: '0.05em' }}>BRAND SETTINGS</h2>
          <span className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>品牌设置</span>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Brand Name 品牌名称
              </label>
              <input value={team.brand_name}
                onChange={e => setTeam(p => ({ ...p, brand_name: e.target.value }))}
                className="w-full px-3 py-2.5 text-lg"
                style={{ ...INPUT_STYLE, borderRadius: '16px' }} />
            </div>
            <div>
              <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Industry 行业
              </label>
              <input value={team.industry}
                onChange={e => setTeam(p => ({ ...p, industry: e.target.value }))}
                className="w-full px-3 py-2.5 text-lg"
                style={{ ...INPUT_STYLE, borderRadius: '16px' }} />
            </div>
          </div>
          <div>
            <label className="block font-label text-[12px] uppercase tracking-[0.15em] mb-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Brand Color 品牌颜色
            </label>
            <div className="flex items-center gap-3">
              <input type="color" value={team.primary_color}
                onChange={e => setTeam(p => ({ ...p, primary_color: e.target.value }))}
                className="w-10 h-10 cursor-pointer" style={{ background: 'transparent', border: 'none', borderRadius: '16px' }} />
              <input value={team.primary_color}
                onChange={e => setTeam(p => ({ ...p, primary_color: e.target.value }))}
                className="w-28 px-3 py-2 font-label text-[12px]"
                style={{ ...INPUT_STYLE, borderRadius: '16px' }} />
              <div className="flex gap-2">
                {ACCENT_SWATCHES.map(c => (
                  <button key={c} onClick={() => setTeam(p => ({ ...p, primary_color: c }))}
                    className="w-6 h-6 transition-all"
                    style={{
                      background: c,
                      borderRadius: '12px',
                      outline: team.primary_color === c ? `2px solid ${c}` : 'none',
                      outlineOffset: '2px',
                    }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Connections */}
      <div className="mb-6 p-6" style={{ ...SURFACE, borderRadius: '20px' }}>
        <div className="flex items-center gap-2 mb-1 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-1 h-4" style={{ background: '#e0ee7d' }} />
          <h2 className="font-display text-2xl" style={{ letterSpacing: '0.05em' }}>PLATFORM CONNECTIONS</h2>
          <span className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>平台连接</span>
        </div>
        <p className="font-label text-[12px] uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Connect your social accounts to enable scheduling
        </p>
        <div className="space-y-2">
          {platforms.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3.5 transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center text-white"
                  style={{ background: p.color === 'rgba(255,255,255,0.7)' ? '#181818' : p.color, borderRadius: '16px' }}>
                  <p.icon size={14} />
                </div>
                <div>
                  <p className="text-lg font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>{p.label}</p>
                  <p className="font-label text-[12px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {p.connected ? '@p2label.official · Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <button onClick={() => togglePlatformConnect(p.id)}
                className="px-3 py-1.5 font-label text-[13px] uppercase tracking-widest transition-all"
                style={p.connected
                  ? { background: 'rgba(224,238,125,0.1)', color: '#e0ee7d', border: '1px solid rgba(224,238,125,0.25)', borderRadius: '16px' }
                  : { background: '#e0ee7d', color: '#000', fontWeight: 700, borderRadius: '16px' }}>
                {p.connected ? '✓ Connected' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="p-6" style={{ ...SURFACE, borderRadius: '20px' }}>
        <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-1 h-4" style={{ background: '#e0ee7d' }} />
          <h2 className="font-display text-2xl" style={{ letterSpacing: '0.05em' }}>NOTIFICATIONS</h2>
          <span className="font-label text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>通知设置</span>
        </div>
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-lg" style={{ color: 'rgba(255,255,255,0.75)' }}>{n.label}</p>
                <p className="font-label text-[12px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{n.zh}</p>
              </div>
              <button onClick={() => toggleNotif(n.id)}
                className="w-10 h-5 relative transition-colors"
                style={{ background: n.on ? '#e0ee7d' : 'rgba(255,255,255,0.1)', borderRadius: '9999px' }}>
                <div className="absolute top-0.5 w-4 h-4 bg-black transition-transform"
                  style={{ borderRadius: '50%', transform: n.on ? 'translateX(21px)' : 'translateX(2px)' }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
