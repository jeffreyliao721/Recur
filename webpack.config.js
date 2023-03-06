const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MarkdownPlugin = require('markdown-html-webpack-plugin');
const AutoPrefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');

const PUB_DIR = path.resolve(__dirname, 'public');
const SRC_DIR = path.resolve(__dirname, 'src');

module.exports = (env, argv) => {
  const devMode = env !== 'production';

  return {
    mode: devMode ? 'development' : 'production',
    devServer: {
      client: {
        overlay: {
          warnings: true,
          errors: true
        }
      },
      historyApiFallback: {
        rewrites: [
          { from: /\.js$/, to: '/bundle.js' },
        ]
      },
      static: PUB_DIR,
      allowedHosts: 'all'
    },
    devtool: 'inline-source-map',
    entry: [`${SRC_DIR}/index.js`],
    output: {
      path: PUB_DIR,
      publicPath: '/',
      filename: 'bundle.js',
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: SRC_DIR,
          loader: 'babel-loader',
          options: {}
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['autoprefixer'],
                },
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: `${SRC_DIR}/templates/index.html`,
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
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.DefinePlugin({
        'process.additional': {
          'NODE_ENV': JSON.stringify(env),
        },
      }),
      new webpack.ContextReplacementPlugin(
        /highlight\.js\/lib\/languages$/,
        new RegExp(`^./(${['javascript', 'swift'].join('|')})$`),
      ),
    ],
  };
};
