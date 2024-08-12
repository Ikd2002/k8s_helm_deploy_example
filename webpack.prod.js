const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./webpack.common');

const date = new Date();
const buildDate = date.toLocaleDateString('en', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const BANNER_TEMPLATE = `
/*!
 * @name       [name]
 * @built at   ${buildDate}
 * @copyright  © jermakyan ${date.getFullYear()} (https://jermakyan.ru)
 */`;

module.exports = merge(common, {
  devtool: 'source-map',

  mode: 'production',

  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: { map: true },
      }),
    ],
  },

  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.BannerPlugin({
      banner: BANNER_TEMPLATE,
      include: [
        'payout-form',
        'payment-form',
      ],
      raw: true,
    }),
  ],
});
