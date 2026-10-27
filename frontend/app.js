const demoCase = `SYNTHETIC TRAINING CASE — DEMO-042
This is fictional training material created for software demonstration. All names, identifiers, dates, and locations are invented.

Incident note (2026-08-14, 18:40): A report recorded that a blue delivery van was observed near Warehouse 12. The note does not record the registration number or the observer's identity.

Interview note (2026-08-15): A fictional witness identified in the record as W-02 stated that they saw an individual called "R. Sen" speaking with a person wearing a grey jacket near the east entrance. The witness said they were uncertain about the time.

Property log (2026-08-16): One sealed storage device, item E-17, was logged by Officer O-04. The log states the seal was intact at intake. The contents of the device have not been reviewed in this sample.

Location note: Warehouse 12 and the east entrance are mentioned in separate notes. The material does not establish that the van, R. Sen, or item E-17 are connected.

Review note: No conclusion about wrongdoing can be drawn from this fictional material. Original records, timestamps, identity details, and chain-of-custody documentation would need independent verification.`;

const caseText = document.getElementById("caseText");
const question = document.getElementById("question");
const analyzeBtn = document.getElementById("analyzeBtn");
const errorMessage = document.getElementById("errorMessage");
const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");
const resultState = document.getElementById("resultState");
const resultText = document.getElementById("resultText");
const charCount = document.getElementById("charCount");
let mode = "summary";
let lastResult = "";

function updateCount() {
  charCount.textContent = `${caseText.value.length.toLocaleString()} / 30,000`;
}
caseText.addEventListener("input", updateCount);

document.getElementById("loadDemo").addEventListener("click", () => {
  caseText.value = demoCase;
  updateCount();
  errorMessage.hidden = true;
});

document.getElementById("clearText").addEventListener("click", () => {
  caseText.value = "";
  updateCount();
  caseText.focus();
});

document.querySelectorAll(".mode-card").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mode-card").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    mode = button.dataset.mode;
    const prompts = {
      summary: "Summarize the recorded facts and identify what needs verification.",
      entities: "Extract entities explicitly mentioned and provide supporting phrases.",
      question: "What facts are explicitly recorded, and what remains uncertain?"
    };
    question.value = prompts[mode];
  });
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const isEntities = button.dataset.view === "entities";
    mode = isEntities ? "entities" : "summary";
    document.querySelectorAll(".mode-card").forEach((item) => {
      item.classList.toggle("selected", item.dataset.mode === mode);
    });
    document.getElementById("breadcrumbCurrent").textContent = isEntities ? "Entity extraction" : "Evidence analysis";
    question.value = isEntities
      ? "Extract entities explicitly mentioned and provide supporting phrases."
      : "Summarize the recorded facts and identify what needs verification.";
    document.querySelector(".source-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function setView(view) {
  emptyState.hidden = view !== "empty";
  loadingState.hidden = view !== "loading";
  resultState.hidden = view !== "result";
}

analyzeBtn.addEventListener("click", async () => {
  errorMessage.hidden = true;
  const text = caseText.value.trim();
  if (text.length < 20) {
    errorMessage.textContent = "Add at least 20 characters of source material, or load the synthetic sample.";
    errorMessage.hidden = false;
    caseText.focus();
    return;
  }
  if (question.value.trim().length < 3) {
    errorMessage.textContent = "Enter a question or analysis instruction.";
    errorMessage.hidden = false;
    question.focus();
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = "<span>Analyzing…</span><span>◌</span>";
  setView("loading");

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ case_text: text, question: question.value.trim(), mode })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || `Request failed (${response.status})`);
    lastResult = data.result || "";
    resultText.textContent = lastResult;
    document.getElementById("modelName").textContent = data.model || "Gemma 4";
    setView("result");
  } catch (error) {
    setView("empty");
    errorMessage.textContent = error.message || "Could not connect to CIPHER AI. Check that the backend is running.";
    errorMessage.hidden = false;
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = "<span>Run analysis</span><span>↗</span>";
  }
});

document.getElementById("copyResult").addEventListener("click", async () => {
  if (!lastResult) return;
  try {
    await navigator.clipboard.writeText(lastResult);
    document.getElementById("copyResult").textContent = "Copied ✓";
    setTimeout(() => document.getElementById("copyResult").textContent = "Copy analysis", 1500);
  } catch {
    errorMessage.textContent = "Clipboard access is unavailable in this browser.";
    errorMessage.hidden = false;
  }
});

document.getElementById("newAnalysis").addEventListener("click", () => {
  setView("empty");
  caseText.focus();
});

fetch("/api/health")
  .then((response) => response.json())
  .then((data) => {
    const dot = document.getElementById("modelDot");
    dot.style.background = data.model_configured ? "var(--mint)" : "#d8a85e";
    dot.title = data.model_configured ? "API key configured" : "API key not configured";
  })
  .catch(() => {
    document.getElementById("modelDot").style.background = "#e78383";
    document.getElementById("modelDot").title = "Backend unavailable";
  });
