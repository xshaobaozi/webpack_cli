module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers: [
                'Android >= 4',
                'Chrome >= 30',
                'iOS >= 6',
                'ie>=6',
                'Firefox >= 20',
                'Safari >= 5'
            ]
        }),
        require('cssnano')({
            preset: 'defailt'
        })
    ]
}