module.exports = function () {
  const path = require('path');
  const webpack = require('webpack');
  const CircularDependencyPlugin = require('circular-dependency-plugin');
  const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

  const config = {
    entry: [
      './src/MyWidgets.ts',
    ],
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'MyWidgets.js',
      library: 'MyWidgets',
      libraryTarget: 'window',
    },
    optimization: {
      minimize: true,
      usedExports: false
    },
    target: 'web',
    mode: 'production',
    devtool: 'cheap-module-source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      modules: [path.resolve('./src'),'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
              {
                  loader: 'ts-loader',
                  options: {
                      configFile: 'tsconfig.json',
                      transpileOnly: true
                  }
              }
          ]
        }
      ]
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: true
      })
    ]
  };

  return config;
}
