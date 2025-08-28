"use client";

import { cn } from "@/lib/utils";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: number;
}

export function TextEditor({
  value,
  onChange,
  placeholder = "내용을 작성하세요...",
  className,
  height,
}: TextEditorProps) {
  const textareaStyle = height ? { height: `${height}px` } : {};

  return (
    <div className={cn("text-editor h-full", className)}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("text-editor-textarea", !height && "h-full")}
        style={textareaStyle}
      />
      <style jsx global>{`
        .text-editor-textarea {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          resize: none;
          padding: 16px 0;
          font-family:
            ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono",
            "Courier New", monospace;
          font-size: 16px;
          line-height: 1.7;
          color: inherit;
        }

        .text-editor-textarea::placeholder {
          color: hsl(var(--muted-foreground));
        }

        /* 다크모드 지원 */
        .dark .text-editor-textarea {
          color: hsl(var(--foreground));
        }
      `}</style>
    </div>
  );
}
