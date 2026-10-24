let revealObserver = null;

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  renderToolkit();
  initSectionNavigation();
  initRevealMotion();
  initContact();
});

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

async function renderProjects() {
  const container = document.getElementById("projects-grid");
  const status = document.getElementById("project-status");
  if (!container) return;

  const data = window.PORTFOLIO_DATA || {};
  const curated = Array.isArray(data.projects) ? data.projects : [];
  let liveRepos = null;

  if (window.GitHubApiClient) {
    try {
      liveRepos = await new window.GitHubApiClient("R3xo666").fetchRepositories();
    } catch (error) {
      console.warn("Could not load repositories from GitHub:", error);
    }
  }

  const liveByName = new Map(
    (Array.isArray(liveRepos) ? liveRepos : [])
      .filter((repo) => repo && repo.name)
      .map((repo) => [repo.name.toLowerCase(), repo])
  );
  const projects = curated.map((project) => {
    const live = liveByName.get(project.repoName.toLowerCase());
    if (live) liveByName.delete(project.repoName.toLowerCase());
    return {
      ...project,
      githubUrl: live?.html_url || "https://github.com/R3xo666/" + project.repoName,
      language: live?.language || project.language
    };
  });

  for (const repo of liveByName.values()) {
    if (repo.fork || ["r3xo666", "r3xo666.github.io"].includes(repo.name.toLowerCase())) continue;
    const name = repo.name.split(/[-_]+/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
    const topicTools = Array.isArray(repo.topics) ? repo.topics.slice(0, 3) : [];
    projects.push({
      repoName: repo.name,
      name,
      summary: repo.description || "An open-source project on GitHub.",
      language: repo.language || "Open source",
      tools: topicTools,
      githubUrl: repo.html_url
    });
  }

  if (!projects.length) {
    container.innerHTML = '<p class="project-empty">There are no public projects to show yet.</p>';
  } else {
    container.innerHTML = projects.map(renderProjectCard).join("");
    observeRevealElements(container);
  }

  if (status) {
    status.textContent = Array.isArray(liveRepos)
      ? "Repository list loaded from GitHub."
      : "Showing saved project details; GitHub is unavailable right now.";
  }
}

function renderProjectCard(project, index) {
  const repoName = String(project.repoName || "");
  const fallbackUrl = "https://github.com/R3xo666/" + encodeURIComponent(repoName);
  const url = typeof project.githubUrl === "string" && project.githubUrl.startsWith("https://github.com/R3xo666/")
    ? project.githubUrl
    : fallbackUrl;
  const name = String(project.name || repoName);
  const summary = String(project.summary || "");
  const tools = Array.isArray(project.tools) ? project.tools : [];
  const toolsMarkup = tools.slice(0, 4).map((tool) => "<li>" + escapeHtml(tool) + "</li>").join("");

  return [
    '<a class="project-card" href="', escapeHtml(url), '" target="_blank" rel="noopener noreferrer" aria-label="', escapeHtml(name + ": " + summary + " View GitHub repository."), '" data-reveal>',
      renderProjectArtwork(repoName),
      '<div class="project-content">',
      '<div class="project-meta">',
        '<span>Project ', String(index + 1).padStart(2, "0"), '</span>',
        '<span class="project-language">', escapeHtml(project.language || "Open source"), '</span>',
      '</div>',
      '<h3 class="project-title"><span>', escapeHtml(name), '</span><span class="project-arrow" aria-hidden="true">↗</span></h3>',
      '<p class="project-summary">', escapeHtml(summary), '</p>',
      toolsMarkup ? '<ul class="project-tools" aria-label="Tools used">' + toolsMarkup + '</ul>' : "",
      '</div>',
    '</a>'
  ].join("");
}

function renderProjectArtwork(repoName) {
  const artwork = {
    "aegis-phone": {
      kind: "phone",
      label: "Device control · ADB + scrcpy",
      svg: '<svg viewBox="0 0 340 250" aria-hidden="true" focusable="false"><circle class="art-fill-lilac" cx="171" cy="127" r="83" opacity=".72"/><circle class="art-stroke-thin" cx="171" cy="127" r="107"/><rect class="art-fill" x="135" y="27" width="72" height="196" rx="18"/><rect class="art-fill-lilac" x="141" y="43" width="60" height="158" rx="9"/><rect class="art-fill" x="162" y="34" width="18" height="2.5" rx="1.25"/><circle class="art-fill" cx="171" cy="212" r="4"/><path class="art-stroke" d="M66 144h43m122 0h43M78 132l-12 12 12 12m184-24 12 12-12 12"/><circle class="art-fill-acid" cx="106" cy="82" r="5"/><circle class="art-fill-clay" cx="239" cy="91" r="4"/></svg>'
    },
    "shopify-sentinel-restock-daemon": {
      kind: "stock",
      label: "Restock alerts · Shopify + Discord",
      svg: '<svg viewBox="0 0 340 250" aria-hidden="true" focusable="false"><circle class="art-stroke-thin" cx="170" cy="126" r="101"/><path class="art-stroke-thin" d="M69 126h202M170 25v202"/><rect class="art-fill-paper" x="51" y="78" width="90" height="102" rx="13" transform="rotate(-8 51 78)"/><path class="art-stroke" d="m78 100 37-5m-34 22 43-6m-40 22 27-4"/><rect class="art-fill" x="197" y="71" width="91" height="106" rx="13" transform="rotate(8 197 71)"/><path class="art-stroke-thin" d="m215 103 45 6m-42 12 41 6"/><circle class="art-fill-acid" cx="252" cy="143" r="8"/><path class="art-path" d="M119 183c24 32 69 35 100 9"/><circle class="art-fill-clay" cx="128" cy="194" r="5"/></svg>'
    },
    "bookstore-catalog-scraper": {
      kind: "book",
      label: "Catalog collection · CSV + Excel",
      svg: '<svg viewBox="0 0 340 250" aria-hidden="true" focusable="false"><circle class="art-fill-paper" cx="168" cy="129" r="91"/><path class="art-stroke" d="M170 60c-29-16-62-17-91-6v119c32-11 62-8 91 8 29-16 59-19 91-8V54c-29-11-62-10-91 6Z"/><path class="art-stroke-thin" d="M170 61v120M96 82c21-5 42-3 60 6m-60 15c21-5 42-3 60 6m68-27c18-9 39-11 60-6m-60 27c18-9 39-11 60-6"/><path class="art-path" d="M51 196h228"/><circle class="art-fill-acid" cx="256" cy="74" r="11"/></svg>'
    },
    "crypto-telegram-threshold-monitor": {
      kind: "signal",
      label: "Price thresholds · Telegram",
      svg: '<svg viewBox="0 0 340 250" aria-hidden="true" focusable="false"><circle class="art-stroke-thin" cx="169" cy="125" r="102"/><circle class="art-stroke-thin" cx="169" cy="125" r="71"/><circle class="art-stroke-thin" cx="169" cy="125" r="39"/><path class="art-stroke" d="M54 156h230"/><path class="art-path" d="M53 167c31-2 32-34 61-34s31 16 55 5 28-60 55-48 35 38 63 16"/><circle class="art-fill-acid" cx="224" cy="90" r="8"/><circle class="art-fill" cx="224" cy="90" r="3"/><path class="art-stroke-thin" d="M224 90v66"/></svg>'
    },
    "batch-invoice-pdf-extractor": {
      kind: "document",
      label: "Invoice extraction · PDF to Excel",
      svg: '<svg viewBox="0 0 340 250" aria-hidden="true" focusable="false"><path class="art-fill-paper" d="M99 37h104l41 41v137H99z"/><path class="art-stroke" d="M203 38v42h41M123 105h93m-93 22h69m-69 22h84m-84 22h55"/><rect class="art-fill-acid" x="177" y="154" width="70" height="44" rx="8" transform="rotate(-7 177 154)"/><path class="art-stroke" d="m194 176 9 8 19-20"/><circle class="art-fill-clay" cx="89" cy="73" r="8"/></svg>'
    }
  }[repoName];

  if (!artwork) {
    return '<div class="project-art project-art--generic" aria-hidden="true"><span class="project-art-label">Open source</span><svg viewBox="0 0 340 250" focusable="false"><circle class="art-fill-acid" cx="170" cy="125" r="72"/><circle class="art-stroke" cx="170" cy="125" r="101"/><path class="art-path" d="M64 125h212"/></svg></div>';
  }

  return '<div class="project-art project-art--' + artwork.kind + '" aria-hidden="true"><span class="project-art-label">' + escapeHtml(artwork.label) + '</span>' + artwork.svg + '</div>';
}

function renderToolkit() {
  const container = document.getElementById("toolkit-list");
  const groups = window.PORTFOLIO_DATA?.skills;
  if (!container || !Array.isArray(groups)) return;

  container.innerHTML = groups.map((group) => [
    '<div class="toolkit-group">',
      '<strong>', escapeHtml(group.category), '</strong>',
      '<span>', group.items.map(escapeHtml).join(" · "), '</span>',
    '</div>'
  ].join("")).join("");
}

function initSectionNavigation() {
  const links = Array.from(document.querySelectorAll(".section-link"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!("IntersectionObserver" in window) || !sections.length) return;

  const activeObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting);
    if (!visible.length) return;
    const currentId = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target.id;
    links.forEach((link) => {
      const active = link.hash === "#" + currentId;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.15, 0.35, 0.6] });

  sections.forEach((section) => activeObserver.observe(section));
}

function initRevealMotion() {
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.body.classList.add("motion-ready");
  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
  observeRevealElements();
}

function observeRevealElements(root = document) {
  if (!revealObserver) return;
  root.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((element) => revealObserver.observe(element));
}

function initContact() {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(value);
        showToast("Copied to clipboard.");
      } catch (_) {
        showToast("Copy is unavailable here. Select the email address above.");
      }
    });
  });

  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("form-status");
    const submit = form.querySelector('button[type="submit"]');
    const honeypot = form.querySelector('[name="_honey"]');
    if (honeypot?.value) return;

    const payload = Object.fromEntries(new FormData(form).entries());
    delete payload._honey;
    submit.disabled = true;
    submit.textContent = "Sending…";
    if (status) status.textContent = "Sending your note…";

    try {
      const response = await fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || !(result.success === true || result.success === "true")) {
        throw new Error("Form delivery was not confirmed.");
      }
      form.reset();
      if (status) status.textContent = "Your note was sent. Thanks for getting in touch.";
      showToast("Your note was sent.");
    } catch (_) {
      if (status) status.textContent = "The form could not confirm delivery. Please email r3xo666.dev@gmail.com instead.";
      showToast("Could not send the note. Please use email.");
    } finally {
      submit.disabled = false;
      submit.innerHTML = 'Send a note <span aria-hidden="true">↗</span>';
    }
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2800);
}
