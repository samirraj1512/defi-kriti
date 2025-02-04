const webpack = require("webpack");

module.exports = {
    resolve: {
        fallback: {
            "buffer": require.resolve("buffer/"),
            "assert": require.resolve("assert/"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify")
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
            process: "process/browser"
        })
    ]
};