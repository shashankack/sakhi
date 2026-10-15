const url = process.env.API_HEALTH_URL || "http://127.0.0.1:3001/health";
try {
  const res = await fetch(url);
  const body = await res.text();
  console.log(res.status, body);
  process.exit(res.ok ? 0 : 1);
} catch (err) {
  console.error("API not reachable:", err.message);
  process.exit(1);
}
