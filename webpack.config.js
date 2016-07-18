var webpack = require('webpack');

module.exports = {
  entry: {
    app: [
      './src/app.js'
    ]
  },
  output: {
    path: './gomi',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ["", ".react.js", ".js"]
  },
  devtool: '#eval-source-map',
  module: {
    loaders: [
      { test: /.js$/, exclude: /node_modules/, loader: "babel" }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    inline: true,
    contentBase: './gomi'
  }
};
