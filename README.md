# 🛡️ Vulnerable Attack Labs

![License](https://img.shields.io/badge/license-Educational-blue.svg)
![Status](https://img.shields.io/badge/status-Active%20Development-green.svg)

An intentionally vulnerable web application training platform designed for learning cybersecurity through hands-on exploitation labs.

**Current Focus:** SQL Injection Attack Track (Labs 1-30)

---

## ⚠️ Security Disclaimer

**FOR AUTHORIZED EDUCATIONAL USE ONLY**

This platform contains **intentionally vulnerable** applications designed exclusively for cybersecurity education and research purposes.

### Legal & Ethical Guidelines

- ✅ **PERMITTED:** Use in isolated lab environments, educational courses, security training, and authorized research
- ❌ **PROHIBITED:** Deployment to production, public internet exposure, testing against unauthorized systems
- 🔒 **REQUIREMENT:** All testing must be performed in local, containerized, or explicitly authorized environments only

### Liability

- **AS-IS BASIS:** This software is provided without warranties of any kind
- **NO LIABILITY:** Authors and contributors are not responsible for misuse, damages, or legal consequences
- **USER RESPONSIBILITY:** You are solely responsible for ensuring legal compliance in your jurisdiction

**By using this platform, you acknowledge understanding and acceptance of these terms.**

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
- [Lab Progress](#-lab-progress)
- [Curriculum Overview](#-curriculum-overview)
- [Development Notes](#-development-notes)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Current Implementation

- **Full-Stack SQL Injection Lab Platform**
  - Next.js 15 application with API routes and UI components
  - PostgreSQL-backed data persistence
  - Real-time SQL query preview and execution
- **Progressive Lab System**
  - Sequential unlock mechanism (Lab 1 → Lab 2 → Lab 3...)
  - Progress tracking via dedicated API endpoints
  - Flag validation system for lab completion

- **Dual Learning Modes**
  - **Vulnerable Mode:** Experience real exploitable code patterns
  - **Secure Mode:** Learn proper security implementations side-by-side

- **Implemented Labs (1-3):**
  - **Lab 1:** Basic Authentication Bypass (Login SQLi)
  - **Lab 2:** Error-Based SQL Injection (Product Search)
  - **Lab 3:** UNION-Based SQL Injection (Data Extraction)

- **Lab Scaffolds (4-6):**
  - Basic structure and API routes created
  - Ready for exploitation scenario implementation

### Planned Features

- Labs 7-30 covering advanced SQL injection techniques
- Automated lab validation and hints system
- Built-in query analyzer and educational tooltips
- Leaderboard and achievement system

---

## 🛠️ Tech Stack

| Component            | Technology                       |
| -------------------- | -------------------------------- |
| **Frontend**         | React 19, Next.js 15, TypeScript |
| **Backend API**      | Next.js API Routes (App Router)  |
| **Database**         | PostgreSQL 15+                   |
| **Styling**          | Tailwind CSS                     |
| **Package Manager**  | pnpm                             |
| **Containerization** | Docker, Docker Compose           |
| **Runtime**          | Node.js 20+                      |

---

## 📁 Repository Structure

```
vulnerable-labs/
├── LICENSE                          # Custom educational license
├── README.md                        # This file
└── sql-injection/
    └── basic/
        ├── docker-compose.yml       # Container orchestration
        ├── Dockerfile               # App container definition
        ├── entrypoint.sh            # Container initialization script
        ├── package.json             # Dependencies and scripts
        ├── pnpm-lock.yaml           # Lockfile
        ├── tsconfig.json            # TypeScript configuration
        ├── next.config.ts           # Next.js configuration
        ├── app/
        │   ├── (ui)/                # UI pages grouped
        │   │   ├── layout.tsx       # Root layout
        │   │   ├── page.tsx         # Home page
        │   │   ├── globals.css      # Global styles
        │   │   ├── lab1/            # Lab 1 UI
        │   │   ├── lab2/            # Lab 2 UI
        │   │   └── lab3-lab8/       # Additional lab UIs
        │   └── api/                 # API routes
        │       ├── checkFlag/       # Flag validation endpoint
        │       ├── lab1/            # Lab 1 endpoints
        │       ├── lab2/            # Lab 2 endpoints
        │       └── lab3-lab8/       # Additional lab endpoints
        ├── components/              # Reusable React components
        │   ├── FlagInput.tsx        # Flag submission component
        │   └── LabCompleteGreeting.tsx
        └── utils/                   # Shared utilities
            ├── flagStore.ts         # Flag management
            ├── hero.ts              # Hero section data
            ├── initdb.js            # Database initialization
            ├── pool.ts              # Database connection pool
            └── provider.tsx         # React context providers
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker & Docker Compose** (recommended) OR
- **Node.js 20+** and **PostgreSQL 15+** (for local development)
- **pnpm** package manager

### Option 1: Docker Deployment (Recommended)

The easiest way to get started with an isolated, pre-configured environment.

```bash
# Navigate to the lab directory
cd sql-injection/basic

# Start all services (PostgreSQL + Web App)
docker compose up --build

# Access the application
# 🌐 Web Interface: http://localhost:3000
# 🗄️ PostgreSQL: localhost:5433 (mapped externally)
```

**Database credentials** (configured in `docker-compose.yml`):

- Host: `localhost`
- Port: `5433` (external) / `5432` (internal)
- Database: `sql_injection_labs`
- User: `postgres`
- Password: `password`

```bash
# Stop all services
docker compose down

# Stop and remove volumes (full cleanup)
docker compose down -v
```

### Option 2: Local Development Setup

For those who prefer running services directly on their host machine.

#### Step 1: Database Setup

```bash
# Start PostgreSQL (or use existing instance)
# Create database
psql -U postgres -c "CREATE DATABASE sql_injection_labs;"
```

#### Step 2: Environment Configuration

```bash
# Export database connection variables
export POSTGRES_HOST=127.0.0.1
export POSTGRES_PORT=5432
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=password
export POSTGRES_DB=sql_injection_labs
```

Or create a `.env.local` file in `sql-injection/basic/`:

```env
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=sql_injection_labs
```

#### Step 3: Application Setup

```bash
# Navigate to webapp directory
cd sql-injection/basic

# Install dependencies
pnpm install

# Initialize database schema and seed data
pnpm run dev-init-db

# Start development server
pnpm dev
```

#### Step 4: Access Application

🌐 Open browser to: **http://localhost:3000**

Start with Lab 1: **http://localhost:3000/lab1**

---

## 📊 Lab Progress

| Lab # | Topic                  | Frontend | API | Status         |
| ----- | ---------------------- | -------- | --- | -------------- |
| 1     | Basic Login Bypass     | ✅       | ✅  | **Complete**   |
| 2     | Error-Based SQLi       | ✅       | ✅  | **Complete**   |
| 3     | UNION-Based SQLi       | ✅       | ✅  | **Complete**   |
| 4     | Finding Column Count   | ✅       | ✅  | **Complete**   |
| 5     | Extracting DB Metadata | ✅       | ✅  | **Complete**   |
| 6     | String vs Numeric SQLi | ✅       | ✅  | **Complete**   |
| 7     | Boolean-Based Blind SQLi | ✅     | ✅  | **Complete**   |
| 8     | Time-Based Blind SQLi  | ✅       | ✅  | **Complete**   |
| 9     | Blind SQLi via Cookies | ✅       | ✅  | **Complete**   |
| 10    | Blind SQLi in HTTP Headers | ✅   | ✅  | **Complete**   |
| 11    | Conditional Error SQLi | ✅       | ✅  | **Complete**   |

---

## 🎓 Curriculum Overview

### Level 1: Fundamentals (Labs 1-6)

**Learn the basics of SQL injection through common vulnerability patterns.**

1. **Basic Login Bypass** - Exploit authentication forms with simple SQL injection
2. **Error-Based SQL Injection** - Extract data through database error messages
3. **UNION-Based SQL Injection** - Combine queries to extract sensitive information
4. **Finding Number of Columns** - Determine table structure using ORDER BY technique
5. **Extracting Database Metadata** - Map database schema, tables, and columns
6. **String vs Numeric Injection** - Understand different injection contexts

### Level 2: Blind SQL Injection (Labs 7-11)

**Master extraction techniques when you can't see direct output.**

7. **Boolean-Based Blind SQLi** - Extract data based on true/false responses
8. **Time-Based Blind SQLi** - Use database delays to infer information
9. **Blind SQLi via Cookies** - Exploit injection points in cookie values
10. **Blind SQLi in HTTP Headers** - Attack User-Agent, Referer, and custom headers
11. **Conditional Error SQLi** - Exploit error states for data extraction

### Level 3: Filter & WAF Bypass (Labs 13-18)

**Evade security filters and web application firewalls.**

13. **Basic Blacklist Bypass** - Circumvent keyword-based filtering
14. **Comment Injection** - Use SQL comments to break filter logic
15. **Encoding & Case Bypass** - Exploit parser differences with encoding
16. **Keyword Obfuscation** - Advanced techniques to hide malicious payloads
17. **JSON SQL Injection** - Attack JSON-based API endpoints
18. **Prepared Statement Misuse** - Find vulnerabilities in parameterized queries

### Level 4: Advanced SQL Injection (Labs 19-23)

**Explore complex, multi-stage attack scenarios.**

19. **Second-Order SQL Injection** - Exploit stored data in subsequent queries
20. **Stored Procedure Injection** - Attack database stored procedures
21. **ORM Injection** - Find SQLi in Object-Relational Mapper implementations
22. **Stacked Query Injection** - Execute multiple statements in a single injection
23. **SQLi via File Upload Metadata** - Exploit filename and metadata storage

### Level 5: Real-World Exploitation (Labs 24-28)

**Apply advanced techniques in realistic scenarios.**

24. **Out-of-Band SQL Injection** - Extract data via DNS/HTTP callbacks
25. **SQLi to Remote Code Execution** - Chain injection to command execution
26. **SQLi to Privilege Escalation** - Elevate database and system permissions
27. **Large-Scale Data Exfiltration** - Efficiently extract entire databases
28. **Enterprise WAF Simulation** - Bypass sophisticated enterprise protections

### Level 6: Cutting Edge Research (Labs 29-30)

**Explore emerging attack vectors and modern defenses.**

29. **SQL Injection with Race Conditions** - Exploit timing windows in concurrent queries
30. **AI-Assisted SQLi Detection Bypass** - Evade machine learning-based security

---

## 💻 Development Notes

### Database Schema

The platform uses the following core tables:

- **`users`** - Application user accounts for authentication labs
- **`products`** - Sample product data with category enum (`ELECTRONICS`, `CLOTHING`, `FOOD`)
- **`progress`** - User progress tracking across labs
- **`flags`** - Lab completion validation tokens

### API Endpoints

Each lab follows a simple and consistent API structure:

```
/api/
  ├── checkFlag/
  │   └── route.ts          # Global flag validation endpoint
  └── lab{N}/
      ├── route.ts          # Main vulnerable lab endpoint (GET/POST)
      └── flag/             # Optional: Lab-specific flag endpoint
          └── route.ts      # Used by some labs (e.g., Lab 3)
```

**Examples:**

- **Lab 1** (Login Bypass): `POST /api/lab1` - Vulnerable login authentication
- **Lab 2** (Error-Based SQLi): `GET /api/lab2?id={product_id}` - Product lookup with SQLi
- **Lab 3** (UNION SQLi): `GET /api/lab3?category={category}` - Category search with SQLi
  - Additional endpoint: `GET /api/lab3/flag` for flag retrieval

> **Note:** The secure/unsecure mode toggle is handled in the **frontend UI**, not through separate API endpoints. Each lab's API route contains the vulnerable implementation for educational purposes.

### Flag Validation System

Flags are validated through the centralized `/api/checkFlag` endpoint:

```typescript
GET /api/checkFlag?labid=lab1&flag=captured_flag_value
Response: { success: boolean }
```

When a flag is successfully validated:

1. The current lab status is marked as `completed` in the database
2. The next lab is automatically `unlocked` for progression

### Development Commands

```bash
# Install dependencies
pnpm install

# Run development server with hot reload
pnpm dev

# Build production bundle
pnpm build

# Start production server
pnpm start

# Initialize/reset database
pnpm run dev-init-db

# Lint code
pnpm lint

# Type check
pnpm type-check
```

---

## 🤝 Contributing

Contributions are welcome from security researchers, educators, and developers!

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/lab-15-implementation`)
3. **Implement** your lab or improvement
4. **Test** thoroughly in both vulnerable and secure modes
5. **Document** the exploitation steps and learning objectives
6. **Submit** a pull request with clear description

### Contribution Guidelines

- Follow existing code structure and naming conventions
- Include both vulnerable and secure implementations
- Provide clear README or comments explaining the vulnerability
- Add appropriate test cases
- Ensure Docker setup still works after changes

### Ideas for Contribution

- Implement labs 7-30 from the curriculum
- Add automated testing framework
- Create hint system for struggling learners
- Improve UI/UX of lab interface
- Add internationalization support
- Write blog posts or video tutorials

---

## 📄 License

This project is licensed under a **Custom Educational License**.

**Copyright © 2026 Priyanshu Kumar Singh**

### License Summary

- ✅ **Permitted:** Educational, academic, and cybersecurity research use
- ❌ **Prohibited:** Commercial use, public deployment, production use
- ⚖️ **Disclaimer:** Provided "AS IS" without warranty; no author liability

Full license terms available in the [`LICENSE`](LICENSE) file.

---

## 📞 Support & Contact

- **Issues:** Report bugs via [GitHub Issues](https://github.com/yourusername/vulnerable-labs/issues)
- **Discussions:** Join community discussions
- **Security:** For security concerns about the platform itself, please report privately

---

## 🙏 Acknowledgments

This project is inspired by industry-standard penetration testing training platforms and aims to provide accessible, hands-on security education.

**Happy (Ethical) Hacking! 🔐**

---

<div align="center">
  
**Remember: With great power comes great responsibility.**  
*Use these skills to build a more secure internet.*

</div>
