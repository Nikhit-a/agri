import { useState } from 'react';

const SOIL_TYPES = ['loamy', 'clay', 'sandy', 'black'];
const SEASONS = ['kharif', 'rabi', 'zaid'];

export default function CropForm({ onSubmit, loading }) {
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('loamy');
  const [ph, setPh] = useState('6.5');
  const [season, setSeason] = useState('kharif');
  const [useLiveWeather, setUseLiveWeather] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ location, soilType, ph, season, useLiveWeather });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Farm Location (village/district)</label>
        <input
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Nashik, Maharashtra"
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Soil Type</label>
          <select value={soilType} onChange={(e) => setSoilType(e.target.value)} className="w-full border rounded-lg px-3 py-2">
            {SOIL_TYPES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Soil pH</label>
          <input
            type="number"
            step="0.1"
            min="3"
            max="10"
            value={ph}
            onChange={(e) => setPh(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Growing Season</label>
        <select value={season} onChange={(e) => setSeason(e.target.value)} className="w-full border rounded-lg px-3 py-2">
          {SEASONS.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={useLiveWeather}
          onChange={(e) => setUseLiveWeather(e.target.checked)}
        />
        Use live weather data for this location
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-crop-600 text-white py-2 rounded-lg font-medium hover:bg-crop-700 disabled:opacity-60"
      >
        {loading ? 'Analyzing…' : 'Get Crop Recommendations'}
      </button>
    </form>
  );
}
