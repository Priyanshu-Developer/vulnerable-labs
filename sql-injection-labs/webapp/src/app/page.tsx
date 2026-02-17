import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ShieldIcon } from "@/components/icons";

const sqlLabs = [
  {
    id: 1,
    title: "Basic Login Bypass",
    description:
      "Learn SQL injection fundamentals by bypassing authentication.",
    difficulty: "Beginner",
    icon: "🔓",
    topics: ["Authentication", "SQL Comments", "Basic Injection"],
  },
  {
    id: 2,
    title: "Error-Based SQL Injection",
    description: "Extract data by triggering and analyzing database errors.",
    difficulty: "Beginner",
    icon: "⚠️",
    topics: ["Error Messages", "Data Extraction", "Information Leakage"],
  },
  {
    id: 3,
    title: "UNION Based SQL Injection",
    description: "Combine multiple SELECT statements to extract data.",
    difficulty: "Intermediate",
    icon: "🔗",
    topics: ["UNION Queries", "Column Matching", "Cross-Table Access"],
  },
  {
    id: 4,
    title: "Finding Number of Columns",
    description: "Discover the column count using ORDER BY technique.",
    difficulty: "Intermediate",
    icon: "🔢",
    topics: ["Column Enumeration", "ORDER BY", "Query Structure"],
  },
  {
    id: 5,
    title: "Extracting Database Metadata",
    description: "Use information_schema to discover database structure.",
    difficulty: "Advanced",
    icon: "🗄️",
    topics: ["Information Schema", "Metadata", "Database Recon"],
  },
  {
    id: 6,
    title: "String vs Numeric Injection",
    description: "Compare injection techniques for different data types.",
    difficulty: "Intermediate",
    icon: "🔤",
    topics: ["Data Types", "String Injection", "Numeric Injection"],
  },
  {
    id: 7,
    title: "SQLi in Search Function",
    description: "Exploit search functionality with advanced techniques.",
    difficulty: "Advanced",
    icon: "🔍",
    topics: ["Search Exploitation", "Wildcards", "Pattern Matching"],
  },
  {
    id: 8,
    title: "SQLi in URL Parameters",
    description: "Manipulate URL parameters to extract unauthorized data.",
    difficulty: "Advanced",
    icon: "🌐",
    topics: ["URL Parameters", "GET Requests", "Parameter Tampering"],
  },
  {
    id: 9,
    title: "Boolean-Based Blind SQLi",
    description:
      "Extract data by observing TRUE/FALSE responses from the database.",
    difficulty: "Advanced",
    icon: "🔀",
    topics: ["Blind SQLi", "Boolean Logic", "Conditional Queries"],
  },
  {
    id: 10,
    title: "Time-Based Blind SQLi",
    description:
      "Use database delays to confirm vulnerabilities and extract data.",
    difficulty: "Advanced",
    icon: "⏱️",
    topics: ["Time Delays", "Blind Injection", "Sleep Functions"],
  },
  {
    id: 11,
    title: "Blind Data Extraction Automation",
    description:
      "Automate blind SQL injection attacks to extract complete data.",
    difficulty: "Advanced",
    icon: "🤖",
    topics: ["Automation", "Binary Search", "Script Development"],
  },
  {
    id: 12,
    title: "Blind SQLi via Cookies",
    description: "Exploit SQL injection through HTTP cookies and session data.",
    difficulty: "Advanced",
    icon: "🍪",
    topics: ["Cookie Injection", "Session Attacks", "Header Manipulation"],
  },
  {
    id: 13,
    title: "Blind SQLi in HTTP Headers",
    description:
      "Inject SQL through User-Agent, Referer, and custom HTTP headers.",
    difficulty: "Advanced",
    icon: "📡",
    topics: ["Header Injection", "Log Poisoning", "Request Manipulation"],
  },
  {
    id: 14,
    title: "Conditional Error SQLi",
    description:
      "Extract data by triggering errors only when conditions are TRUE.",
    difficulty: "Advanced",
    icon: "⚡",
    topics: ["Error-Based Blind", "Conditional Logic", "Type Conversion"],
  },
];

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-800 border-green-300",
  Intermediate: "bg-amber-100 text-amber-800 border-amber-300",
  Advanced: "bg-red-100 text-red-800 border-red-300",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="container-width py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-(--brand) bg-white px-5 py-2 text-sm font-bold text-(--brand) mb-6">
              <ShieldIcon className="w-5 h-5" />
              Professional SQL Injection Training Platform
            </div>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Master SQL Injection
              <span className="block text-(--brand)">The Safe Way</span>
            </h1>
            <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
              Learn to identify and exploit SQL injection vulnerabilities in a
              controlled, educational environment. Progress through 14 hands-on
              labs covering real-world attack scenarios.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="#labs"
                className="brand-button primary text-lg px-8 py-4"
              >
                Start Learning
              </Link>
              <Link
                href="#about"
                className="brand-button secondary text-lg px-8 py-4"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container-width py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="surface p-6 text-center">
              <div className="text-4xl font-black text-(--brand) mb-2">14</div>
              <p className="font-bold">Progressive Labs</p>
              <p className="text-sm text-muted mt-1">
                From basics to advanced blind SQLi
              </p>
            </div>
            <div className="surface p-6 text-center">
              <div className="text-4xl font-black text-(--brand) mb-2">
                Real-Time
              </div>
              <p className="font-bold">SQL Query Monitor</p>
              <p className="text-sm text-muted mt-1">
                See your injections live
              </p>
            </div>
            <div className="surface p-6 text-center">
              <div className="text-4xl font-black text-(--brand) mb-2">
                Safe
              </div>
              <p className="font-bold">Isolated Environment</p>
              <p className="text-sm text-muted mt-1">Practice without risks</p>
            </div>
          </div>
        </section>

        {/* Labs Grid */}
        <section id="labs" className="container-width py-16">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-(--brand) mb-2">
              HANDS-ON TRAINING
            </p>
            <h2
              className="text-4xl md:text-5xl font-black"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              SQL Injection Labs
            </h2>
            <p className="text-muted mt-3 text-lg">
              Progressive challenges designed to build your expertise step by
              step
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {sqlLabs.map((lab) => (
              <Link
                key={lab.id}
                href={`/lab${lab.id}`}
                className="surface p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{lab.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-(--brand) px-3 py-1 text-xs font-bold text-white">
                        Lab {lab.id}
                      </span>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${
                          difficultyColors[lab.difficulty]
                        }`}
                      >
                        {lab.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-black mb-2 group-hover:text-(--brand) transition">
                      {lab.title}
                    </h3>
                    <p className="text-sm text-muted mb-4">{lab.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {lab.topics.map((topic) => (
                        <span
                          key={topic}
                          className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-(--brand) group-hover:translate-x-1 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="about" className="container-width py-16">
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-black"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Why This Platform?
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="surface p-6">
              <div className="w-12 h-12 bg-(--brand) rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">
                Real-Time SQL Monitoring
              </h3>
              <p className="text-sm text-muted">
                Watch SQL queries execute in real-time as you type. Understand
                exactly how your input affects the database query.
              </p>
            </div>

            <div className="surface p-6">
              <div className="w-12 h-12 bg-(--brand) rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">
                Secure & Vulnerable Modes
              </h3>
              <p className="text-sm text-muted">
                Toggle between vulnerable and secure implementations. Learn what
                makes code vulnerable and how to fix it.
              </p>
            </div>

            <div className="surface p-6">
              <div className="w-12 h-12 bg-(--brand) rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">
                Progressive Hints System
              </h3>
              <p className="text-sm text-muted">
                Stuck on a challenge? Unlock hints progressively to guide you
                without giving away the solution immediately.
              </p>
            </div>

            <div className="surface p-6">
              <div className="w-12 h-12 bg-(--brand) rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">
                Safe Learning Environment
              </h3>
              <p className="text-sm text-muted">
                Practice dangerous techniques safely in an isolated environment
                designed specifically for educational purposes.
              </p>
            </div>

            <div className="surface p-6">
              <div className="w-12 h-12 bg-(--brand) rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Real-World Scenarios</h3>
              <p className="text-sm text-muted">
                Each lab simulates actual vulnerability patterns found in
                production applications, preparing you for real security work.
              </p>
            </div>

            <div className="surface p-6">
              <div className="w-12 h-12 bg-(--brand) rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Track Your Progress</h3>
              <p className="text-sm text-muted">
                Monitor your advancement through the labs. Each completed
                challenge brings you closer to mastering SQL injection.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container-width py-16">
          <div className="surface p-12 text-center bg-linear-to-br from-(--brand) to-teal-700 border-none text-white">
            <h2
              className="text-3xl md:text-4xl font-black mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Ready to Become a Security Expert?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Start with Lab 1 and progress through increasingly complex
              scenarios. Learn at your own pace with our comprehensive hint
              system.
            </p>
            <Link
              href="/lab1"
              className="inline-flex items-center gap-2 bg-white text-(--brand) font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition text-lg"
            >
              Begin Lab 1: Basic Login Bypass
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
