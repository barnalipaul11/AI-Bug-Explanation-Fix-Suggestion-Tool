import React, { useState } from "react";
import axios from "axios";

export default function GithubFetcher({ onAnalyze }) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [number, setNumber] = useState("");
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState("");

  const fetchIssue = async () => {
    try {
      setError("");
      setIssue(null);
      const res = await axios.get("http://localhost:8080/api/github/issue", {
        params: { owner, repo, number },
      });
      setIssue(res.data);
    } catch (error) {
      setError("Could not load issue. Check repo/issue number.");
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 shadow-2xl rounded-xl p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-white mb-4">Fetch GitHub Issue</h2>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1 uppercase font-bold tracking-wide">Owner</label>
          <input
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. facebook"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1 uppercase font-bold tracking-wide">Repository</label>
          <input
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. react"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1 uppercase font-bold tracking-wide">Issue #</label>
          <input
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. 1024"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>

        <button
          onClick={fetchIssue}
          className="mt-2 bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg font-medium transition-colors border border-slate-600"
        >
          Fetch Issue
        </button>
      </div>

      {error && <p className="text-red-400 mt-4 bg-red-900/20 p-3 rounded border border-red-900/50 text-sm">{error}</p>}

      {issue && (
        <div className="mt-6 border border-slate-700 bg-slate-900/50 p-4 rounded-xl flex-1 overflow-y-auto">
          <div className="flex justify-between items-start mb-4 border-b border-slate-700 pb-3">
            <h3 className="text-lg font-bold text-slate-100 truncate pr-2">{issue.title}</h3>
            
            <button
              onClick={() => onAnalyze(issue.title + "\n\n" + issue.body)}
              className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-3 py-2 rounded shadow-lg transform transition hover:scale-105 flex items-center gap-2"
            >
               Analyze <span className="text-green-200">→</span>
            </button>
          </div>

          <pre className="whitespace-pre-wrap text-slate-400 text-sm font-mono">
            {issue.body}
          </pre>

          <a
            className="text-blue-400 hover:text-blue-300 text-sm mt-4 inline-block underline underline-offset-2"
            href={issue.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub ↗
          </a>
        </div>
      )}
    </div>
  );
}