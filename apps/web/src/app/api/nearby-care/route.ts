import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 45;

type NearbyPlace = {
  id: string;
  name: string;
  kind: "hospital" | "clinic" | "doctors" | "other";
  lat: number;
  lon: number;
  distanceKm: number;
  address?: string;
  mapsUrl: string;
};

const OVERPASS_ENDPOINTS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function classify(tags: Record<string, string> | undefined): NearbyPlace["kind"] {
  const amenity = tags?.amenity || "";
  const healthcare = tags?.healthcare || "";
  if (amenity === "hospital" || healthcare === "hospital") return "hospital";
  if (amenity === "clinic" || healthcare === "clinic") return "clinic";
  if (amenity === "doctors" || healthcare === "doctor") return "doctors";
  return "other";
}

function readCoords(el: {
  type: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
}): { lat: number; lon: number } | null {
  if (typeof el.lat === "number" && typeof el.lon === "number") {
    return { lat: el.lat, lon: el.lon };
  }
  if (el.center && typeof el.center.lat === "number") {
    return { lat: el.center.lat, lon: el.center.lon };
  }
  return null;
}

async function queryOverpass(query: string): Promise<Response> {
  let lastError: unknown;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "application/json",
          "User-Agent": "AaiHealthEducation/1.0 (hackathon; contact@localhost)",
        },
        body: `data=${encodeURIComponent(query)}`,
      });
      if (res.ok) return res;
      lastError = new Error(`Overpass ${res.status}`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Nearby care lookup failed.");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const radiusM = Math.min(
    Math.max(Number(searchParams.get("radius") || 6000), 1000),
    15000,
  );

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json(
      { error: "Please share a valid location." },
      { status: 400 },
    );
  }

  const query = `
[out:json][timeout:25];
(
  node["amenity"="hospital"](around:${radiusM},${lat},${lon});
  node["amenity"="clinic"](around:${radiusM},${lat},${lon});
  node["amenity"="doctors"](around:${radiusM},${lat},${lon});
  node["healthcare"="hospital"](around:${radiusM},${lat},${lon});
  node["healthcare"="clinic"](around:${radiusM},${lat},${lon});
  way["amenity"="hospital"](around:${radiusM},${lat},${lon});
  way["amenity"="clinic"](around:${radiusM},${lat},${lon});
  way["healthcare"="hospital"](around:${radiusM},${lat},${lon});
);
out center 20;
`.trim();

  try {
    let places: NearbyPlace[] = [];
    try {
      const res = await queryOverpass(query);
      const data = (await res.json()) as {
        elements?: Array<{
          id: number;
          type: string;
          lat?: number;
          lon?: number;
          center?: { lat: number; lon: number };
          tags?: Record<string, string>;
        }>;
      };

      const seen = new Set<string>();
      for (const el of data.elements || []) {
        const coords = readCoords(el);
        if (!coords) continue;
        const name = (el.tags?.name || "").trim();
        if (!name) continue;
        const key = `${name.toLowerCase()}|${coords.lat.toFixed(4)}|${coords.lon.toFixed(4)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const distanceKm = haversineKm(lat, lon, coords.lat, coords.lon);
        const address = [
          el.tags?.["addr:full"],
          el.tags?.["addr:street"],
          el.tags?.["addr:city"],
        ]
          .filter(Boolean)
          .join(", ");
        places.push({
          id: `${el.type}-${el.id}`,
          name,
          kind: classify(el.tags),
          lat: coords.lat,
          lon: coords.lon,
          distanceKm,
          address: address || undefined,
          mapsUrl: `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}#map=17/${coords.lat}/${coords.lon}`,
        });
      }
    } catch {
      places = await nominatimNearby(lat, lon, radiusM);
    }

    if (places.length === 0) {
      places = await nominatimNearby(lat, lon, radiusM);
    }

    places.sort((a, b) => a.distanceKm - b.distanceKm);
    return NextResponse.json({ places: places.slice(0, 8) });
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not reach the map service. Check your connection and try again.",
      },
      { status: 502 },
    );
  }
}

async function nominatimNearby(
  lat: number,
  lon: number,
  radiusM: number,
): Promise<NearbyPlace[]> {
  const radiusKm = Math.max(radiusM / 1000, 1);
  const queries = ["hospital", "clinic"];
  const places: NearbyPlace[] = [];
  const seen = new Set<string>();

  for (const q of queries) {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&limit=8&viewbox=${lon - 0.08},${lat + 0.08},${lon + 0.08},${lat - 0.08}&bounded=1`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "AaiHealthEducation/1.0 (hackathon; contact@localhost)",
      },
    });
    if (!res.ok) continue;
    const rows = (await res.json()) as Array<{
      place_id: number;
      display_name: string;
      name?: string;
      lat: string;
      lon: string;
      type?: string;
      class?: string;
    }>;
    for (const row of rows) {
      const plat = Number(row.lat);
      const plon = Number(row.lon);
      if (!Number.isFinite(plat) || !Number.isFinite(plon)) continue;
      const distanceKm = haversineKm(lat, lon, plat, plon);
      if (distanceKm > radiusKm + 2) continue;
      const name = (row.name || row.display_name.split(",")[0] || "").trim();
      if (!name) continue;
      const key = `${name.toLowerCase()}|${plat.toFixed(4)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const kind =
        row.type === "hospital" || q === "hospital"
          ? "hospital"
          : row.type === "clinic" || q === "clinic"
            ? "clinic"
            : "other";
      places.push({
        id: `nominatim-${row.place_id}`,
        name,
        kind,
        lat: plat,
        lon: plon,
        distanceKm,
        address: row.display_name,
        mapsUrl: `https://www.openstreetmap.org/?mlat=${plat}&mlon=${plon}#map=17/${plat}/${plon}`,
      });
    }
  }
  return places;
}
