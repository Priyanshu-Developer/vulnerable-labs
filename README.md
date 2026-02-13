# Vulnerable Attack Labs

An open-source, intentionally vulnerable lab platform for learning web application attacks through hands-on practice.

This project is designed as a multi-series roadmap, where each series focuses on one attack class with progressively harder labs.
The first published track is **SQL Injection** with **32 labs** from fundamentals to cutting-edge scenarios.

## Introduction

This repository helps learners move from basic payloads to realistic exploitation patterns in controlled environments.
Each lab emphasizes both offense (how attacks work) and defense (how to fix them correctly), making it suitable for students, developers, and security engineers.

## Important Disclaimer

This repository is for **authorized security training only**.

- Run labs only in local or isolated environments.
- Never test these techniques against systems you do not own or have written permission to assess.
- The maintainers are not responsible for misuse.

## Project Scope

- Multi-attack lab roadmap (SQLi first, additional attack tracks planned)
- Realistic vulnerable app flows for practical training
- Progressive difficulty from beginner to advanced
- Secure coding remediation guidance alongside exploitation

## Current Track

- SQL Injection Series: 32 labs

## Project Goals

- Teach SQLi from fundamentals to advanced exploitation.
- Provide practical, hands-on vulnerable scenarios.
- Help learners understand attacker mindset and defensive remediation.
- Offer a structured progression for students, security engineers, and trainers.

## Tech Stack

- API: `Node.js`, `TypeScript`, `Express`, `PostgreSQL`
- Web App: `Next.js`, `React`, `TypeScript`

## Repository Structure

- `sql-injection-labs/api` - Vulnerable API endpoints and lab routes
- `sql-injection-labs/webapp` - Frontend exercises and challenge UI
- `README.md` - Project overview and lab roadmap

## Quick Start

### 1. Clone repository

```bash
git clone <your-repo-url>
cd labs/sql-injection-labs
```

### 2. Run API

```bash
cd api
pnpm install
pnpm dev
```

API default URL: `http://localhost:3000`

### 3. Run Web App

```bash
cd ../webapp
pnpm install
pnpm dev
```

Web app default URL: `http://localhost:3000` or Next.js-assigned port if occupied.

## Current Implementation Status

- Implemented: Initial SQLi login lab route (`auth-routes-lab1.ts`)
- In progress: Additional lab routes and progress tracking integration
- Planned: Full 32-lab curriculum below

## SQL Injection Curriculum (32 Labs)

### LEVEL 1 - Fundamentals (8 Labs)

1. Basic Login Bypass
2. Error-Based SQL Injection
3. UNION Based SQL Injection
4. Finding Number of Columns
5. Extracting Database Metadata
6. String vs Numeric Injection
7. SQLi in Search Function
8. SQLi in URL Parameters

### LEVEL 2 - Blind SQL Injection (6 Labs)

9. Boolean Based Blind SQLi
10. Time Based Blind SQLi
11. Blind Data Extraction Automation
12. Blind SQLi via Cookies
13. Blind SQLi in HTTP Headers
14. Conditional Error SQLi

### LEVEL 3 - Filter & WAF Bypass (6 Labs)

15. Basic Blacklist Bypass
16. Comment Injection
17. Encoding & Case Bypass
18. Keyword Obfuscation
19. JSON SQL Injection
20. Prepared Statement Misuse

### LEVEL 4 - Advanced SQL Injection (5 Labs)

21. Second Order SQL Injection
22. Stored Procedure Injection
23. ORM Injection
24. Stacked Query Injection
25. SQLi via File Upload Metadata

### LEVEL 5 - Elite / Real-World Exploitation (5 Labs)

26. Out-of-Band SQL Injection
27. SQLi -> Remote Code Execution
28. SQLi -> Privilege Escalation
29. SQLi -> Large Scale Data Exfiltration
30. SQLi + Enterprise WAF Simulation

### LEVEL 6 - Research / Cutting Edge (2 Labs)

31. SQL Injection + Race Condition
32. AI-Assisted SQLi Detection Bypass

## New Labs Added

### Lab 31 - SQL Injection + Race Condition

Focus areas:
- Parallel request exploitation
- Transaction locking abuse
- Timing-based injection chaining

Example scenario:
- Multiple payment requests submitted simultaneously
- SQLi modifies balance validation query
- Race condition bypasses balance checks

### Lab 32 - AI-Assisted SQLi Detection Bypass

Focus areas:
- Prompt obfuscation
- Semantic payload rewriting
- Polyglot payloads
- Context-aware injection strategies

Example concepts:
- Bypassing AI input filters and LLM/WAF pattern detection
- Rewriting payloads to evade semantic security checks

## Learning Outcomes

By completing this series, learners should be able to:

- Identify SQLi attack surfaces in web applications.
- Exploit common and advanced SQLi patterns in controlled labs.
- Automate blind extraction techniques.
- Understand WAF/filter bypass tradeoffs.
- Apply secure coding fixes such as parameterized queries and robust validation.

## Contribution Guidelines

Contributions are welcome for:

- New lab scenarios
- Better challenge realism
- Fixes to setup/dev experience
- Documentation improvements

Suggested workflow:

1. Fork the repository
2. Create a feature branch
3. Add or update a lab
4. Submit a pull request with a clear description and reproduction steps

## Responsible Use Policy

This project is intentionally vulnerable for educational reasons. If you discover unsafe defaults or accidental exposure vectors, open an issue responsibly and include mitigation guidance.

## License

This project is open source. Add a `LICENSE` file (recommended: MIT) and update this section with the final license text.
