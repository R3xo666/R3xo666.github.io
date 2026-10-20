/**
 * Resilient GitHub REST API v3 Client with localStorage cache
 */
class GitHubApiClient {
  constructor(username = "R3xo666") {
    this.username = username;
    this.cacheKey = `gh_cache_${username}`;
    this.cacheTtlMs = 10 * 60 * 1000; // 10 minutes (responsive to newly pushed repositories)
  }

  async fetchRepositories() {
    // Check if user requested a fresh sync via query parameter (?refresh=1 or ?bust=1)
    const urlParams = new URLSearchParams(window.location.search);
    const forceRefresh = urlParams.has("refresh") || urlParams.has("bust");

    // 1. Try Cache First (if not forced)
    if (!forceRefresh) {
      const cached = this.getCache();
      if (cached) {
        console.log("[GitHubApiClient] Serving from local cache");
        return cached;
      }
    } else {
      this.clearCache();
      console.log("[GitHubApiClient] Cache invalidated via refresh request");
    }

    // 2. Fetch from GitHub REST API
    try {
      const url = `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=30`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API HTTP ${response.status}: ${response.statusText}`);
      }

      const repos = await response.json();
      this.setCache(repos);
      return repos;
    } catch (error) {
      console.warn("[GitHubApiClient] API fetch failed, using fallback curated data:", error.message);
      return null;
    }
  }

  getCache() {
    try {
      const item = localStorage.getItem(this.cacheKey);
      if (!item) return null;
      const data = JSON.parse(item);
      if (Date.now() - data.timestamp > this.cacheTtlMs) {
        localStorage.removeItem(this.cacheKey);
        return null;
      }
      return data.repos;
    } catch (e) {
      return null;
    }
  }

  setCache(repos) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify({
        timestamp: Date.now(),
        repos: repos
      }));
    } catch (e) {
      console.warn("[GitHubApiClient] Could not cache to localStorage", e);
    }
  }

  clearCache() {
    try {
      localStorage.removeItem(this.cacheKey);
    } catch (_) {}
  }
}

window.GitHubApiClient = GitHubApiClient;
