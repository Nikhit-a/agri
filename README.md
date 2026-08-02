# AgriPredict — AI Crop Recommendation Dashboard

An interactive dashboard that analyzes weather, soil, and location data to recommend suitable crops and predict crop success, helping farmers make data-driven agricultural decisions.

**Stack:** JavaScript · React.js · Next.js · Firebase (Firestore)

## Features

- 🌦️ **Weather-aware recommendations** — pulls live temperature/rainfall for the farm's location (OpenWeatherMap), with a sensible mock fallback so it works with zero setup
- 🌱 **Soil-based scoring** — matches soil type and pH against ideal growing conditions for 10 major crops (rice, wheat, cotton, sugarcane, and more)
- 📊 **Visual insights** — ranked crop suitability chart built with Recharts
- 🔥 **Firebase-backed history** — every check is saved to Firestore so farmers can revisit past recommendations
- 📱 Responsive dashboard UI styled with Tailwind CSS

## Architecture

```
agripredict/
├── pages/
│   ├── index.js            Landing page
│   ├── dashboard.js        Main interactive dashboard
│   └── api/recommend.js    API route: scores crops against soil + weather inputs
├── components/              CropForm, ResultsChart, RecommendationList, Navbar
└── lib/
    ├── cropData.js          Crop knowledge base + scoring algorithm
    ├── weather.js            Weather fetch helper (live API or mock)
    └── firebase.js           Firebase client init (Firestore + Auth)
```

## How the recommendation engine works

`lib/cropData.js` scores each crop in the knowledge base against the farm's
soil type, pH, temperature, rainfall, and season using weighted rules — no
training data required, so the project runs immediately. To upgrade to a
trained ML model (e.g. a classifier trained on historical yield data), swap
`scoreCrops()` in `pages/api/recommend.js` for a call to your model's
inference endpoint; the request/response shape stays the same.

## Getting Started

### 1. Firebase setup
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** (start in test mode for local development).
3. Create a **Web App** and copy the config into `.env.local` (see `.env.local.example`).

### 2. (Optional) Live weather
Get a free API key from [OpenWeatherMap](https://openweathermap.org/api) and add it to `.env.local` as `NEXT_PUBLIC_OPENWEATHER_API_KEY`. Without it, the app uses realistic mock weather data automatically.

### 3. Run locally
```bash
cp .env.local.example .env.local   # fill in your values
npm install
npm run dev                          # http://localhost:3000
```

## Deploying

This is a standard Next.js app — deploy directly to [Vercel](https://vercel.com/) (recommended) by importing the GitHub repo, or run `npm run build && npm start` on any Node host. Remember to set the environment variables from `.env.local` in your hosting provider's dashboard.

## License

MIT — free to use for learning or as a portfolio project.
