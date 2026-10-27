# CIPHER — Gemma 4-Powered Evidence Intelligence

### AI-Assisted Criminal Network Analysis | Hacktoberfest Hack Day Chandigarh 2026

**CIPHER** is an AI-assisted investigative intelligence platform designed to help authorized investigators organize case evidence, identify candidate entities, explore potential relationships, and prioritize leads for human review.

By combining **Gemma 4, FastAPI, structured evidence processing, and graph-based relationship analysis**, CIPHER aims to make complex investigative workflows easier to navigate while keeping human investigators responsible for verification and consequential decisions.

> **Our mission:** Turn fragmented evidence into structured, reviewable intelligence—with AI assistance, evidence traceability, and human oversight.

[Live Demo](YOUR_AWS_DEPLOYMENT_URL) · [Source Code](YOUR_GITHUB_REPOSITORY_URL) · [Report an Issue](YOUR_GITHUB_REPOSITORY_URL/issues)

---

## Table of Contents

- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [Why Gemma 4?](#why-gemma-4)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [AWS Deployment](#aws-deployment)
- [Local Setup](#local-setup)
- [Environment Configuration](#environment-configuration)
- [Testing and Validation](#testing-and-validation)
- [Responsible AI and Security](#responsible-ai-and-security)
- [Limitations and Future Work](#limitations-and-future-work)
- [Open Source and Contributions](#open-source-and-contributions)
- [Acknowledgements](#acknowledgements)

## The Problem

Investigations involving interconnected entities can require investigators to review large volumes of fragmented information, including case notes, documents, locations, communications, and relationships.

This can create several challenges:

- Important information is distributed across multiple records.
- Manually reviewing evidence takes time.
- Potential connections are difficult to discover across disconnected data.
- Unstructured information is difficult to convert into a consistent analytical format.
- AI-generated hypotheses must be distinguished from verified evidence.
- Investigators need tools that assist their judgment without replacing it.

Traditional data-management tools may organize records but provide limited support for extracting structured information from unstructured text.

CIPHER explores how AI-assisted language understanding and graph-based analysis can help address these challenges.

## Our Solution

CIPHER provides an investigative workspace that combines evidence organization, AI-assisted analysis, and relationship exploration.

The platform is designed to support an end-to-end workflow:

1. Organize information within an investigation.
2. Process supported evidence and case notes.
3. Use Gemma 4 for configured AI analysis tasks.
4. Extract candidate entities and possible relationships.
5. Organize relevant information for graph-based exploration.
6. Review findings against their source material.
7. Keep the investigator in control of verification and final decisions.

CIPHER is an investigative decision-support tool, not an automated criminality detector. A generated relationship or model response is not proof of wrongdoing.

## Why Gemma 4?

Gemma is Google's family of open-weight AI models. CIPHER uses its configured Gemma integration to explore how language models can assist with structured analysis of investigative material.

### Role of Gemma 4 in CIPHER

The model can support configured tasks such as:

- **Case summarization:** Convert lengthy notes into concise summaries.
- **Entity extraction:** Identify candidate people, organizations, locations, and other relevant entities.
- **Relationship discovery:** Identify possible connections described in the supplied material.
- **Structured output:** Produce information that the backend can validate and present to the application.
- **Investigator assistance:** Help users navigate evidence and prioritize material for further examination.

The exact capabilities depend on the enabled application endpoints, prompts, model configuration, and validation logic.

### Why an open-weight model?

Gemma makes it possible to explore AI-assisted analysis using an open-weight model family and compatible inference infrastructure.

This approach supports experimentation, model evaluation, and future deployment choices while keeping the application's analysis workflow separate from the model provider.

Open weights do not automatically mean that every API, deployment, or use is unrestricted. Model licensing and the chosen inference provider's terms must still be respected.

### Model configuration

The model and credentials are configured through environment variables rather than hard-coded into the source code.

```env
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=your_verified_gemma_4_model_id
```

The configured model ID must match a model actually supported by the chosen inference API and account.

**Verification note:** CIPHER's model identity should be confirmed using the deployed application's configuration and successful inference tests. Merely setting an environment variable is not sufficient evidence that a request used Gemma 4.

Official references:

- [Gemma documentation](https://ai.google.dev/gemma/docs)
- [Gemini API documentation](https://ai.google.dev/gemini-api/docs)
- [Google AI Studio](https://aistudio.google.com/)

## Key Features

### 1. Evidence Intelligence

Organize case-related information into a more structured workflow for investigation and review.

### 2. AI-Assisted Case Analysis

Use the configured Gemma integration for supported text-analysis tasks, with errors surfaced when model requests fail.

### 3. Candidate Entity Extraction

Convert relevant unstructured text into candidate entities that can be examined against source evidence.

### 4. Relationship Exploration

Represent relevant entities and potential connections through graph-based analysis where the graph backend is configured and available.

### 5. Human-in-the-Loop Verification

Keep a clear distinction between AI-generated candidates and findings that have been independently reviewed.

### 6. API-Based Backend

Use a FastAPI backend to coordinate application requests, evidence processing, model integration, and supported persistence operations.

### 7. Cloud Deployment

Deploy the application on AWS so that the project can be accessed and demonstrated through a hosted environment.

### 8. Configurable Architecture

Separate model configuration, application logic, and persistence settings to make the system easier to maintain and extend.

*Only features verified in the deployed version should be presented as fully operational.*

## How It Works

### Investigation workflow

**Step 1 — Select a case**

An authorized investigator opens a case through the application's supported interface.

**Step 2 — Supply evidence**

The investigator provides supported case notes or other authorized evidence.

**Step 3 — Prepare the input**

The backend validates the request and prepares the relevant content for analysis.

**Step 4 — Invoke Gemma 4**

The configured AI integration sends the analysis request to the selected Gemma model and receives a response.

**Step 5 — Extract structured information**

The application processes the response into summaries, candidate entities, or possible relationships, depending on the selected task.

**Step 6 — Explore connections**

Supported graph functionality helps the investigator inspect relationships among entities and records.

**Step 7 — Verify findings**

The investigator checks the generated results against source evidence before treating a finding as verified.

**Step 8 — Continue the investigation**

Reviewed information can support subsequent investigative work through the application's available case-management features.

## System Architecture

CIPHER is organized into the following logical layers.

```text
                 INVESTIGATOR
                       |
                       v
              CIPHER WEB INTERFACE
                       |
                       v
                FASTAPI BACKEND
                       |
          +------------+------------+
          |            |            |
          v            v            v
     EVIDENCE       GEMMA 4      AUTHENTICATION
     PROCESSING     INFERENCE    & AUTHORIZATION
          |            |            |
          +------------+------------+
                       |
                       v
              STRUCTURED RESULTS
                       |
               +-------+-------+
               |               |
               v               v
          DATA STORAGE     GRAPH ANALYSIS
               |               |
               +-------+-------+
                       |
                       v
               HUMAN VERIFICATION
```

This diagram describes the logical architecture. The exact request paths and storage integrations depend on the deployed configuration.

### Frontend

Provides the investigator-facing interface for supported case workflows, evidence review, and presentation of analytical results.

### Backend

FastAPI exposes application endpoints, validates requests, coordinates analysis, and manages communication with configured dependencies.

### Gemma inference service

Handles model requests, model configuration, response processing, and provider errors.

### Data and graph services

Relational storage can manage structured records. Neo4j can represent entities and relationships when configured and connected.

### Review and verification

AI-generated candidates remain distinct from independently verified findings, helping prevent speculative output from being treated as established fact.

## Technology Stack

The project uses the following technologies where enabled in the deployed build.

| Technology | Role |
|---|---|
| Python | Backend and evidence-processing logic |
| FastAPI | HTTP API and request handling |
| Gemma 4 | Configured AI model for supported language-analysis tasks |
| Google AI API | Hosted model-inference interface, where configured |
| HTML, CSS, JavaScript | Web interface |
| PostgreSQL | Relational storage, when configured |
| SQLAlchemy | Database access, when used |
| Neo4j | Graph storage and relationship exploration, when configured |
| JWT | Token-based authentication, where enabled |
| AWS | Cloud hosting and deployment |
| Git and GitHub | Version control and collaboration |

## AWS Deployment

CIPHER is deployed on Amazon Web Services.

**Live application:** [Open the CIPHER demo](YOUR_AWS_DEPLOYMENT_URL)

Replace the placeholder above with the actual public HTTPS URL.

The deployed application depends on its configured AWS hosting environment, runtime settings, secrets, and connected services.

### Deployment configuration

The following values should be configured through the deployment environment or an appropriate secrets manager:

- Model API credentials.
- Model identifier.
- Backend runtime settings.
- Database connection details, if required.
- Graph database connection details, if required.
- Authentication and security settings.
- Frontend API base URL.

Credentials should never be embedded in frontend JavaScript or committed to the repository.

### Deployment verification

The deployment should be tested for:

- Successful application startup.
- Reachability of the intended public URL.
- Backend health and API availability.
- Successful model inference.
- Correct frontend-to-backend communication.
- Appropriate handling of provider and database failures.
- Absence of exposed API credentials.

## Local Setup

### Prerequisites

- Python compatible with the project's dependency versions.
- Git, if cloning the repository.
- A modern web browser.
- A valid API credential for the configured hosted Gemma inference endpoint.
- Database services only if required by the selected application workflow.

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_DIRECTORY
```

Replace the placeholders with the actual repository URL and directory.

### 2. Create a virtual environment

On Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

On macOS or Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

Use the requirements file included in the actual project.

For a root-level requirements file:

```bash
python -m pip install -r requirements.txt
```

If the file is under `python_backend`:

```bash
python -m pip install -r python_backend/requirements.txt
```

### 4. Configure environment variables

Copy the supplied environment template to `.env` in the location expected by the backend.

Set the model credentials and identifier:

```env
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=your_verified_gemma_4_model_id
```

Configure other application variables as documented by the repository.

### 5. Start the backend

For a project whose FastAPI entry point is `python_backend.main:app`, run:

```bash
python -m uvicorn python_backend.main:app --reload --host 127.0.0.1 --port 8000
```

If the project uses a startup script or a different import path, follow the actual project instructions instead.

### 6. Open the API documentation

If the backend is running on port 8000 and exposes these routes:

- API documentation: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

A successful health response does not necessarily verify the database or AI inference service. Those components must be tested independently.

### 7. Start the frontend

Use the supplied frontend instructions. For a static frontend, a local HTTP server may be suitable:

```bash
python -m http.server 5500 --directory frontend
```

Open http://127.0.0.1:5500 and confirm that the configured API URL points to the correct backend.

## Testing and Validation

The deployed project has been tested according to the project team's reported results. Record the actual test cases and results in the repository so that reviewers can reproduce them.

### Recommended validation checklist

- [ ] Backend startup and import checks.
- [ ] API health endpoint.
- [ ] Authentication and authorization checks.
- [ ] Database connectivity, if enabled.
- [ ] Graph database connectivity, if enabled.
- [ ] Live Gemma inference using the configured model.
- [ ] Case-analysis endpoint behavior.
- [ ] Frontend-to-backend communication.
- [ ] Provider timeout and invalid-credential handling.
- [ ] AI-generated candidate labeling and human-review workflow.
- [ ] Secret scanning and repository security checks.

### Model verification

A successful AI request should be recorded with the test date, configured model ID, task, and outcome. Never include the API key in logs or test reports.

If the application supports fallback providers, the model used for each request should be identified accurately. A response from another model must not be reported as a Gemma response.

Do not publish performance benchmarks or numerical accuracy claims without measured results.

## Responsible AI and Security

CIPHER is designed as an investigative decision-support tool.

AI-generated output may contain inaccuracies, omissions, or unsupported connections. A relationship appearing in a graph does not establish guilt or prove that the relationship is meaningful.

The project should follow these principles:

- Preserve source evidence and its provenance where supported.
- Label AI-generated entities and relationships as candidates.
- Require appropriate human verification before consequential use.
- Avoid treating correlation as proof of wrongdoing.
- Apply authentication and case-level authorization to sensitive operations.
- Use synthetic or authorized evidence for testing and demonstrations.
- Minimize sensitive information sent to external AI services.
- Store credentials in environment variables or a secrets manager.
- Keep secrets out of source control, browser code, and logs.
- Report model errors and fallback behavior clearly.

CIPHER should not be used as the sole basis for arrest, prosecution, or other consequential decisions.

## Limitations and Future Work

Potential areas for continued development include:

- More robust evidence provenance and source-level citations.
- Stronger validation of structured model outputs.
- Evaluation on carefully designed synthetic datasets.
- Improved model-failure handling and reproducible inference tests.
- Enhanced graph visualization and relationship review.
- Better audit trails for investigator decisions.
- More granular authorization and access controls.
- Model evaluation for hallucinations, omissions, and false associations.
- Expanded deployment monitoring and operational documentation.

These are future improvements unless explicitly implemented in the submitted version.

## Open Source and Contributions

CIPHER is intended to support transparent development and reproducible evaluation.

Contributors can:

1. Fork or clone the repository.
2. Create a feature branch.
3. Implement and test a change.
4. Update relevant documentation.
5. Open a pull request describing the change.

Before describing the project as open-source licensed, include an appropriate `LICENSE` file and verify the repository's licensing terms.

Do not commit API keys, private environment files, confidential case records, or other secrets.

## Acknowledgements

- [Google Gemma](https://ai.google.dev/gemma/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Neo4j Documentation](https://neo4j.com/docs/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Amazon Web Services](https://aws.amazon.com/)

## Project Status

CIPHER is deployed on AWS, 

The deployed build should be evaluated using its actual public URL and reproducible test results. Model identity, enabled features, and live inference behavior should be documented according to the configuration and tests of that build.

---

**CIPHER — Evidence intelligence with AI assistance, graph-based exploration, and human oversight.**
