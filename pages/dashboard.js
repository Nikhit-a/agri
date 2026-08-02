import { useEffect, useState } from 'react';
import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import CropForm from '../components/CropForm';
import ResultsChart from '../components/ResultsChart';
import RecommendationList from '../components/RecommendationList';
import { db } from '../lib/firebase';

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const q = query(collection(db, 'cropChecks'), orderBy('createdAt', 'desc'), limit(5));
      const snap = await getDocs(q);
      setHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      // Firestore may not be configured yet in local dev — fail silently.
      console.warn('Could not load history (is Firebase configured?):', err.message);
    }
  }

  async function handleSubmit(formData) {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setResult(data);

      // Persist this check to Firestore so farmers can revisit past results.
      try {
        await addDoc(collection(db, 'cropChecks'), {
          location: formData.location,
          soilType: formData.soilType,
          season: formData.season,
          topCrop: data.recommendations[0]?.crop,
          weatherUsed: data.weatherUsed,
          createdAt: serverTimestamp()
        });
        loadHistory();
      } catch (err) {
        console.warn('Could not save to Firestore (is it configured?):', err.message);
      }
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-crop-700 mb-6">Crop Recommendation Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <CropForm onSubmit={handleSubmit} loading={loading} />

            {history.length > 0 && (
              <div className="mt-6 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Checks</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {history.map((h) => (
                    <li key={h.id} className="flex justify-between">
                      <span>{h.location}</span>
                      <span className="text-crop-700 font-medium">{h.topCrop}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {result && (
              <>
                <ResultsChart recommendations={result.recommendations} />
                <RecommendationList recommendations={result.recommendations} weatherUsed={result.weatherUsed} />
              </>
            )}
            {!result && !loading && (
              <div className="bg-white border border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400">
                Fill in the form to see crop recommendations
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
