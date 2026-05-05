import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Plainkost',
  description: 'Privacy policy for Plainkost.com.',
  alternates: { canonical: 'https://www.plainkost.com/privacy-policy' },
  robots: { index: false },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-[700px] mx-auto px-4 py-12">
      <div className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-xs text-gray-400">Last updated: May 2025</p>
      </div>

      <div className="space-y-8 text-sm text-gray-500 leading-relaxed">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Information we collect</h2>
          <p>
            Plainkost does not require account creation and does not collect personally identifiable information by default. When you use the price reporting or clinic suggestion forms, we collect the data you submit (procedure name, price, clinic name) along with a timestamp. No name or email is required.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Analytics</h2>
          <p>
            We may use privacy-respecting analytics to understand how the site is used (pages visited, general geographic region, device type). We do not use Google Analytics or other tracking tools that build cross-site profiles.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Google Maps</h2>
          <p>
            The map feature uses the Google Maps API. Google's privacy policy applies to map interactions. No personal data is sent to Google beyond what is required to render the map.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Cookies</h2>
          <p>
            Plainkost does not set tracking cookies. Your selected filters and calculator inputs are stored only in your browser's memory for the duration of your session.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Third parties</h2>
          <p>
            We do not sell, rent, or share any data with third parties. User-submitted price reports are stored in a private database and used only to improve the price data shown on this site.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Contact</h2>
          <p>
            Questions about this policy:{' '}
            <a href="mailto:hello@plainkost.com" className="text-gray-700 underline hover:text-gray-900">
              hello@plainkost.com
            </a>
          </p>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <Link href="/about" className="hover:text-gray-700">About</Link>
      </div>
    </div>
  )
}
