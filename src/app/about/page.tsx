import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Liponity',
  description: 'Liponity is a trusted guide for US patients exploring liposuction in Korea.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About Liponity</h1>
      <div className="prose prose-gray max-w-none">
        <p>
          Liponity is an independent information resource for US patients considering liposuction
          and body contouring procedures in South Korea.
        </p>
        <p>
          We provide unbiased cost comparisons, clinic information, and practical travel guidance
          to help you make an informed decision. We are not affiliated with any clinic or
          medical provider.
        </p>
        <h2>Our Mission</h2>
        <p>
          To make medical tourism transparent, accessible, and safe for American patients seeking
          high-quality cosmetic surgery at a fraction of domestic costs.
        </p>
        <p className="text-sm text-gray-400">
          The information on this site is for educational purposes only and does not constitute
          medical advice. Always consult a qualified medical professional before undergoing any
          surgical procedure.
        </p>
      </div>
    </div>
  )
}
