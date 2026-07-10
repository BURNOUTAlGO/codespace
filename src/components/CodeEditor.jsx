import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";

const getExtension = (fileName = "") => {
  const ext = fileName.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "js":
    case "jsx":
      return javascript({ jsx: true });

    case "ts":
    case "tsx":
      return javascript({ typescript: true });

    case "html":
      return html();

    case "css":
      return css();

    case "json":
      return json();

    case "java":
      return java();

    case "py":
      return python();

    default:
      return javascript();
  }
};





const CodeEditor = ({ value, onChange, fileName }) => {
  return (
    <div className="h-full bg-[#030108]">
      <CodeMirror
        value={value}
        height="100%"
        theme={oneDark}
        extensions={[getExtension(fileName)]}
        onChange={(value) => onChange(value)}
basicSetup={{
  lineNumbers: true,
  foldGutter: true,
  highlightActiveLine: true,
  highlightActiveLineGutter: true,
  bracketMatching: true,
  autocompletion: true,
  closeBrackets: true,
  indentOnInput: true,
  drawSelection: true,
}}
        style={{
          height: "100%",
          fontSize: "14px",
          
          fontFamily: "JetBrains Mono, monospace",
        }}
      />
    </div>
  );
};

export default CodeEditor;