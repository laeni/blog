// @ts-check

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  output: 'export',
  // 严格模式 - https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: true,
  // 尾斜杠 - 将'/xxx.html'输出为'/xxx/index.html',以解决导出静态文件后直接访问子页面404的问题
  trailingSlash: true,
}
