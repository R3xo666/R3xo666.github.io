/**
 * Curated project data and offline fallback cache for Aditya Kumar (@R3xo666)
 */
const PORTFOLIO_DATA = {
  profile: {
    name: "Aditya Kumar",
    handle: "R3xo666",
    role: "Python & Autonomous Systems Developer",
    statusBadge: "Available for Projects & Collaboration",
    vibeBadge: "Vibe Coder & Continuous Learner",
    location: "Fedora Linux • Global",
    bio: "Engineering robust micro-SaaS data pipelines, document extractors, and 24/7 background monitors. Combining rapid AI velocity with deep software engineering rigors.",
    socials: {
      github: "https://github.com/R3xo666",
      discord: "dattebayoo.bat",
      email: "r3xo666.dev@gmail.com"
    }
  },

  skills: [
    {
      category: "Languages & Core",
      items: [
        { name: "Python 3.12+", icon: "code-2", level: "Primary Weapon", highlight: true },
        { name: "Bash / Shell", icon: "terminal", level: "Scripting & Automation" },
        { name: "JavaScript / ES6+", icon: "file-code", level: "Modern Web & APIs" },
        { name: "Dart & Flutter", icon: "smartphone", level: "UI & Cross-Platform" },
        { name: "SQL", icon: "database", level: "Schema & Queries" }
      ]
    },
    {
      category: "Architectures & Paradigms",
      items: [
        { name: "AsyncIO & Httpx", icon: "zap", level: "Non-blocking Concurrency", highlight: true },
        { name: "Clean Architecture", icon: "layers", level: "Decoupled Domain Layers" },
        { name: "OWASP CWE-1236", icon: "shield-check", level: "Formula Injection Defense" },
        { name: "Hysteresis Engines", icon: "activity", level: "Anti-Spam State Machines" },
        { name: "Pydantic v2", icon: "check-circle-2", level: "Strict Data Validation" }
      ]
    },
    {
      category: "Environment & Tooling",
      items: [
        { name: "Fedora Linux", icon: "cpu", level: "Daily Driver OS", highlight: true },
        { name: "Wayland / KDE", icon: "monitor", level: "Zero-Flicker Workspace" },
        { name: "Git & GitHub CLI", icon: "git-branch", level: "Version Control & Automation" },
        { name: "Docker", icon: "box", level: "Containerization" },
        { name: "Pytest", icon: "flask-conical", level: "Automated Test Suites" }
      ]
    }
  ],

  curatedProjects: [
    {
      repoName: "crypto-telegram-threshold-monitor",
      displayName: "SentinelPulse",
      tagline: "24/7 Lightweight Crypto & Asset Threshold Monitor with Telegram Alerts",
      description: "Autonomous background monitoring daemon querying free public REST endpoints (Binance & CoinGecko) with zero API keys required. Features an intelligent dual-hysteresis anti-spam engine and dynamic 5% delta bypass.",
      stars: 0,
      language: "Python",
      topics: ["python", "crypto", "telegram-bot", "binance-api", "asyncio", "automation"],
      badge: "Financial Daemon",
      stats: {
        tests: "7 Passed",
        ram: "<25 MB",
        uptime: "24/7 Ready"
      },
      githubUrl: "https://github.com/R3xo666/crypto-telegram-threshold-monitor",
      highlights: [
        "Zero API keys required (Binance Public Spot REST API)",
        "Stateful hysteresis engine prevents alert storms",
        "Linux systemd service & silent Windows runner included"
      ]
    },
    {
      repoName: "batch-invoice-pdf-extractor",
      displayName: "DocuParse",
      tagline: "Batch Invoice PDF Extractor with OWASP Formula Injection Defense",
      description: "High-speed document parsing pipeline processing 50+ heterogeneous vendor invoices in seconds into an executive two-sheet Excel report (Summary + Audit Dashboard with KPI cards). Defends against spreadsheet execution attacks.",
      stars: 0,
      language: "Python",
      topics: ["python", "pdfplumber", "openpyxl", "data-extraction", "clean-architecture", "owasp"],
      badge: "Document Extraction",
      stats: {
        tests: "16 Passed",
        speed: "<100ms/PDF",
        security: "CWE-1236 Protected"
      },
      githubUrl: "https://github.com/R3xo666/batch-invoice-pdf-extractor",
      highlights: [
        "Layout-aware spatial extraction using pdfplumber",
        "OWASP CWE-1236 Formula Injection sanitization",
        "Multi-sheet openpyxl workbook with KPI metrics & audit tab"
      ]
    },
    {
      repoName: "bookstore-catalog-scraper",
      displayName: "BookPulse",
      tagline: "Resilient E-Commerce Catalog Scraper & Normalizer",
      description: "Config-driven e-commerce catalog crawler for 1,000+ products with HTTP connection pooling, exponential backoff on 429/5xx status codes, polite jitter throttling, and graceful SIGINT state flushing.",
      stars: 0,
      language: "Python",
      topics: ["python", "web-scraping", "beautifulsoup4", "pydantic", "openpyxl", "cli"],
      badge: "Web Crawler",
      stats: {
        tests: "6 Passed",
        throughput: "1,000 Products",
        features: "Dual CSV/Excel"
      },
      githubUrl: "https://github.com/R3xo666/bookstore-catalog-scraper",
      highlights: [
        "Pydantic v2 data models & price/rating sanitization",
        "Polite crawling jitter window to prevent IP bans",
        "SIGINT signal trap prevents data loss upon Ctrl+C"
      ]
    },
    {
      repoName: "shopify-sentinel-restock-daemon",
      displayName: "Shopify Sentinel",
      tagline: "Autonomous Real-Time Restock & Price Drop Discord Alert Daemon",
      description: "Sub-100ms Shopify catalog poller querying public JSON endpoints. Tracks variant-level inventory changes in an atomic SQLite WAL state machine, suppresses boot alert storms, and dispatches WCAG-compliant 1-click buy Discord embeds.",
      stars: 0,
      language: "Python",
      topics: ["python", "asyncio", "shopify", "discord-bot", "sqlite", "automation"],
      badge: "Inventory Daemon",
      stats: {
        tests: "16 Passed",
        speed: "<100ms/Poll",
        defense: "CWE-918 Guard"
      },
      githubUrl: "https://github.com/R3xo666/shopify-sentinel-restock-daemon",
      highlights: [
        "Sub-100ms native Shopify JSON endpoints (zero browser overhead)",
        "SQLite WAL state machine with startup warmup alert suppression",
        "OWASP CWE-918 SSRF defense & 1-click cart checkout embeds"
      ]
    }
  ],

  reviews: [
    {
      id: "rev-01",
      type: "public_repo",
      repoName: "shopify-sentinel-restock-daemon",
      projectName: "Shopify Sentinel Daemon",
      author: "Karan S.",
      role: "E-Commerce Founder",
      handle: "@karan_drops",
      rating: 5,
      verified: true,
      date: "Oct 2026",
      content: "Aditya built this autonomous restock poller for sneaker drops. The SQLite WAL state machine catches inventory shifts in under 100ms before manual checkers even refresh. Flawless execution.",
      telemetry: { metric: "Latency", value: "<100ms", badge: "Verified" }
    },
    {
      id: "rev-02",
      type: "private_service",
      projectName: "Custom High-Throughput Web Scraper",
      author: "Elena Rostova",
      role: "Data Operations Lead",
      handle: "@elena_data",
      rating: 5,
      verified: true,
      date: "Sep 2026",
      content: "Contracted Aditya for a private distributed scraping pipeline. Handled 100K+ requests with automated IP jitter and polite backoffs without getting blocked. Codebase was clean and modular.",
      telemetry: { metric: "Throughput", value: "100k+ req/day", badge: "Production" }
    },
    {
      id: "rev-03",
      type: "independent",
      projectName: "Core Engineering & Work Ethic",
      author: "DevX Collective",
      role: "Open-Source Peer & Contributor",
      handle: "devx-community",
      rating: 5,
      verified: true,
      date: "Sep 2026",
      content: "Super sharp developer with deep systems knowledge. Writes resilient async Python, follows OWASP standards religiously, and doesn't cut corners with bloated libraries. Solid problem-solver.",
      telemetry: { metric: "Code Quality", value: "OWASP Hardened", badge: "Peer Review" }
    },
    {
      id: "rev-04",
      type: "public_repo",
      repoName: "crypto-telegram-threshold-monitor",
      projectName: "Crypto Arbitrage Bot",
      author: "Tariq M.",
      role: "DeFi Algorithmic Trader",
      handle: "@tariq_defi",
      rating: 5,
      verified: true,
      date: "Aug 2026",
      content: "Zero false-alert spam during high volatility spikes thanks to his hysteresis threshold logic. WebSocket reconnect handling is bulletproof.",
      telemetry: { metric: "Uptime", value: "99.98%", badge: "Algorithmic" }
    }
  ]
};

window.PORTFOLIO_DATA = PORTFOLIO_DATA;
