"use client";

import { useState, FormEvent } from "react";
import LabLayout from "@/components/lab-layout";
import SuccessDialog from "@/components/success-dialog";

export default function Lab11Page() {
  const [targetUsername, setTargetUsername] = useState("admin");
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [executedQuery, setExecutedQuery] = useState("");
  const [extractedData, setExtractedData] = useState<string[]>([]);
  const [isAutomating, setIsAutomating] = useState(false);

  const hints = [
    "Manual blind extraction is tedious. Automation is key to practical exploitation.",
    "Write a script that tests each character position: for pos in 1..20, test ASCII values.",
    "Use binary search for efficiency: Check if ASCII(char) > 100, then narrow to 100-127 or 0-99.",
    "Try the automation endpoint: /api/lab11/automate with target username to extract passwords.",
    "Real attackers use tools like sqlmap for automation. This lab simulates that process manually.",
  ];

  const handleManualTest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(
      "Manual testing requires multiple requests. Use automation for practical extraction.",
    );
  };

  const handleAutomateExtraction = async () => {
    setIsLoading(true);
    setIsAutomating(true);
    setStatusMessage("🤖 Starting automated extraction...");
    setExtractedData([]);

    try {
      const endpoint = `/api/lab11/automate?username=${encodeURIComponent(targetUsername)}&secure=${isSecureMode}`;
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.query) {
        setExecutedQuery(data.query);
      }

      if (data.success && data.extracted) {
        setExtractedData(data.steps || []);
        setStatusMessage(`✅ Extraction complete! Found: ${data.extracted}`);

        if (!isSecureMode) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lab_name: "lab11" }),
          });
          setShowSuccess(true);
        }
      } else {
        setStatusMessage("❌ " + (data.error || "Extraction failed"));
      }
    } catch (error) {
      setStatusMessage("❌ Unable to process request");
    } finally {
      setIsLoading(false);
      setIsAutomating(false);
    }
  };

  return (
    <>
      <LabLayout
        labNumber={11}
        labTitle="Blind Data Extraction Automation"
        labDescription="Automate blind SQL injection to extract data efficiently. Learn how attackers use scripts and tools to extract information character by character."
        difficulty="Advanced"
        hints={hints}
        sqlQuery={executedQuery}
        sqlParams={[]}
        isSecureMode={isSecureMode}
        onSecureModeToggle={() => setIsSecureMode(!isSecureMode)}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            Automated Blind SQLi Extraction
          </h2>
          <p className="text-muted mb-6">
            Manually extracting data via blind SQL injection is slow. This lab
            demonstrates automated extraction techniques used by real attackers
            and penetration testers.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Target Username
              </label>
              <input
                type="text"
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value)}
                placeholder="Enter username to extract password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--brand) focus:outline-none transition"
              />
            </div>

            <button
              onClick={handleAutomateExtraction}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition text-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Extracting Data...</span>
                </>
              ) : (
                <>
                  <span>🤖 Start Automated Extraction</span>
                </>
              )}
            </button>

            {statusMessage && (
              <div
                className={`p-4 rounded-xl border-2 text-sm font-semibold ${
                  statusMessage.includes("✅")
                    ? "bg-green-50 border-green-200 text-green-800"
                    : statusMessage.includes("🤖")
                      ? "bg-blue-50 border-blue-200 text-blue-800"
                      : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {statusMessage}
              </div>
            )}

            {/* Extraction Progress */}
            {extractedData.length > 0 && (
              <div className="p-5 bg-gray-900 text-green-400 rounded-xl font-mono text-sm max-h-96 overflow-y-auto">
                <div className="flex items-center gap-2 mb-3 text-white">
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
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-bold">Extraction Log</span>
                </div>
                {extractedData.map((step, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-500">[{index + 1}]</span> {step}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Your Objective
              </h3>
              <p className="text-sm text-blue-900">
                Use the automated extraction tool to retrieve the password for
                the target username. The tool will make multiple requests to
                extract data character by character.
              </p>
            </div>

            <div className="p-5 bg-purple-50 border-2 border-purple-200 rounded-xl">
              <h3 className="font-bold text-purple-900 mb-2">
                🔧 How Automation Works
              </h3>
              <ol className="text-sm text-purple-900 space-y-2 list-decimal list-inside">
                <li>
                  <strong>Determine length:</strong> Find how many characters to
                  extract
                </li>
                <li>
                  <strong>Loop through positions:</strong> For each character
                  position (1, 2, 3...)
                </li>
                <li>
                  <strong>Binary search:</strong> Efficiently find ASCII value
                  of each character
                </li>
                <li>
                  <strong>Build the result:</strong> Combine all characters to
                  get the complete data
                </li>
                <li>
                  <strong>Common tools:</strong> sqlmap, custom Python scripts,
                  Burp Suite extensions
                </li>
              </ol>
            </div>

            <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-xl">
              <h3 className="font-bold text-amber-900 mb-2">
                ⚡ Why Automation Matters
              </h3>
              <p className="text-sm text-amber-900">
                Extracting a 10-character password manually would require{" "}
                <strong>hundreds of requests</strong>. Automation tools can
                complete the same task in seconds, making blind SQL injection
                practical and dangerous in real-world scenarios.
              </p>
            </div>
          </div>
        </div>
      </LabLayout>

      <SuccessDialog
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        labNumber={11}
        title="Blind Data Extraction Automation"
        message="Outstanding! You've automated blind SQL injection to extract data efficiently. This is a critical skill for real-world penetration testing."
      />
    </>
  );
}
