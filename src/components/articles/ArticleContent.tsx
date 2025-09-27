"use client";

interface ArticleContentProps {
  content: string;
}

// 간단한 마크다운 파싱 함수
function parseMarkdown(content: string): string {
  return content
    // 헤딩
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-8 mb-4 first:mt-0">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-semibold mt-8 mb-4 first:mt-0">$1</h1>')
    
    // 볼드, 이탤릭
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>')
    
    // 링크
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-primary hover:text-primary/80 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // 인라인 코드
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    
    // 줄바꿈을 p 태그로
    .split('\n\n')
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map(paragraph => {
      if (paragraph.startsWith('<h') || paragraph.startsWith('<ul') || paragraph.startsWith('<blockquote')) {
        return paragraph;
      }
      return `<p class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">${paragraph}</p>`;
    })
    .join('');
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const parsedContent = parseMarkdown(content);

  return (
    <div 
      className="prose prose-gray dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: parsedContent }}
    />
  );
}