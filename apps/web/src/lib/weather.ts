import { getCurrentPosition } from "@/lib/nearbyCare";
import {
  buildPrecautions,
  type WeatherPrecaution,
  type WeatherSnapshot,
} from "@/lib/weatherCore";

export type { WeatherPrecaution, WeatherSnapshot };
export { buildPrecautions, weatherCodeLabel } from "@/lib/weatherCore";

export type WeatherResult =
  | { ok: true; weather: WeatherSnapshot; precautions: WeatherPrecaution[] }
  | { ok: false; error: string };

function friendlyFetchError(err: unknown, fallback: string): string {
  if (
    err instanceof Error &&
    /failed to fetch|networkerror|load failed/i.test(err.message)
  ) {
    return "Could not reach Aai’s weather helper. Check your connection and try again.";
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

/** Browser: geolocation + same-origin API (avoids CORS with Open-Meteo/Nominatim). */
export async function loadLocalWeather(): Promise<WeatherResult> {
  try {
    const coords = await getCurrentPosition();
    const res = await fetch(
      `/api/weather?lat=${encodeURIComponent(String(coords.lat))}&lon=${encodeURIComponent(String(coords.lon))}`,
    );
    const data = (await res.json()) as {
      weather?: WeatherSnapshot;
      precautions?: WeatherPrecaution[];
      error?: string;
    };
    if (!res.ok || !data.weather || !data.precautions) {
      return {
        ok: false,
        error: data.error || "Could not load weather for your location.",
      };
    }
    return { ok: true, weather: data.weather, precautions: data.precautions };
  } catch (err) {
    return {
      ok: false,
      error: friendlyFetchError(
        err,
        "Could not load weather for your location.",
      ),
    };
  }
}
