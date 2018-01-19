module.exports = {
  entry: "./public/js/main.js",
  output: {
    path: __dirname,
    filename: "public/js/bundle.js"
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
    ]
  }
};
