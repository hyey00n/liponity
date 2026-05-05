export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-8">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Plainkost — Estimates only. Not medical advice.
        </p>
      </div>
    </footer>
  )
}
