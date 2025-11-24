import React from 'react';

interface CodeBlockProps {
  code: string;
  className?: string;
}

// A simple simulated syntax highlighter for better visuals without heavy dependencies
const CodeBlock: React.FC<CodeBlockProps> = ({ code, className }) => {
  return (
    <pre className={`font-mono text-sm leading-6 overflow-x-auto p-4 ${className}`}>
      <code>
        {code.split('\n').map((line, i) => (
          <div key={i} className="table-row">
            <span className="table-cell text-gray-600 select-none text-right pr-4 w-8 border-r border-gray-700/50 mr-4">
              {i + 1}
            </span>
            <span className="table-cell pl-4 whitespace-pre text-gray-200">
              {line}
            </span>
          </div>
        ))}
      </code>
    </pre>
  );
};

export default CodeBlock;
