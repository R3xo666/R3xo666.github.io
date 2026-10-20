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

  async fetchApprovedReviews() {
    const reviewsCacheKey = `gh_reviews_cache_${this.username}`;
    const urlParams = new URLSearchParams(window.location.search);
    const forceRefresh = urlParams.has("refresh") || urlParams.has("bust");

    if (!forceRefresh) {
      try {
        const item = localStorage.getItem(reviewsCacheKey);
        if (item) {
          const cached = JSON.parse(item);
          if (Date.now() - cached.timestamp < this.cacheTtlMs) {
            console.log("[GitHubApiClient] Serving approved reviews from cache");
            return cached.reviews;
          }
        }
      } catch (_) {}
    } else {
      try {
        localStorage.removeItem(reviewsCacheKey);
      } catch (_) {}
    }

    try {
      // Query approved review issues from the portfolio repository
      const url = `https://api.github.com/repos/${this.username}/${this.username}.github.io/issues?labels=approved&state=all&per_page=50`;
      const response = await fetch(url, {
        headers: { Accept: "application/vnd.github.v3+json" }
      });

      if (!response.ok) {
        throw new Error(`GitHub API HTTP ${response.status}`);
      }

      const issues = await response.json();
      const parsedReviews = (issues || [])
        .filter((issue) => !issue.pull_request)
        .map((issue) => this.parseReviewIssue(issue))
        .filter(Boolean);

      try {
        localStorage.setItem(reviewsCacheKey, JSON.stringify({
          timestamp: Date.now(),
          reviews: parsedReviews
        }));
      } catch (_) {}

      return parsedReviews;
    } catch (error) {
      console.warn("[GitHubApiClient] Could not fetch approved reviews from GitHub Issues:", error);
      return [];
    }
  }

  parseReviewIssue(issue) {
    if (!issue || !issue.body) return null;
    const body = issue.body;

    const extractField = (pattern, fallback = "") => {
      const match = body.match(pattern);
      return match ? match[1].replace(/\*\*/g, "").trim() : fallback;
    };

    const rawCategory = extractField(/(?:category|type)\*{0,2}:\s*(.+)/i, "independent").toLowerCase();
    const role = extractField(/(?:role\s*\/\s*affiliation|role)\*{0,2}:\s*(.+)/i, "Collaborator");
    const metric = extractField(/(?:outcome\s*\/\s*metric|metric)\*{0,2}:\s*(.+)/i, "");
    const repoMatch = body.match(/(?:repo|repository)\*{0,2}:\s*([a-zA-Z0-9_\-]+)/i);
    const repoName = repoMatch ? repoMatch[1].trim() : "";

    const ratingMatch = body.match(/rating\*{0,2}:\s*(\d)/i);
    const rating = ratingMatch ? Math.min(5, Math.max(1, parseInt(ratingMatch[1], 10))) : 5;

    let content = "";
    const endorsementMatch = body.match(/###\s*(?:Detailed\s*)?Endorsement[\r\n]+([\s\S]+?)(?:---|\n###|$)/i);
    if (endorsementMatch) {
      content = endorsementMatch[1].replace(/^[>\s]+/gm, "").trim();
    } else {
      content = body.slice(0, 500).trim();
    }

    if (!content || content.length < 10) return null;

    const author = issue.user?.login || "GitHub User";
    const avatar = issue.user?.avatar_url || `https://github.com/${author}.png`;
    const profileUrl = issue.user?.html_url || `https://github.com/${author}`;

    let type = "independent";
    if (rawCategory.includes("private")) type = "private_service";
    else if (rawCategory.includes("repo") || rawCategory.includes("public") || repoName) type = "public_repo";

    return {
      id: `gh-${issue.id}`,
      issueNumber: issue.number,
      issueUrl: issue.html_url,
      type: type,
      repoName: repoName || undefined,
      projectName: repoName || (type === "private_service" ? "Private Service Contract" : "Independent Developer Review"),
      author: author,
      handle: `@${author}`,
      role: role,
      avatar: avatar,
      profileUrl: profileUrl,
      rating: rating,
      verified: true,
      isGitHubVerified: true,
      date: new Date(issue.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      content: content,
      telemetry: metric
        ? { metric: "Outcome", value: metric, badge: "GitHub Verified" }
        : { metric: "Identity", value: "GitHub Verified", badge: "Live Issue" }
    };
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
      localStorage.removeItem(`gh_reviews_cache_${this.username}`);
    } catch (_) {}
  }
}

window.GitHubApiClient = GitHubApiClient;
