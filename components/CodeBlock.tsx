import React from 'react';

interface CodeBlockProps {
  code: string;
  className?: string;
}

// A simple simulated syntax highlighter for better visuals without heavy dependencies
const CodeBlock: React.FC<CodeBlockProps> = ({ code, className }) => {
  // Normalize line endings to ensure consistent splitting
  const lines = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  return (
    <div className={`font-mono text-sm leading-6 overflow-x-auto p-4 ${className}`}>
      <div className="min-w-max space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="text-gray-600 select-none text-right pr-4 w-8 border-r border-gray-700/50">
              {i + 1}
            </span>
            <span className="pl-4 whitespace-pre text-gray-200 flex-1">
              {line || ' '}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeBlock;
