import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

type MarkdownContentProps = {
  children: string;
};

type CodeBlockProps = ComponentPropsWithoutRef<"code"> & {
  language?: string;
};

const LANGUAGE_CLASS_NAME = /language-([\w-]+)/;

function CodeBlock({ children, className, language, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const resetTimeoutRef = useRef<number | undefined>(undefined);
  const code = String(children).replace(/\n$/, "");

  useEffect(() => {
    return () => window.clearTimeout(resetTimeoutRef.current);
  }, []);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Não foi possível copiar o bloco de código.", error);
    }
  }

  return (
    <div className="not-prose my-4 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {language || "código"}
        </span>
        <button
          type="button"
          onClick={() => void copyCode()}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
          aria-label={copied ? "Código copiado" : "Copiar código"}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-200">
        <code className={className} {...props}>
          {code}
        </code>
      </pre>
    </div>
  );
}

const markdownComponents: Components = {
  a: ({ children, ...props }) => (
    <a {...props} target="_blank" rel="noreferrer noopener">
      {children}
    </a>
  ),
  code: ({ children, className, node, ...props }) => {
    const language = LANGUAGE_CLASS_NAME.exec(className || "")?.[1];
    const isBlock = Boolean(
      language ||
        (node?.position && node.position.start.line !== node.position.end.line),
    );

    if (isBlock) {
      return (
        <CodeBlock className={className} language={language} {...props}>
          {children}
        </CodeBlock>
      );
    }

    return (
      <code
        className="rounded bg-slate-950 px-1.5 py-0.5 text-[0.9em] text-cyan-300"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
};

function MarkdownContent({ children }: MarkdownContentProps) {
  return (
    <div className="prose prose-invert prose-slate max-w-none wrap-break-word text-slate-200 prose-headings:mb-2 prose-headings:mt-5 prose-headings:text-white prose-p:my-3 prose-a:text-cyan-400 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-cyan-300 prose-blockquote:border-cyan-500 prose-blockquote:text-slate-300 prose-li:my-1 prose-ol:my-3 prose-ul:my-3 prose-strong:text-white prose-table:block prose-table:max-w-full prose-table:overflow-x-auto prose-th:border prose-th:border-slate-700 prose-th:bg-slate-800 prose-th:px-3 prose-th:py-2 prose-td:border prose-td:border-slate-700 prose-td:px-3 prose-td:py-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={markdownComponents}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownContent;
