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
      renderProjectWorkflow(project.workflow),
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

function renderProjectWorkflow(workflow) {
  const flow = workflow || { input: "Repository", output: "GitHub", kind: "generic" };
  return [
    '<div class="project-art project-art--', escapeHtml(flow.kind || "generic"), '" aria-hidden="true">',
      '<span class="project-art-label">Input <i>→</i> result</span>',
      '<div class="workflow-track">',
        '<div class="workflow-node"><span class="workflow-node-mark" aria-hidden="true"></span><strong>', escapeHtml(flow.input), '</strong></div>',
        '<span class="workflow-connector" aria-hidden="true"><i></i></span>',
        '<div class="workflow-node"><span class="workflow-node-mark" aria-hidden="true"></span><strong>', escapeHtml(flow.output), '</strong></div>',
      '</div>',
    '</div>'
  ].join("");
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
