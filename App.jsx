import React, { useState, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import html2canvas from "html2canvas";
import "./App.css";

export default function App() {
  const [fields, setFields] = useState([
    { key: "name", value: "your name!" },
    { key: "title", value: "Frontend Developer" },
    { key: "email", value: "me@example.com :)" },
  ]);

  const [cardTheme, setCardTheme] = useState("dark"); // dark or light

  const cardRef = useRef(null);

  const toggleTheme = () => {
    setCardTheme(cardTheme === "dark" ? "light" : "dark");
  };

  const handleChangeKey = (index, newKey) => {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, key: newKey } : f))
    );
  };
  const handleChangeValue = (index, newValue) => {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, value: newValue } : f))
    );
  };
  const addField = () =>
    setFields((prev) => [...prev, { key: "newKey", value: "newValue" }]);
  const removeField = (index) =>
    setFields((prev) => prev.filter((_, i) => i !== index));

  const dataObj = {};
  fields.forEach((f, i) => {
    const k = (f.key && f.key.trim()) || `key${i + 1}`;
    dataObj[k] = f.value;
  });
  const codeString = JSON.stringify(dataObj, null, 2);
  const lineCount = codeString.split("\n").length;

  const saveAsPng = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: "#fff",
    });
    const link = document.createElement("a");
    link.download = "business-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="app">
      <h1 className="page-title">IDE-style Business Card</h1>

      {/* 输入区 */}
      <div className="controls">
        {fields.map((f, i) => (
          <div className="control-row" key={i}>
            <input
              className="ctrl-key"
              value={f.key}
              onChange={(e) => handleChangeKey(i, e.target.value)}
              placeholder="key"
            />
            <input
              className="ctrl-val"
              value={f.value}
              onChange={(e) => handleChangeValue(i, e.target.value)}
              placeholder="value"
            />
            <button className="ctrl-remove" onClick={() => removeField(i)}>
              −
            </button>
          </div>
        ))}
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button className="ctrl-add" onClick={addField}>
            + add field
          </button>
          {/* 切换卡片颜色按钮 */}
          <button className="ctrl-add" onClick={toggleTheme}>
            {cardTheme === "dark" ? "light" : "dark"}
          </button>
        </div>
      </div>

      {/* 卡片 */}
      <div className="card-wrap">
        <div
          className={`card ${cardTheme}`}
          ref={cardRef}
        >
          {/* macOS 标题栏 */}
          <div className="title-bar">
            <div className="dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <div className="title">MyProfile.json</div>
          </div>

          {/* 工具栏 */}
          <div className="toolbar">
            <svg className="tb-icon" viewBox="0 0 24 24">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <svg className="tb-icon" viewBox="0 0 24 24">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <svg className="tb-icon" viewBox="0 0 24 24">
              <path
                d="M3 7l9 5 9-5-9 10-9-5z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* 代码编辑器 */}
          <div className="editor">
            <div className="line-numbers">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i} className="ln">
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="code-area">
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                showLineNumbers={false}
                customStyle={{
                  background: "transparent",
                  margin: 0,
                  padding: "12px 16px",
                  fontSize: 12,
                  lineHeight: 1.4,
                  color: cardTheme === "dark" ? "#fff" : "#000",
                }}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="card-actions">
          <button className="save-btn" onClick={saveAsPng}>
            💾 Save as PNG
          </button>
        </div>
      </div>
    </div>
  );
}
