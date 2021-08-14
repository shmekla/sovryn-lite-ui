const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    plugins: process.env.ANALYZER === 'test' ? [new BundleAnalyzerPlugin()] : []
  }
};
