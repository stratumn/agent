module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module"
  },
  extends: ["eslint:recommended", "prettier", "prettier/standard"],
  env: {
    browser: true
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: true
      }
    ]
  },
  globals: {
    mapexplorerCore: false
  }
};
