// MYR formatting
export function fmtMYR(amount: number) {
  return `RM ${amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// DD/MM/YYYY
export function fmtDateMY(date: string | Date) {
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Add days to a date string
export function addDays(date: string, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

// Today as YYYY-MM-DD
export function today(): string {
  return new Date().toISOString().split('T')[0]
}

// Auto-generate quote/invoice number
export function generateNumber(prefix: string, next: number): string {
  const year = new Date().getFullYear()
  return `${prefix}-${year}-${String(next).padStart(4, '0')}`
}

// SST calculation
export function calcSST(subtotal: number, discountAmt: number, sstRate: number) {
  return Math.round((subtotal - discountAmt) * (sstRate / 100) * 100) / 100
}

// Discount amount
export function calcDiscount(subtotal: number, type: string, value: number) {
  if (type === 'percentage') return Math.round(subtotal * (value / 100) * 100) / 100
  if (type === 'fixed') return value
  return 0
}

// Line total
export function calcLineTotal(qty: number, unitPrice: number, discountPct: number) {
  return Math.round(qty * unitPrice * (1 - discountPct / 100) * 100) / 100
}

// Dark-theme status badge classes
export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  draft:    { bg: 'bg-white/8',           text: 'text-white/50',     dot: 'bg-white/30' },
  sent:     { bg: 'bg-blue-500/15',       text: 'text-blue-300',     dot: 'bg-blue-400' },
  viewed:   { bg: 'bg-indigo-500/15',     text: 'text-indigo-300',   dot: 'bg-indigo-400' },
  accepted: { bg: 'bg-[#e0ee7d]/15',      text: 'text-[#e0ee7d]',   dot: 'bg-[#e0ee7d]' },
  rejected: { bg: 'bg-red-500/15',        text: 'text-red-400',      dot: 'bg-red-500' },
  expired:  { bg: 'bg-amber-500/15',      text: 'text-amber-400',    dot: 'bg-amber-400' },
  unpaid:   { bg: 'bg-yellow-500/15',     text: 'text-yellow-300',   dot: 'bg-yellow-400' },
  partial:  { bg: 'bg-orange-500/15',     text: 'text-orange-400',   dot: 'bg-orange-400' },
  paid:     { bg: 'bg-[#e0ee7d]/15',      text: 'text-[#e0ee7d]',   dot: 'bg-[#e0ee7d]' },
  overdue:  { bg: 'bg-red-500/15',        text: 'text-red-400',      dot: 'bg-red-500' },
  cancelled:{ bg: 'bg-white/5',           text: 'text-white/30',     dot: 'bg-white/20' },
}
