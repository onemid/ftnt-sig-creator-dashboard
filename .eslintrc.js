module.exports = {
  root: true,
  extends: [
    '@nuxtjs/eslint-config-typescript'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: { // 自訂規則
    'quotes': ['error', 'single'], // 使用單引號
    'no-console': 'warn' // 使用 console 時警告提示
  }
}
