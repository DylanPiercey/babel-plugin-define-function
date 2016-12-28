# babel-plugin-define-function

A plugin for Babel 6 allows you to define dynamic variables at build time with functions.

## Installation

```bash
$ npm install babel-plugin-define-function --save-dev
```

**.babelrc**

```json
{
  "plugins": [
    ["define-function", "./path/to/config/file.js"]
  ]
}
```

## Example

Given the following definitions:
```javascript
var exec = require('child_process').execSync
var details = require('./package.json')
var buildNumber = 0

module.exports = {
	// Define a static version variable.
	__VERSION__: details.version,
	// Evaluate git commit at build time.
	__GIT_COMMIT__: function () {
		// This function will be called on each build.
			return exec('git rev-parse HEAD') + '-' + buildNumber++
	}
}
```

And the following file:

```javascript
console.log('package version is ' + __VERSION__)
console.log('git build is ' + __GIT_COMMIT__)
```

becomes:

```javascript
console.log('package version is ' + '1.0.0')
console.log('git build is ' + '0c25b7ea0ed7554b7da285907154b66a694c3060-0')
```

and on the second build (if watching):

```javascript
console.log('package version is ' + '1.0.0')
console.log('git build is ' + '0c25b7ea0ed7554b7da285907154b66a694c3060-1')
```

## Contributions

* Use `npm test` to run tests.

## License

[MIT](https://tldrlegal.com/license/mit-license)
