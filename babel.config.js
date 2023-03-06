module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/transform-runtime'],
  env: {
    production: {
      plugins: ['babel-plugin-dev-expression'],
    },
  },
};
