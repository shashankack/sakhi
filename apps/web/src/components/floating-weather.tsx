"use client";

import { useEffect, useRef, useState } from "react";
import {
  Cloud,
  CloudRain,
  Droplets,
  Loader2,
  MapPin,
  Sun,
  Wind,
  X,
} from "lucide-react";
import {
  loadLocalWeather,
  type WeatherPrecaution,
  type WeatherSnapshot,
} from "@/lib/weather";

function WeatherIcon({ code, size = 16 }: { code: number; size?: number }) {
  if (code >= 61 || (code >= 80 && code <= 99)) {
    return <CloudRain aria-hidden="true" size={size} />;
  }
  if (code === 0 || code === 1) return <Sun aria-hidden="true" size={size} />;
  return <Cloud aria-hidden="true" size={size} />;
}

export function FloatingWeather() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [precautions, setPrecautions] = useState<WeatherPrecaution[]>([]);
  const [error, setError] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  async function load() {
    setLoading(true);
    setError("");
    const result = await loadLocalWeather();
    setLoading(false);
    if (!result.ok) {
      setWeather(null);
      setPrecautions([]);
      setError(result.error);
      setOpen(true);
      return;
    }
    setWeather(result.weather);
    setPrecautions(result.precautions);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      className={`nav-weather${open ? " is-open" : ""}`}
      ref={rootRef}
    >
      <button
        type="button"
        className="nav-weather-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Live weather"
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          if (weather) setOpen(true);
          else void load();
        }}
      >
        {loading ? (
          <Loader2 aria-hidden="true" className="nearby-spin" size={15} />
        ) : weather ? (
          <>
            <WeatherIcon code={weather.weatherCode} size={15} />
            <span className="nav-weather-temp">{weather.tempC}°</span>
            <span className="nav-weather-label">{weather.label}</span>
          </>
        ) : (
          <>
            <MapPin aria-hidden="true" size={14} />
            <span className="nav-weather-label">Weather</span>
          </>
        )}
      </button>

      {open ? (
        <section
          className="nav-weather-panel"
          aria-label="Live local weather and precautions"
        >
          <header className="nav-weather-panel-head">
            <div>
              <p className="nav-weather-kicker">Live near you</p>
              <p className="nav-weather-place">
                {weather?.placeLabel || "Your area"}
              </p>
            </div>
            <div className="nav-weather-panel-actions">
              <button
                type="button"
                className="nav-weather-icon-btn"
                onClick={() => void load()}
                disabled={loading}
                aria-label="Refresh weather"
              >
                {loading ? (
                  <Loader2 aria-hidden="true" className="nearby-spin" size={14} />
                ) : (
                  <MapPin aria-hidden="true" size={14} />
                )}
              </button>
              <button
                type="button"
                className="nav-weather-icon-btn"
                onClick={() => setOpen(false)}
                aria-label="Close weather"
              >
                <X aria-hidden="true" size={14} />
              </button>
            </div>
          </header>

          {error ? (
            <p className="nav-weather-error" role="alert">
              {error}
            </p>
          ) : null}

          {weather ? (
            <>
              <div className="nav-weather-now">
                <span className="nav-weather-icon" aria-hidden="true">
                  <WeatherIcon code={weather.weatherCode} size={20} />
                </span>
                <div>
                  <p className="nav-weather-now-temp">{weather.tempC}°C</p>
                  <p className="nav-weather-meta">
                    {weather.label} · feels {weather.feelsLikeC}°C
                  </p>
                </div>
              </div>

              <dl className="nav-weather-metrics">
                <div>
                  <dt>
                    <Droplets aria-hidden="true" size={12} /> Humidity
                  </dt>
                  <dd>{weather.humidity}%</dd>
                </div>
                <div>
                  <dt>
                    <Wind aria-hidden="true" size={12} /> Wind
                  </dt>
                  <dd>{weather.windKmh} km/h</dd>
                </div>
                {weather.uvIndex != null ? (
                  <div>
                    <dt>
                      <Sun aria-hidden="true" size={12} /> UV
                    </dt>
                    <dd>{weather.uvIndex}</dd>
                  </div>
                ) : null}
              </dl>

              <ul className="nav-weather-tips">
                {precautions.slice(0, 3).map((tip) => (
                  <li key={tip.id}>
                    <strong>{tip.title}</strong>
                    <span>{tip.detail}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="nav-weather-empty">
              <p>Allow location for live conditions and comfort tips.</p>
              <button
                type="button"
                className="nav-weather-cta"
                disabled={loading}
                onClick={() => void load()}
              >
                {loading ? "Loading…" : "Use my location"}
              </button>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
