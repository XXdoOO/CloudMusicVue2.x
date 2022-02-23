module.exports = {
    devServer: {
        proxy: {
          '/api': {
                target: 'http://124.222.90.113:3000',
                secure: false, // false为http访问，true为https访问
                changeOrigin: true, // 跨域访问设置，true代表跨域
                pathRewrite: { "^/api": "" }
            }
        }
    }
}