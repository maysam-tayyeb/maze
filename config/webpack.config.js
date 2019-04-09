const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const express = require('express');

const paths = require('./paths');

module.exports = (env, argv) => {
  return {
    mode: argv.mode,
    entry: paths.appIndexJs,
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
      extensions: [
        '.web.js',
        '.mjs',
        '.js',
        '.json',
        '.web.jsx',
        '.jsx',
        '.web.ts',
        '.ts',
        '.web.tsx',
        '.tsx',
      ],
      plugins: [
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
        new TsconfigPathsPlugin({ configFile: paths.appTsConfig }),
      ],
    },

    output: {
      path: path.join(__dirname, '..', 'public'),
      filename: 'bundle.js',
      sourceMapFilename: 'bundle.map'
    },

    module: {
      rules: [
        {
          test: /\.(png|jpg|gif)$/,
          use: {
            loader: "url-loader",
            options: {
              limit: 8192
            }
          }
        },
        {
          test: /\.(ts|tsx)$/,
          include: paths.appSrc,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
              },
            },
          ],
        }, {
          test: /\.s?css$/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        }
      ]
    },

    plugins: [
      new CleanWebpackPlugin(),
      new WriteFilePlugin(),
      new CopyWebpackPlugin([
        { from: 'static', to: 'static' }
      ]),
      new MiniCssExtractPlugin({
        filename: 'css/style.[contenthash].css'
      }),
      new HtmlWebpackPlugin({
        title: 'Maze',
        template: "./src/index.html",
        filename: "./index.html"
      }),
      new ForkTsCheckerWebpackPlugin({
        async: false,
        watch: paths.appSrc,
        tsconfig: paths.appTsConfig,
        tslint: paths.appTsLint
      }),
      new StyleLintPlugin({
        configFile: '.stylelintrc',
        context: 'src',
        files: '**/*.scss',
      })
    ],

    devServer: {
      contentBase: path.join(__dirname, '..', 'public')
    }
  };
};