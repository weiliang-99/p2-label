import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-MY', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-MY', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'Asia/Kuala_Lumpur'
  })
}

export const PLATFORM_COLORS: Record<string, string> = {
  facebook: '#1877F2',
  instagram: '#E1306C',
  linkedin: '#0A66C2',
  tiktok: '#000000',
}

export const PLATFORM_LIMITS: Record<string, number> = {
  facebook: 63206,
  instagram: 2200,
  linkedin: 3000,
  tiktok: 2200,
}

export const MALAYSIAN_HOLIDAYS = [
  { date: '2025-01-29', name: 'Chinese New Year', emoji: '🧧' },
  { date: '2025-01-30', name: 'Chinese New Year (Day 2)', emoji: '🧧' },
  { date: '2025-03-31', name: 'Hari Raya Aidilfitri', emoji: '🌙' },
  { date: '2025-04-01', name: 'Hari Raya (Day 2)', emoji: '🌙' },
  { date: '2025-05-01', name: 'Labour Day', emoji: '💼' },
  { date: '2025-06-02', name: 'Agong Birthday', emoji: '👑' },
  { date: '2025-08-31', name: 'Hari Merdeka', emoji: '🇲🇾' },
  { date: '2025-09-16', name: 'Malaysia Day', emoji: '🇲🇾' },
  { date: '2025-10-20', name: 'Deepavali', emoji: '🪔' },
  { date: '2025-12-25', name: 'Christmas', emoji: '🎄' },
  { date: '2025-11-11', name: '11.11 Shopping Festival', emoji: '🛍️' },
  { date: '2025-12-12', name: '12.12 Shopping Festival', emoji: '🛍️' },
]
