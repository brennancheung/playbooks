import type { Components } from 'react-markdown'

export const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    const isInline = !match

    if (isInline) {
      return (
        <code
          className="rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800"
          {...props}
        >
          {children}
        </code>
      )
    }

    return (
      <div className="my-2">
        <pre className="overflow-auto rounded bg-gray-100 p-3 dark:bg-gray-800">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    )
  },
  pre({ children }) {
    return <>{children}</>
  },
  ul({ children }) {
    return <ul className="my-2 list-disc pl-6">{children}</ul>
  },
  ol({ children }) {
    return <ol className="my-2 list-decimal pl-6">{children}</ol>
  },
  blockquote({ children }) {
    return (
      <blockquote className="my-2 border-l-4 border-gray-300 pl-4 italic dark:border-gray-600">
        {children}
      </blockquote>
    )
  },
  h1({ children }) {
    return <h1 className="mb-2 mt-4 text-xl font-bold">{children}</h1>
  },
  h2({ children }) {
    return <h2 className="mb-2 mt-3 text-lg font-semibold">{children}</h2>
  },
  h3({ children }) {
    return <h3 className="mb-1 mt-2 text-base font-semibold">{children}</h3>
  },
  p({ children }) {
    return <p className="my-2">{children}</p>
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  },
}