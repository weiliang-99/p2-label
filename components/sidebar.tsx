'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, PenSquare, Image, FileText,
  Hash, BarChart2, Settings, Megaphone,
  BookOpen, MessageSquare, ClipboardList, Timer,
  TrendingUp, Receipt, Users, MapPin, Package,
} from 'lucide-react'

const ICON_W = 60

const marketingNav = [
  { href: '/dashboard',    label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/calendar',     label: 'Calendar',    icon: Calendar },
  { href: '/posts/create', label: 'Create Post', icon: PenSquare },
  { href: '/media',        label: 'Media',       icon: Image },
  { href: '/templates',    label: 'Templates',   icon: FileText },
  { href: '/hashtags',     label: 'Hashtags',    icon: Hash },
  { href: '/analytics',    label: 'Analytics',   icon: BarChart2 },
]

const salesNav = [
  { href: '/sales/dashboard', label: 'Overview',   icon: TrendingUp },
  { href: '/sales/quotes',    label: 'Quotations', icon: Receipt },
  { href: '/sales/clients',   label: 'Clients',    icon: Users },
  { href: '/sales/sources',   label: 'Sources',    icon: MapPin },
  { href: '/sales/products',  label: 'Products',   icon: Package },
]

const csNav = [
  { href: '/cs/inbox',      label: 'Inbox',      icon: MessageSquare },
  { href: '/cs/complaints', label: 'Complaints', icon: ClipboardList },
  { href: '/cs/knowledge',  label: 'Knowledge',  icon: BookOpen },
  { href: '/cs/reports',    label: 'CS Reports', icon: Timer },
]

function NavSection({ bracket, items, pathname }: {
  bracket: string
  items: typeof marketingNav
  pathname: string
}) {
  const isActive = (href: string) =>
    pathname === href || (href.length > 1 && pathname.startsWith(href))

  return (
    <div className="mb-5">
      <p
        className="sidebar-label font-label text-[11px] uppercase tracking-[0.18em] mb-2"
        style={{ color: 'rgba(255,255,255,0.40)', paddingLeft: ICON_W }}
      >
        [{bracket}]
      </p>
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            className="sidebar-link flex items-center py-2.5 transition-colors"
            style={{
              color: active ? '#e0ee7d' : 'rgba(255,255,255,0.65)',
              borderLeft: active ? '2px solid #e0ee7d' : '2px solid transparent',
            }}
          >
            <span
              className="sidebar-icon shrink-0 flex items-center justify-center"
              style={{ width: ICON_W, minWidth: ICON_W }}
            >
              <Icon size={16} />
            </span>
            <span className="sidebar-label font-label text-[13px] uppercase tracking-widest whitespace-nowrap">
              {label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      <style>{`
        .sidebar-root {
          width: ${ICON_W}px;
          transition: width 240ms cubic-bezier(0.4,0,0.2,1), box-shadow 240ms ease;
          overflow: hidden;
        }
        .sidebar-root:hover {
          width: 236px;
          box-shadow: 4px 0 28px rgba(0,0,0,0.6);
        }
        .sidebar-label {
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          transition: opacity 160ms ease, max-width 240ms cubic-bezier(0.4,0,0.2,1);
          pointer-events: none;
        }
        .sidebar-root:hover .sidebar-label {
          opacity: 1;
          max-width: 200px;
          pointer-events: auto;
        }
        .sidebar-icon {
          transition: width 240ms ease;
        }
        .sidebar-link:hover {
          color: rgba(255,255,255,0.9) !important;
        }
        .sidebar-link[style*="color: rgb(224, 238, 125)"]:hover,
        .sidebar-link[style*="#e0ee7d"]:hover {
          color: #e0ee7d !important;
        }
        .sidebar-logo-text {
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          transition: opacity 160ms ease, max-width 240ms cubic-bezier(0.4,0,0.2,1);
          white-space: nowrap;
        }
        .sidebar-root:hover .sidebar-logo-text {
          opacity: 1;
          max-width: 180px;
        }
        .sidebar-user-text {
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          transition: opacity 160ms ease, max-width 240ms cubic-bezier(0.4,0,0.2,1);
          white-space: nowrap;
        }
        .sidebar-root:hover .sidebar-user-text {
          opacity: 1;
          max-width: 180px;
        }
      `}</style>

      <aside
        className="sidebar-root fixed top-0 left-0 h-screen flex flex-col z-50"
        style={{
          background: '#080808',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: 64 }}
        >
          <span
            className="sidebar-icon shrink-0 flex items-center justify-center"
            style={{ width: ICON_W, minWidth: ICON_W }}
          >
            <div
              className="flex items-center justify-center"
              style={{ width: 32, height: 32, background: '#e0ee7d', borderRadius: '10px' }}
            >
              <Megaphone size={15} className="text-black" />
            </div>
          </span>
          <div className="sidebar-logo-text">
            <p className="font-display text-xl leading-none" style={{ color: '#e0ee7d', letterSpacing: '0.08em' }}>
              P2 LABEL
            </p>
            <p className="font-label text-[10px] uppercase tracking-[0.15em] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Business Hub
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <NavSection bracket="Marketing"        items={marketingNav} pathname={pathname} />
          <NavSection bracket="Sales"            items={salesNav}     pathname={pathname} />
          <NavSection bracket="Customer Service" items={csNav}        pathname={pathname} />
        </nav>

        {/* Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link
            href="/settings"
            className="sidebar-link flex items-center py-3 transition-colors"
            style={{ color: pathname === '/settings' ? '#e0ee7d' : 'rgba(255,255,255,0.60)' }}
          >
            <span
              className="sidebar-icon shrink-0 flex items-center justify-center"
              style={{ width: ICON_W, minWidth: ICON_W }}
            >
              <Settings size={16} />
            </span>
            <span className="sidebar-label font-label text-[13px] uppercase tracking-widest whitespace-nowrap">
              Settings
            </span>
          </Link>

          <div className="flex items-center pb-4">
            <span
              className="sidebar-icon shrink-0 flex items-center justify-center"
              style={{ width: ICON_W, minWidth: ICON_W }}
            >
              <div
                className="flex items-center justify-center text-[11px] font-bold text-black"
                style={{ width: 26, height: 26, background: '#e0ee7d', borderRadius: '6px' }}
              >
                P
              </div>
            </span>
            <span
              className="sidebar-user-text font-label text-[11px] uppercase tracking-wider"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              P2 Label Team
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}
