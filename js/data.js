const PORTFOLIO_DATA = {
  profile: {
    name: "Aditya Kumar",
    handle: "R3xo666",
    role: "Python developer",
    github: "https://github.com/R3xo666",
    email: "r3xo666.dev@gmail.com"
  },
  projects: [
    {
      repoName: "aegis-phone",
      name: "Aegis Phone",
      summary: "A Bash command-line wrapper for ADB and scrcpy, with screen mirroring, device controls, status checks, and file transfer.",
      language: "Shell",
      tools: ["Linux", "ADB", "scrcpy"],
      workflow: { input: "Android device", output: "Mirror + controls", kind: "phone" }
    },
    {
      repoName: "shopify-sentinel-restock-daemon",
      name: "Shopify Sentinel",
      summary: "Polls public Shopify product variants, compares availability and prices with saved SQLite state, then sends Discord alerts.",
      language: "Python",
      tools: ["AsyncIO", "SQLite", "Discord"],
      workflow: { input: "Shopify variants", output: "Discord alerts", kind: "stock" }
    },
    {
      repoName: "bookstore-catalog-scraper",
      name: "BookPulse",
      summary: "Scrapes books.toscrape.com across catalogue pages, validates each record, and exports CSV or Excel files.",
      language: "Python",
      tools: ["BeautifulSoup", "Pydantic", "openpyxl"],
      workflow: { input: "Book listings", output: "CSV / Excel", kind: "book" }
    },
    {
      repoName: "crypto-telegram-threshold-monitor",
      name: "SentinelPulse",
      summary: "Checks configured price thresholds with Binance and a CoinGecko fallback, then sends Telegram alerts. It does not place trades.",
      language: "Python",
      tools: ["AsyncIO", "Pydantic", "Telegram"],
      workflow: { input: "Price thresholds", output: "Telegram alerts", kind: "signal" }
    },
    {
      repoName: "batch-invoice-pdf-extractor",
      name: "DocuParse",
      summary: "Reads invoice fields from text-based PDFs into Excel and flags incomplete records for review. Scanned PDFs are identified; OCR is not included.",
      language: "Python",
      tools: ["pdfplumber", "openpyxl"],
      workflow: { input: "Invoice PDFs", output: "Excel + review flags", kind: "document" }
    }
  ],
  skills: [
    { category: "Languages", items: ["Python", "Bash", "JavaScript"] },
    { category: "Data", items: ["pdfplumber", "BeautifulSoup", "openpyxl", "Pydantic"] },
    { category: "Tools & runtime", items: ["Linux", "AsyncIO", "SQLite", "Git", "Docker", "Pytest"] }
  ]
};

window.PORTFOLIO_DATA = PORTFOLIO_DATA;
