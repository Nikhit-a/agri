// A small, transparent rule-based "recommendation engine" that scores crops
// against soil, weather, and location inputs. This stands in for a trained
// ML model until real agronomic training data is available — swap
// `scoreCrops()` below for a call to a hosted model without changing the
// API contract (see /pages/api/recommend.js).

export const CROP_DB = [
  {
    name: 'Rice',
    idealSoil: ['clay', 'loamy'],
    phRange: [5.5, 7.0],
    idealTempRange: [20, 35],
    minRainfallMm: 1000,
    season: ['kharif']
  },
  {
    name: 'Wheat',
    idealSoil: ['loamy', 'clay'],
    phRange: [6.0, 7.5],
    idealTempRange: [10, 25],
    minRainfallMm: 400,
    season: ['rabi']
  },
  {
    name: 'Maize (Corn)',
    idealSoil: ['loamy', 'sandy'],
    phRange: [5.5, 7.5],
    idealTempRange: [18, 32],
    minRainfallMm: 500,
    season: ['kharif', 'rabi']
  },
  {
    name: 'Cotton',
    idealSoil: ['black', 'loamy'],
    phRange: [6.0, 8.0],
    idealTempRange: [21, 35],
    minRainfallMm: 500,
    season: ['kharif']
  },
  {
    name: 'Sugarcane',
    idealSoil: ['loamy', 'clay'],
    phRange: [6.0, 7.5],
    idealTempRange: [20, 38],
    minRainfallMm: 1200,
    season: ['kharif', 'rabi']
  },
  {
    name: 'Groundnut',
    idealSoil: ['sandy', 'loamy'],
    phRange: [6.0, 7.0],
    idealTempRange: [20, 30],
    minRainfallMm: 500,
    season: ['kharif']
  },
  {
    name: 'Chickpea (Gram)',
    idealSoil: ['loamy', 'sandy'],
    phRange: [6.0, 7.5],
    idealTempRange: [10, 25],
    minRainfallMm: 350,
    season: ['rabi']
  },
  {
    name: 'Millets (Bajra/Jowar)',
    idealSoil: ['sandy', 'black'],
    phRange: [5.5, 7.5],
    idealTempRange: [22, 35],
    minRainfallMm: 300,
    season: ['kharif']
  },
  {
    name: 'Mustard',
    idealSoil: ['loamy', 'sandy'],
    phRange: [6.0, 7.5],
    idealTempRange: [10, 25],
    minRainfallMm: 300,
    season: ['rabi']
  },
  {
    name: 'Tomato',
    idealSoil: ['loamy'],
    phRange: [6.0, 7.0],
    idealTempRange: [18, 29],
    minRainfallMm: 400,
    season: ['kharif', 'rabi', 'zaid']
  }
];

function scoreRange(value, [min, max]) {
  if (value == null) return 0.5; // neutral if unknown
  if (value >= min && value <= max) return 1;
  const distance = value < min ? min - value : value - max;
  const span = max - min || 1;
  return Math.max(0, 1 - distance / span);
}

export function scoreCrops({ soilType, ph, temperatureC, rainfallMm, season }) {
  return CROP_DB.map((crop) => {
    let score = 0;
    let weightSum = 0;

    // Soil type match (weight 0.3)
    if (soilType) {
      score += (crop.idealSoil.includes(soilType.toLowerCase()) ? 1 : 0.2) * 0.3;
      weightSum += 0.3;
    }

    // Soil pH match (weight 0.2)
    if (ph != null) {
      score += scoreRange(Number(ph), crop.phRange) * 0.2;
      weightSum += 0.2;
    }

    // Temperature match (weight 0.25)
    if (temperatureC != null) {
      score += scoreRange(Number(temperatureC), crop.idealTempRange) * 0.25;
      weightSum += 0.25;
    }

    // Rainfall sufficiency (weight 0.15)
    if (rainfallMm != null) {
      const rainfallScore = Math.min(Number(rainfallMm) / crop.minRainfallMm, 1);
      score += rainfallScore * 0.15;
      weightSum += 0.15;
    }

    // Season match (weight 0.1)
    if (season) {
      score += (crop.season.includes(season.toLowerCase()) ? 1 : 0.1) * 0.1;
      weightSum += 0.1;
    }

    const normalizedScore = weightSum > 0 ? score / weightSum : 0;

    return {
      crop: crop.name,
      suitability: Math.round(normalizedScore * 100), // 0-100 predicted success score
      idealSoil: crop.idealSoil,
      idealTempRange: crop.idealTempRange,
      minRainfallMm: crop.minRainfallMm,
      bestSeasons: crop.season
    };
  }).sort((a, b) => b.suitability - a.suitability);
}
