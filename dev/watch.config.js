module.exports = {
    ...require("./core.config"),

    mode: "development",

    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        ignored: /dist/
    }
}