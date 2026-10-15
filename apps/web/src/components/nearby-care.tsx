"use client";

import { useState } from "react";
import { Hospital, Loader2, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  findNearbyCare,
  type NearbyPlace,
} from "@/lib/nearbyCare";

function kindLabel(kind: NearbyPlace["kind"]) {
  if (kind === "hospital") return "Hospital";
  if (kind === "clinic") return "Clinic";
  if (kind === "doctors") return "Doctor";
  return "Care";
}

function formatKm(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

type Props = {
  /** Auto-emphasize for urgent red-flag replies */
  emphasize?: boolean;
  className?: string;
};

export function NearbyCarePanel({ emphasize = false, className = "" }: Props) {
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<NearbyPlace[] | null>(null);
  const [error, setError] = useState("");

  async function loadNearby() {
    setLoading(true);
    setError("");
    const result = await findNearbyCare();
    setLoading(false);
    if (!result.ok) {
      setPlaces(null);
      setError(result.error);
      return;
    }
    if (result.places.length === 0) {
      setPlaces([]);
      setError("No hospitals or clinics found within about 6 km.");
      return;
    }
    setPlaces(result.places);
  }

  return (
    <section
      className={`nearby-panel${emphasize ? " nearby-panel-urgent" : ""} ${className}`.trim()}
      aria-label="Nearby hospitals and clinics"
    >
      <header className="nearby-head">
        <div className="section-label">
          <Hospital aria-hidden="true" size={15} />
          Nearby hospitals &amp; clinics
        </div>
        {!places?.length ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="nearby-find-button"
            disabled={loading}
            onClick={loadNearby}
          >
            {loading ? (
              <>
                <Loader2 aria-hidden="true" className="nearby-spin" size={14} />
                Finding…
              </>
            ) : (
              <>
                <MapPin aria-hidden="true" size={14} />
                Use my location
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="nearby-find-button"
            disabled={loading}
            onClick={loadNearby}
          >
            Refresh
          </Button>
        )}
      </header>

      <p className="nearby-note">
        Location stays on your device. Results come from OpenStreetMap and are
        suggestions only  not an emergency dispatcher.
      </p>

      {emphasize ? (
        <p className="nearby-emergency">
          If this feels like an emergency in India, dial{" "}
          <strong>108</strong> (ambulance) or go to the nearest ER now.
        </p>
      ) : null}

      {error ? (
        <p className="nearby-error" role="alert">
          {error}
        </p>
      ) : null}

      {places && places.length > 0 ? (
        <ul className="nearby-list">
          {places.map((place) => (
            <li key={place.id}>
              <div className="nearby-item-main">
                <span className="nearby-kind">{kindLabel(place.kind)}</span>
                <strong>{place.name}</strong>
                {place.address ? (
                  <span className="nearby-address">{place.address}</span>
                ) : null}
              </div>
              <div className="nearby-item-meta">
                <span>{formatKm(place.distanceKm)}</span>
                <a
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nearby-maps-link"
                >
                  <Navigation aria-hidden="true" size={13} />
                  Map
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
