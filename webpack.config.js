var path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'zkit_sdk.js',
    library: 'zkit_sdk',
    // libraryTarget: "umd",
    path: './lib'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    preLoaders: [
      { include: path.resolve('./src/'), test: /\.ts$/, loader: 'tslint-loader' }
    ],
    loaders: [
      { include: path.resolve('./src/'), test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
};
