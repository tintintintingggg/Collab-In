// webpack.config.js

const path = require('path');
// node 中與路徑的相關套件
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  // 進入點，所以檔案必須與此檔案有關聯才會被編譯
  output: {
    filename: 'main.js',
    // 編譯檔案名稱
    path: path.resolve(__dirname, 'public')
    // 編譯檔案的位置
  },
  module: {
    rules: [
      { test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader" 
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  devServer: {
    contentBase: './public',
    port:8000,
    historyApiFallback: {
      index: 'index.html'
    }

  },
  node: {
    child_process: 'empty',
    fs: 'empty',
    crypto: 'empty',
    net: 'empty',
    tls: 'empty',
    http2: 'empty'
  }
};