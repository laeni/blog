import ReactMarkdown, { Components } from "react-markdown"
import rehypeMathjax from 'rehype-mathjax'
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import remarkMath from 'remark-math'
import CodeBlock from '../../components/code-block'
import StyleClient from '../../components/style-client'

const components: Components = {
  code({ children, node, style, ...props }) {
    const match = /language-(\w+)/.exec(props.className || '')

    return match ? (
      <CodeBlock
        language={match.length > 0 ? match[1] : undefined}
        children={children as string}
        style={style as { [key: string]: React.CSSProperties } | undefined}
        {...props}
      />
    ) : (
      <code className="bg-gray-200 dark:bg-gray-700 rounded-sm px-1">{children}</code>
    )
  },
  style({ children }) {
    return <StyleClient children={children as string || ''} />
  }
}

// 自定义 unified 插件，将 table 放在 <div class='overflow-x-auto' /> 标签内，防止在移动端由于表格内容过多破坏整体布局
function rehypeFixTable() {
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

export default async function ReactMarkdownContent({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeMathjax, rehypeSlug, rehypeFixTable]}
      components={components}
      children={children}
      skipHtml
    />
  )
}
