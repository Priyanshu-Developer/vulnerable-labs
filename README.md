# Vulnerable Attack Labs

An intentionally vulnerable training platform for learning web security through hands-on labs.

Current focus: **SQL Injection** track.

## Important Disclaimer

For authorized training only.

- Run only in local/isolated environments.
- Do not test against systems without explicit permission.
- Maintainers are not responsible for misuse.

## Job Done Till Now

Implemented in this repository today:

- SQL Injection lab platform built in a single Next.js app (`sql-injection-labs/webapp`).
- PostgreSQL-backed data layer and seed script (`users`, `progress`, `products`, and enum `category`).
- Progress unlock flow (`lab1 -> lab2 -> lab3`) via `/api/progress`.
- Lab 1 (Login bypass):
  - Vulnerable endpoint: `/api/lab1/auth/unsecure`
  - Secure endpoint: `/api/lab1/auth/secure`
- Lab 2 (Error-based SQLi in product search):
  - Vulnerable endpoint: `/api/lab2/products/unsecured`
  - Secure endpoint: `/api/lab2/products/secured`
- Lab 3 (UNION-based SQLi in product search):
  - Vulnerable endpoint: `/api/lab3/products/unsecure`
  - Secure endpoint: `/api/lab3/products/secure`
- Lab 4-8 (initial draft scaffolds):
  - Lab 4 (Finding number of columns): `/lab4`, `/api/lab4/products/{unsecure|secure}`
  - Lab 5 (Extracting DB metadata): `/lab5`, `/api/lab5/products/{unsecure|secure}`
  - Lab 6 (String vs numeric SQLi): `/lab6`, `/api/lab6/products/{unsecure|secure}`
  - Lab 7 (SQLi in search function): `/lab7`, `/api/lab7/products/{unsecure|secure}`
  - Lab 8 (SQLi in URL parameters): `/lab8`, `/api/lab8/products/{unsecure|secure}`
- UI for secure/unsecure mode toggle and realtime SQL query preview in labs.

Planned but not implemented yet: labs **4-32**.

## Tech Stack

- Frontend + API: `Next.js 16`, `React 19`, `TypeScript`
- Database: `PostgreSQL`
- Runtime/Package manager: `Node.js`, `pnpm`
- Container setup: `docker-compose`

## Repository Structure

- `README.md` - Project overview and setup instructions
- `sql-injection-labs/docker-compose.yml` - DB + webapp container setup
- `sql-injection-labs/webapp` - Next.js app with lab pages and API routes
- `sql-injection-labs/webapp/src/lib/initlize-db.js` - DB initialization and seed script

## Running Instructions

### Option 1: Run with Docker (recommended)

1. Go to compose directory:

```bash
cd sql-injection-labs
```

2. Build and start services:

```bash
docker compose up --build
```

3. Open:

- App: `http://localhost:3000`
- PostgreSQL host port: `localhost:5433`

4. Stop:

```bash
docker compose down
```

Notes:

- Database is initialized on startup by container entrypoint.
- Default DB credentials are defined in `sql-injection-labs/docker-compose.yml`.

### Option 2: Run locally (webapp + your own Postgres)

1. Start PostgreSQL and create database:

- DB name: `sql_injection_labs`
- User: `postgres`
- Password: `password`
- Port: `5432`

2. Go to webapp:

```bash
cd sql-injection-labs/webapp
```

3. Install dependencies:

```bash
pnpm install
```

4. Export DB env vars (if needed):

```bash
export POSTGRES_HOST=127.0.0.1
export POSTGRES_PORT=5432
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=password
export POSTGRES_DB=sql_injection_labs
```

5. Initialize database:

```bash
pnpm run dev-init-db
```

6. Start app:

```bash
pnpm dev
```

7. Open:

- `http://localhost:3000`
- Start lab from `http://localhost:3000/lab1`

## Current Lab Status

- `Lab 1`: implemented
- `Lab 2`: implemented
- `Lab 3`: implemented
- `Lab 4-8`: draft scaffolds implemented
- `Lab 9-32`: pending

## Planned Curriculum (32 Labs)

### Level 1 - Fundamentals

1. Basic Login Bypass
2. Error-Based SQL Injection
3. UNION Based SQL Injection
4. Finding Number of Columns
5. Extracting Database Metadata
6. String vs Numeric Injection
7. SQLi in Search Function
8. SQLi in URL Parameters

### Level 2 - Blind SQL Injection

9. Boolean Based Blind SQLi
10. Time Based Blind SQLi
11. Blind Data Extraction Automation
12. Blind SQLi via Cookies
13. Blind SQLi in HTTP Headers
14. Conditional Error SQLi

### Level 3 - Filter & WAF Bypass

15. Basic Blacklist Bypass
16. Comment Injection
17. Encoding & Case Bypass
18. Keyword Obfuscation
19. JSON SQL Injection
20. Prepared Statement Misuse

### Level 4 - Advanced SQL Injection

21. Second Order SQL Injection
22. Stored Procedure Injection
23. ORM Injection
24. Stacked Query Injection
25. SQLi via File Upload Metadata

### Level 5 - Real-World Exploitation

26. Out-of-Band SQL Injection
27. SQLi to Remote Code Execution
28. SQLi to Privilege Escalation
29. SQLi to Large Scale Data Exfiltration
30. SQLi with Enterprise WAF Simulation

### Level 6 - Research/Cutting Edge

31. SQL Injection with Race Condition
32. AI-Assisted SQLi Detection Bypass

## Contribution Guidelines

1. Fork repository
2. Create feature branch
3. Add or improve lab
4. Open pull request with clear reproduction steps

## License

This project is licensed under a custom educational/research license in `LICENSE`.

Copyright (c) 2026 Priyanshu Kumar Singh

Key terms:

- Educational, academic, and cybersecurity research use only.
- No production deployment.
- No commercial use, resale, or sublicensing for profit.
- No public internet exposure of the vulnerable app.
- Provided "AS IS" without warranty; author liability is disclaimed.
