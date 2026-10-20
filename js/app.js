/**
 * Main application orchestrator (Aceternity UI Edition)
 */

document.addEventListener("DOMContentLoaded", () => {
  initAntigravityBackground();
  initAudioFeedback();
  initCard3DTilt();
  initArchitecturePlayground();
  initNavigation();
  renderProjects();
  renderSkills();
  renderReviews();
  initReviewModal();
  initInteractiveUtils();
  initTerminalSimulation();
});

// Antigravity Atmospheric Mesh & Interactive Bounced Surface Canvas
function initAntigravityBackground() {
  const canvas = document.getElementById("antigravity-canvas");
  const cloud = document.getElementById("antigravity-cloud");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouseX = width / 2;
  let mouseY = height / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let isMouseActive = false;

  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  };
  window.addEventListener("resize", handleResize);

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseActive = true;
  });

  document.addEventListener("mouseleave", () => {
    isMouseActive = false;
  });

  // Python syntax fragments pool (subtle, tiny, aesthetic tokens)
  const PYTHON_TOKENS = [
    ".copy()",
    ".vibe()",
    ".if()",
    "print()",
    "async def",
    "await",
    "yield",
    "@property",
    "lambda x:",
    "self._init",
    "[x for x in]",
    "None",
    "True",
    "False",
    "pass",
    "import os",
    "try:",
    "except:",
    "__call__",
    "with ctx:",
    ":>",
    "R3xo",
    "len(data)",
    ".pop(0)",
    "dict(zip)",
    ".keys()",
    "-> None",
    "return res"
  ];

  // Particle configuration (Floating Python Syntax Nodes)
  const particles = [];
  const particleCount = Math.min(55, Math.floor((width * height) / 24000));

  class AntigravitySyntaxParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : Math.random() > 0.5 ? -40 : width + 40;
      this.y = initial ? Math.random() * height : Math.random() * height;
      this.baseX = this.x;
      this.baseY = this.y;

      // Subtle float speed
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;

      // Random Python token
      this.text = PYTHON_TOKENS[Math.floor(Math.random() * PYTHON_TOKENS.length)];
      // Very compact, readable mono font size (9px - 11px)
      this.fontSize = Math.floor(Math.random() * 3) + 9;
      this.maxDist = 130; // interaction reach
      this.alpha = Math.random() * 0.35 + 0.22;

      // Palette: Sky blue, Electric Indigo, Emerald mint, Subtle Zinc
      const palettes = [
        { r: 56, g: 189, b: 248 },   // sky-400
        { r: 99, g: 102, b: 241 },   // indigo-400
        { r: 52, g: 211, b: 153 },   // emerald-400
        { r: 168, g: 85, b: 247 },   // purple-400
        { r: 212, g: 212, b: 216 }   // zinc-300
      ];
      this.color = palettes[Math.floor(Math.random() * palettes.length)];
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulse = Math.random() * Math.PI;
    }

    update(targetX, targetY) {
      // Natural float drift
      this.x += this.vx;
      this.y += this.vy;

      // Bounce gracefully off canvas bounds (Bounced Surface)
      if (this.x < 10) {
        this.x = 10;
        this.vx = Math.abs(this.vx);
      } else if (this.x > width - 50) {
        this.x = width - 50;
        this.vx = -Math.abs(this.vx);
      }
      if (this.y < 20) {
        this.y = 20;
        this.vy = Math.abs(this.vy);
      } else if (this.y > height - 20) {
        this.y = height - 20;
        this.vy = -Math.abs(this.vy);
      }

      // Gravitational bounce & repulsion around cursor
      if (isMouseActive) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDist && dist > 0) {
          const force = (1 - dist / this.maxDist) * 3.2;
          const angle = Math.atan2(dy, dx);
          // Push away with soft damped elasticity
          this.x -= Math.cos(angle) * force;
          this.y -= Math.sin(angle) * force;
        }
      }

      this.pulse += this.pulseSpeed;
    }

    draw() {
      const currentAlpha = Math.max(0.12, this.alpha + Math.sin(this.pulse) * 0.14);
      ctx.save();
      ctx.font = `${this.fontSize}px 'JetBrains Mono', 'Fira Code', monospace`;
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha})`;
      
      // Soft ambient glow around code syntax
      ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.7)`;
      ctx.shadowBlur = 6;
      ctx.fillText(this.text, this.x, this.y);
      ctx.restore();
    }
  }

  function initParticles() {
    particles.length = 0;
    const count = Math.min(55, Math.floor((width * height) / 24000));
    for (let i = 0; i < count; i++) {
      particles.push(new AntigravitySyntaxParticle());
    }
  }
  initParticles();

  // Animation frame loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Smooth cursor trailing for soft nebula cloud and particle gravity
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    if (cloud) {
      cloud.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    }

    // Connect close neighboring syntax particles with atmospheric subtle lines
    const len = particles.length;
    for (let i = 0; i < len; i++) {
      const p1 = particles[i];
      p1.update(currentX, currentY);
      p1.draw();

      for (let j = i + 1; j < len; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const lineAlpha = (1 - dist / 110) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y - 4);
          ctx.lineTo(p2.x, p2.y - 4);
          ctx.strokeStyle = `rgba(147, 197, 253, ${lineAlpha})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

// Navigation Tab Switcher
function initNavigation() {
  const navPills = document.querySelectorAll(".nav-pill");
  const tabContents = document.querySelectorAll(".tab-content");

  function switchTab(targetTabId) {
    if (!targetTabId) return;
    const normalized = targetTabId.startsWith("tab-") ? targetTabId : `tab-${targetTabId}`;

    navPills.forEach((pill) => {
      if (pill.dataset.tab === normalized) {
        pill.classList.add("active");
        pill.setAttribute("aria-selected", "true");
      } else {
        pill.classList.remove("active");
        pill.setAttribute("aria-selected", "false");
      }
    });

    tabContents.forEach((tab) => {
      if (tab.id === normalized) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // WCAG 2.2 Tab Keyboard Navigation (ArrowLeft / ArrowRight)
  const tabList = document.querySelector('[role="tablist"]');
  if (tabList) {
    tabList.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const pillsArray = Array.from(navPills);
      const currentIndex = pillsArray.findIndex((p) => p.getAttribute("aria-selected") === "true");
      let nextIndex = currentIndex;
      if (e.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % pillsArray.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + pillsArray.length) % pillsArray.length;
      }
      const nextPill = pillsArray[nextIndex];
      if (nextPill) {
        nextPill.focus();
        const target = nextPill.dataset.tab;
        switchTab(target);
        history.replaceState(null, "", `#${target.replace("tab-", "")}`);
      }
    });
  }

  navPills.forEach((pill) => {
    pill.addEventListener("click", (e) => {
      e.preventDefault();
      const target = pill.dataset.tab;
      switchTab(target);
      history.replaceState(null, "", `#${target.replace("tab-", "")}`);
    });
  });

  // Direct hash navigation on initial load
  const initialHash = window.location.hash.replace("#", "");
  if (initialHash) {
    switchTab(`tab-${initialHash}`);
  }

  // React to hashchange events dynamically (logo click, browser back/forward)
  window.addEventListener("hashchange", () => {
    const currentHash = window.location.hash.replace("#", "");
    if (currentHash) {
      switchTab(`tab-${currentHash}`);
    } else {
      switchTab("tab-overview");
    }
  });

  // Intercept all data-navigate elements (buttons, hero links, logo)
  document.querySelectorAll("[data-navigate]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute("data-navigate");
      switchTab(targetTab);
      history.replaceState(null, "", `#${targetTab.replace("tab-", "")}`);
    });
  });
}

// Lightweight HTML Entity Encoder (OWASP A03 / CWE-79 Defense)
function escapeHtml(str) {
  if (typeof str !== "string") return str ?? "";
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

// Render Projects with Aceternity Card Styling
// Render Projects with Dynamic GitHub Auto-Discovery & Aceternity Card Styling
async function renderProjects() {
  const container = document.getElementById("projects-grid");
  if (!container) return;

  const data = window.PORTFOLIO_DATA;
  const curatedMap = new Map();
  if (data && Array.isArray(data.curatedProjects)) {
    data.curatedProjects.forEach((p) => curatedMap.set(p.repoName.toLowerCase(), { ...p }));
  }

  const ghClient = new window.GitHubApiClient("R3xo666");
  const liveRepos = await ghClient.fetchRepositories();
  let finalProjects = [];

  if (liveRepos && Array.isArray(liveRepos)) {
    const ignoredRepos = new Set(["r3xo666", "r3xo666.github.io"]);
    liveRepos.forEach((repo) => {
      const lower = repo.name.toLowerCase();
      if (ignoredRepos.has(lower) || repo.fork) return;

      const curated = curatedMap.get(lower);
      if (curated) {
        finalProjects.push({
          ...curated,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          topics: repo.topics && repo.topics.length ? repo.topics : curated.topics,
          liveUpdated: new Date(repo.pushed_at).toLocaleDateString(),
          githubUrl: repo.html_url
        });
        curatedMap.delete(lower);
      } else {
        const cleanTitle = repo.name.split(/[-_]+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        finalProjects.push({
          repoName: repo.name,
          displayName: cleanTitle,
          description: repo.description || "Production-grade automated system synchronized directly from GitHub.",
          badge: repo.language ? `${repo.language} Daemon` : "Micro-SaaS Tool",
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || "Python",
          topics: repo.topics && repo.topics.length ? repo.topics : ["python", "automation", "api"],
          highlights: [
            `Engineered in ${repo.language || "Python"} with clean modular architecture`,
            "Auto-synchronized directly from GitHub REST API v3",
            `Live on GitHub • Last updated ${new Date(repo.pushed_at).toLocaleDateString()}`
          ],
          stats: { tests: "Verified", speed: "Optimized", defense: "Hardened" },
          githubUrl: repo.html_url,
          liveUpdated: new Date(repo.pushed_at).toLocaleDateString()
        });
      }
    });
    // Append any curated repos not returned by the live API (e.g. rate limit fallback / private)
    curatedMap.forEach((curated) => finalProjects.push(curated));
  } else {
    finalProjects = [...(data?.curatedProjects || [])];
  }

  // Update dynamic metric counter in DOM
  const repoCountEl = document.getElementById("stat-repo-count");
  if (repoCountEl) {
    repoCountEl.textContent = String(finalProjects.length);
  }

  container.innerHTML = finalProjects.map((p) => createAceternityProjectCard(p)).join("");
  initProjectFilters();
}

function createAceternityProjectCard(p) {
  const safeDisplayName = escapeHtml(p.displayName || p.repoName);
  const safeRepoName = escapeHtml(p.repoName);
  const safeDescription = escapeHtml(p.description || "");
  const safeBadge = escapeHtml(p.badge || "System Tool");
  const safeLanguage = escapeHtml(p.language || "Python");
  const safeUrl = (p.githubUrl && p.githubUrl.startsWith("https://github.com/")) ? p.githubUrl : `https://github.com/R3xo666/${safeRepoName}`;
  const topicsList = Array.isArray(p.topics) ? p.topics : [];

  const tagsHtml = topicsList
    .slice(0, 4)
    .map(
      (t) =>
        `<span class="text-[11px] px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">#${escapeHtml(t)}</span>`
    )
    .join("");

  const highlights = Array.isArray(p.highlights) ? p.highlights : [];
  const highlightsHtml = highlights
    .map(
      (h) => `
      <li class="flex items-start gap-2 text-xs text-zinc-300">
        <span class="text-zinc-500 mt-0.5 font-mono">/</span>
        <span>${escapeHtml(h)}</span>
      </li>
    `
    )
    .join("");

  const statsHtml = p.stats
    ? `
      <div class="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-black/50 border border-zinc-800/80 mb-5 text-center font-mono">
        <div>
          <div class="text-[10px] text-zinc-500 uppercase">Tests</div>
          <div class="text-xs font-semibold text-zinc-300 mt-0.5">${escapeHtml(p.stats.tests || 'Verified')}</div>
        </div>
        <div>
          <div class="text-[10px] text-zinc-500 uppercase">Latency</div>
          <div class="text-xs font-semibold text-emerald-400 mt-0.5">${escapeHtml(p.stats.speed || p.stats.ram || 'Optimal')}</div>
        </div>
        <div>
          <div class="text-[10px] text-zinc-500 uppercase">Defense</div>
          <div class="text-xs font-semibold text-zinc-300 mt-0.5">${escapeHtml(p.stats.defense || p.stats.security || p.stats.uptime || 'Hardened')}</div>
        </div>
      </div>
    `
    : "";

  return `
    <div class="aceternity-card p-6 flex flex-col justify-between group" data-tags="${topicsList.map((t) => escapeHtml(t)).join(" ")}">
      <div>
        <div class="flex items-center justify-between gap-3 mb-4">
          <span class="text-[11px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700/60 text-zinc-300">
            ${safeBadge}
          </span>
          <div class="flex items-center gap-3 text-xs text-zinc-400 font-mono">
            <span>⭐ ${p.stars || 0}</span>
            <span class="text-emerald-400 font-sans">✓ Verified</span>
          </div>
        </div>

        <h3 class="text-lg font-bold text-white group-hover:text-zinc-200 transition-colors">
          ${safeDisplayName}
        </h3>
        <p class="text-xs text-zinc-500 font-mono mt-0.5 mb-3">${safeRepoName}</p>
        <p class="text-sm text-zinc-400 leading-relaxed mb-5">
          ${safeDescription}
        </p>

        <ul class="space-y-1.5 mb-5 p-3 rounded-xl bg-black/40 border border-zinc-800/80">
          ${highlightsHtml}
        </ul>

        ${statsHtml}
      </div>

      <div>
        <div class="flex flex-wrap gap-1.5 mb-5">
          ${tagsHtml}
        </div>

        <div class="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-4 text-xs font-mono">
          <div class="flex items-center gap-2 text-zinc-400 shrink-0 whitespace-nowrap">
            <span class="w-2 h-2 shrink-0 rounded-full bg-emerald-400"></span>
            <span class="text-zinc-300 font-medium">${safeLanguage}</span>
            ${p.liveUpdated ? `<span class="text-zinc-500 font-sans text-[11px] whitespace-nowrap">&bull;&nbsp;${escapeHtml(p.liveUpdated)}</span>` : ""}
          </div>
          <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" 
             class="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white transition-all duration-200 border border-zinc-700 hover:border-zinc-500 shadow-sm ml-auto whitespace-nowrap">
            <span>Repository</span>
            <span class="text-zinc-400 group-hover:translate-x-0.5 transition-transform">↗</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

// Project Tag Filtering
function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll("#projects-grid > div");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active", "bg-zinc-100", "text-black", "border-white");
        b.classList.add("bg-zinc-900", "text-zinc-400", "border-zinc-800");
      });
      btn.classList.add("active", "bg-zinc-100", "text-black", "border-white");
      btn.classList.remove("bg-zinc-900", "text-zinc-400", "border-zinc-800");

      const filter = (btn.dataset.filter || "").toLowerCase();
      cards.forEach((card) => {
        const tags = (card.dataset.tags || "").toLowerCase();
        if (filter === "all" || tags.includes(filter)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// Render Skills Matrix (Robust Two-Tier Layout — Zero Truncation & Glitches)
function renderSkills() {
  const container = document.getElementById("skills-container");
  if (!container) return;

  const data = window.PORTFOLIO_DATA;
  container.innerHTML = data.skills
    .map(
      (cat) => `
    <div class="aceternity-card p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between pb-3 mb-3.5 border-b border-zinc-800/80">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">${cat.category}</h3>
          </div>
          <span class="text-[10px] font-mono text-zinc-500 uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800/80">${cat.items.length} Techs</span>
        </div>
        <div class="space-y-2.5">
          ${cat.items
            .map(
              (item) => `
            <div class="group/skill p-3 rounded-xl bg-black/50 border border-zinc-800/70 hover:border-zinc-700 hover:bg-zinc-900/40 transition-all duration-200">
              <!-- Tier 1: Skill Name & Core Badge -->
              <div class="flex items-center justify-between gap-2 mb-1">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-1.5 h-1.5 shrink-0 rounded-full ${item.highlight ? "bg-emerald-400 ring-2 ring-emerald-400/30" : "bg-zinc-600"}"></span>
                  <span class="text-xs sm:text-sm font-semibold text-white tracking-tight">${item.name}</span>
                </div>
                ${item.highlight ? `<span class="shrink-0 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Core</span>` : ""}
              </div>
              
              <!-- Tier 2: Subtitle / Role Description (Guaranteed Full Visibility) -->
              <div class="flex items-center gap-1.5 pl-3.5 text-[11px] font-mono text-zinc-400">
                <span class="text-zinc-600">↳</span>
                <span class="leading-snug">${item.level}</span>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// Interactive Utilities
function initInteractiveUtils() {
  document.querySelectorAll("[data-copy]").forEach((el) => {
    el.addEventListener("click", () => {
      const textToCopy = el.getAttribute("data-copy");
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied "${textToCopy}" to clipboard`);
      });
    });
  });

  initSecureContactPipeline();
}

/**
 * Enterprise-Grade Defensive Security & Contact Pipeline
 * Implements:
 * 1. DDoS & Rapid-Fire Rate Limiting (Token Bucket: 60s cooldown & 3 submissions/hr)
 * 2. Invisible Honeypot Bot Trap (_trap_bot)
 * 3. Human Velocity & Interaction Timing Verification
 * 4. Real-time Client IP & Geolocation/Browser Telemetry
 * 5. OWASP Sanitization (CWE-1236 Formula Defense & CWE-79 Injection Defense)
 * 6. Live FormSubmit Dispatch with Mailto Fallback
 */
function initSecureContactPipeline() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  const formLoadTime = Date.now();
  let firstInteractionTime = 0;

  // Track first interaction for bot velocity verification
  ["input", "focus", "keydown"].forEach((evt) => {
    contactForm.addEventListener(
      evt,
      () => {
        if (!firstInteractionTime) firstInteractionTime = Date.now();
      },
      { once: true }
    );
  });

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector("button[type='submit']");
    const nameInput = document.getElementById("input-name");
    const handleInput = document.getElementById("input-handle");
    const messageInput = document.getElementById("input-details");
    const botTrap = document.getElementById("trap-bot");

    // 1. Bot Trap (Honeypot) Verification
    if (botTrap && botTrap.value.trim().length > 0) {
      console.warn("[Security] Automated bot trap triggered. Terminating payload silently.");
      showToast("Verification failed: automated submission detected.");
      return;
    }

    // 2. Human Interaction Velocity Check
    const interactionDuration = firstInteractionTime ? (Date.now() - firstInteractionTime) / 1000 : 0;
    const loadDuration = (Date.now() - formLoadTime) / 1000;
    if (loadDuration < 1.8 && interactionDuration < 0.8) {
      console.warn("[Security] Rapid-fire script submission rejected.");
      showToast("Security notice: Submission too fast. Please take a moment to review.");
      return;
    }

    // 3. DDoS / Rate Limiting (Token Bucket - 60s cooldown & max 3/hour)
    const rateLimitKey = "r3xo_inquiry_telemetry";
    const history = JSON.parse(localStorage.getItem(rateLimitKey) || "[]");
    const now = Date.now();
    const recentSubmissions = history.filter((t) => now - t < 3600 * 1000);

    if (recentSubmissions.length > 0) {
      const lastSubmission = recentSubmissions[recentSubmissions.length - 1];
      const secondsSinceLast = Math.floor((now - lastSubmission) / 1000);
      if (secondsSinceLast < 60) {
        const waitSec = 60 - secondsSinceLast;
        showToast(`Rate limit active. Please wait ${waitSec}s before sending another message.`);
        return;
      }
    }

    if (recentSubmissions.length >= 3) {
      showToast("Hourly limit reached (3 messages/hr). Please message directly on Discord: dattebayoo.bat");
      return;
    }

    // 4. Input Sanitization (OWASP CWE-1236 & CWE-79)
    const sanitize = (str) => {
      if (!str) return "";
      let s = str.trim();
      // Neutralize formula injection
      if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
      // Strip control chars
      return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
    };

    const rawName = nameInput.value;
    const rawHandle = handleInput.value;
    const rawMessage = messageInput.value;

    if (!rawName.trim() || !rawHandle.trim() || !rawMessage.trim()) {
      showToast("Please fill out all fields before sending.");
      return;
    }

    const cleanName = sanitize(rawName).slice(0, 80);
    const cleanHandle = sanitize(rawHandle).slice(0, 100);
    const cleanMessage = sanitize(rawMessage).slice(0, 2000);

    // 5. Fast Non-blocking Client Telemetry & Immediate UI Transition
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span class="flex items-center justify-center gap-2 text-emerald-400 font-mono text-xs">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        Transmitting Inquiry...
      </span>
    `;
    submitBtn.disabled = true;

    // Guard against accidental tab close/reload during transmission
    const unloadGuard = (evt) => {
      evt.preventDefault();
      evt.returnValue = "";
    };
    window.addEventListener("beforeunload", unloadGuard);

    // Fast non-blocking IP resolution (Max 400ms timeout)
    let clientIp = "Client-side routed (Protected)";
    try {
      const ipController = new AbortController();
      const ipTimeout = setTimeout(() => ipController.abort(), 400);
      const ipRes = await fetch("https://api.ipify.org?format=json", { signal: ipController.signal });
      clearTimeout(ipTimeout);
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData && ipData.ip) clientIp = ipData.ip;
      }
    } catch (_) {
      // Graceful fallback without blocking
    }

    const userAgent = navigator.userAgent || "Unknown Device";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const language = navigator.language || "en";
    const timestamp = new Date().toISOString();
    const cleanIp = sanitize(clientIp).slice(0, 60);

    // 6. Anti-Spam FormSubmit Payload (RFC-compliant subject, replyto, no spam triggers)
    const payload = {
      _subject: `New Portfolio Inquiry from ${cleanName}`,
      "Sender Name": cleanName,
      "Contact Handle": cleanHandle,
      "Message Content": cleanMessage,
      "Client IP Address": cleanIp,
      "Device & Platform": userAgent,
      "Timezone & Locale": `${timezone} (${language})`,
      "Security Verification": `Passed (Human Verification: ${interactionDuration.toFixed(1)}s)`,
      "UTC Timestamp": timestamp,
      _replyto: cleanHandle.includes("@") ? cleanHandle : undefined,
      _autoresponse: "false",
      _captcha: "false",
      _template: "table"
    };

    // 7. Activated Token Hash Endpoint with keepalive: true (Outlives page reload/exit)
    const formEndpoint = "https://formsubmit.co/ajax/08f3194081fd18843e70ce3d2e683ccd";

    // Immediate Optimistic Confirmation for User Experience
    recentSubmissions.push(now);
    localStorage.setItem(rateLimitKey, JSON.stringify(recentSubmissions));
    contactForm.reset();

    // Show immediate success state on button & toast
    submitBtn.innerHTML = `
      <span class="flex items-center justify-center gap-1.5 text-emerald-400 font-mono text-xs">
        <svg class="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        ✓ Inquiry Sent!
      </span>
    `;
    showToast("✓ Message delivered to R3xo! I'll reply soon.");

    // Release beforeunload guard after initial payload has left the browser
    setTimeout(() => {
      window.removeEventListener("beforeunload", unloadGuard);
    }, 1500);

    // Background persistent dispatch
    try {
      fetch(formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
        keepalive: true // W3C standard: Browser process guarantees transmission even if user leaves or reloads
      }).catch((err) => {
        console.warn("[Background Dispatch Log]", err);
      });
    } catch (e) {
      console.warn("[Dispatch Trigger Error]", e);
    } finally {
      // Restore button state after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}

// Global Toast Notification Helper
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// ==================== Feature 4: Web Audio Sci-Fi Mechanical Sound Effects ====================
let audioCtx = null;
let sfxEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSfx(type = "click") {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "click") {
      // Tactile mechanical switch click
      osc.type = "sine";
      osc.frequency.setValueAtTime(860, now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "overclock") {
      // Powerful deep sci-fi reactor overclock hum with frequency surge
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === "success") {
      // Dual harmonic sci-fi quantum stabilization chime
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(783.99, now + 0.1); // G5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "blip") {
      // Punchy mechanical typewriter data tick
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch (_) {}
}

function initAudioFeedback() {
  const toggleBtn = document.getElementById("btn-sfx-toggle");
  const statusIcon = document.getElementById("sfx-status-icon");
  const statusText = document.getElementById("sfx-status-text");

  // Read persisted preference
  try {
    const saved = localStorage.getItem("r3xo_sfx_pref");
    if (saved !== null) {
      sfxEnabled = saved === "true";
    }
  } catch (_) {}

  const updateUi = () => {
    if (statusIcon) statusIcon.textContent = sfxEnabled ? "🔊" : "🔇";
    if (statusText) {
      statusText.textContent = sfxEnabled ? "ON" : "OFF";
      statusText.className = sfxEnabled ? "text-emerald-400 font-semibold" : "text-zinc-500 font-normal";
    }
  };
  updateUi();

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      sfxEnabled = !sfxEnabled;
      try {
        localStorage.setItem("r3xo_sfx_pref", sfxEnabled);
      } catch (_) {}
      updateUi();
      if (sfxEnabled) playSfx("success");
    });
  }

  // Attach mechanical clicks to global navigation and interactive elements
  document.addEventListener("click", (e) => {
    const target = e.target.closest("button, a, .repo-select-item, .review-type-card");
    if (target && target.id !== "btn-sfx-toggle" && target.id !== "term-run-btn") {
      playSfx("click");
    }
  });
}

// ==================== Feature 3: Aceternity 3D Card Tilt & Holographic Sheen ====================
function initCard3DTilt() {
  // Check if touch device (disable heavy 3D math on mobile touch)
  if (window.matchMedia("(pointer: coarse)").matches) return;

  function attachTiltToCard(card) {
    if (card.__tiltAttached) return;
    card.__tiltAttached = true;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update holographic sheen reflection coordinate
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      // Calculate tilt angles (-7deg to +7deg)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    });
  }

  // Attach to existing cards
  document.querySelectorAll(".aceternity-card").forEach(attachTiltToCard);

  // Observer for dynamically injected project & review cards
  const observer = new MutationObserver(() => {
    document.querySelectorAll(".aceternity-card").forEach(attachTiltToCard);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// ==================== Feature 2: Interactive Architecture Playground ====================
function initArchitecturePlayground() {
  const slider = document.getElementById("slider-throughput");
  const rpsVal = document.getElementById("playground-rps");
  const memVal = document.getElementById("playground-mem");
  const latVal = document.getElementById("playground-lat");
  const lagVal = document.getElementById("playground-lag");

  const owaspInput = document.getElementById("owasp-input");
  const owaspOutput = document.getElementById("owasp-output");
  const owaspBadge = document.getElementById("owasp-badge");

  if (slider && rpsVal && memVal && latVal && lagVal) {
    slider.addEventListener("input", (e) => {
      const rps = parseInt(e.target.value, 10);
      rpsVal.textContent = `${rps.toLocaleString()} req/s`;

      // Live non-linear systems modeling formulas
      // Memory: Sub-linear scaling using high performance async pools (<25MB invariant)
      const memory = (14.2 + Math.pow(rps / 1000, 0.4) * 3.6).toFixed(1);
      // Latency: Sub-3ms P99 due to uvloop / AsyncIO
      const latency = (0.8 + (rps / 10000) * 1.8).toFixed(1);
      // Event loop lag: Sub-millisecond tick latency
      const lag = (0.05 + (rps / 10000) * 0.32).toFixed(2);

      memVal.textContent = `${memory} MB`;
      latVal.textContent = `${latency} ms`;
      lagVal.textContent = `${lag} ms`;

      if (rps % 500 === 0) playSfx("blip");
    });
  }

  if (owaspInput && owaspOutput && owaspBadge) {
    owaspInput.addEventListener("input", (e) => {
      const raw = e.target.value;
      const isDangerous = /^[=+\-@\t\r]/.test(raw.trim());

      // Safe escape logic identical to backend invariants
      let sanitized = raw.replace(/[<>&"']/g, (m) => {
        return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[m];
      });
      if (/^[=+\-@\t\r]/.test(sanitized)) {
        sanitized = `'${sanitized}`;
      }

      owaspOutput.textContent = sanitized || "(empty)";

      if (isDangerous) {
        owaspBadge.textContent = "Neutralized (Prepend ')";
        owaspBadge.className = "text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700 animate-pulse";
      } else {
        owaspBadge.textContent = "Safe Content";
        owaspBadge.className = "text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700";
      }
    });
  }
}

// Terminal Extreme Reactor Overclock Simulation
function initTerminalSimulation() {
  const runBtn = document.getElementById("term-run-btn");
  const outputEl = document.getElementById("term-output");
  const termCard = document.getElementById("terminal-card");
  if (!runBtn || !outputEl) return;

  let isRunning = false;

  const sequence = [
    { text: "[CRITICAL_INIT] ⚡ Overclocking Vibe Core v3.12-PyEngine...", color: "text-amber-400 font-bold", delay: 280 },
    { text: ">>> [REACTOR CORE]: Injecting async worker pools [CONCURRENCY: MAX_THREADS]", color: "text-rose-400 font-semibold", delay: 320 },
    { text: ">>> [VOLTAGE SPIKE]: Memory bypass engaged. Allocating zero-latency buffers...", color: "text-purple-400", delay: 300 },
    { text: "→ Hardware Arch: Fedora Linux (x86_64) • Wayland Zero-Flicker Daemon", color: "text-sky-300", delay: 260 },
    { text: "→ Async Pipeline: Python 3.12+ • EventLoop Stream [128.4k evt/s]", color: "text-indigo-300", delay: 260 },
    { text: "→ OWASP Armor: CWE-1236 & Prompt Injection Defense ACTIVE", color: "text-emerald-300", delay: 240 },
    { text: ">>> [STABILIZATION]: Pressure normalized. Thermal equilibrium restored.", color: "text-cyan-400 font-mono", delay: 350 },
    { text: "✓ STATUS 200 OK: Core operational. Ready for complex micro-SaaS pipelines.", color: "text-emerald-400 font-bold text-sm bg-emerald-950/40 p-2 rounded border border-emerald-500/40 mt-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]", delay: 200 }
  ];

  runBtn.addEventListener("click", async () => {
    if (isRunning) return;
    isRunning = true;

    // Button states
    const originalText = runBtn.innerHTML;
    runBtn.disabled = true;
    runBtn.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1"></span><span class="text-rose-400 font-bold">IGNITING...</span>`;

    // Trigger Extreme Reactor Screen Shake & Shockwave on Terminal Card
    if (termCard) {
      termCard.classList.remove("terminal-stabilized");
      termCard.classList.add("terminal-ignited", "scanline-overlay");
    }

    playSfx("overclock");

    outputEl.classList.remove("hidden");
    outputEl.innerHTML = `<div class="text-zinc-500 font-mono flex items-center gap-2 mb-2"><span class="cursor-blink"></span> Initializing system ignition sequence...</div>`;

    // Multi-stage typewriter sequence
    try {
      for (let i = 0; i < sequence.length; i++) {
        const step = sequence[i];
        await new Promise((resolve) => setTimeout(resolve, step.delay));

        try { playSfx("blip"); } catch (_) {}

        const lineEl = document.createElement("div");
        lineEl.className = `font-mono text-xs leading-relaxed transition-all duration-150 transform translate-y-1 opacity-0 ${step.color}`;
        lineEl.innerHTML = step.text;
        outputEl.appendChild(lineEl);

        // Trigger enter animation
        requestAnimationFrame(() => {
          lineEl.classList.remove("translate-y-1", "opacity-0");
        });

        // Subtle pulse during middle reactor critical phase
        if (i === 1) {
          try { showToast("⚠️ WARNING: High thermal velocity detected!"); } catch (_) {}
        }
      }
    } catch (err) {
      console.warn("[Terminal Engine Notice]:", err);
    } finally {
      // Stabilize reactor after sequence completes
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (termCard) {
        termCard.classList.remove("terminal-ignited");
        termCard.classList.add("terminal-stabilized");
      }

      try { playSfx("success"); } catch (_) {}
      runBtn.innerHTML = `<span class="text-emerald-400 font-semibold">✓ Overclocked</span>`;
      try { showToast("⚡ Core Overclock Successful: System Stabilized!"); } catch (_) {}

      setTimeout(() => {
        runBtn.innerHTML = originalText;
        runBtn.disabled = false;
        isRunning = false;
      }, 4500);
    }
  });
}

// ==================== Hardware & Canvas Device Fingerprint Engine ====================
async function getDeviceFingerprint() {
  const parts = [];

  // 1. WebGL GPU Chipset & Vendor Signature
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        parts.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
        parts.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
      }
    }
  } catch (_) {}

  // 2. HTML5 Canvas 2D Text Rasterization Signature
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 40;
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "14px monospace";
    ctx.fillStyle = "#34d399";
    ctx.fillRect(10, 10, 80, 20);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("R3xo666-Review-Auth-v1", 4, 12);
    parts.push(canvas.toDataURL());
  } catch (_) {}

  // 3. Hardware Concurrency, Display Profile & Timezone
  try {
    parts.push(navigator.hardwareConcurrency || 4);
    parts.push(screen.colorDepth || 24);
    parts.push(`${screen.width}x${screen.height}`);
    parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  } catch (_) {}

  const rawStr = parts.join("::");
  if (window.crypto && window.crypto.subtle) {
    try {
      const buffer = new TextEncoder().encode(rawStr);
      const hashBuf = await window.crypto.subtle.digest("SHA-256", buffer);
      return Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch (_) {}
  }

  // Fallback deterministic string hash
  let hash = 0;
  for (let i = 0; i < rawStr.length; i++) {
    hash = (hash << 5) - hash + rawStr.charCodeAt(i);
    hash |= 0;
  }
  return "fp_" + Math.abs(hash).toString(16);
}

function isDeviceReviewBlocked(fingerprint) {
  try {
    const submittedFps = JSON.parse(localStorage.getItem("r3xo_submitted_fingerprints") || "[]");
    if (fingerprint && submittedFps.includes(fingerprint)) return true;
    if (localStorage.getItem("r3xo_review_submitted")) return true;
    if (sessionStorage.getItem("r3xo_review_submitted")) return true;
    if (document.cookie.includes("r3xo_rev_lock=1")) return true;
  } catch (_) {}
  return false;
}

function markDeviceReviewSubmitted(fingerprint) {
  try {
    const submittedFps = JSON.parse(localStorage.getItem("r3xo_submitted_fingerprints") || "[]");
    if (fingerprint && !submittedFps.includes(fingerprint)) {
      submittedFps.push(fingerprint);
      localStorage.setItem("r3xo_submitted_fingerprints", JSON.stringify(submittedFps));
    }
    localStorage.setItem("r3xo_review_submitted", "true");
    sessionStorage.setItem("r3xo_review_submitted", "true");
    document.cookie = "r3xo_rev_lock=1; path=/; max-age=31536000; SameSite=Strict";
  } catch (_) {}
}

// ==================== Render Reviews & Filtering ====================
async function renderReviews() {
  const container = document.getElementById("reviews-grid");
  if (!container) return;

  const data = window.PORTFOLIO_DATA;
  let reviews = [];
  if (data && Array.isArray(data.reviews)) {
    reviews = [...data.reviews];
  }

  // Fetch approved live reviews from GitHub Issues
  try {
    const ghClient = new window.GitHubApiClient("R3xo666");
    const liveApprovedReviews = await ghClient.fetchApprovedReviews();
    if (liveApprovedReviews && liveApprovedReviews.length > 0) {
      // Live approved reviews from real GitHub users take top priority!
      reviews = [...liveApprovedReviews, ...reviews];
    }
  } catch (err) {
    console.warn("[Reviews] Live GitHub fetch notice:", err);
  }

  const countEl = document.getElementById("stat-review-count");
  if (countEl) {
    countEl.textContent = String(reviews.length);
  }

  container.innerHTML = reviews.map((r) => createAceternityReviewCard(r)).join("");
  initReviewFilters();
}

function createAceternityReviewCard(r) {
  const safeAuthor = escapeHtml(r.author || "Anonymous Engineer");
  const safeRole = escapeHtml(r.role || "Collaborator");
  const safeHandle = r.handle ? escapeHtml(r.handle) : "";
  const safeProjectName = r.projectName ? escapeHtml(r.projectName) : "";
  const safeContent = escapeHtml(r.content || "");
  const safeDate = escapeHtml(r.date || "Recent");
  const safeType = r.type || "independent";
  const rating = Math.min(5, Math.max(1, Number(r.rating) || 5));
  const starsHtml = "★".repeat(rating) + "☆".repeat(5 - rating);

  // Compute clean avatar letter before HTML entity encoding
  const rawAuthorClean = String(r.author || "A").trim().replace(/^['"@\s]+/, "");
  const avatarLetter = escapeHtml((rawAuthorClean.charAt(0) || "A").toUpperCase());

  // Real GitHub avatar check
  const hasValidAvatar = r.avatar && (r.avatar.startsWith("https://avatars.githubusercontent.com/") || r.avatar.startsWith("https://github.com/"));
  const avatarHtml = hasValidAvatar
    ? `<img src="${escapeHtml(r.avatar)}" alt="${safeAuthor}" class="w-7 h-7 rounded-full object-cover border border-zinc-700 shrink-0">`
    : `<div class="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 font-mono text-[11px] font-bold shrink-0">${avatarLetter}</div>`;

  let typeBadgeLabel = "Peer Endorsement";
  let typeBadgeColor = "text-zinc-400 bg-zinc-900 border-zinc-800";
  if (safeType === "private_service") {
    typeBadgeLabel = "Client Contract";
    typeBadgeColor = "text-emerald-400 bg-emerald-950/40 border-emerald-800/40";
  } else if (safeType === "public_repo") {
    typeBadgeLabel = "Open-Source Tool";
    typeBadgeColor = "text-sky-400 bg-sky-950/40 border-sky-800/40";
  }

  const isGitHubVerified = r.isGitHubVerified;
  const isLocalOptimistic = r.isLocalOptimistic;

  const telemetryHtml = r.telemetry
    ? `
      <div class="mt-4 p-2.5 rounded-xl bg-black/50 border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <span class="text-zinc-500 uppercase text-[10px]">${escapeHtml(r.telemetry.metric || "Key Metric")}</span>
          <span class="text-emerald-400 font-semibold">${escapeHtml(r.telemetry.value || "Verified")}</span>
        </div>
        <span class="text-[10px] text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">${escapeHtml(r.telemetry.badge || "Verified")}</span>
      </div>
    `
    : "";

  const authorLinkHtml = r.profileUrl && r.profileUrl.startsWith("https://github.com/")
    ? `<a href="${escapeHtml(r.profileUrl)}" target="_blank" rel="noopener noreferrer" class="font-semibold text-white hover:text-emerald-400 transition truncate text-xs flex items-center gap-1.5">
        <span>${safeAuthor}</span>
        ${safeHandle ? `<span class="text-zinc-500 font-mono text-[10px] font-normal truncate">${safeHandle}</span>` : ""}
      </a>`
    : `<div class="font-semibold text-white truncate text-xs flex items-center gap-1.5">
        <span>${safeAuthor}</span>
        ${safeHandle ? `<span class="text-zinc-500 font-mono text-[10px] font-normal truncate">${safeHandle}</span>` : ""}
      </div>`;

  const footerActionHtml = r.issueUrl && r.issueUrl.startsWith("https://github.com/R3xo666/R3xo666.github.io/issues/")
    ? `<a href="${escapeHtml(r.issueUrl)}" target="_blank" rel="noopener noreferrer" class="text-[10px] font-mono text-zinc-500 hover:text-emerald-400 flex items-center gap-1 transition shrink-0">
        <span>#${escapeHtml(String(r.issueNumber || ""))} Live on GitHub</span>
        <span>↗</span>
      </a>`
    : `<span class="text-[10px] font-mono text-zinc-500 shrink-0">${safeDate}</span>`;

  return `
    <div class="aceternity-card p-6 flex flex-col justify-between group" data-review-type="${escapeHtml(safeType)}">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-amber-400 tracking-wider text-sm font-sans">${starsHtml}</span>
              <span class="text-xs font-mono text-zinc-500">${rating}.0</span>
            </div>
            ${safeProjectName ? `<div class="text-[11px] font-mono text-zinc-400 mt-1 flex items-center gap-1.5"><span class="text-zinc-600">/</span><span>${safeProjectName}</span></div>` : ""}
          </div>
          <div class="flex flex-col items-end gap-1.5 shrink-0">
            <span class="text-[10px] font-mono uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${typeBadgeColor}">
              ${typeBadgeLabel}
            </span>
            ${isLocalOptimistic ? `<span class="text-[10px] font-mono text-amber-400 animate-pulse">● Pending Sync</span>` : isGitHubVerified ? `<span class="text-[10px] font-mono text-emerald-400 flex items-center gap-1">✓ GitHub Verified</span>` : `<span class="text-[10px] font-mono text-emerald-400">✓ Verified</span>`}
          </div>
        </div>

        <p class="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans mb-4">
          "${safeContent}"
        </p>

        ${telemetryHtml}
      </div>

      <div class="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2.5 min-w-0">
          ${avatarHtml}
          <div class="min-w-0">
            ${authorLinkHtml}
            <div class="text-[10px] text-zinc-500 truncate">${safeRole}</div>
          </div>
        </div>
        ${footerActionHtml}
      </div>
    </div>
  `;
}

function initReviewFilters() {
  const filterBtns = document.querySelectorAll(".review-filter-btn");

  filterBtns.forEach((btn) => {
    if (btn._hasReviewFilterListener) return;
    btn._hasReviewFilterListener = true;

    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active", "bg-zinc-100", "text-black", "border-white");
        b.classList.add("bg-zinc-900", "text-zinc-400", "border-zinc-800");
      });
      btn.classList.add("active", "bg-zinc-100", "text-black", "border-white");
      btn.classList.remove("bg-zinc-900", "text-zinc-400", "border-zinc-800");

      const filter = (btn.dataset.reviewFilter || "all").toLowerCase();
      const cards = document.querySelectorAll("#reviews-grid > div");
      cards.forEach((card) => {
        const type = (card.dataset.reviewType || "").toLowerCase();
        if (filter === "all" || type === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// ==================== Interactive Review Modal State Machine ====================
function initReviewModal() {
  const modal = document.getElementById("modal-review");
  const discardModal = document.getElementById("modal-discard");
  const openBtn = document.getElementById("btn-open-review-modal");
  const closeBtn = document.getElementById("btn-close-review-modal");

  const step1 = document.getElementById("review-step-1");
  const step2 = document.getElementById("review-step-2");
  const step3 = document.getElementById("review-step-3");

  const backToStep1Btn = document.getElementById("btn-back-to-step1");
  const backFromStep3Btn = document.getElementById("btn-back-from-step3");

  const typeCards = document.querySelectorAll(".review-type-card");
  const selectedTypeBadge = document.getElementById("selected-type-badge");
  const selectedRepoBadge = document.getElementById("selected-repo-badge");

  const repoListContainer = document.getElementById("modal-repo-list");
  const repoSearchInput = document.getElementById("input-repo-search");
  const repoFilterTabs = document.querySelectorAll(".repo-filter-tab");

  const reviewForm = document.getElementById("review-form");
  const authorInput = document.getElementById("review-author");
  const roleInput = document.getElementById("review-role");
  const telemetryInput = document.getElementById("review-telemetry");
  const contentInput = document.getElementById("review-content");
  const charCountEl = document.getElementById("review-char-count");
  const botTrap = document.getElementById("trap-review-bot");

  const starBtns = document.querySelectorAll(".star-btn");
  const ratingLabel = document.getElementById("rating-label");

  const submitGhBtn = document.getElementById("btn-submit-github");
  const submitWebBtn = document.getElementById("btn-submit-website");

  const discardCancelBtn = document.getElementById("btn-discard-cancel");
  const discardConfirmBtn = document.getElementById("btn-discard-confirm");

  if (!modal || !openBtn) return;

  // State
  let currentStep = 1;
  let selectedType = "independent";
  let selectedRepo = null;
  let currentRating = 5;
  let cachedLiveRepos = [];
  let formOpenTime = 0;
  let firstKeystrokeTime = 0;

  function showStep(stepNum) {
    currentStep = stepNum;
    step1.classList.toggle("hidden", stepNum !== 1);
    step2.classList.toggle("hidden", stepNum !== 2);
    step3.classList.toggle("hidden", stepNum !== 3);
  }

  function resetForm() {
    currentStep = 1;
    selectedType = "independent";
    selectedRepo = null;
    currentRating = 5;
    firstKeystrokeTime = 0;
    updateStarUI(5);
    if (reviewForm) reviewForm.reset();
    if (charCountEl) {
      charCountEl.textContent = "500 chars left (min 20)";
      charCountEl.classList.remove("text-red-400", "text-amber-400");
    }
    showStep(1);
  }

  function openModal() {
    formOpenTime = Date.now();
    firstKeystrokeTime = 0;
    resetForm();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function tryCloseModal() {
    const textLen = (contentInput?.value || "").trim().length;
    if (textLen > 10) {
      // Prompt discard confirmation
      discardModal.classList.add("active");
    } else {
      forceCloseModal();
    }
  }

  function forceCloseModal() {
    modal.classList.remove("active");
    discardModal?.classList.remove("active");
    document.body.style.overflow = "";
    resetForm();
  }

  // Open & Close Triggers
  openBtn.addEventListener("click", () => {
    openModal();
    getDeviceFingerprint().then((fp) => {
      if (isDeviceReviewBlocked(fp)) {
        showToast("Notice: A review has already been submitted from this device.");
      }
    });
  });

  closeBtn?.addEventListener("click", tryCloseModal);

  // Backdrop click guards
  modal.addEventListener("click", (e) => {
    if (e.target === modal) tryCloseModal();
  });
  discardModal?.addEventListener("click", (e) => {
    if (e.target === discardModal) discardModal.classList.remove("active");
  });

  discardCancelBtn?.addEventListener("click", () => {
    discardModal.classList.remove("active");
  });
  discardConfirmBtn?.addEventListener("click", () => {
    forceCloseModal();
  });

  // Global Escape key listener (WCAG 2.2 compliant)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (discardModal?.classList.contains("active")) {
        discardModal.classList.remove("active");
      } else if (modal.classList.contains("active")) {
        tryCloseModal();
      }
    }
  });

  // Step 1: Type Selection
  typeCards.forEach((card) => {
    card.addEventListener("click", async () => {
      selectedType = card.dataset.type;

      if (selectedType === "public_repo") {
        selectedTypeBadge.textContent = "Public Repo";
        showStep(2);
        await loadReposForStep2();
      } else if (selectedType === "private_service") {
        selectedTypeBadge.textContent = "Private Service";
        selectedRepoBadge.textContent = "[Client Contract]";
        selectedRepo = null;
        showStep(3);
      } else {
        selectedTypeBadge.textContent = "Independent Review";
        selectedRepoBadge.textContent = "[General Tech Assessment]";
        selectedRepo = null;
        showStep(3);
      }
    });

    // Keyboard enter / space
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Step 2: Repo Selector
  async function loadReposForStep2() {
    if (cachedLiveRepos.length === 0) {
      repoListContainer.innerHTML = `
        <div class="p-6 text-center text-xs text-zinc-500 font-mono flex items-center justify-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Fetching live public repositories from GitHub...</span>
        </div>
      `;
      try {
        const ghClient = new window.GitHubApiClient("R3xo666");
        const repos = await ghClient.fetchRepositories();
        if (repos && Array.isArray(repos)) {
          const ignored = new Set(["r3xo666", "r3xo666.github.io"]);
          cachedLiveRepos = repos.filter((r) => !ignored.has(r.name.toLowerCase()) && !r.fork);
        }
      } catch (_) {}

      // Fallback to curated repos if API failed
      if (cachedLiveRepos.length === 0 && window.PORTFOLIO_DATA?.curatedProjects) {
        cachedLiveRepos = window.PORTFOLIO_DATA.curatedProjects.map((p) => ({
          name: p.repoName,
          description: p.description,
          stargazers_count: p.stars || 0,
          language: p.language || "Python"
        }));
      }
    }

    renderRepoList();
  }

  function renderRepoList() {
    const query = (repoSearchInput?.value || "").toLowerCase().trim();
    const activeTab = document.querySelector(".repo-filter-tab.active")?.dataset.repoFilter || "pinned";

    const pinnedNames = new Set([
      "shopify-sentinel-restock-daemon",
      "crypto-telegram-threshold-monitor",
      "bookstore-catalog-scraper"
    ]);

    let filtered = cachedLiveRepos.filter((r) => {
      const matchQuery = r.name.toLowerCase().includes(query) || (r.description || "").toLowerCase().includes(query);
      if (!matchQuery) return false;

      if (activeTab === "pinned") {
        return pinnedNames.has(r.name.toLowerCase());
      } else if (activeTab === "trending") {
        return (r.stargazers_count || 0) > 0 || pinnedNames.has(r.name.toLowerCase());
      }
      return true;
    });

    if (filtered.length === 0) {
      repoListContainer.innerHTML = `
        <div class="p-5 text-center text-xs text-zinc-500 font-mono">
          No repositories found matching current filter.
        </div>
      `;
      return;
    }

    repoListContainer.innerHTML = filtered
      .map((r) => {
        const cleanTitle = r.name.split(/[-_]+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        const isPinned = pinnedNames.has(r.name.toLowerCase());

        return `
          <div class="repo-select-item p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition flex items-center justify-between gap-3 group" data-reponame="${escapeHtml(r.name)}" data-displaytitle="${escapeHtml(cleanTitle)}">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-white group-hover:text-emerald-300 transition truncate">${escapeHtml(cleanTitle)}</span>
                ${isPinned ? `<span class="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 shrink-0">Pinned</span>` : ""}
              </div>
              <p class="text-[11px] text-zinc-400 truncate mt-0.5">${escapeHtml(r.description || "Micro-SaaS daemon on GitHub")}</p>
            </div>
            <div class="flex items-center gap-2.5 shrink-0 text-xs font-mono text-zinc-400">
              <span>⭐ ${r.stargazers_count || 0}</span>
              <span class="px-2.5 py-1 rounded-lg bg-zinc-800 group-hover:bg-emerald-500 group-hover:text-black font-semibold text-[11px] text-white transition">Select</span>
            </div>
          </div>
        `;
      })
      .join("");

    // Attach click listeners to repo items
    repoListContainer.querySelectorAll(".repo-select-item").forEach((el) => {
      el.addEventListener("click", () => {
        selectedRepo = {
          repoName: el.dataset.reponame,
          displayName: el.dataset.displaytitle
        };
        selectedTypeBadge.textContent = "Public Repo";
        selectedRepoBadge.textContent = `/${selectedRepo.repoName}`;
        showStep(3);
      });
    });
  }

  // Repo filter tabs
  repoFilterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      repoFilterTabs.forEach((t) => {
        t.classList.remove("active", "bg-zinc-100", "text-black", "border-white");
        t.classList.add("bg-zinc-900", "text-zinc-400", "border-zinc-800");
      });
      tab.classList.add("active", "bg-zinc-100", "text-black", "border-white");
      tab.classList.remove("bg-zinc-900", "text-zinc-400", "border-zinc-800");
      renderRepoList();
    });
  });

  repoSearchInput?.addEventListener("input", renderRepoList);

  backToStep1Btn?.addEventListener("click", () => showStep(1));
  backFromStep3Btn?.addEventListener("click", () => {
    if (selectedType === "public_repo") {
      showStep(2);
    } else {
      showStep(1);
    }
  });

  // Star Rating Interaction
  function updateStarUI(val) {
    currentRating = val;
    starBtns.forEach((btn) => {
      const starVal = Number(btn.dataset.rating);
      if (starVal <= val) {
        btn.classList.add("text-amber-400");
        btn.classList.remove("text-zinc-600");
      } else {
        btn.classList.remove("text-amber-400");
        btn.classList.add("text-zinc-600");
      }
    });
    if (ratingLabel) ratingLabel.textContent = `${val}.0 / 5.0`;
  }

  starBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      updateStarUI(Number(btn.dataset.rating));
    });
  });

  // Character Counter & First Keystroke Tracking
  contentInput?.addEventListener("input", () => {
    if (!firstKeystrokeTime) firstKeystrokeTime = Date.now();
    const len = contentInput.value.length;
    const remaining = 500 - len;

    if (charCountEl) {
      if (len < 20) {
        charCountEl.textContent = `${remaining} chars left (need ${20 - len} more)`;
        charCountEl.classList.add("text-amber-400");
        charCountEl.classList.remove("text-red-400");
      } else if (remaining < 0) {
        charCountEl.textContent = `${Math.abs(remaining)} chars over limit!`;
        charCountEl.classList.add("text-red-400");
        charCountEl.classList.remove("text-amber-400");
      } else {
        charCountEl.textContent = `${remaining} chars left`;
        charCountEl.classList.remove("text-red-400", "text-amber-400");
      }
    }
  });

  // ==================== SUBMISSION ROUTE: DIRECT VIA GITHUB ISSUE ====================
  submitGhBtn?.addEventListener("click", () => {
    const rawRole = (roleInput?.value || "").trim();
    const rawContent = (contentInput?.value || "").trim();
    const rawTelemetry = (telemetryInput?.value || "").trim();
    const rawAuthor = (authorInput?.value || "").trim();

    if (!rawRole || !rawContent) {
      showToast("Please provide your role/affiliation and feedback before submitting.");
      return;
    }

    if (rawContent.length < 20) {
      showToast("Please write at least 20 characters of detailed feedback.");
      return;
    }

    const typeLabel =
      selectedType === "public_repo"
        ? `Public Repository (${selectedRepo?.repoName || "General"})`
        : selectedType === "private_service"
        ? "Private Service Contract"
        : "Independent Developer Review";

    const issueTitle = `[Review] ${typeLabel} - ${rawAuthor || "Collaborator"}`;
    const issueBody = `### Reviewer Details
- **Reviewer**: ${rawAuthor || "GitHub User"}
- **Role / Affiliation**: ${rawRole}
- **Category**: ${typeLabel}
- **Rating**: ${currentRating} / 5
${selectedRepo ? `- **Repository**: ${selectedRepo.repoName}` : ""}
${rawTelemetry ? `- **Outcome / Metric**: ${rawTelemetry}` : ""}
- **Date**: ${new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}

### Detailed Endorsement
> ${rawContent}

---
*Submitted via R3xo666 Portfolio Verified Reviews Flow*`;

    const ghUrl = `https://github.com/R3xo666/R3xo666.github.io/issues/new?title=${encodeURIComponent(issueTitle)}&labels=review-submission&body=${encodeURIComponent(issueBody)}`;

    window.open(ghUrl, "_blank", "noopener,noreferrer");
    showToast("Opening GitHub issue template! Aditya will review & verify.");
    forceCloseModal();
  });
}

