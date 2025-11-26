import React, { useState } from "react";
import BugAnalyzer from "../components/BugAnalyzer";
import GithubFetcher from "../components/GithubFetcher";

export default function Dashboard() {
  const [sharedBugText, setSharedBugText] = useState("");

  return (
    // 1. Dark Gradient Background
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white p-6">
      
      {/* Header with slight transparency */}
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-sm">
        AI Bug Explanation Dashboard
      </h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
        {/* GithubFetcher: 30% width on md+, full on mobile */}
        <div className="w-full md:w-[30%] shrink-0">
          <GithubFetcher onAnalyze={(text) => setSharedBugText(text)} />
        </div>
        {/* BugAnalyzer: 70% width on md+, full on mobile */}
        <div className="w-full md:w-[70%]">
          <BugAnalyzer prefilledText={sharedBugText} />
        </div>
      </div>
    </div>
  );
}