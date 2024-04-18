module.exports = function (_, argv = {}) {
  const path = require('path');
  const CircularDependencyPlugin = require('circular-dependency-plugin');
  const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
  const CopyPlugin = require('copy-webpack-plugin');
  const TerserPlugin = require("terser-webpack-plugin");

  const getConfig = require('./bin/utils');

  const { mode = 'production', outputPath = path.resolve(__dirname, 'build') } = argv;
  const isProduction = mode === 'production';
  const { entry, patterns } = getConfig(outputPath);

  const config = {
    entry,
    output: {
      path: outputPath,
      filename: '[name].js',
      library: {
        name: '[name]',
        type: 'self',
      },
      libraryTarget: 'window',
      clean: isProduction
    },
    optimization: {
      minimize: isProduction,
      usedExports: false,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    },
    target: 'web',
    mode,
    devtool: isProduction ? false : 'cheap-module-source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      modules: [path.resolve('./src'), 'node_modules'],
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
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: true
      }),
      new CopyPlugin({ patterns })
    ]
  };

  return config;
}
