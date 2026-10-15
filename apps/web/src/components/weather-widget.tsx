"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudRain,
  Droplets,
  Loader2,
  MapPin,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  loadLocalWeather,
  type WeatherPrecaution,
  type WeatherSnapshot,
} from "@/lib/weather";

function WeatherIcon({ code }: { code: number }) {
  if (code >= 61 || (code >= 80 && code <= 99)) {
    return <CloudRain aria-hidden="true" size={22} />;
  }
  if (code === 0 || code === 1) return <Sun aria-hidden="true" size={22} />;
  return <Cloud aria-hidden="true" size={22} />;
}

type Props = {
  /** Auto-fetch on mount when location was previously allowed */
  autoLoad?: boolean;
  compact?: boolean;
  className?: string;
};

export function WeatherWidget({
  autoLoad = false,
  compact = false,
  className = "",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [precautions, setPrecautions] = useState<WeatherPrecaution[]>([]);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    const result = await loadLocalWeather();
    setLoading(false);
    if (!result.ok) {
      setWeather(null);
      setPrecautions([]);
      setError(result.error);
      return;
    }
    setWeather(result.weather);
    setPrecautions(result.precautions);
  }

  useEffect(() => {
    if (autoLoad) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad]);

  return (
    <section
      className={`weather-widget${compact ? " weather-widget-compact" : ""} ${className}`.trim()}
      aria-label="Live local weather and precautions"
    >
      <header className="weather-head">
        <div className="section-label">
          <Thermometer aria-hidden="true" size={15} />
          Live weather &amp; precautions
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="weather-load-button"
          disabled={loading}
          onClick={load}
        >
          {loading ? (
            <>
              <Loader2 aria-hidden="true" className="nearby-spin" size={14} />
              Updating…
            </>
          ) : weather ? (
            "Refresh"
          ) : (
            <>
              <MapPin aria-hidden="true" size={14} />
              Use my location
            </>
          )}
        </Button>
      </header>

      <p className="weather-note">
        Uses your device location with Open-Meteo. Tips are general comfort
        guidance  not medical advice.
      </p>

      {error ? (
        <p className="weather-error" role="alert">
          {error}
        </p>
      ) : null}

      {weather ? (
        <>
          <div className="weather-now">
            <div className="weather-now-main">
              <span className="weather-icon" aria-hidden="true">
                <WeatherIcon code={weather.weatherCode} />
              </span>
              <div>
                <p className="weather-place">{weather.placeLabel}</p>
                <p className="weather-temp">
                  {weather.tempC}°C{" "}
                  <span>
                    {weather.label} · feels {weather.feelsLikeC}°C
                  </span>
                </p>
              </div>
            </div>
            <dl className="weather-metrics">
              <div>
                <dt>
                  <Droplets aria-hidden="true" size={13} /> Humidity
                </dt>
                <dd>{weather.humidity}%</dd>
              </div>
              <div>
                <dt>
                  <Wind aria-hidden="true" size={13} /> Wind
                </dt>
                <dd>{weather.windKmh} km/h</dd>
              </div>
              {weather.uvIndex != null ? (
                <div>
                  <dt>
                    <Sun aria-hidden="true" size={13} /> UV
                  </dt>
                  <dd>{weather.uvIndex}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <ul className="weather-precautions">
            {precautions.map((tip) => (
              <li key={tip.id}>
                <strong>{tip.title}</strong>
                <span>{tip.detail}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
