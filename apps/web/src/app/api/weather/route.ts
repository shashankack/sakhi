import { NextResponse } from "next/server";
import {
  buildPrecautions,
  weatherCodeLabel,
  type WeatherSnapshot,
} from "@/lib/weatherCore";

export const runtime = "nodejs";
export const maxDuration = 30;

async function reversePlaceLabel(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=12`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "AaiHealthEducation/1.0 (hackathon; contact@localhost)",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return "Your area";
    const data = (await res.json()) as {
      address?: { city?: string; town?: string; village?: string; state?: string };
      name?: string;
    };
    const a = data.address || {};
    const city = a.city || a.town || a.village || data.name;
    if (city && a.state) return `${city}, ${a.state}`;
    if (city) return city;
    if (a.state) return a.state;
    return "Your area";
  } catch {
    return "Your area";
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json(
      { error: "Please share a valid location." },
      { status: 400 },
    );
  }
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ error: "Location looks invalid." }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "precipitation",
        "weather_code",
        "wind_speed_10m",
        "uv_index",
      ].join(","),
      wind_speed_unit: "kmh",
      timezone: "auto",
    });
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Weather service is unavailable right now." },
        { status: 502 },
      );
    }
    const data = (await res.json()) as {
      current?: {
        temperature_2m?: number;
        relative_humidity_2m?: number;
        apparent_temperature?: number;
        precipitation?: number;
        weather_code?: number;
        wind_speed_10m?: number;
        uv_index?: number;
        time?: string;
      };
    };
    const c = data.current;
    if (!c || typeof c.temperature_2m !== "number") {
      return NextResponse.json(
        { error: "Weather data was incomplete." },
        { status: 502 },
      );
    }
    const code = Number(c.weather_code ?? 0);
    const weather: WeatherSnapshot = {
      tempC: Math.round(c.temperature_2m),
      feelsLikeC: Math.round(c.apparent_temperature ?? c.temperature_2m),
      humidity: Math.round(c.relative_humidity_2m ?? 0),
      precipMm: Number(c.precipitation ?? 0),
      windKmh: Math.round(c.wind_speed_10m ?? 0),
      uvIndex: typeof c.uv_index === "number" ? Math.round(c.uv_index) : null,
      weatherCode: code,
      label: weatherCodeLabel(code),
      placeLabel: await reversePlaceLabel(lat, lon),
      fetchedAt: c.time || new Date().toISOString(),
    };
    return NextResponse.json({
      weather,
      precautions: buildPrecautions(weather),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the weather service. Try again." },
      { status: 502 },
    );
  }
}
