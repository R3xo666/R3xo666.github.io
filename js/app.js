/**
 * Main application orchestrator: Routing, dynamic rendering, and animations
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Ambient Mouse Glow
  initAmbientGlow();

  // 2. Initialize Navigation Router
  initNavigation();

  // 3. Render Views
  renderProjects();
  renderSkills();

  // 4. Initialize Interactive Utilities (copy to clipboard, etc.)
  initInteractiveUtils();

  // 5. Initialize Terminal Run Simulation
  initTerminalSimulation();
});

// Ambient Mouse Spotlight
function initAmbientGlow() {
  const glow = document.getElementById("ambient-glow");
  if (!glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  }
  animate();
}

// Navigation Tab Switcher
function initNavigation() {
  const navPills = document.querySelectorAll(".nav-pill");
  const tabContents = document.querySelectorAll(".tab-content");

  function switchTab(targetTabId) {
    // Update pills
    navPills.forEach((pill) => {
      if (pill.dataset.tab === targetTabId) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });

    // Update tab content
    tabContents.forEach((tab) => {
      if (tab.id === targetTabId) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navPills.forEach((pill) => {
    pill.addEventListener("click", (e) => {
      e.preventDefault();
      const target = pill.dataset.tab;
      switchTab(target);
      history.replaceState(null, "", `#${target.replace("tab-", "")}`);
    });
  });

  // Handle direct hash navigation (#projects, #about, #contact)
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const targetPill = document.querySelector(`[data-tab="tab-${hash}"]`);
    if (targetPill) {
      switchTab(`tab-${hash}`);
    }
  }

  // Quick CTA links inside pages
  document.querySelectorAll("[data-navigate]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute("data-navigate");
      switchTab(targetTab);
    });
  });
}

// Render Projects with Live GitHub API Sync
async function renderProjects() {
  const container = document.getElementById("projects-grid");
  if (!container) return;

  const data = window.PORTFOLIO_DATA;
  let projects = [...data.curatedProjects];

  // Try live GitHub REST API fetch
  const ghClient = new window.GitHubApiClient("R3xo666");
  const liveRepos = await ghClient.fetchRepositories();

  if (liveRepos && Array.isArray(liveRepos)) {
    // Merge live stars and updated topics
    projects = projects.map((proj) => {
      const match = liveRepos.find((r) => r.name.toLowerCase() === proj.repoName.toLowerCase());
      if (match) {
        return {
          ...proj,
          stars: match.stargazers_count,
          forks: match.forks_count,
          topics: match.topics && match.topics.length ? match.topics : proj.topics,
          liveUpdated: new Date(match.pushed_at).toLocaleDateString()
        };
      }
      return proj;
    });
  }

  // Render HTML
  container.innerHTML = projects.map((p) => createProjectCardHTML(p)).join("");
  initProjectFilters(projects);
}

function createProjectCardHTML(p) {
  const tagsHtml = p.topics
    .slice(0, 4)
    .map(
      (t) =>
        `<span class="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-300 font-mono">#${t}</span>`
    )
    .join("");

  const highlightsHtml = p.highlights
    .map(
      (h) => `
      <li class="flex items-start gap-2 text-xs text-slate-300">
        <span class="text-blue-400 mt-0.5">▹</span>
        <span>${h}</span>
      </li>
    `
    )
    .join("");

  return `
    <div class="glass-panel rounded-2xl p-6 flex flex-col justify-between group" data-tags="${p.topics.join(" ")}">
      <div>
        <div class="flex items-center justify-between gap-3 mb-3">
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            ${p.badge}
          </span>
          <div class="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>⭐ ${p.stars || 0}</span>
            <span class="text-emerald-400 font-sans">✓ Verified</span>
          </div>
        </div>

        <h3 class="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
          ${p.displayName}
        </h3>
        <p class="text-xs text-slate-400 font-mono mt-0.5 mb-3">${p.repoName}</p>
        <p class="text-sm text-slate-300 leading-relaxed mb-4">
          ${p.description}
        </p>

        <ul class="space-y-1.5 mb-5 p-3 rounded-xl bg-black/20 border border-white/[0.04]">
          ${highlightsHtml}
        </ul>
      </div>

      <div>
        <div class="flex flex-wrap gap-1.5 mb-5">
          ${tagsHtml}
        </div>

        <div class="pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Python</span>
            ${p.liveUpdated ? `<span class="text-slate-500">• Updated ${p.liveUpdated}</span>` : ""}
          </div>
          <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white transition border border-white/[0.1]">
            <span>View Source</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

// Project Tag Filtering
function initProjectFilters(projects) {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll("#projects-grid > div");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active", "bg-blue-600", "text-white"));
      btn.classList.add("active", "bg-blue-600", "text-white");

      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        if (filter === "all" || card.dataset.tags.includes(filter)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// Render Skills Matrix
function renderSkills() {
  const container = document.getElementById("skills-container");
  if (!container) return;

  const data = window.PORTFOLIO_DATA;
  container.innerHTML = data.skills
    .map(
      (cat) => `
    <div class="glass-panel rounded-2xl p-6">
      <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-white/[0.06]">
        ${cat.category}
      </h3>
      <div class="space-y-3">
        ${cat.items
          .map(
            (item) => `
          <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.03] transition">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full ${item.highlight ? "bg-blue-400 ring-4 ring-blue-400/20" : "bg-slate-600"}"></span>
              <span class="text-sm font-medium ${item.highlight ? "text-white font-semibold" : "text-slate-300"}">${item.name}</span>
            </div>
            <span class="text-xs font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.04]">${item.level}</span>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `
    )
    .join("");
}

// Interactive Utilities: Clipboard & Toast
function initInteractiveUtils() {
  document.querySelectorAll("[data-copy]").forEach((el) => {
    el.addEventListener("click", () => {
      const textToCopy = el.getAttribute("data-copy");
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied "${textToCopy}" to clipboard!`);
      });
    });
  });

  // Simulated Contact Form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = "<span>Sending...</span>";
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast("Message sent! I'll get back to you shortly.");
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Terminal simulation run button
function initTerminalSimulation() {
  const runBtn = document.getElementById("term-run-btn");
  const outputEl = document.getElementById("term-output");
  if (!runBtn || !outputEl) return;

  runBtn.addEventListener("click", () => {
    outputEl.classList.remove("hidden");
    outputEl.innerHTML = `
      <div class="text-blue-400 animate-pulse">[+] Executing developer.py runtime check...</div>
      <div class="text-slate-300 mt-1">✓ OS: Fedora Linux (x86_64)</div>
      <div class="text-slate-300">✓ Stack: Python 3.12 / AsyncIO / Pydantic v2</div>
      <div class="text-slate-300">✓ Security: OWASP CWE-1236 Defenses Active</div>
      <div class="text-emerald-400 mt-1">✓ Ready for complex pipeline automation and high-velocity builds.</div>
    `;
  });
}
