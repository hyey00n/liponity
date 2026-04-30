'use client'
import Link from 'next/link'
import { useState } from 'react'

const NAV = [
  { label: 'Clinics', href: '/clinics' },
  { label: 'Guide',   href: '/guide' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Liponity
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden text-sm text-gray-500"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 px-4 py-4 space-y-3">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block text-sm text-gray-700"
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}