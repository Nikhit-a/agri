export default function RecommendationList({ recommendations, weatherUsed }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Recommended Crops</h3>
        {weatherUsed && (
          <span className="text-xs text-gray-500">
            {Math.round(weatherUsed.temperatureC)}°C · {Math.round(weatherUsed.rainfallMm)}mm rainfall
            {weatherUsed.source === 'mock' && ' (estimated)'}
          </span>
        )}
      </div>

      <ul className="space-y-3">
        {recommendations.map((r, i) => (
          <li key={r.crop} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
            <div>
              <p className="font-medium text-gray-800">
                {i === 0 && '🏆 '}
                {r.crop}
              </p>
              <p className="text-xs text-gray-500">
                Best in {r.bestSeasons.join(', ')} · Needs {r.minRainfallMm}mm+ rainfall
              </p>
            </div>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                r.suitability >= 70
                  ? 'bg-green-100 text-green-800'
                  : r.suitability >= 40
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {r.suitability}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
