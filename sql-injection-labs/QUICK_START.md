# 🚀 Quick Start Guide - SQL Injection Labs

## Prerequisites

Before running the application, ensure you have:

- Node.js 18+ installed
- PostgreSQL database running
- pnpm package manager

## Setup Instructions

### 1. Navigate to the webapp directory:

```bash
cd /home/anonymous/Desktop/vulnerable-labs/sql-injection-labs/webapp
```

### 2. Install dependencies (if not already installed):

```bash
pnpm install
```

### 3. Set up environment variables:

Create a `.env.local` file with your database connection:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sql_labs"
```

### 4. Initialize the database:

```bash
node src/lib/initlize-db.js
```

### 5. Start the development server:

```bash
pnpm dev
```

### 6. Open your browser:

Navigate to `http://localhost:3000`

---

## 🎯 What to Explore

### Homepage (`/`)

- Overview of all 8 SQL injection labs
- Professional hero section
- Features showcase
- Direct navigation to labs

### Lab 1 - Basic Login Bypass (`/lab1`)

**Beginner Level**

- Your first SQL injection challenge
- Learn authentication bypass
- Try username: `admin' --`
- Toggle between secure and unsecure modes

### Lab 2 - Error-Based SQL Injection (`/lab2`)

**Beginner Level**

- Search for products
- Try entering a single quote `'` to trigger errors
- Observe how errors leak information

### Lab 3 - UNION-Based SQL Injection (`/lab3`)

**Intermediate Level**

- Master UNION query attacks
- Extract data from multiple tables
- Match column counts

### Lab 4 - Finding Number of Columns (`/lab4`)

**Intermediate Level**

- Use ORDER BY technique
- Enumerate columns systematically
- Understand query structure

### Lab 5 - Extracting Database Metadata (`/lab5`)

**Advanced Level**

- Query information_schema
- Discover table names
- Extract column information

### Lab 6 - String vs Numeric Injection (`/lab6`)

**Intermediate Level**

- Compare injection types
- Understand context differences
- Practice type-based attacks

### Lab 7 - Advanced Search Exploitation (`/lab7`)

**Advanced Level**

- Multiple injection points
- Complex queries
- Combined parameter attacks

### Lab 8 - SQLi in URL Parameters (`/lab8`)

**Advanced Level**

- URL parameter manipulation
- GET request exploitation
- UNION-based extraction

---

## 🎓 Learning Path

**Recommended Progression:**

1. Start with Lab 1 (Basic Login Bypass)
2. Progress sequentially through Labs 2-4
3. Complete intermediate challenges (Labs 3, 4, 6)
4. Tackle advanced labs (Labs 5, 7, 8)

**For Each Lab:**

1. Read the objective carefully
2. Try to solve it yourself first
3. Use hints progressively if stuck
4. Toggle to secure mode to see proper implementation
5. Watch the SQL monitor to understand query manipulation

---

## 🔍 Key Features to Try

### Real-Time SQL Monitor

- Watch queries update as you type
- See parameter values (in secure mode)
- Understand query structure
- Located in the sidebar of each lab

### Security Mode Toggle

- Located at the top of each lab
- Switch between vulnerable and secure implementations
- Compare parameterized queries vs string concatenation
- Green (🔒) = Secure, Red (🔓) = Vulnerable

### Progressive Hints

- Click "Show Hints" button
- Reveal hints one at a time
- 5 hints per lab (40 total)
- Strategic progression from basic to advanced

### Success Tracking

- Complete challenges to unlock achievements
- Animated success dialogs
- Progress to next lab button
- Track your learning journey

---

## 💡 Pro Tips

1. **Always Read the Objective**: Each lab has a clear objective section explaining what you need to accomplish.

2. **Start Simple**: Begin with basic payloads like `'` or `' OR '1'='1` before attempting complex attacks.

3. **Watch the Monitor**: The SQL query monitor is your best teacher - see exactly how your input affects queries.

4. **Use Both Modes**: Toggle between secure and unsecure to understand the difference.

5. **Progressive Hints**: Don't reveal all hints at once - try to solve with minimal help for better learning.

6. **Take Notes**: Document successful payloads and techniques for future reference.

---

## 🛠️ Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Verify database exists
psql -l | grep sql_labs
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
pnpm dev -p 3001
```

### Build Errors

```bash
# Clean install
rm-rf node_modules
rm pnpm-lock.yaml
pnpm install
```

---

## 📚 Learning Resources

### After Completing the Labs

**Next Steps:**

- Study OWASP Top 10 vulnerabilities
- Learn about parameterized queries and prepared statements
- Explore other web security topics (XSS, CSRF, etc.)
- Practice on other CTF platforms like HackTheBox, TryHackMe

**Recommended Reading:**

- OWASP SQL Injection Prevention Cheat Sheet
- The Web Application Hacker's Handbook
- SQL for Security Professionals

---

## 🔒 Security Reminder

⚠️ **IMPORTANT**: This platform is for educational purposes only!

- ✅ Use only in this controlled environment
- ❌ Never attempt SQL injection on systems without authorization
- 📚 Learn to defend, not to attack
- 🛡️ Apply secure coding practices in your projects
- ✅ Practice ethical hacking principles

---

## 🎉 Enjoy Learning!

The SQL Injection Labs platform provides a safe, professional environment to master SQL injection techniques. Take your time, experiment freely, and most importantly - have fun learning!

**Need help?** Review the hints in each lab or consult the comprehensive REDESIGN_SUMMARY.md file for detailed information about all features.

**Ready to begin?** Start with Lab 1 and work your way through all 8 challenges!

---

## 📊 Quick Stats

- **Total Labs**: 8
- **Difficulty Levels**: 3 (Beginner, Intermediate, Advanced)
- **Hints Available**: 40 (5 per lab)
- **Topics Covered**: Authentication bypass, error-based injection, UNION queries, column enumeration, metadata extraction, type-based injection, search exploitation, URL parameters
- **Learning Time**: 30-60 minutes per lab (4-8 hours total)

Happy Hacking! 🚀
