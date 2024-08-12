const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');
const webpack = require('webpack');

const baseEnvPath = path.join(__dirname, '.env');
const envPath = `${baseEnvPath}.${process.env.ENV}`;
const envParams = Object.entries(dotenvExpand(dotenv.config({
  path: fs.existsSync(envPath) ? envPath : baseEnvPath,
})).parsed).reduce((result, [key, value]) => ({
  ...result,
  [key]: JSON.stringify(value),
}), {});

module.exports = {
  entry: {
    'app': path.join(__dirname, 'src/app.js'),
    'payment-form': path.join(__dirname, 'src/payment-form.js'),
    'payout-form': path.join(__dirname, 'src/payout-form.js'),
  },

  output: {
    path: path.join(__dirname, 'build'),
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: 'jermakyan-[folder]__[local]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                postcssPresetEnv({
                  importFrom: path.join(__dirname, 'src/theme.css'),
                  preserve: false,
                }),
              ],
            },
          },
        ],
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin(envParams),
    new CopyPlugin([
      {
        from: path.join(__dirname, 'public'),
        to: path.join(__dirname, 'build'),
      },
      {
        from: path.join(__dirname, 'examples'),
        to: path.join(__dirname, 'build/examples'),
        transform: (content, path) => {
          if (/\.html$/i.test(path)) {
            return content
              .toString()
              .replace(/\{\{\s*APP_BASE_URL\s*\}\}/ig, process.env.APP_BASE_URL);
          }

          return content;
        }
      },
    ]),
    new HtmlWebpackPlugin({
      chunks: ['app'],
      template: 'src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
    new MiniCssExtractPlugin(),
  ],
};
