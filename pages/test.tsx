import { unified } from 'unified'
// Markdown字符串 -> Markdown语法树(mdast)
import remarkParse from 'remark-parse'
// Markdown语法树(mdast) -> HTML语法树(hast)
import remarkRehype from 'remark-rehype'
// HTML语法树(hast) -> HTML字符串
import rehypeStringify from 'rehype-stringify'

export default function TestPage() {
    unified()
        .use(remarkParse)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeStringify)
        .process('# Test\n*Emphasis* and _stress_, you guys!')
        .then(v => {
            console.log(v);
            console.log(String(v));
        })

    return (
        <>
            11111111111111111111111
        </>
    )
}