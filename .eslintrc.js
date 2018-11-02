module.exports = {
  root: true,
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack/webpack.common.js',
      },
    },
  },
  rules: {
    // custom rules here
    'react/no-array-index-key': 'off',
    'no-underscore-dangle': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'no-console': 'off',
    'max-len': 'off',
    'camelcase': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/prop-types': ['warn', { ignore: ['className', 'form'] }],
  },
};
