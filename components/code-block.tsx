'use client'

import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from 'react-syntax-highlighter';

// 支持多种主题
// import {
//   coyWithoutShadows, coy, prism, solarizedlight, coldarkCold,                     // 浅色
//   xonokai, vscDarkPlus, tomorrow, okaidia, materialOceanic, darcula, cb, a11yDark // 深色
// } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/darcula';
import light from 'react-syntax-highlighter/dist/cjs/styles/prism/prism';

/**
 * 代码快.
 */
export default function CodeBlock({ children, language, ...props }: SyntaxHighlighterProps) {
  const [value, setValue] = useState<boolean>();
  useEffect(() => setValue(true), [])

  // 初始时返回简单code，即 SSR 时得到的内容，之后在客户端水合后才展示 SyntaxHighlighter 组件
  if (value) {
    return (
      <SyntaxHighlighter
        language={language}
        style={window?.matchMedia('(prefers-color-scheme: dark)').matches ? dark : light}
        children={typeof children === 'string' ? children.replace(/\n+$/, '') : children}
        {...props}
      />
    )
  } else {
    return <code children={children} {...props} />
  }
}
