// // 


// import React, { useState, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import axios from "axios";

// export default function BugAnalyzer({ prefilledText }) {
//   const [text, setText] = useState("");
//   const [resp, setResp] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Watch for changes in prefilledText (from GitHub Fetcher)
//   useEffect(() => {
//     if (prefilledText) setText(prefilledText);
//   }, [prefilledText]);

//   const analyze = async () => {
//     setLoading(true);
//     setError(null);
//     setResp(null);

//     try {
//       const res = await axios.post("http://localhost:8080/api/bug/analyze", {
//         bugText: text,
//       });
//       setResp(res.data);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.details || "Failed to analyze bug.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper: Determine badge color based on severity
//   const getSeverityColor = (sev) => {
//     const s = sev?.toLowerCase() || "";
//     if (s.includes("critical") || s.includes("high")) return "bg-red-500 text-white";
//     if (s.includes("medium")) return "bg-yellow-500 text-black";
//     return "bg-blue-500 text-white";
//   };

//   // Helper: Create Stack Overflow search link
//   const getStackOverflowUrl = (keywords) => {
//     if (!keywords) return "https://stackoverflow.com/";
//     const query = encodeURIComponent(keywords);
//     return `https://stackoverflow.com/search?q=${query}`;
//   };

//   return (
//     <div className="bg-slate-800 border border-slate-700 shadow-2xl rounded-xl p-6 h-full flex flex-col">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold text-white">AI Bug Analyzer</h2>
//         <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
//           Gemini Powered
//         </span>
//       </div>

//       {/* Input Area */}
//       <textarea
//         className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-32 font-mono text-sm transition-all"
//         placeholder="Paste error log here..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />

//       {/* Analyze Button */}
//       <button
//         onClick={analyze}
//         disabled={loading || !text}
//         className={`mt-4 px-6 py-3 rounded-lg font-medium text-white transition-all shadow-lg ${
//           loading
//             ? "bg-slate-600 cursor-not-allowed"
//             : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-95"
//         }`}
//       >
//         {loading ? (
//           <span className="flex items-center justify-center gap-2">
//             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
//             Analyzing...
//           </span>
//         ) : (
//           "Analyze Bug"
//         )}
//       </button>

//       {/* Error Display */}
//       {error && (
//         <div className="mt-4 bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-lg">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {/* Results Display */}
//       {resp && (
//         <div className="mt-6 flex-1 overflow-y-auto custom-scrollbar space-y-4">
          
//           {/* 1. HEADER: Title, Summary, Severity */}
//           <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 relative overflow-hidden">
//             <div className="flex justify-between items-start gap-4">
//                 <div>
//                     <h3 className="text-lg font-bold text-blue-200 leading-tight">
//                     {resp.title}
//                     </h3>
//                     <p className="text-slate-400 mt-2 text-sm italic">
//                     "{resp.summary}"
//                     </p>
//                 </div>
//                 <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getSeverityColor(resp.severity)}`}>
//                     {resp.severity || "Unknown"}
//                 </span>
//             </div>
            
//             {/* Action Bar: Keywords & Search */}
//             <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
//                 <span className="text-xs text-slate-500 uppercase font-bold">Keywords:</span>
//                 <span className="text-xs text-slate-400 font-mono mr-auto">
//                     {resp.keywords || "N/A"}
//                 </span>
//                 <a 
//                     href={getStackOverflowUrl(resp.keywords)} 
//                     target="_blank" 
//                     rel="noreferrer"
//                     className="text-xs bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded transition-colors flex items-center gap-1"
//                 >
//                     Search on Stack Overflow ↗
//                 </a>
//             </div>
//           </div>

//           {/* 2. EXPLANATION */}
//           <div className="p-2">
//             <h4 className="font-bold text-slate-400 mb-2 uppercase text-xs tracking-wider">
//               Explanation
//             </h4>
//             <div className="prose prose-invert prose-sm max-w-none text-slate-300">
//               <ReactMarkdown>{resp.explanation}</ReactMarkdown>
//             </div>
//           </div>

//           {/* 3. SUGGESTED FIXES */}
//           <div className="bg-green-900/10 border border-green-900/30 rounded-lg p-4">
//             <div className="flex justify-between items-center mb-2">
//                 <h4 className="font-bold text-green-400 uppercase text-xs tracking-wider">
//                 Suggested Fixes
//                 </h4>
//                 <button 
//                     onClick={() => navigator.clipboard.writeText(resp.fixes)}
//                     className="text-xs text-green-400 hover:text-green-200 underline transition-colors"
//                     title="Copy code to clipboard"
//                 >
//                     Copy All
//                 </button>
//             </div>
//             <div className="prose prose-invert prose-sm max-w-none text-slate-300">
//               <ReactMarkdown>{resp.fixes}</ReactMarkdown>
//             </div>
//           </div>

//           {/* 4. DOCUMENTATION LINKS */}
//           {resp.links && (
//             <div className="bg-purple-900/10 border border-purple-900/30 rounded-lg p-4">
//                 <h4 className="font-bold text-purple-400 mb-2 uppercase text-xs tracking-wider flex items-center gap-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                 </svg>
//                 Relevant Documentation
//                 </h4>
//                 <div className="prose prose-invert prose-sm max-w-none text-purple-200 hover:text-purple-100 transition-colors">
//                 <ReactMarkdown 
//                     components={{
//                     a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline" />
//                     }}
//                 >
//                     {resp.links}
//                 </ReactMarkdown>
//                 </div>
//             </div>
//           )}

//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

/**
 * Custom Component to render Code Blocks with a Copy Button
 * logic: Intercepts the <pre> tag from markdown
 */
const CodeBlock = ({ children, ...props }) => {
  const [copied, setCopied] = useState(false);

  // ReactMarkdown nests code inside 'pre' > 'code'. 
  // We extract the raw text from children.props.children
  const codeContent = children?.props?.children || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden">
      {/* The Copy Button (Visible on Hover) */}
      <button
        onClick={handleCopy}
        className={`absolute right-2 top-2 px-3 py-1 text-xs font-bold rounded shadow-md transition-all z-10 border ${
          copied
            ? "bg-green-500 border-green-600 text-white opacity-100"
            : "bg-slate-700 border-slate-600 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-slate-600 hover:text-white"
        }`}
      >
        {copied ? "Copied!" : "Copy Code"}
      </button>

      {/* The Code Block Container */}
      <pre {...props} className="bg-slate-950 p-4 overflow-x-auto border border-slate-800 text-sm text-slate-300">
        {children}
      </pre>
    </div>
  );
};

export default function BugAnalyzer({ prefilledText }) {
  const [text, setText] = useState("");
  const [resp, setResp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prefilledText) setText(prefilledText);
  }, [prefilledText]);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    setResp(null);

    try {
      const res = await axios.post("http://localhost:8080/api/bug/analyze", {
        bugText: text,
      });
      setResp(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.details || "Failed to analyze bug.");
    } finally {
      setLoading(false);
    }
  };

  // Helper: Badge Colors
  const getSeverityColor = (sev) => {
    const s = sev?.toLowerCase() || "";
    if (s.includes("critical") || s.includes("high")) return "bg-red-500 text-white";
    if (s.includes("medium")) return "bg-yellow-500 text-black";
    return "bg-blue-500 text-white";
  };

  // Helper: Stack Overflow Link
  const getStackOverflowUrl = (keywords) => {
    if (!keywords) return "https://stackoverflow.com/";
    const query = encodeURIComponent(keywords);
    return `https://stackoverflow.com/search?q=${query}`;
  };

  return (
    <div className="bg-slate-800 border border-slate-700 shadow-2xl rounded-xl p-6 h-full flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">AI Bug Analyzer</h2>
        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
          Gemini Powered
        </span>
      </div>

      {/* Input Area */}
      <textarea
        className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-32 font-mono text-sm"
        placeholder="Paste error log here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Analyze Button */}
      <button
        onClick={analyze}
        disabled={loading || !text}
        className={`mt-4 px-6 py-3 rounded-lg font-medium text-white transition-all shadow-lg ${
          loading
            ? "bg-slate-600 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-95"
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Analyzing...
          </span>
        ) : (
          "Analyze Bug"
        )}
      </button>

      {/* Error State */}
      {error && (
        <div className="mt-4 bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Response State */}
      {resp && (
        <div
          className="mt-6 flex-1 custom-scrollbar space-y-6"
          style={{ maxHeight: "600px", overflowY: "auto" }}
        >
          
          {/* 1. SUMMARY CARD */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="text-lg font-bold text-blue-200 leading-tight">{resp.title}</h3>
                    <p className="text-slate-400 mt-2 text-sm italic">"{resp.summary}"</p>
                </div>
                <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase ${getSeverityColor(resp.severity)}`}>
                    {resp.severity || "Info"}
                </span>
            </div>
            
            {/* Keywords & Search */}
            <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 uppercase font-bold">Keywords:</span>
                <span className="text-xs text-slate-400 font-mono mr-auto">
                    {resp.keywords || "N/A"}
                </span>
                <a 
                    href={getStackOverflowUrl(resp.keywords)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded transition-colors flex items-center gap-1"
                >
                    Search Stack Overflow ↗
                </a>
            </div>
          </div>

          {/* 2. EXPLANATION */}
          <div className="p-2">
            <h4 className="font-bold text-slate-400 mb-2 uppercase text-xs tracking-wider">Explanation</h4>
            <div className="prose prose-invert prose-sm max-w-none text-slate-300">
              <ReactMarkdown>{resp.explanation}</ReactMarkdown>
            </div>
          </div>

          {/* 3. FIXES (With Copy Code Button) */}
          <div className="bg-green-900/10 border border-green-900/30 rounded-lg p-4">
            <h4 className="font-bold text-green-400 uppercase text-xs tracking-wider mb-2">Suggested Fixes</h4>
            
            <div className="prose prose-invert prose-sm max-w-none text-slate-300">
              <ReactMarkdown
                components={{
                  // INTERCEPT <pre> TAGS TO ADD COPY BUTTON
                  pre: CodeBlock,
                  // Custom Link Styling
                  a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline" />
                }}
              >
                {resp.fixes}
              </ReactMarkdown>
            </div>
          </div>

          {/* 4. DOCUMENTATION LINKS */}
          {resp.links && (
            <div className="bg-purple-900/10 border border-purple-900/30 rounded-lg p-4">
                <h4 className="font-bold text-purple-400 mb-2 uppercase text-xs tracking-wider flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                Relevant Documentation
                </h4>
                <div className="prose prose-invert prose-sm max-w-none text-purple-200">
                <ReactMarkdown components={{ a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline" /> }}>
                    {resp.links}
                </ReactMarkdown>
                </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}