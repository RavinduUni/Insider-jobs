# InsiderJobs — System Design Document

> A full-stack freelancing/internship marketplace connecting **Students** with **Recruiters (Companies)**, moderated by an **Admin**, with AI-assisted project matching.

---

## 1. Overview

InsiderJobs is a MERN-based platform (MongoDB, Express, React, Node.js) where:

- **Recruiters** post projects (gigs) with budgets, deadlines, and requirements.
- **Students** browse/receive AI-recommended projects, apply with a CV + project plan, sign NDAs, get assigned, and get paid/reviewed on completion.
- **Admins** moderate the platform (analytics, user/project/application/NDA management, cascading deletes).

### 1.1 Tech Stack

| Layer | Technology |
|---|---|
| Presentation (Client) | React 19, React Router v7, Vite 7, Tailwind CSS v4, Recharts, GSAP/AOS (animation), Axios/Fetch |
| Application (Server) | Node.js, Express 5, JWT (`jsonwebtoken`), `bcrypt`, `multer` (file uploads) |
| Database | MongoDB with Mongoose 8 ODM |
| External Services | Cloudinary (file/image storage), Google Gemini (via OpenAI-compatible SDK) for AI matching & resume enhancement, Nodemailer (Gmail SMTP) for OTP emails |
| Deployment | Docker (server Dockerfile), Kubernetes (`server/k8s/app.yaml`), GitHub Actions CI (`.github/workflows/ci.yaml`) |

### 1.2 User Roles

1. **Student** — the talent supplying labor.
2. **Recruiter** — represents a company; posts and manages projects.
3. **Admin** — platform super-user with full moderation rights.

---

## 2. High-Level Architecture (3-Tier + External Services)

The system follows a classic **3-tier architecture**: Presentation → Application → Data, with the Application tier fanning out to three external SaaS integrations.

```mermaid
flowchart TB
    subgraph PRESENTATION["🖥️ PRESENTATION LAYER (Client — React SPA)"]
        UI_Public["Public Pages<br/>Home · AllProjects · Companies · Pricing · About"]
        UI_Auth["AuthPage<br/>(Student / Recruiter / Admin login & register)"]
        UI_Student["Student Dashboard<br/>Browse · Apply · NDAs · Wallet · ResumeBuilder"]
        UI_Owner["Recruiter (Owner) Dashboard<br/>Projects · Applicants · NDA · Payments · Reviews"]
        UI_Admin["Admin Dashboard<br/>Stats · User/Project Moderation"]
        Ctx["AppContext (Global State)<br/>token, role, user, projects, companies"]
        RouteGuard["Route Protectors<br/>StudentRoutesProtector / RecruiterRouterProtector<br/>(JWT decode + expiry + role check)"]
    end

    subgraph APPLICATION["⚙️ APPLICATION LAYER (Node.js / Express 5 Server)"]
        MW["Middleware<br/>cors · express.json · multer (disk) · verifyToken (JWT + RBAC)"]
        Routes["REST Routers<br/>/api/student · /api/recruiter · /api/projects · /api/companies · /api/admin"]
        Controllers["Controllers<br/>studentController · recruiterController · projectsController · companyController · adminController"]
        Utils["Utils<br/>generateToken · generateOtp · sendOtpEmail"]
    end

    subgraph DATA["🗄️ DATA LAYER (MongoDB Atlas / Mongoose)"]
        DB[("MongoDB Database<br/>Student · Recruiter · Admin · Project · Application · NDA · Review")]
    end

    subgraph EXTERNAL["☁️ EXTERNAL SERVICES"]
        Cloudinary["Cloudinary<br/>(resumes, CVs, project plans, NDAs,<br/>profile pics, company logos)"]
        Gemini["Google Gemini<br/>(OpenAI-compatible Chat Completions API)<br/>Project matching · Resume enhancement"]
        SMTP["Nodemailer + Gmail SMTP<br/>OTP verification emails"]
    end

    UI_Public --> Ctx
    UI_Auth --> Ctx
    UI_Student --> RouteGuard
    UI_Owner --> RouteGuard
    RouteGuard --> Ctx
    Ctx -->|"fetch() + Bearer JWT"| Routes

    Routes --> MW --> Controllers
    Controllers --> Utils
    Controllers <-->|"Mongoose ODM (CRUD, transactions)"| DB
    Controllers <-->|"upload / destroy files"| Cloudinary
    Controllers -->|"chat.completions.create()"| Gemini
    Controllers -->|"sendMail()"| SMTP

    Controllers -->|"JSON response"| Routes
    Routes -->|"JSON response"| Ctx
    Ctx --> UI_Student
    Ctx --> UI_Owner
    Ctx --> UI_Admin

    style PRESENTATION fill:#1e3a5f,color:#fff
    style APPLICATION fill:#3d2e5f,color:#fff
    style DATA fill:#1f4d3d,color:#fff
    style EXTERNAL fill:#5f3d1e,color:#fff
```

**Key architectural notes:**
- The client is a **Single Page Application**; all navigation between roles is client-side routed with `react-router-dom`, and access is gated by `<RouteProtector>` wrapper components that decode the JWT locally (no server round-trip needed to gate a route).
- The server is **stateless** — every protected request carries a `Bearer <JWT>` header; there is no server-side session store.
- `AppContext` is the single source of truth on the client: it holds the JWT, decoded role, hydrated user profile, and shared lists (`projects`, `companies`, `allApplicants`, `recommendedProjects`), fetched via `useEffect` hooks and exposed to all components via React Context.
- The Application layer never talks to external services directly from routes — always through controllers, keeping Cloudinary/Gemini/SMTP credentials and logic encapsulated in `server/configs/*.js`.

---

## 3. Request Lifecycle (Presentation ↔ Application ↔ Data)

Generic path every request takes through the stack:

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant R as React Component
    participant CTX as AppContext
    participant EXP as Express Router
    participant MW as Middleware (multer / verifyToken)
    participant C as Controller
    participant M as Mongoose Model
    participant DB as MongoDB

    U->>R: Interacts (click / submit form)
    R->>CTX: Read token / trigger fetch
    CTX->>EXP: HTTP request (Authorization: Bearer JWT, JSON or FormData)
    EXP->>MW: Route matched
    MW->>MW: multer parses multipart file(s) to disk
    MW->>MW: verifyToken: jwt.verify() -> decode {userId, role}
    MW->>M: findById(userId) by role (Student/Recruiter/Admin)
    M->>DB: query
    DB-->>M: user doc
    MW->>C: req.user populated -> next()
    C->>M: business logic (find/save/update/delete)
    M->>DB: CRUD operation
    DB-->>M: result
    M-->>C: document(s)
    C-->>EXP: res.status(...).json({success, data})
    EXP-->>CTX: JSON response
    CTX->>CTX: setState (user/projects/applications/...)
    CTX-->>R: re-render with new state
    R-->>U: Updated UI
```

---

## 4. External Service Integrations

### 4.1 Cloudinary — File & Media Storage

Used for every binary asset in the system: student resumes, profile pictures, company logos, application CVs, project plans, and signed NDA documents.

```mermaid
sequenceDiagram
    participant Client as React Client
    participant Server as Express Controller
    participant Multer as Multer (disk buffer)
    participant CDN as Cloudinary

    Client->>Server: multipart/form-data (file + fields)
    Server->>Multer: middleware intercepts, saves temp file to local disk
    Multer-->>Server: req.file / req.files with local path
    Server->>CDN: cloudinary.uploader.upload(localPath, {folder, resource_type:'raw'})
    CDN-->>Server: {secure_url, public_id}
    Server->>Server: Save secure_url into MongoDB document
    alt DB save fails
        Server->>CDN: cloudinary.uploader.destroy(public_id)  (rollback/cleanup)
    end
    Server-->>Client: {success, url}
```

- Config: `server/configs/cloudinary.js` (cloud name, API key/secret from env).
- Folders used: `applications/cvs`, `applications/plans`, NDAs, profile pictures, company logos — organized by `resource_type: 'raw'` for documents.
- **Transactional safety**: in flows like `applyProject`, uploads happen before the MongoDB write; if the Mongoose `session.commitTransaction()` fails, the controller calls Cloudinary cleanup to delete the orphaned uploaded files, preventing storage leaks.
- Cascading deletes (Admin deleting a Student) also cascade into Cloudinary — every associated file (resume, profile picture, CVs, plans, NDAs) is destroyed before the corresponding MongoDB documents are removed.

### 4.2 Google Gemini — AI Matching & Resume Enhancement

Accessed through the **OpenAI-compatible SDK** pointed at Google's Gemini endpoint (`server/configs/ai.js`):

```js
const ai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: process.env.GEMINI_BASE_URL,
});
```

Two use cases:

```mermaid
sequenceDiagram
    participant Client as Student Dashboard
    participant Server as studentController
    participant DB as MongoDB
    participant Gemini as Google Gemini (Chat Completions)

    Note over Client,Gemini: Use Case A — Project Recommendations
    Client->>Server: GET /api/student/recommendations
    Server->>DB: fetch student {bio, skills}
    Server->>DB: fetch open/in_progress/completed projects
    Server->>Gemini: chat.completions.create({system: "return matchScores JSON", user: {student, projects}})
    Gemini-->>Server: {"recommendations":[{projectId, matchScore}, ...]}
    Server->>Server: map matchScore back onto full project docs, sort desc
    Server-->>Client: {success, recommendedProjects}

    Note over Client,Gemini: Use Case B — Resume Text Enhancement
    Client->>Server: POST /api/student/enhance {text}
    Server->>Gemini: chat.completions.create({prompt: "improve this resume bullet/section"})
    Gemini-->>Server: enhanced text
    Server-->>Client: {success, enhancedText}
```

- Response is constrained with `response_format: { type: "json_object" }` for the recommendation endpoint so the server can safely `JSON.parse()` it.
- Model name is configurable via `process.env.GEMINI_MODEL`.

### 4.3 Nodemailer — OTP Email Delivery

```mermaid
sequenceDiagram
    participant Client as AuthPage (Register form)
    participant Server as Controller (sendEmailVerificationOtp)
    participant OtpGen as generateOtp() util
    participant Mailer as sendOtpEmail() util
    participant SMTP as Nodemailer Transport (Gmail SMTP)
    participant Inbox as User's Email Inbox

    Client->>Server: POST /api/student|recruiter/send-otp {name, email}
    Server->>OtpGen: generate random numeric OTP
    OtpGen-->>Server: otp
    Server->>Mailer: sendOtpEmail(email, otp, name)
    Mailer->>SMTP: transporter.sendMail({to, subject, html})
    SMTP->>Inbox: delivers OTP email
    Server-->>Client: {success, otp}
    Note right of Client: Client compares user-entered OTP<br/>against value returned to complete registration
```

- Config: `server/configs/mailer.js` — uses `nodemailer.createTransport({service:'gmail', auth:{user, pass}})` with `SMTP_USER` / app-specific `SMTP_PASS` from env.

---

## 5. Database Design — UML Class / ER Diagram

MongoDB is schema-flexible, but Mongoose enforces a consistent structure. The diagram below models each collection as a class (with types & key constraints) and shows relationships as they are actually implemented (via `ObjectId` refs and application-level joins).

```mermaid
classDiagram
    class Student {
        +ObjectId _id
        +String name
        +String email  «unique, regex»
        +String password  «bcrypt hash»
        +String phone
        +String university
        +String major
        +Number graduationYear
        +String bio
        +String[] skills
        +String profilePicture  «Cloudinary URL»
        +String resume  «Cloudinary URL»
        +String github
        +String linkedin
        +String portfolio
        +ObjectId[] appliedProjects  «ref: Project»
        +ObjectId[] submissions  «ref: Submission»
        +Boolean isEmailVerified
        +Date createdAt
        +Date updatedAt
    }

    class Recruiter {
        +ObjectId _id
        +String name
        +String companyName
        +String email  «unique»
        +String password  «bcrypt hash»
        +String companyLogo  «Cloudinary URL»
        +String contactNumber
        +String industry
        +String companySize
        +String location
        +String bio
        +String[] hiringFor
        +String companyWebsite
        +String companyLinkedin
        +String companyTwitter
        +Date createdAt
        +Date updatedAt
    }

    class Admin {
        +ObjectId _id
        +String name
        +String email  «unique, regex»
        +String password  «bcrypt hash»
        +String role  «default: admin»
        +Boolean isSuperAdmin
        +Date createdAt
        +Date updatedAt
    }

    class Project {
        +ObjectId _id
        +String title
        +String category
        +String description
        +Number budget
        +Date deadline
        +String[] technologies
        +String[] requirements
        +String[] deliverables
        +String status  «open|has applicants|in progress|completed»
        +String paymentStatus  «unpaid|paid»
        +Date submittedDate
        +ObjectId recruiter  «ref: Recruiter»
        +Date createdAt
        +Date updatedAt
    }

    class Application {
        +ObjectId _id
        +ObjectId studentId  «ref: Student»
        +ObjectId projectId  «ref: Project»
        +String cvUrl  «Cloudinary URL»
        +String projectPlanUrl  «Cloudinary URL»
        +String notes
        +String status  «applied|selected|rejected|assigned»
        +ObjectId ndaId  «ref: NDA»
        +Date createdAt
        +Date updatedAt
    }

    class NDA {
        +ObjectId _id
        +ObjectId applicationId  «ref: Application»
        +String documentUrl  «Cloudinary URL»
        +String ndaStatus  «nda_sent|accepted|rejected»
        +Date createdAt
        +Date updatedAt
    }

    class Review {
        +ObjectId _id
        +ObjectId recruiterId  «ref: Recruiter»
        +ObjectId studentId  «ref: Student»
        +Number rating  «1–5»
        +String comment
        +Date createdAt
        +Date updatedAt
    }

    Recruiter "1" --> "many" Project : posts
    Student "many" --> "many" Project : appliedProjects (denormalized array)
    Student "1" --> "many" Application : submits
    Project "1" --> "many" Application : receives
    Application "1" --> "0..1" NDA : governed by
    Recruiter "1" --> "many" Review : writes
    Student "1" --> "many" Review : receives
    Recruiter "1" --> "many" NDA : sends (via Application)
```

### 5.1 Relationship Notes

| Relationship | Type | Implementation Detail |
|---|---|---|
| Recruiter → Project | 1 : N | `Project.recruiter` stores the owning recruiter's `ObjectId`. A recruiter can post many projects. |
| Student → Project | M : N | Modeled two ways: `Student.appliedProjects[]` (denormalized convenience array) **and** the authoritative `Application` join collection. |
| Student ↔ Project → Application | Join Entity | `Application` is the true many-to-many join table between `Student` and `Project`, carrying its own attributes (`cvUrl`, `status`, `notes`). |
| Application → NDA | 1 : 0..1 | An application optionally has one NDA once the recruiter sends one; `Application.ndaId` and `NDA.applicationId` form a bidirectional-ish link (NDA is the primary FK holder; `Application.ndaId` is a denormalized back-reference). |
| Recruiter → Review ← Student | N : N via Review | `Review` is a join entity: a recruiter rates a student per completed project engagement. |
| Student.submissions[] | 1 : N (referenced, unimplemented) | Schema references a `Submission` model that does not currently exist in `server/models/` — a placeholder for a future "Submissions" feature (client has a `Submissions.jsx` page already scaffolded). |

### 5.2 Cascading Delete Graph (Admin moderation)

```mermaid
flowchart LR
    A[Admin: DELETE /students/:id] --> B[Delete Student.profilePicture from Cloudinary]
    A --> C[Delete Student.resume from Cloudinary]
    A --> D[Find all Application where studentId = id]
    D --> E[For each Application: delete cvUrl + projectPlanUrl from Cloudinary]
    D --> F[Find NDA where applicationId = app._id]
    F --> G[Delete NDA.documentUrl from Cloudinary]
    G --> H[NDA.deleteMany]
    E --> I[Application.deleteMany]
    A --> J[Review.deleteMany where studentId]
    A --> K[Student.findByIdAndDelete]
    H --> K
    I --> K
    J --> K
```

---

## 6. Backend Component Architecture

```mermaid
flowchart TB
    subgraph Routes["routes/"]
        SR[studentRoute.js]
        RR[recruiterRoutes.js]
        PR[projectRoutes.js]
        CR[companyRoutes.js]
        AR[adminRoutes.js]
    end

    subgraph MW["middlewares/"]
        VT[verifyToken.js]
    end

    subgraph Cfg["configs/"]
        DB_C[db.js — Mongoose connect]
        CD_C[cloudinary.js]
        AI_C[ai.js — Gemini/OpenAI client]
        ML_C[mailer.js — Nodemailer transport]
        MU_C[multer.js — disk storage]
    end

    subgraph Ctrl["controllers/"]
        SC[studentController.js]
        RC[recruiterController.js]
        PC[projectsController.js]
        CC[companyController.js]
        AC[adminController.js]
    end

    subgraph Utl["utils/"]
        GT[generateToken.js]
        GO[generateOtp.js]
        SE[sendOtpEmail.js]
    end

    subgraph Mdl["models/ (Mongoose)"]
        M1[Student] 
        M2[Recruiter]
        M3[Admin]
        M4[Project]
        M5[Application]
        M6[NDA]
        M7[Review]
    end

    SR --> VT --> SC
    RR --> VT --> RC
    PR --> VT --> PC
    CR --> CC
    AR --> AC

    SC --> M1 & M4 & M5 & M6
    RC --> M2 & M4 & M5 & M6 & M7
    PC --> M4
    CC --> M2
    AC --> M1 & M2 & M4 & M5 & M6 & M7

    SC & RC --> CD_C
    SC --> AI_C
    SC & RC --> ML_C
    SC & RC --> GT & GO & SE
    SR & RR --> MU_C
```

### 6.1 REST API Surface

| Resource | Method & Path | Auth | Purpose |
|---|---|---|---|
| **Student** | `POST /api/student/send-otp` | Public | Send email verification OTP |
| | `POST /api/student/register` | Public (+file: resume) | Register new student |
| | `POST /api/student/login` | Public | Login, returns JWT |
| | `GET /api/student/profile` | JWT | Get own profile |
| | `PUT /api/student/update-profile` | JWT (+files) | Update profile/resume/pic |
| | `POST /api/student/change-password` | JWT | Change password |
| | `POST /api/student/enhance` | Public | AI resume text enhancement (Gemini) |
| | `POST /api/student/apply-project` | JWT (+files) | Apply with CV + plan (Cloudinary + transaction) |
| | `GET /api/student/applied-projects` | JWT | List own applications |
| | `GET /api/student/recommendations` | JWT | AI-matched project list (Gemini) |
| | `GET /api/student/ndas` | JWT | List NDAs sent to student |
| | `PUT /api/student/upload-nda` | JWT (+file) | Upload signed NDA |
| | `GET /api/student/stats` , `/wallet` | JWT | Dashboard stats / earnings |
| **Recruiter** | `POST /send-otp`, `/register` (+logo), `/login` | Public | Onboarding |
| | `POST /create-project`, `PUT /update-project/:id`, `DELETE /delete-project/:id` | JWT | Project CRUD |
| | `GET /profile`, `PUT /update-profile`, `POST /change-password` | JWT | Account management |
| | `GET /project-applicants`, `POST /applicant-details` | JWT | Applicant tracking |
| | `POST /send-nda` (+file), `GET /ndas` | JWT | NDA lifecycle |
| | `POST /assign-project` | JWT | Assign + auto-reject competitors |
| | `GET /assigned-projects`, `POST /process-payment` | JWT | Payments |
| | `POST /submit-review`, `GET /student-reviews/:id` | JWT | Reviews |
| | `GET /stats` | JWT | Dashboard analytics |
| **Projects (public)** | `GET /api/projects` | Public | List all projects |
| | `GET /api/projects/:recruiterId` | JWT | Projects by recruiter |
| | `GET /api/projects/project/:projectId` | JWT | Single project detail |
| **Companies** | `GET /api/companies` | Public | List all recruiters/companies |
| **Admin** | `POST /register`, `POST /login`, `GET /profile` | Public* | Admin auth |
| | `GET /stats` | — | Platform-wide analytics |
| | `GET /students`, `DELETE /students/:id` | — | Student moderation (cascading delete) |
| | `GET /recruiters`, `DELETE /recruiters/:id` | — | Recruiter moderation |
| | `GET /projects`, `DELETE /projects/:id` | — | Project moderation |
| | `GET /applications`, `GET /ndas` | — | Global visibility |

\* Admin routes currently lack `verifyToken` middleware attached in code (commented out placeholder for `authAdmin`) — see **Section 8: Security Observations**.

---

## 7. Frontend Component Architecture

```mermaid
flowchart TB
    Main[main.jsx] --> App[App.jsx — Router Root]
    App --> CtxProvider[AppContextProvider]

    CtxProvider --> Public["Public Routes<br/>Home, AllProjects, Companies, About, Pricing, ProjectDetail, AuthPage"]
    CtxProvider --> SGuard[StudentRoutesProtector]
    CtxProvider --> RGuard[RecruiterRouterProtector]
    CtxProvider --> AdminRoutes["AdminLogin, AdminDashboard (ungated)"]

    SGuard --> SDash[StudentDashBoard — layout/outlet]
    SDash --> S1[DashBoard]
    SDash --> S2[BrowseProjects]
    SDash --> S3[AppliedProjects]
    SDash --> S4[NDARequests]
    SDash --> S5[Submissions]
    SDash --> S6[ResumeBuilder]
    SDash --> S7[Wallet]
    SDash --> S8[Settings]

    RGuard --> ODash[OwnerDashBoard — layout/outlet]
    ODash --> O1[OwnerDashboardLanding]
    ODash --> O2[Projects]
    ODash --> O3[CreateProject]
    ODash --> O4[NDAManagement]
    ODash --> O5[AllApplicant / ProjectApplicants]
    ODash --> O6[Payments]
    ODash --> O7[OwnerSettings]
    ODash --> O8[ReviewSubmission]
    ODash --> O9[ViewStudentDetails]

    subgraph Shared["Shared Components"]
        Navbar
        Footer
        ProjectCard
        JobListing
        ApplyModel
        StatusBadge
    end

    S1 & S2 & O2 & Public -.uses.-> Shared
```

- **Route protection** is purely client-side: `StudentRoutesProtector` / `RecruiterRouterProtector` decode the JWT with `jwt-decode`, check expiry and `role`, and redirect via `<Navigate>` if invalid — actual authorization is still enforced server-side by `verifyToken` on each API call.
- **State hydration**: on mount, `AppContext` decodes the stored token, sets a `setTimeout` for auto-logout at expiry, then fetches the role-specific profile (`/profile`), all projects, all companies, and (conditionally) applications or AI recommendations.

---

## 8. Security Observations (for awareness, not implemented changes)

These are descriptive notes on the current implementation, not requested fixes:

- **Admin routes are unauthenticated** — `adminRoutes.js` has no `verifyToken`/`authAdmin` middleware wired in (comment says "Add authentication middleware if needed"), meaning `/api/admin/*` endpoints are currently open to any caller.
- **OTP returned in API response** — `sendEmailVerificationOtp` returns the `otp` value directly in the JSON response (`{success, message, otp}`), which is presumably for client-side comparison, but it should ideally never leave the server — an attacker who intercepts the response could complete verification without reading the email.
- **CORS is fully open** — `app.use(cors())` with no origin allow-list.

---

## 9. Deployment Topology

```mermaid
flowchart LR
    Dev[Developer] -->|git push| GH[GitHub]
    GH -->|GitHub Actions CI| CI[.github/workflows/ci.yaml]
    CI --> Build[Build & Test]
    Build --> Docker["Docker Image<br/>(server/Dockerfile — node:20-alpine)"]
    Docker --> K8s["Kubernetes Deployment<br/>(server/k8s/app.yaml)"]
    K8s --> Pod[Server Pod :5000]
    Pod --> Atlas[(MongoDB Atlas)]
    Pod --> CDN[Cloudinary]
    Pod --> Gemini[Google Gemini API]
    Pod --> SMTP[Gmail SMTP]

    ClientBuild["Client (Vite build)"] --> StaticHost[Static Hosting / CDN]
    StaticHost -->|VITE_REACT_BACKEND_URL| Pod
```

---

## 10. Summary

InsiderJobs cleanly separates concerns across three tiers:

1. **Presentation** — a React SPA with context-based global state and client-side route guarding.
2. **Application** — a stateless Express REST API using JWT for auth, Mongoose for persistence, and dedicated config modules to isolate third-party integrations (Cloudinary, Gemini, Nodemailer).
3. **Data** — MongoDB collections connected through explicit `ObjectId` references, with `Application` and `Review` acting as join entities for the platform's core many-to-many relationships (Student↔Project, Recruiter↔Student).

External services are integrated at the controller layer only, keeping the boundary between "our" persisted data and third-party SaaS calls explicit and auditable.