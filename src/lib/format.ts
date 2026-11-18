const usd = (locale: string, options: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0, ...options });

export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) return "Unavailable";
  return usd("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value);
}

export function formatPrice(value: number): string {
  if (!Number.isFinite(value)) return "Unavailable";
  const digits = value >= 1 ? 2 : value >= 0.01 ? 4 : 8;
  return usd("en-US", { minimumFractionDigits: 2, maximumFractionDigits: digits }).format(value);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "Unavailable";
  const sign = value > 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}%`;
}

export function formatTimestamp(value: string): string {
  const time = new Date(value);
  if (Number.isNaN(time.getTime())) return "Unknown time";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC", timeZoneName: "short" }).format(time);
}

export function fearLabel(value: number): string {
  if (value <= 24) return "Extreme fear";
  if (value <= 44) return "Fear";
  if (value <= 55) return "Neutral";
  if (value <= 74) return "Greed";
  return "Extreme greed";
}

export function shortUsd(value: number): string {
  if (!Number.isFinite(value)) return "Unavailable";
  return usd("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value);
}
