/**
 * Main application orchestrator (Aceternity UI Edition)
 */

document.addEventListener("DOMContentLoaded", () => {
  initAceternitySpotlight();
  initNavigation();
  renderProjects();
  renderSkills();
  initInteractiveUtils();
  initTerminalSimulation();
});

// Aceternity Smooth Spotlight Effect
function initAceternitySpotlight() {
  const glow = document.getElementById("aceternity-spotlight");
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
    navPills.forEach((pill) => {
      if (pill.dataset.tab === targetTabId) {
        pill.classList.add("active");
        pill.setAttribute("aria-selected", "true");
      } else {
        pill.classList.remove("active");
        pill.setAttribute("aria-selected", "false");
      }
    });

    tabContents.forEach((tab) => {
      if (tab.id === targetTabId) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

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

  // Direct hash navigation
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const targetPill = document.querySelector(`[data-tab="tab-${hash}"]`);
    if (targetPill) switchTab(`tab-${hash}`);
  }

  // Quick CTA links inside content
  document.querySelectorAll("[data-navigate]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute("data-navigate");
      switchTab(targetTab);
    });
  });
}

// Render Projects with Aceternity Card Styling
async function renderProjects() {
  const container = document.getElementById("projects-grid");
  if (!container) return;

  const data = window.PORTFOLIO_DATA;
  let projects = [...data.curatedProjects];

  const ghClient = new window.GitHubApiClient("R3xo666");
  const liveRepos = await ghClient.fetchRepositories();

  if (liveRepos && Array.isArray(liveRepos)) {
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

  container.innerHTML = projects.map((p) => createAceternityProjectCard(p)).join("");
  initProjectFilters(projects);
}

function createAceternityProjectCard(p) {
  const tagsHtml = p.topics
    .slice(0, 4)
    .map(
      (t) =>
        `<span class="text-[11px] px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">#${t}</span>`
    )
    .join("");

  const highlightsHtml = p.highlights
    .map(
      (h) => `
      <li class="flex items-start gap-2 text-xs text-zinc-300">
        <span class="text-zinc-500 mt-0.5 font-mono">/</span>
        <span>${h}</span>
      </li>
    `
    )
    .join("");

  return `
    <div class="aceternity-card p-6 flex flex-col justify-between group" data-tags="${p.topics.join(" ")}">
      <div>
        <div class="flex items-center justify-between gap-3 mb-4">
          <span class="text-[11px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700/60 text-zinc-300">
            ${p.badge}
          </span>
          <div class="flex items-center gap-3 text-xs text-zinc-400 font-mono">
            <span>⭐ ${p.stars || 0}</span>
            <span class="text-emerald-400 font-sans">✓ Verified</span>
          </div>
        </div>

        <h3 class="text-lg font-bold text-white group-hover:text-zinc-200 transition-colors">
          ${p.displayName}
        </h3>
        <p class="text-xs text-zinc-500 font-mono mt-0.5 mb-3">${p.repoName}</p>
        <p class="text-sm text-zinc-400 leading-relaxed mb-5">
          ${p.description}
        </p>

        <ul class="space-y-1.5 mb-6 p-3 rounded-xl bg-black/40 border border-zinc-800/80">
          ${highlightsHtml}
        </ul>
      </div>

      <div>
        <div class="flex flex-wrap gap-1.5 mb-5">
          ${tagsHtml}
        </div>

        <div class="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-zinc-400">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Python</span>
            ${p.liveUpdated ? `<span class="text-zinc-600">• ${p.liveUpdated}</span>` : ""}
          </div>
          <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white transition border border-zinc-700">
            <span>Repository</span>
            <span class="text-zinc-400">↗</span>
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

// Render Skills Matrix (Aceternity Editorial Layout)
function renderSkills() {
  const container = document.getElementById("skills-container");
  if (!container) return;

  const data = window.PORTFOLIO_DATA;
  container.innerHTML = data.skills
    .map(
      (cat) => `
    <div class="aceternity-card p-6">
      <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4 pb-2 border-b border-zinc-800 flex items-center justify-between">
        <span>${cat.category}</span>
        <span class="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
      </h3>
      <div class="space-y-2.5">
        ${cat.items
          .map(
            (item) => `
          <div class="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-900/60 transition">
            <div class="flex items-center gap-2.5">
              <span class="w-1.5 h-1.5 rounded-full ${item.highlight ? "bg-white ring-2 ring-white/20" : "bg-zinc-600"}"></span>
              <span class="text-sm font-medium ${item.highlight ? "text-white font-semibold" : "text-zinc-300"}">${item.name}</span>
            </div>
            <span class="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">${item.level}</span>
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

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = "<span>Sending...</span>";
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast("Inquiry received. I'll get back to you shortly.");
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

// Terminal Simulation
function initTerminalSimulation() {
  const runBtn = document.getElementById("term-run-btn");
  const outputEl = document.getElementById("term-output");
  if (!runBtn || !outputEl) return;

  runBtn.addEventListener("click", () => {
    outputEl.classList.remove("hidden");
    outputEl.innerHTML = `
      <div class="text-zinc-400 font-mono">[+] Running developer.py environment check...</div>
      <div class="text-zinc-300 mt-1 font-mono">→ System: Fedora Linux (x86_64) • Wayland</div>
      <div class="text-zinc-300 font-mono">→ Core: Python 3.12+ • AsyncIO • Pydantic v2</div>
      <div class="text-zinc-300 font-mono">→ Security: OWASP CWE-1236 Neutralized</div>
      <div class="text-emerald-400 mt-1 font-mono">✓ Operational. Ready for complex micro-SaaS pipelines.</div>
    `;
  });
}
