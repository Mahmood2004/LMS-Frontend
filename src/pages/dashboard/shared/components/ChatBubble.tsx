import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";
import type { Element } from "hast";

interface ChatBubbleProps {
  content: string;
  role: "user" | "assistant";
}

function ChatBubble({ content, role }: ChatBubbleProps) {
  const components: Components = {
    p({ children }) {
      return <div className="mb-2">{children}</div>;
    },

    code({ node, className, children, ...props }) {
      // detect block code by checking if parent is a <pre> element
      const isBlock =
        (node?.position?.start.line ?? 0) !== (node?.position?.end.line ?? 0) ||
        (node?.data as { meta?: string } | undefined)?.meta !== undefined ||
        ((node as Element & { tagName?: string })?.tagName === "code" &&
          node?.position &&
          node.position.end.line - node.position.start.line > 0);

      // check parent node type via className
      const hasLanguageClass = Boolean(className?.startsWith("language-"));

      if (!hasLanguageClass) {
        // Inline code is render as plain text
        return <span {...props}>{children}</span>;
      }

      // Block code with language class is rendered with SyntaxHighlighter
      const language = className?.replace("language-", "") || "text";

      return (
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="pre"
          customStyle={{
            borderRadius: "0.5rem",
            padding: "1rem",
            marginTop: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    },

    table({ children }) {
      return (
        <div className="overflow-x-auto my-2 rounded-md border border-gray-300">
          <table className="w-full border-collapse text-sm bg-white">
            {children}
          </table>
        </div>
      );
    },

    tr({ children, ...props }) {
      return (
        <tr className="even:bg-gray-50" {...props}>
          {children}
        </tr>
      );
    },

    th({ children }) {
      return (
        <th className="border border-gray-300 px-3 py-1.5 bg-gray-100 text-left font-semibold">
          {children}
        </th>
      );
    },

    td({ children }) {
      return (
        <td className="border border-gray-300 px-3 py-1.5 text-gray-800">
          {children}
        </td>
      );
    },

    ul({ children }) {
      return <ul className="list-disc pl-5 mb-2">{children}</ul>;
    },

    ol({ children }) {
      return <ol className="list-decimal pl-5 mb-2">{children}</ol>;
    },

    li({ children }) {
      return <li className="mb-1">{children}</li>;
    },

    h1({ children }) {
      return <h1 className="text-lg font-bold mb-2">{children}</h1>;
    },

    h2({ children }) {
      return <h2 className="text-base font-semibold mb-2">{children}</h2>;
    },

    h3({ children }) {
      return <h3 className="text-sm font-semibold mb-1">{children}</h3>;
    },
  };

  return (
    <div
      className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
        role === "user"
          ? "bg-blue-500 text-white rounded-tr-md ml-auto"
          : "bg-gray-200 text-gray-900"
      }`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default ChatBubble;
