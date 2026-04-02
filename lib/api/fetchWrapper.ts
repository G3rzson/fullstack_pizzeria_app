let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshResponse = await fetch("/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshResponse.ok) {
        return false;
      }

      const data = await refreshResponse.json();
      return !!data.user;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function fetchWithAuth(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // Ha 401, próbálj token refresh-t
  if (response.status === 401) {
    const refreshSuccess = await refreshAccessToken();

    if (!refreshSuccess) {
      // Refresh sikertelen, térj vissza az eredeti 401-es válasszal
      return response;
    }

    // Token refresh sikeres, retry az eredeti request
    const retryResponse = await fetch(url, {
      ...options,
      credentials: "include",
    });

    return retryResponse;
  }

  return response;
}
