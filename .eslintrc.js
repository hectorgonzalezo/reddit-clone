module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
		"eslint:recommended",
    'plugin:react/recommended',
    "airbnb",
    "airbnb-typescript",
    'standard-with-typescript',
		"plugin:@typescript-eslint/recommended",
		'prettier'
  ],
  overrides: [
  ],
	parser: "@typescript-eslint/parser",
  parserOptions: {
		ecmaFeatures: {
            jsx: true
        },
    ecmaVersion: 'latest',
		project: 'tsconfig.json',
    sourceType: 'module',
		tsconfigRootDir: __dirname,
  },
  plugins: [
		'strict-null-checks',
    'react',
		'react-hooks',
		"@typescript-eslint",
		'prettier'
  ],
    rules: {
    "@typescript-eslint/strict-boolean-expressions": "warn",
    "semi": [2, "always"],
			"no-underscore-dangle": 0,
			"react/jsx-no-bind": 0,
			"react/require-default-props": 1,
  },
		settings: {
    "import/resolver": {
      typescript: {}
    }
  }
}
