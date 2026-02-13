"use client";
import { useEffect, useState } from "react";

export default function HackerLoading() {
  const text = "Initializing secure connection...";
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 60);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="font-mono text-green-400 text-lg">
        <p>
          {displayed}
          <span className="animate-pulse">█</span>
        </p>

        {/* Matrix style dots */}
        <div className="mt-4 flex gap-2 justify-center">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-150"></span>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-300"></span>
        </div>
      </div>
    </div>
  );
}
