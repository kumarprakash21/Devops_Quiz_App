const legacyQuestions = [
  {
    domain: "Identity & Governance",
    question: "You need to allow a user to manage virtual machines in one resource group without granting access to other resources. What should you do?",
    options: [
      "Assign the Virtual Machine Contributor role at the resource group scope",
      "Assign the Global Administrator role at the tenant scope",
      "Add the user as a subscription Owner",
      "Create a management group for the user"
    ],
    answer: 0,
    explanation: "Azure RBAC assignments combine a security principal, a role, and a scope. Assigning Virtual Machine Contributor at the resource group gives the required VM permissions only within that group."
  },
  {
    domain: "Identity & Governance",
    question: "Which Azure governance feature can prevent resources from being deployed in unapproved regions?",
    options: ["Azure Policy", "Resource locks", "Microsoft Defender for Cloud", "Network Security Groups"],
    answer: 0,
    explanation: "Azure Policy evaluates resource properties against rules. An allowed-locations policy can deny deployments outside approved Azure regions."
  },
  {
    domain: "Identity & Governance",
    question: "Which resource lock allows authorized users to read a resource but prevents both updates and deletion?",
    options: ["CanNotDelete", "ReadOnly", "DenyAction", "Immutable"],
    answer: 1,
    explanation: "A ReadOnly lock permits read operations but blocks updates and deletion. A CanNotDelete lock prevents deletion while still allowing changes."
  },
  {
    domain: "Storage",
    question: "A storage account must remain available if an entire Azure region becomes unavailable, and users in the secondary region need read access. Which redundancy option should you choose?",
    options: ["LRS", "ZRS", "GRS", "RA-GRS"],
    answer: 3,
    explanation: "Read-access geo-redundant storage (RA-GRS) replicates data to a secondary region and exposes a read-only secondary endpoint."
  },
  {
    domain: "Storage",
    question: "You need to grant a vendor temporary, limited access to a single blob without sharing the storage account key. What should you use?",
    options: ["Shared access signature (SAS)", "Resource lock", "Azure Policy exemption", "Service endpoint"],
    answer: 0,
    explanation: "A SAS delegates constrained access to storage resources. You can restrict its permissions, resource, protocol, IP range, start time, and expiry time."
  },
  {
    domain: "Storage",
    question: "Which Blob Storage access tier is intended for data that is rarely accessed and can tolerate hours of retrieval latency?",
    options: ["Hot", "Cool", "Cold", "Archive"],
    answer: 3,
    explanation: "The Archive tier has the lowest storage cost and requires rehydration before data can be read, which can take hours."
  },
  {
    domain: "Compute",
    question: "You need to deploy an identical set of autoscaling virtual machines behind a load balancer. Which service is designed for this scenario?",
    options: ["Virtual Machine Scale Sets", "Azure Dedicated Host", "Azure Batch accounts", "Availability Sets"],
    answer: 0,
    explanation: "Virtual Machine Scale Sets create and manage a group of load-balanced VMs and can automatically increase or decrease instance count."
  },
  {
    domain: "Compute",
    question: "Which Azure service provides a fully managed platform for hosting web applications with built-in deployment slots?",
    options: ["Azure App Service", "Azure Virtual Desktop", "Azure Container Instances", "Azure Functions Premium only"],
    answer: 0,
    explanation: "Azure App Service is a managed hosting platform for web apps and APIs. Deployment slots support validation and swapping before production release."
  },
  {
    domain: "Compute",
    question: "You want to describe and deploy Azure infrastructure declaratively using a concise, Azure-native language. Which should you use?",
    options: ["Bicep", "KQL", "PowerShell DSC only", "Cloud Shell storage"],
    answer: 0,
    explanation: "Bicep is Azure's declarative infrastructure-as-code language. It offers concise syntax and compiles to Azure Resource Manager templates."
  },
  {
    domain: "Networking",
    question: "Two Azure virtual networks must communicate privately over the Microsoft backbone without a VPN gateway. What should you configure?",
    options: ["VNet peering", "Azure Front Door", "A public load balancer", "A NAT gateway"],
    answer: 0,
    explanation: "VNet peering directly connects virtual networks so resources can communicate privately using the Microsoft backbone."
  },
  {
    domain: "Networking",
    question: "Which resource filters inbound and outbound network traffic using rules based on source, destination, port, and protocol?",
    options: ["Network Security Group", "Route table", "Private DNS zone", "Application Security Group"],
    answer: 0,
    explanation: "A Network Security Group contains prioritized security rules that allow or deny inbound and outbound network traffic."
  },
  {
    domain: "Networking",
    question: "You need private RDP and SSH access to Azure VMs through the Azure portal without assigning public IP addresses to those VMs. Which service should you deploy?",
    options: ["Azure Bastion", "Azure DNS", "Traffic Manager", "VPN Gateway Basic"],
    answer: 0,
    explanation: "Azure Bastion provides browser-based RDP and SSH access over TLS to VMs using their private IP addresses."
  },
  {
    domain: "Monitoring",
    question: "Where should you query Azure Monitor log data using Kusto Query Language (KQL)?",
    options: ["A Log Analytics workspace", "An Azure DNS zone", "A recovery services vault", "A network interface"],
    answer: 0,
    explanation: "Azure Monitor Logs stores collected log and performance data in a Log Analytics workspace, where it can be queried with KQL."
  },
  {
    domain: "Monitoring",
    question: "An operations team must receive an email when average VM CPU usage exceeds 90 percent. Which resources are required?",
    options: ["An alert rule and an action group", "A resource lock and an initiative", "A route table and a service tag", "A workbook and a dashboard only"],
    answer: 0,
    explanation: "The alert rule defines the signal and threshold. The action group defines the notification or automation action, such as sending email."
  },
  {
    domain: "Business Continuity",
    question: "Which Azure service orchestrates replication and failover of Azure virtual machines to a secondary Azure region?",
    options: ["Azure Site Recovery", "Azure Backup Center", "Azure Advisor", "Azure Update Manager"],
    answer: 0,
    explanation: "Azure Site Recovery provides disaster recovery by replicating workloads and orchestrating failover and failback."
  }
];

let questions = [];
let activeSectionIndex = null;
const totalQuestions = questionSections.reduce((total, section) => total + section.questions.length, 0);

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const userActions = document.querySelector("#userActions");
let selections = [];

const AUTH_TOKEN_KEY = "cloudprep-auth-token";
let authToken = localStorage.getItem(AUTH_TOKEN_KEY) || "";
let currentUser = null;

const icons = {
  cloud: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18.5h10a4 4 0 0 0 .55-7.96A6 6 0 0 0 6.3 8.51 5 5 0 0 0 7 18.5Z"/><path d="m9.5 13 1.7 1.7 3.6-3.6"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-3.2 7-9V5l-7-2-7 2v7c0 5.8 7 9 7 9Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  clock: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  list: `<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>`
};

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const response = await fetch(path, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Unable to complete the request.");
  return body;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

function updateHeader() {
  if (!currentUser) {
    userActions.innerHTML = "";
    return;
  }
  const initials = currentUser.name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase();
  userActions.innerHTML = `<button class="profile-chip" id="profileButton" type="button" aria-label="Open your profile"><span>${escapeHtml(initials)}</span><strong>${escapeHtml(currentUser.name.split(" ")[0])}</strong></button>`;
  document.querySelector("#profileButton").addEventListener("click", renderProfile);
}

function renderLogin() {
  currentUser = null;
  updateHeader();
  window.scrollTo({ top: 0, behavior: "smooth" });
  app.innerHTML = `
    <section class="auth-page page">
      <div class="auth-intro">
        <p class="eyebrow">Welcome to CloudPrep</p>
        <h1>Your Azure progress, all in one place.</h1>
        <p>Sign in to practise by exam section, review your answers, and track every score.</p>
        <div class="auth-benefits">
          <span>✓ 100 practice questions</span>
          <span>✓ Five focused sections</span>
          <span>✓ Personal attempt history</span>
        </div>
      </div>
      <div class="auth-card">
        <p class="eyebrow">Account access</p>
        <h2>Sign in</h2>
        <p class="auth-subtitle">Continue your AZ-104 preparation.</p>
        <form id="loginForm" class="auth-form">
          <label>Email address<input type="email" id="loginEmail" autocomplete="email" placeholder="you@example.com" required /></label>
          <label>Password<input type="password" id="loginPassword" autocomplete="current-password" placeholder="Enter your password" required /></label>
          <p class="form-error" id="loginError" role="alert"></p>
          <button class="primary-button auth-submit" type="submit">Sign in</button>
        </form>
        <p class="auth-switch">New to CloudPrep? <button id="showRegister" type="button">Create an account</button></p>
      </div>
    </section>`;

  document.querySelector("#loginForm").addEventListener("submit", handleLogin);
  document.querySelector("#showRegister").addEventListener("click", renderRegister);
  app.focus();
}

function renderRegister() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  app.innerHTML = `
    <section class="auth-page page">
      <div class="auth-intro">
        <p class="eyebrow">Start learning</p>
        <h1>Create your practice profile.</h1>
        <p>Your account, scores, and completed attempts will be saved securely on the CloudPrep server.</p>
        <div class="auth-benefits">
          <span>✓ Track correct and incorrect answers</span>
          <span>✓ See pass status for every attempt</span>
          <span>✓ Monitor your overall score</span>
        </div>
      </div>
      <div class="auth-card">
        <p class="eyebrow">Create account</p>
        <h2>Register</h2>
        <p class="auth-subtitle">A few details and you are ready to begin.</p>
        <form id="registerForm" class="auth-form">
          <label>Full name<input type="text" id="registerName" autocomplete="name" minlength="2" placeholder="Your full name" required /></label>
          <label>Email address<input type="email" id="registerEmail" autocomplete="email" placeholder="you@example.com" required /></label>
          <label>Password<input type="password" id="registerPassword" autocomplete="new-password" minlength="6" placeholder="At least 6 characters" required /></label>
          <label>Confirm password<input type="password" id="registerConfirm" autocomplete="new-password" minlength="6" placeholder="Repeat your password" required /></label>
          <p class="form-error" id="registerError" role="alert"></p>
          <button class="primary-button auth-submit" type="submit">Create account</button>
        </form>
        <p class="auth-switch">Already registered? <button id="showLogin" type="button">Sign in</button></p>
      </div>
    </section>`;

  document.querySelector("#registerForm").addEventListener("submit", handleRegister);
  document.querySelector("#showLogin").addEventListener("click", renderLogin);
  app.focus();
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.querySelector("#loginEmail").value.trim().toLowerCase();
  const password = document.querySelector("#loginPassword").value;
  const error = document.querySelector("#loginError");
  const button = event.submitter;
  error.textContent = "";
  button.disabled = true;
  button.textContent = "Signing in…";
  try {
    const result = await api("/api/login", { method: "POST", body: JSON.stringify({ email, password }) });
    authToken = result.token;
    currentUser = result.user;
    localStorage.setItem(AUTH_TOKEN_KEY, authToken);
    updateHeader();
    showToast(`Welcome back, ${currentUser.name.split(" ")[0]}!`);
    renderHome();
  } catch (requestError) {
    error.textContent = requestError.message;
    button.disabled = false;
    button.textContent = "Sign in";
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const name = document.querySelector("#registerName").value.trim();
  const email = document.querySelector("#registerEmail").value.trim().toLowerCase();
  const password = document.querySelector("#registerPassword").value;
  const confirmPassword = document.querySelector("#registerConfirm").value;
  const error = document.querySelector("#registerError");
  const button = event.submitter;

  if (password !== confirmPassword) { error.textContent = "The passwords do not match."; return; }
  error.textContent = "";
  button.disabled = true;
  button.textContent = "Creating account…";
  try {
    const result = await api("/api/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
    authToken = result.token;
    currentUser = result.user;
    localStorage.setItem(AUTH_TOKEN_KEY, authToken);
    updateHeader();
    showToast("Your account is ready.");
    renderHome();
  } catch (requestError) {
    error.textContent = requestError.message;
    button.disabled = false;
    button.textContent = "Create account";
  }
}

async function logout() {
  try { await api("/api/logout", { method: "POST" }); }
  catch { /* The local session is still cleared if the server is unavailable. */ }
  localStorage.removeItem(AUTH_TOKEN_KEY);
  authToken = "";
  currentUser = null;
  renderLogin();
  showToast("You have been signed out.");
}

async function saveAttempt(correct) {
  if (!currentUser) return;
  const result = await api("/api/attempts", {
    method: "POST",
    body: JSON.stringify({ section: questionSections[activeSectionIndex].shortTitle, correct, total: questions.length })
  });
  currentUser = result.user;
}

async function renderProfile() {
  if (!currentUser) { renderLogin(); return; }
  try {
    const result = await api("/api/me");
    currentUser = result.user;
  } catch (requestError) {
    if (requestError.message === "Please sign in again.") { await logout(); return; }
    showToast(requestError.message);
  }
  const attempts = currentUser.attempts || [];
  const passed = attempts.filter(attempt => attempt.passed).length;
  const totalCorrect = attempts.reduce((sum, attempt) => sum + attempt.correct, 0);
  const totalPossible = attempts.reduce((sum, attempt) => sum + attempt.total, 0);
  const overall = totalPossible ? Math.round((totalCorrect / totalPossible) * 100) : 0;
  const initials = currentUser.name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase();
  const joined = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(currentUser.joinedAt));
  window.scrollTo({ top: 0, behavior: "smooth" });

  app.innerHTML = `
    <section class="page profile-page">
      <button class="back-button" id="profileBack" type="button">← Back to courses</button>
      <div class="profile-hero">
        <div class="profile-identity"><span class="profile-avatar">${escapeHtml(initials)}</span><div><p class="eyebrow">Your profile</p><h1>${escapeHtml(currentUser.name)}</h1><p>${escapeHtml(currentUser.email)} · Member since ${joined}</p></div></div>
        <button class="secondary-button logout-button" id="logoutButton" type="button">Sign out</button>
      </div>
      <div class="profile-stats">
        <article><span>Total attempts</span><strong>${attempts.length}</strong><small>Completed sections</small></article>
        <article><span>Passed attempts</span><strong>${passed}</strong><small>Score of 70% or higher</small></article>
        <article><span>Total score</span><strong>${totalCorrect}<em>/${totalPossible}</em></strong><small>${overall}% overall accuracy</small></article>
      </div>
      <div class="attempts-heading"><div><p class="eyebrow">Learning activity</p><h2>Past attempts</h2></div>${attempts.length ? `<span>${attempts.length} result${attempts.length === 1 ? "" : "s"}</span>` : ""}</div>
      ${attempts.length ? `
        <div class="attempt-list">
          ${attempts.map(attempt => `
            <article class="attempt-row">
              <div class="attempt-icon ${attempt.passed ? "passed" : "needs-review"}">${attempt.passed ? "✓" : "↗"}</div>
              <div class="attempt-info"><h3>${attempt.section}</h3><p>${new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(attempt.completedAt))}</p></div>
              <span class="attempt-status ${attempt.passed ? "passed" : "needs-review"}">${attempt.passed ? "Passed" : "Review"}</span>
              <div class="attempt-score"><strong>${attempt.percentage}%</strong><span>${attempt.correct} / ${attempt.total} correct</span></div>
            </article>`).join("")}
        </div>` : `
        <div class="empty-attempts"><span>◎</span><h3>No attempts yet</h3><p>Complete an AZ-104 section and your score will appear here.</p><button class="primary-button" id="startFromProfile" type="button">Choose a section</button></div>`}
    </section>`;

  document.querySelector("#profileBack").addEventListener("click", renderHome);
  document.querySelector("#logoutButton").addEventListener("click", logout);
  document.querySelector("#startFromProfile")?.addEventListener("click", renderSections);
  app.focus();
}

function renderHome() {
  if (!currentUser) { renderLogin(); return; }
  window.scrollTo({ top: 0, behavior: "smooth" });
  app.innerHTML = `
    <section class="page home-page">
      <p class="eyebrow">Azure certification practice</p>
      <h1>Build confidence.<br>Master the cloud.</h1>
      <p class="hero-copy">Focused practice questions, clear explanations, and instant feedback to help you prepare with purpose.</p>

      <div class="section-heading">
        <div><p class="eyebrow">Course library</p><h2>Choose your certification</h2></div>
        <p>1 course available</p>
      </div>

      <div class="course-grid">
        <article class="course-card available" id="az104Card" tabindex="0" role="button" aria-label="View AZ-104 practice sections">
          <div class="course-top"><span class="course-icon">${icons.cloud}</span><span class="tag">Available</span></div>
          <h3>AZ-104</h3>
          <p class="course-name">Microsoft Azure Administrator</p>
          <div class="course-meta">
            <span>${icons.list} ${totalQuestions} questions</span>
            <span>${icons.clock} 5 sections</span>
            <span class="arrow-button">Explore →</span>
          </div>
        </article>

        <article class="course-card coming-soon" aria-disabled="true">
          <div class="course-top"><span class="course-icon">${icons.shield}</span><span class="tag muted">Coming soon</span></div>
          <h3>AZ-900</h3>
          <p class="course-name">Microsoft Azure Fundamentals</p>
          <div class="course-meta"><span>${icons.list} Course in development</span></div>
        </article>
      </div>
    </section>`;

  const card = document.querySelector("#az104Card");
  card.addEventListener("click", renderSections);
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); renderSections(); }
  });
  app.focus();
}

function renderSections() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  app.innerHTML = `
    <section class="page sections-page">
      <button class="back-button" id="sectionsBack" type="button">← Back to courses</button>
      <div class="sections-hero">
        <div>
          <p class="eyebrow">AZ-104 · Microsoft Azure Administrator</p>
          <h1>Choose a section</h1>
          <p>Each section contains 20 focused questions. Complete them one at a time and review every answer.</p>
        </div>
        <div class="question-total"><strong>${totalQuestions}</strong><span>questions total</span></div>
      </div>
      <div class="section-grid">
        ${questionSections.map((section, index) => `
          <article class="section-card" tabindex="0" role="button" data-section="${index}" aria-label="Start ${section.shortTitle} section">
            <div class="section-card-top"><span class="section-index">0${index + 1}</span><span class="tag">20 questions</span></div>
            <h2>${section.title}</h2>
            <p>${section.description}</p>
            <div class="section-start"><span>Begin section</span><span>→</span></div>
          </article>`).join("")}
      </div>
    </section>`;

  document.querySelector("#sectionsBack").addEventListener("click", renderHome);
  document.querySelectorAll(".section-card").forEach(card => {
    const openSection = () => startQuiz(Number(card.dataset.section));
    card.addEventListener("click", openSection);
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openSection(); }
    });
  });
  app.focus();
}

function startQuiz(sectionIndex = activeSectionIndex) {
  activeSectionIndex = sectionIndex;
  questions = questionSections[activeSectionIndex].questions;
  selections = new Array(questions.length).fill(null);
  renderQuiz();
}

function renderQuiz() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  app.innerHTML = `
    <section class="page quiz-page">
      <button class="back-button" id="backHome" type="button">← Back to sections</button>
      <div class="quiz-heading">
        <div><p class="eyebrow">AZ-104 · Section ${activeSectionIndex + 1} of ${questionSections.length}</p><h1>${questionSections[activeSectionIndex].shortTitle}</h1><p>Select one answer for each question.</p></div>
        <span class="answered-count"><strong id="answeredNumber">0</strong> of ${questions.length} answered</span>
      </div>
      <div class="progress-track" aria-label="Quiz progress"><div class="progress-bar" id="progressBar"></div></div>
      <form id="quizForm">
        <div class="question-list">
          ${questions.map((item, qIndex) => `
            <article class="question-card" id="question-${qIndex}">
              <p class="question-number">Question ${qIndex + 1} · ${item.domain}</p>
              <h2>${item.question}</h2>
              <div class="options">
                ${item.options.map((option, oIndex) => `
                  <label class="option">
                    <input type="radio" name="question-${qIndex}" value="${oIndex}" />
                    <span class="radio-ui" aria-hidden="true"></span>
                    <span class="option-text">${option}</span>
                  </label>`).join("")}
              </div>
            </article>`).join("")}
        </div>
        <div class="submit-panel">
          <p>Review your choices before submitting.</p>
          <button class="primary-button" type="submit">Submit assessment</button>
        </div>
      </form>
    </section>`;

  document.querySelector("#backHome").addEventListener("click", renderSections);
  const form = document.querySelector("#quizForm");
  form.addEventListener("change", event => {
    const index = Number(event.target.name.split("-")[1]);
    selections[index] = Number(event.target.value);
    updateProgress();
  });
  form.addEventListener("submit", submitQuiz);
  app.focus();
}

function updateProgress() {
  const answered = selections.filter(answer => answer !== null).length;
  document.querySelector("#answeredNumber").textContent = answered;
  document.querySelector("#progressBar").style.width = `${(answered / questions.length) * 100}%`;
}

function submitQuiz(event) {
  event.preventDefault();
  const firstMissing = selections.findIndex(answer => answer === null);
  if (firstMissing !== -1) {
    showToast(`Please answer question ${firstMissing + 1} before submitting.`);
    document.querySelector(`#question-${firstMissing}`).scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  renderResults();
}

async function renderResults() {
  const correct = questions.reduce((total, question, index) => total + (selections[index] === question.answer ? 1 : 0), 0);
  const percentage = Math.round((correct / questions.length) * 100);
  const passed = percentage >= 70;
  try { await saveAttempt(correct); }
  catch (requestError) { showToast(`Score could not be saved: ${requestError.message}`); }
  window.scrollTo({ top: 0, behavior: "smooth" });

  app.innerHTML = `
    <section class="page results-page">
      <div class="score-card">
        <div class="score-ring" style="--score-angle: ${percentage * 3.6}deg"><span class="score-value">${percentage}%</span></div>
        <div class="score-summary">
          <p class="eyebrow">${questionSections[activeSectionIndex].shortTitle} complete</p>
          <h1>${passed ? "Strong work — you passed." : "Good start — keep building."}</h1>
          <p>You answered ${correct} of ${questions.length} questions correctly.</p>
        </div>
        <div class="score-actions">
          <button class="primary-button" id="retryQuiz" type="button">Try again</button>
          <button class="secondary-button" id="resultsHome" type="button">All sections</button>
        </div>
      </div>

      <div class="stats">
        <div class="stat"><strong>${correct}</strong><span>Correct answers</span></div>
        <div class="stat"><strong>${questions.length - correct}</strong><span>Incorrect answers</span></div>
        <div class="stat"><strong>${passed ? "Passed" : "Review"}</strong><span>70% target score</span></div>
      </div>

      <div class="review-heading"><h2>Answer review</h2><p>Compare your answers and read the explanation for each question.</p></div>
      <div class="question-list">
        ${questions.map((item, index) => {
          const isCorrect = selections[index] === item.answer;
          const userAnswer = item.options[selections[index]];
          const correctAnswer = item.options[item.answer];
          return `
            <article class="question-card review-card ${isCorrect ? "correct" : "incorrect"}">
              <span class="review-status">${isCorrect ? "✓ Correct" : "✕ Incorrect"}</span>
              <p class="question-number">Question ${index + 1} · ${item.domain}</p>
              <h2>${item.question}</h2>
              <div class="answer-row ${isCorrect ? "user-correct" : "user-wrong"}"><small>Your answer</small>${userAnswer}</div>
              ${isCorrect ? "" : `<div class="answer-row correct-answer"><small>Correct answer</small>${correctAnswer}</div>`}
              <p class="explanation"><strong>Why:</strong> ${item.explanation}</p>
            </article>`;
        }).join("")}
      </div>
    </section>`;

  document.querySelector("#retryQuiz").addEventListener("click", () => startQuiz(activeSectionIndex));
  document.querySelector("#resultsHome").addEventListener("click", renderSections);
  app.focus();
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

document.querySelector("#brandButton").addEventListener("click", renderHome);
document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("cloudprep-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("cloudprep-theme") === "dark") document.body.classList.add("dark");

async function bootstrap() {
  if (authToken) {
    try {
      const result = await api("/api/me");
      currentUser = result.user;
    } catch {
      authToken = "";
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }
  updateHeader();
  if (currentUser) renderHome();
  else renderLogin();
}

bootstrap();
