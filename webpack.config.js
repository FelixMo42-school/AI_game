const path = require("path")

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, "dist"),
    },

    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        ignored: /dist/
    }
}