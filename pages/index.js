import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-crop-700 mb-3">AgriPredict</h1>
        <p className="text-lg text-gray-600 mb-8">
          AI-powered crop recommendations from your soil, weather, and location data.
        </p>
        <Link
          href="/dashboard"
          className="bg-crop-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-crop-700"
        >
          Open Dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <FeatureCard
            title="Live Weather Integration"
            desc="Pulls current temperature and rainfall data for your farm's location."
          />
          <FeatureCard
            title="Soil-Aware Scoring"
            desc="Matches your soil type and pH against ideal growing conditions for 10+ crops."
          />
          <FeatureCard
            title="Visual Insights"
            desc="See ranked crop suitability scores as an interactive chart, powered by Firebase-backed history."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-crop-700 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
