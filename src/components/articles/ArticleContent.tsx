"use client";

import Image from 'next/image';
/* eslint-disable @next/next/no-img-element */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="article-content">
      <style jsx global>{`
        .article-content {
          max-width: none;
          color: #374151;
          line-height: 1.75;
        }

        /* 헤딩 스타일 */
        .article-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .article-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .article-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        /* 본문 텍스트 */
        .article-content p {
          margin-bottom: 1rem;
          color: #4b5563;
          line-height: 1.8;
        }

        /* 강조 텍스트 */
        .article-content strong {
          font-weight: 700;
          color: #111827;
        }

        .article-content em {
          font-style: italic;
          color: #4b5563;
        }

        /* 링크 스타일 */
        .article-content a {
          color: #2563eb;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }

        .article-content a:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        /* 코드 스타일 */
        .article-content code {
          background-color: #f3f4f6;
          color: #1f2937;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
        }

        .article-content pre {
          background-color: #111827;
          color: #f3f4f6;
          border-radius: 0.5rem;
          overflow-x: auto;
          padding: 1rem;
          margin: 1.5rem 0;
        }

        .article-content pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
          font-size: 0.875rem;
        }

        /* 인용구 */
        .article-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          font-style: italic;
          color: #4b5563;
          margin: 1.5rem 0;
        }

        /* 리스트 */
        .article-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .article-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .article-content li {
          margin-bottom: 0.25rem;
          color: #4b5563;
        }

        /* 표 */
        .article-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.5rem 0;
          font-size: 0.875rem;
        }

        .article-content th {
          background-color: #f9fafb;
          border: 1px solid #d1d5db;
          padding: 0.5rem 1rem;
          text-align: left;
          font-weight: 600;
        }

        .article-content td {
          border: 1px solid #d1d5db;
          padding: 0.5rem 1rem;
        }

        /* 이미지 */
        .article-content img {
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          margin: 1.5rem auto;
          display: block;
          max-width: 100%;
        }

        /* 구분선 */
        .article-content hr {
          border-color: #d1d5db;
          margin: 2rem 0;
        }
      `}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => {
            // src가 문자열이 아니면 null 반환
            if (!src || typeof src !== 'string') return null;

            // 외부 이미지인 경우 (cdn.danhobak.kr만 Next Image 사용)
            if (src.startsWith('https://cdn.danhobak.kr')) {
              return (
                <span className="block relative w-full my-4">
                  <Image
                    src={src}
                    alt={alt || ''}
                    width={800}
                    height={400}
                    className="rounded-lg shadow-md mx-auto"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </span>
              );
            }

            // 그 외 외부 이미지는 일반 img 태그 사용
            if (src.startsWith('http')) {
              return (
                <img
                  src={src}
                  alt={alt || ''}
                  className="rounded-lg shadow-md mx-auto my-4"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              );
            }

            // 내부 이미지인 경우
            return (
              <span className="block relative w-full my-4">
                <Image
                  src={src}
                  alt={alt || ''}
                  width={800}
                  height={400}
                  className="rounded-lg shadow-md mx-auto"
                  style={{ width: '100%', height: 'auto' }}
                />
              </span>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}