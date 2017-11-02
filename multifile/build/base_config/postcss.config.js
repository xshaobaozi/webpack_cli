const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
    plugins: [
        autoprefixer({
            browsers: [
                'Android >= 4',
                'Chrome >= 30',
                'iOS >= 6',
                'ie>=6',
                'Firefox >= 20',
                'Safari >= 5'
            ]
        }),
        // cssnano({
        //     preset: 'defailt'
        // })
    ]
}