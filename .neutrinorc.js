module.exports = {
  use: [
    ['@neutrinojs/airbnb-base',
      {
        eslint: {
          "rules": {
            "import/extensions": 0,
            "no-underscore-dangle": "off",
            'no-param-reassign': 'off',
            'class-methods-use-this': 'warn',
            "no-console": "warn",
            'no-plusplus': 'off',
            'no-unused-vars': 'warn',
            'prefer-destructuring': 'off',
            'prefer-template': 'warn',
            'max-len': ['warn',  { "code": 120 } ]
          }
        }
      }
    ],
    [
      '@neutrinojs/library',
      {
        name: 'inspector'
      }
    ],
    '@neutrinojs/jest'
  ]
};
