import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-8">
      <div className="max-w-[1400px] mx-auto px-4 py-6 flex flex-col md:flex-row justify-between gap-2">
        <div className="flex gap-4 text-xs text-gray-400">
          <Link href="/about" className="hover:text-gray-700">About</Link>
          <Link href="/contact" className="hover:text-gray-700">Contact</Link>
          <Link href="/privacy-policy" className="hover:text-gray-700">Privacy</Link>
        </div>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Liponity — Estimates only. Not medical advice.
        </p>
      </div>
    </footer>
  )
}
