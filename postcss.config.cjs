const resolveFromProjectOrLegacy = (packageName) => {
  return require.resolve(packageName, { paths: [__dirname] });
};

module.exports = {
  plugins: {
    [resolveFromProjectOrLegacy('@tailwindcss/postcss')]: {},
    [resolveFromProjectOrLegacy('autoprefixer')]: {},
  },
};
