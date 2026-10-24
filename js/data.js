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
      summary: "A Linux tool built around ADB and scrcpy for mirroring and controlling an Android device.",
      language: "Shell",
      tools: ["Linux", "ADB", "scrcpy"]
    },
    {
      repoName: "shopify-sentinel-restock-daemon",
      name: "Shopify Sentinel",
      summary: "A Python service that watches Shopify product availability and sends Discord alerts when stock changes.",
      language: "Python",
      tools: ["AsyncIO", "SQLite", "Discord"]
    },
    {
      repoName: "bookstore-catalog-scraper",
      name: "BookPulse",
      summary: "A Python crawler that collects bookstore catalogue data and exports it to CSV or Excel.",
      language: "Python",
      tools: ["BeautifulSoup", "Pydantic", "openpyxl"]
    },
    {
      repoName: "crypto-telegram-threshold-monitor",
      name: "SentinelPulse",
      summary: "A self-hosted Python monitor that checks asset price thresholds and sends Telegram alerts.",
      language: "Python",
      tools: ["AsyncIO", "Pydantic", "Telegram"]
    },
    {
      repoName: "batch-invoice-pdf-extractor",
      name: "DocuParse",
      summary: "A command-line tool that extracts invoice details from PDFs and writes the results to Excel.",
      language: "Python",
      tools: ["pdfplumber", "openpyxl", "Python"]
    }
  ],
  skills: [
    { category: "Languages", items: ["Python", "Bash", "JavaScript"] },
    { category: "Data", items: ["pdfplumber", "BeautifulSoup", "openpyxl", "Pydantic"] },
    { category: "Tools & runtime", items: ["Linux", "AsyncIO", "SQLite", "Git", "Docker", "Pytest"] }
  ]
};

window.PORTFOLIO_DATA = PORTFOLIO_DATA;
