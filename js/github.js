class GitHubApiClient {
  constructor(username = "R3xo666") {
    this.username = username;
    this.cacheKey = "portfolio_repositories_" + username;
    this.cacheTtlMs = 10 * 60 * 1000;
  }

  async fetchRepositories() {
    const forceRefresh = new URLSearchParams(window.location.search).has("refresh");
    if (!forceRefresh) {
      const cached = this.getCache();
      if (cached) return cached;
    } else {
      this.clearCache();
    }

    try {
      const response = await fetch(
        "https://api.github.com/users/" + encodeURIComponent(this.username) + "/repos?sort=updated&per_page=30",
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (!response.ok) throw new Error("GitHub returned HTTP " + response.status);
      const repos = await response.json();
      this.setCache(repos);
      return repos;
    } catch (error) {
      console.warn("GitHub repository list unavailable:", error.message);
      return null;
    }
  }

  getCache() {
    try {
      const saved = localStorage.getItem(this.cacheKey);
      if (!saved) return null;
      const cache = JSON.parse(saved);
      if (Date.now() - cache.timestamp > this.cacheTtlMs) {
        localStorage.removeItem(this.cacheKey);
        return null;
      }
      return cache.repos;
    } catch (_) {
      return null;
    }
  }

  setCache(repos) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify({ timestamp: Date.now(), repos }));
    } catch (_) {
      // The page can show its saved project descriptions without browser storage.
    }
  }

  clearCache() {
    try {
      localStorage.removeItem(this.cacheKey);
    } catch (_) {}
  }
}

window.GitHubApiClient = GitHubApiClient;
