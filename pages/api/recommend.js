import { scoreCrops } from '../../lib/cropData';
import { fetchWeather } from '../../lib/weather';

// POST /api/recommend
// Body: { location, soilType, ph, season, useLiveWeather }
// Returns a ranked list of crop suitability scores plus the weather data used.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { location, soilType, ph, season, temperatureC, rainfallMm, useLiveWeather } = req.body;

    let weather = { temperatureC, rainfallMm };
    if (useLiveWeather || (!temperatureC && !rainfallMm)) {
      weather = await fetchWeather(location);
    }

    const recommendations = scoreCrops({
      soilType,
      ph,
      season,
      temperatureC: weather.temperatureC,
      rainfallMm: weather.rainfallMm
    });

    res.status(200).json({
      location,
      weatherUsed: weather,
      recommendations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate crop recommendations' });
  }
}
