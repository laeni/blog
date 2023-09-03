'use client'

import dynamic from 'next/dynamic'
import ReactMarkdown, { Components } from "react-markdown"
import rehypeSlug from "rehype-slug"
import gfm from "remark-gfm"

const components: Components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')

    // 删除自动添加的换行
    children = children.map(value => String(value).replace(/[\n]+$/, ''));

    // 代码块使用动态加载,且服务端不加载,否则其中需要用到window而报错
    const DynamicCodeBlock = dynamic(
      () => import('../../components/code-block'),
      { loading: () => <code>{children}</code>, ssr: false }
    )

    return inline ? (
      <code className="bg-gray-200 dark:bg-gray-700 rounded-sm px-1">{children}</code>
    ) : (
      <DynamicCodeBlock language={match && match.length > 0 ? match[1] : ''} children={children} {...props} />
    )
  }
}

// 自定义 unified 插件，将 table 放在 <div class='overflow-x-auto' /> 标签内，防止在移动端由于表格内容过多破坏整体布局
function fixTable() {
  return (tree: any) => {
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type === 'element' && node.tagName === 'table') {
        tree.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: { class: 'overflow-x-auto' },
          children: [node]
        }
      }
    }
  }
}

export default function ReactMarkdownContent({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
      rehypePlugins={[rehypeSlug, fixTable]}
      components={components}
      children={children}
      skipHtml
    />
  )
}
