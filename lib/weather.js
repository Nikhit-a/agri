// Fetches current weather for a location. Uses OpenWeatherMap if an API key
// is configured (see .env.local.example); otherwise falls back to
// reasonable mock data so the dashboard works out of the box.
export async function fetchWeather(location) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  if (apiKey && location) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          location
        )}&appid=${apiKey}&units=metric`
      );
      if (res.ok) {
        const data = await res.json();
        return {
          temperatureC: data.main.temp,
          humidity: data.main.humidity,
          // OpenWeatherMap's free tier doesn't give rainfall totals reliably,
          // so we estimate a seasonal figure alongside the live temperature.
          rainfallMm: data.rain ? data.rain['1h'] * 24 * 30 : 80,
          source: 'openweathermap'
        };
      }
    } catch (err) {
      console.error('Weather fetch failed, using mock data:', err.message);
    }
  }

  // Mock fallback — deterministic-ish based on location string so demos feel consistent.
  const seed = location ? location.length : 5;
  return {
    temperatureC: 22 + (seed % 10),
    humidity: 55 + (seed % 20),
    rainfallMm: 400 + (seed % 5) * 150,
    source: 'mock'
  };
}
