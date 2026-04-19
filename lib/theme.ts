import type { CSSProperties } from 'react'

// ── Surfaces ──────────────────────────────────────────────────────────────────
export const SURFACE: CSSProperties = {
  background: '#111111',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '20px',
}

export const SURFACE_ELEVATED: CSSProperties = {
  background: '#181818',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '20px',
}

export const SURFACE_OVERLAY: CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: '20px',
}

// ── Inputs ────────────────────────────────────────────────────────────────────
export const INPUT_STYLE: CSSProperties = {
  background: '#181818',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#ffffff',
  outline: 'none',
  borderRadius: '14px',
}

export const SELECT_STYLE: CSSProperties = {
  background: '#181818',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'rgba(255,255,255,0.85)',
  outline: 'none',
  borderRadius: '14px',
}

// ── Chart tokens ──────────────────────────────────────────────────────────────
export const AXIS_STYLE = {
  fontSize: 9,
  fill: 'rgba(255,255,255,0.35)',
  fontFamily: 'var(--font-space)',
} as const

export const GRID_COLOR = 'rgba(255,255,255,0.05)'

// ── Colour palette ────────────────────────────────────────────────────────────
export const ACCENT        = '#e0ee7d'
export const BG            = '#0a0a0a'
export const BG_SECONDARY  = '#0d0d0d'

// ── Border colours ────────────────────────────────────────────────────────────
export const BORDER        = 'rgba(255,255,255,0.07)'
export const BORDER_MID    = 'rgba(255,255,255,0.13)'
export const BORDER_STRONG = 'rgba(255,255,255,0.22)'

// ── Text colours ──────────────────────────────────────────────────────────────
export const TEXT_PRIMARY  = '#ffffff'
export const TEXT_MUTED    = 'rgba(255,255,255,0.65)'
export const TEXT_DIM      = 'rgba(255,255,255,0.5)'

// ── Semantic status tokens (dark) ─────────────────────────────────────────────
export const STATUS_ACCENT = { bg: 'rgba(224,238,125,0.1)',  color: ACCENT,      border: 'rgba(224,238,125,0.25)' }
export const STATUS_BLUE   = { bg: 'rgba(96,165,250,0.1)',   color: '#60a5fa',   border: 'rgba(96,165,250,0.25)' }
export const STATUS_RED    = { bg: 'rgba(248,113,113,0.08)', color: '#f87171',   border: 'rgba(248,113,113,0.2)' }
export const STATUS_ORANGE = { bg: 'rgba(251,146,60,0.08)',  color: '#fb923c',   border: 'rgba(251,146,60,0.2)' }
export const STATUS_GREEN  = { bg: 'rgba(52,211,153,0.1)',   color: '#34d399',   border: 'rgba(52,211,153,0.2)' }
export const STATUS_MUTED  = { bg: 'rgba(255,255,255,0.06)', color: TEXT_MUTED,  border: BORDER }

// ── Accent button ─────────────────────────────────────────────────────────────
export const BTN_ACCENT: CSSProperties = {
  background: ACCENT,
  color: '#000000',
  borderRadius: '999px',
  fontWeight: 700,
}

// ── Ghost button ──────────────────────────────────────────────────────────────
export const BTN_GHOST: CSSProperties = {
  border: `1px solid ${BORDER_MID}`,
  color: TEXT_MUTED,
  borderRadius: '999px',
}

// ── Section divider ───────────────────────────────────────────────────────────
export const DIVIDER: CSSProperties = {
  height: '1px',
  background: 'rgba(255,255,255,0.06)',
  margin: '20px 0',
}
