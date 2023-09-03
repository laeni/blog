//@ts-nocheck

// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';

// 支持多种主题
// import {
//   coyWithoutShadows, coy, prism, solarizedlight, coldarkCold,                     // 浅色
//   xonokai, vscDarkPlus, tomorrow, okaidia, materialOceanic, darcula, cb, a11yDark // 深色
// } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import light from 'react-syntax-highlighter/dist/cjs/styles/prism/prism'
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/darcula'

//#region  为了减小包大小，这里仅仅注册常见的语言 - https://github.com/react-syntax-highlighter/react-syntax-highlighter#light-build
import basic from 'refractor/lang/basic';
import c from 'refractor/lang/c';
import cpp from 'refractor/lang/cpp';
import css from 'refractor/lang/css';
import go from 'refractor/lang/go';
import java from 'refractor/lang/java';
import javascript from 'refractor/lang/javascript';
import json from 'refractor/lang/json';
import jsx from 'refractor/lang/jsx';
import kotlin from 'refractor/lang/kotlin';
import less from 'refractor/lang/less';
import lua from 'refractor/lang/lua';
import makefile from 'refractor/lang/makefile';
import markdown from 'refractor/lang/markdown';
import nginx from 'refractor/lang/nginx';
import python from 'refractor/lang/python';
import sql from 'refractor/lang/sql';
import typescript from 'refractor/lang/typescript';
import yaml from 'refractor/lang/yaml';
import React from "react";
SyntaxHighlighter.registerLanguage('basic', basic);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('less', less);
SyntaxHighlighter.registerLanguage('lua', lua);
SyntaxHighlighter.registerLanguage('makefile', makefile);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('nginx', nginx);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('yaml', yaml);
//#endregion

/**
 * 代码快.
 */
export default function CodeBlock(props) {
  return (
    <SyntaxHighlighter
      language={props.language}
      style={window?.matchMedia('(prefers-color-scheme: dark)').matches ? dark : light}
      children={props.children}
      {...props}
    />
  )
}
