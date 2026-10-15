export type NearbyPlace = {
  id: string;
  name: string;
  kind: "hospital" | "clinic" | "doctors" | "other";
  lat: number;
  lon: number;
  distanceKm: number;
  address?: string;
  mapsUrl: string;
};

export type NearbyCareResult =
  | { ok: true; places: NearbyPlace[]; coords: { lat: number; lon: number } }
  | { ok: false; error: string };

export function getCurrentPosition(
  timeoutMs = 15000,
): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Location is not available in this browser."));
      return;
    }
    // Geolocation requires a secure context (HTTPS or localhost).
    if (
      typeof window !== "undefined" &&
      !window.isSecureContext &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      reject(
        new Error(
          "Location needs HTTPS (or localhost). Open the app via https:// or http://localhost.",
        ),
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(
            new Error(
              "Location permission was denied. Allow location for this site and try again.",
            ),
          );
        } else if (err.code === err.TIMEOUT) {
          reject(new Error("Location request timed out. Try again."));
        } else {
          reject(new Error("Could not read your location."));
        }
      },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 120_000 },
    );
  });
}

function friendlyFetchError(err: unknown, fallback: string): string {
  if (
    err instanceof Error &&
    /failed to fetch|networkerror|load failed/i.test(err.message)
  ) {
    return "Could not reach Aai’s map helper. Check your connection and try again.";
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

/** Browser: geolocation + same-origin API (avoids CORS with Overpass). */
export async function findNearbyCare(): Promise<NearbyCareResult> {
  try {
    const coords = await getCurrentPosition();
    const res = await fetch(
      `/api/nearby-care?lat=${encodeURIComponent(String(coords.lat))}&lon=${encodeURIComponent(String(coords.lon))}`,
    );
    const data = (await res.json()) as {
      places?: NearbyPlace[];
      error?: string;
    };
    if (!res.ok) {
      return {
        ok: false,
        error: data.error || "Nearby care lookup failed. Try again in a moment.",
      };
    }
    return { ok: true, places: data.places || [], coords };
  } catch (err) {
    return {
      ok: false,
      error: friendlyFetchError(err, "Could not find nearby care right now."),
    };
  }
}
