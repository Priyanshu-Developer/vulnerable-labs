# 🎨 SQL Injection Labs - Visual Feature Guide

## 🌟 Welcome to Your Redesigned Platform

This guide showcases the key visual features and how to use them.

---

## 📱 Homepage - First Impression

### Hero Section

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🛡️ Professional SQL Injection       ┃
┃        Training Platform               ┃
┃                                        ┃
┃    Master SQL Injection                ┃
┃    🔐 The Safe Way                     ┃
┃                                        ┃
┃  Learn to identify and exploit SQL     ┃
┃  injection vulnerabilities in a safe   ┃
┃  educational environment.              ┃
┃                                        ┃
┃  [Start Learning]  [Learn More]        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Stats Grid

```
┌──────────┬──────────────┬────────────┐
│    8     │  Real-Time   │    Safe    │
│ Labs     │ SQL Monitor  │ Environment│
└──────────┴──────────────┴────────────┘
```

### Labs Grid (8 Cards)

```
┏━━━━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━━━━┓
┃ 🔓 Lab 1         ┃  ┃ ⚠️ Lab 2          ┃
┃ [Beginner]       ┃  ┃ [Beginner]        ┃
┃ Login Bypass     ┃  ┃ Error-Based SQL   ┃
┃ Learn basics...  ┃  ┃ Extract via errors┃
┃ #Auth #Comments  ┃  ┃ #Errors #Leakage  ┃
┗━━━━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━━━━━━━┓
┃ 🔗 Lab 3         ┃  ┃ 🔢 Lab 4          ┃
┃ [Intermediate]   ┃  ┃ [Intermediate]    ┃
┃ UNION Injection  ┃  ┃ Column Discovery  ┃
┃ Combine queries  ┃  ┃ Find column count ┃
┃ #UNION #Extract  ┃  ┃ #ORDER BY #Enum   ┃
┗━━━━━━━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━━━━━━━┛

... and 4 more labs
```

---

## 🎯 Lab Interface - The Learning Environment

### Full Lab Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ← Back to Labs                                      ┃
┃                                                      ┃
┃  💡 Lab 1  [Beginner]                                ┃
┃  Basic Login Bypass                                  ┃
┃  Learn how SQL injection can bypass authentication   ┃
┃                                                      ┃
┃  Security Mode: [ 🔒 Secured ⚪─○ 🔓 Vulnerable ]   ┃
┃  [💡 Show Hints]                                     ┃
┃                                                      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                           ┃   🖥️ SQL Monitor       ┃
┃  📝 Lab Content           ┃   ┏━━━━━━━━━━━━━━━━━┓ ┃
┃                           ┃   ┃ [⚫ Vulnerable]  ┃ ┃
┃  Username: [__________]   ┃   ┃                 ┃ ┃
┃  Password: [__________]   ┃   ┃ SELECT * FROM   ┃ ┃
┃                           ┃   ┃ users WHERE     ┃ ┃
┃  [Submit]                 ┃   ┃ username = ''   ┃ ┃
┃                           ┃   ┃ AND password='' ┃ ┃
┃  ℹ️ Your Objective:       ┃   ┃                 ┃ ┃
┃  Login as admin without   ┃   ┗━━━━━━━━━━━━━━━━━┛ ┃
┃  knowing the password     ┃                       ┃
┃                           ┃   💡 Tip: Watch the   ┃
┃                           ┃   query update live!  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🔍 Feature Showcase

### 1. Real-Time SQL Monitor

**What You See:**

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🖥️ SQL Query Monitor       ┃
┃ [🔴 Raw Concatenation]     ┃
┃                            ┃
┃ SELECT * FROM products     ┃
┃ WHERE name ILIKE '%laptop%'┃
┃                            ┃
┃ Tip: Try injecting SQL to  ┃
┃ bypass the query logic!    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**When You Type:** `laptop' OR '1'='1`

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🖥️ SQL Query Monitor       ┃
┃ [🔴 Raw Concatenation]     ┃
┃                            ┃
┃ SELECT * FROM products     ┃
┃ WHERE name ILIKE           ┃
┃ '%laptop' OR '1'='1%'      ┃
┃                            ┃
┃ ⚠️ Query modified by input!┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Secure Mode:**

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🖥️ SQL Query Monitor       ┃
┃ [🟢 Parameterized Query]   ┃
┃                            ┃
┃ SELECT * FROM products     ┃
┃ WHERE name ILIKE $1        ┃
┃                            ┃
┃ Parameters:                ┃
┃ $1: "%laptop' OR '1'='1%"  ┃
┃                            ┃
┃ ✅ Input safely escaped!   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

### 2. Progressive Hint System

**Initial State:**

```
┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ [💡 Show Hints]          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**After Clicking Show Hints:**

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 💡 Hints (0/5)                ┃
┃                               ┃
┃ [Reveal Next Hint (1/5)]      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**After Revealing First Hint:**

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 💡 Hints (1/5)                ┃
┃                               ┃
┃ ┌─────────────────────────┐   ┃
┃ │ Hint 1:                 │   ┃
┃ │ SQL comments can be used│   ┃
┃ │ to ignore parts of a    │   ┃
┃ │ query. Try using -- or #│   ┃
┃ └─────────────────────────┘   ┃
┃                               ┃
┃ [Reveal Next Hint (2/5)]      ┃
┃ [Hide All Hints]              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

### 3. Security Mode Toggle

**Visual Representation:**

```
Security Mode: [ 🔒 Secured ⚪─────○ 🔓 Vulnerable ]
                           ↑ Click to toggle
```

**Secured Position (Green):**

```
[ 🔒 Secured ○─────⚪ 🔓 Vulnerable ]
    Active           Inactive
```

**Vulnerable Position (Red):**

```
[ 🔒 Secured ⚪─────○ 🔓 Vulnerable ]
    Inactive         Active
```

---

### 4. Success Dialog

**Appears After Successful Exploit:**

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                            ┃
┃         ┌─────┐            ┃
┃         │  ✓  │ ← Green    ┃
┃         └─────┘            ┃
┃                            ┃
┃  🎉 Challenge Complete!    ┃
┃                            ┃
┃  Lab 1: Basic Login Bypass ┃
┃                            ┃
┃  Great work! You've        ┃
┃  successfully exploited    ┃
┃  the vulnerability.        ┃
┃                            ┃
┃  [Continue Practice]       ┃
┃  [Next Lab →]              ┃
┃                            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🎨 Color Guide

### Status Colors

```
🟢 Green   = Secure, Success, Correct
🔴 Red     = Vulnerable, Error, Wrong
🟡 Yellow  = Warning, Hint, Caution
🔵 Blue    = Information, Objective, Neutral
⚫ Black   = Code, Terminal, Technical
```

### Visual Indicators

```
🔒 Locked     = Secure mode active
🔓 Unlocked   = Vulnerable mode active
💡 Lightbulb  = Hints available
✓ Checkmark  = Task completed
⚠️ Warning    = Error or vulnerability
🎯 Target     = Objective/Goal
```

---

## 🖱️ User Interactions

### Lab Workflow

```
1. Land on Homepage
   ↓
2. Click Lab Card
   ↓
3. Read Objective
   ↓
4. Toggle Security Mode (optional)
   ↓
5. Enter Input
   ↓
6. Watch SQL Monitor Update (real-time)
   ↓
7. Click Submit
   ↓
8. See Result
   ├─ Success → Success Dialog → Next Lab
   └─ Fail → Try Again / Reveal Hint
```

### Hint Usage Pattern

```
Try Yourself
   ↓
Stuck?
   ↓
Click "Show Hints"
   ↓
Reveal Hint 1
   ↓
Still stuck?
   ↓
Reveal Hint 2
   ↓
Continue revealing as needed
   (Up to 5 hints per lab)
```

---

## 📱 Responsive Design

### Desktop View (1920px+)

```
┌─────────────────────────────────────────────┐
│           Header                             │
├──────────────────┬──────────────────────────┤
│                  │                          │
│   Lab Content    │   SQL Monitor (Sticky)   │
│   (Main Column)  │   (Sidebar)              │
│                  │                          │
│   - Form         │   - Query Display        │
│   - Hints        │   - Parameters           │
│   - Objective    │   - Tips                 │
│                  │                          │
└──────────────────┴──────────────────────────┘
```

### Tablet View (768px - 1024px)

```
┌────────────────────────┐
│   Header               │
├────────────────────────┤
│                        │
│   Lab Content          │
│   (Full Width)         │
│                        │
├────────────────────────┤
│                        │
│   SQL Monitor          │
│   (Below Content)      │
│                        │
└────────────────────────┘
```

### Mobile View (<768px)

```
┌──────────────┐
│   Header     │
├──────────────┤
│              │
│ Lab Content  │
│              │
│ - Compact    │
│ - Stacked    │
│              │
├──────────────┤
│              │
│ SQL Monitor  │
│ (Collapsed)  │
│              │
└──────────────┘
```

---

## 🎯 Pro Tips for Users

### Getting Started

1. **Start with Lab 1** - builds foundation
2. **Read objectives carefully** - know your goal
3. **Watch the SQL monitor** - your best teacher
4. **Toggle modes** - compare secure vs vulnerable

### During Labs

1. **Type slowly** - watch queries update
2. **Use hints wisely** - try first, hint later
3. **Experiment freely** - safe environment
4. **Take notes** - document successful payloads

### Progression

1. **Complete in order** - builds systematically
2. **Review secure mode** - learn protection
3. **Celebrate wins** - enjoy success dialogs
4. **Move forward** - don't spend too long on one

---

## 🚀 Start Your Journey!

```bash
# Navigate to project
cd /home/anonymous/Desktop/vulnerable-labs/sql-injection-labs/webapp

# Start the server
pnpm dev

# Open browser
http://localhost:3000
```

**Your professional SQL injection training platform is ready!** 🎉

---

## 📚 Quick Reference

| Feature         | Location          | Usage              |
| --------------- | ----------------- | ------------------ |
| Lab Selection   | Homepage          | Click lab cards    |
| SQL Monitor     | Right sidebar     | Auto-updates       |
| Hints           | Lab header button | Click to toggle    |
| Security Toggle | Lab header        | Click switch       |
| Objectives      | Below form        | Read first         |
| Success Dialog  | Auto-popup        | After exploit      |
| Navigation      | Header            | Home/Labs/Features |

---

**Happy Learning! Master SQL Injection The Safe Way!** 🛡️
