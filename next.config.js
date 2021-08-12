module.exports = {
    // 需要执行'next export'导出为静态页面时使用,目的是将图片的cdn地址设置为和本站一致（静态导出将失去图片优化）
    images: { loader: 'imgix', path: '/' },
    // 尾斜杠 - 将'/xxx.html'输出为'/xxx/index.html',以解决导出静态文件后直接访问子页面404的问题
    trailingSlash: true,
    webpack5: true,
}
