export interface YahooAdsCredentials {
  accessToken: string;
  accountId: string;
  channel: "search" | "display";
}

const STORAGE_KEY = "mos-yahoo-ads";

export function loadYahooCredentials(): YahooAdsCredentials | undefined {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return undefined;
    }
    const parsed = JSON.parse(raw) as YahooAdsCredentials;
    if (!parsed.accessToken?.trim() || !parsed.accountId?.trim()) {
      return undefined;
    }
    return {
      accessToken: parsed.accessToken.trim(),
      accountId: parsed.accountId.trim(),
      channel: parsed.channel === "display" ? "display" : "search",
    };
  } catch {
    return undefined;
  }
}

export function saveYahooCredentials(credentials: YahooAdsCredentials): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

export function yahooCredentialsForRequest(): YahooAdsCredentials | undefined {
  return loadYahooCredentials();
}
