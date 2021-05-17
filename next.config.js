module.exports = {
    // 需要执行'next export'导出为静态页面时使用,目的是将图片的cdn地址设置为和本站一致（静态导出将失去图片优化）
    images: { loader: 'imgix', path: '/' },
    future: {
        webpack5: true
    },
    exportTrailingSlash: true
}
