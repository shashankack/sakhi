export type WeatherSnapshot = {
  tempC: number;
  feelsLikeC: number;
  humidity: number;
  precipMm: number;
  windKmh: number;
  uvIndex: number | null;
  weatherCode: number;
  label: string;
  placeLabel: string;
  fetchedAt: string;
};

export type WeatherPrecaution = {
  id: string;
  title: string;
  detail: string;
};

/** WMO weather interpretation codes (simplified). */
export function weatherCodeLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code === 1 || code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "Mixed conditions";
}

export function buildPrecautions(w: WeatherSnapshot): WeatherPrecaution[] {
  const tips: WeatherPrecaution[] = [];

  if (w.tempC >= 34 || w.feelsLikeC >= 36) {
    tips.push({
      id: "heat",
      title: "Heat care",
      detail:
        "Sip water often, rest in shade or a cool room, and avoid heavy outdoor activity in peak sun. Heat can worsen tiredness and dizziness.",
    });
  } else if (w.tempC >= 30 || w.feelsLikeC >= 32) {
    tips.push({
      id: "warm",
      title: "Stay cool",
      detail:
        "Choose light clothing, carry water, and pace outdoor plans. If you feel faint or overheated, sit down and cool off.",
    });
  }

  if (w.tempC <= 16) {
    tips.push({
      id: "cool",
      title: "Stay warm gently",
      detail:
        "Layer clothing and keep evenings cozy. Cool weather can make low energy feel heavier — short indoor stretches still help.",
    });
  }

  if (w.humidity >= 75) {
    tips.push({
      id: "humidity",
      title: "Humidity & skin comfort",
      detail:
        "High humidity can make skin feel oilier. Keep skincare light, wash gently, and change out of damp clothes after being outdoors.",
    });
  } else if (w.humidity <= 30) {
    tips.push({
      id: "dry",
      title: "Dry air",
      detail:
        "Dry air can irritate skin and lips. Moisturize, drink water, and skip harsh scrubbing if your skin feels tight.",
    });
  }

  if (w.uvIndex != null && w.uvIndex >= 7) {
    tips.push({
      id: "uv",
      title: "Strong sun / UV",
      detail:
        "Use sunscreen, cover arms if you will be outside long, and prefer earlier or later outdoor walks when UV peaks.",
    });
  } else if (w.uvIndex != null && w.uvIndex >= 4) {
    tips.push({
      id: "uv-mod",
      title: "Moderate UV",
      detail:
        "A little sun protection still helps — sunscreen on face and neck is a simple habit for outdoor time.",
    });
  }

  if (
    w.precipMm >= 1 ||
    [61, 63, 65, 80, 81, 82, 95, 96, 99].includes(w.weatherCode)
  ) {
    tips.push({
      id: "rain",
      title: "Wet weather",
      detail:
        "Keep movement indoors if roads are slippery. Carry an umbrella, and pack any medicines in a dry pouch if you must go out.",
    });
  }

  if (w.windKmh >= 35) {
    tips.push({
      id: "wind",
      title: "Strong wind",
      detail:
        "Dust and wind can irritate eyes and skin. Sunglasses and a light scarf help; skip intense outdoor workouts if debris is flying.",
    });
  }

  if (tips.length === 0) {
    tips.push({
      id: "baseline",
      title: "Steady day habits",
      detail:
        "A calm day is a good time for gentle movement, regular meals, and noting how your body feels — useful context for a clinician visit.",
    });
  }

  tips.push({
    id: "edu-only",
    title: "Education only",
    detail:
      "These are general comfort tips based on local weather, not medical advice or a diagnosis.",
  });

  return tips.slice(0, 4);
}
