const DashboardPlugin = require('webpack-dashboard/plugin');
const merge = require('webpack-merge');
const path = require('path');

const common = require('./webpack.common');

module.exports = merge(common, {
  devtool: 'inline-source-map',

  devServer: {
    contentBase: path.join(__dirname, 'build'),
    historyApiFallback: true,
    hot: true,
    port: process.env.APP_PORT,
  },

  mode: 'development',

  plugins: [
    new DashboardPlugin(),
  ],
});
