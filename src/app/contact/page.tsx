import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Liponity',
  description: 'Get in touch with the Liponity team.',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact</h1>
      <p className="text-gray-500 mb-10">
        Have a question or want to suggest a clinic? Reach out below.
      </p>

      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Your message..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-medium
            hover:bg-blue-700 transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
