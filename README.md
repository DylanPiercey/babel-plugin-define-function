# babel-plugin-define-function

A plugin for Babel 6 allows you to define dynamic variables at build time with functions.
All of the defined variables must exist in a `.babel-define.js` or `.babel-define.json` file.

## Installation

```bash
$ npm install babel-plugin-define-function --save-dev
$ babel --plugins define-function script.js
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

## License

[MIT](https://tldrlegal.com/license/mit-license)
