import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Liponity',
  description: 'Liponity privacy policy.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: April 2025</p>

      <div className="prose prose-gray max-w-none">
        <h2>Information We Collect</h2>
        <p>
          Liponity does not collect personal information unless you voluntarily provide it through
          our contact form. We may collect anonymous usage analytics through Google Analytics.
        </p>

        <h2>How We Use Information</h2>
        <p>
          Contact form submissions are used solely to respond to your inquiry. Analytics data is
          used in aggregate to improve the site.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          We use Google Analytics for anonymous traffic analysis. We display Google AdSense
          advertisements. These services have their own privacy policies.
        </p>

        <h2>Cookies</h2>
        <p>
          We use cookies for analytics and advertising purposes. You may opt out through your
          browser settings or Google's opt-out tools.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy-related questions, use our{' '}
          <a href="/contact" className="text-blue-600 hover:underline">contact form</a>.
        </p>
      </div>
    </div>
  )
}
