import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./App.css";
import { applyInlineSuggestions } from "./editor/inlineSuggestions";
import Navbar from "./components/Navbar";

export default function App() {
  const editorRef = useRef(null);

  const [code, setCode] = useState("print('Welcome to CodeSage')");
  const [output, setOutput] = useState("");
  const [showTerminal, setShowTerminal] = useState(false);

  const [improvedCode, setImprovedCode] = useState("");
  const [improveSummary, setImproveSummary] = useState("");
  const [showDiff, setShowDiff] = useState(false);

  const runCode = async () => {
    setShowTerminal(true);
    setOutput("Running...\n");

    try {
      const res = await fetch("http://127.0.0.1:8000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: "test.py", code }),
      });

      const data = await res.json();
      setOutput((data.stdout || "") + (data.stderr || ""));
    } catch {
      setOutput("❌ Failed to connect to backend\n");
    }
  };

  const explainCode = async () => {
    setShowTerminal(true);
    setOutput("Explaining code...\n");

    try {
      const res = await fetch("http://127.0.0.1:8000/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      setOutput(data.explanation || "No explanation returned");
    } catch {
      setOutput("❌ Explain failed\n");
    }
  };

  const checkErrors = async () => {
    setShowTerminal(true);
    setOutput("Checking for errors...\n");

    try {
      const res = await fetch("http://127.0.0.1:8000/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!data.issues || data.issues.length === 0) {
        setOutput("✅ No errors found");
      } else {
        const list = data.issues
          .map((e, i) => `${i + 1}. ${e.type}: ${e.message}`)
          .join("\n");

        setOutput(list + "\n\n" + (data.explanation || ""));
      }
    } catch {
      setOutput("❌ Error analysis failed\n");
    }
  };

  const improveCode = async () => {
    setShowTerminal(true);
    setOutput("Analyzing code...\nImproving readability...\n");

    try {
      const res = await fetch("http://127.0.0.1:8000/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!data.improved_code || data.improved_code.trim() === code.trim()) {
        setShowDiff(false);
        setOutput("ℹ️ No improvement possible. Code is already optimal.");
        return;
      }

      setImproveSummary(data.summary || "Code improved");
      setImprovedCode(data.improved_code);
      setShowDiff(true);
      setOutput("✔ Improvement ready. Review changes.\n");

      if (editorRef.current && data.suggestions) {
        applyInlineSuggestions(editorRef.current, data.suggestions);
      }
    } catch {
      setOutput("❌ Improve failed (AI timeout)\n");
    }
  };

  return (
    <div className="app">
      {/* 🔵 TOP NAVBAR */}
      <Navbar />

      {/* 🔵 MAIN LAYOUT: SIDEBAR + EDITOR */}
      <div className="main-layout">
        {/* LEFT SIDEBAR */}
        <aside className="sidebar">
          <button className="action" onClick={explainCode}>
            Explain
          </button>
          <button className="action" onClick={checkErrors}>
            Errors
          </button>
          <button className="action" onClick={improveCode}>
            Improve
          </button>
          <button className="action run" onClick={runCode}>
            Run
          </button>
        </aside>

        {/* RIGHT EDITOR */}
        <main className="editor-area">
          <Editor
            height={showTerminal ? "65%" : "100%"}
            defaultLanguage="python"
            value={code}
            onChange={(v) => setCode(v || "")}
            theme="vs-dark"
            onMount={(editor) => {
              editorRef.current = editor;
            }}
          />

          {showTerminal && (
            <div className="terminal">
              <div className="terminal-header">
                <span>Terminal</span>
                <button
                  className="terminal-close"
                  onClick={() => setShowTerminal(false)}
                >
                  ×
                </button>
              </div>
              <pre className="terminal-body">{output}</pre>
            </div>
          )}

          {showDiff && (
            <div className="diff-modal">
              <div className="diff-container">
                <div className="diff-summary">{improveSummary}</div>

                <div className="diff-panels">
                  <div className="diff-panel">
                    <div className="diff-label">Original Code</div>
                    <pre>{code}</pre>
                  </div>

                  <div className="diff-panel improved">
                    <div className="diff-label">Improved Code</div>
                    <pre>{improvedCode}</pre>
                  </div>
                </div>

                <div className="diff-actions">
                  <button
                    className="apply"
                    onClick={() => {
                      setCode(improvedCode);
                      setShowDiff(false);
                    }}
                  >
                    Apply Improvement
                  </button>
                  <button className="cancel" onClick={() => setShowDiff(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
