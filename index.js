'use strict'

const path = require('path')
const template = require('babel-template')
const findRoot = require('find-root')
const DEFINITIONS_PATH = findRoot(path.join(__dirname, '../.babel-define'))

// Load options and warn if missing.
let options
try {
  options = require(DEFINITIONS_PATH)
} catch (err) {
  throw new Error('Babel-Plugin-Define-Function: Could not require definitions from ' + JSON.stringify(DEFINITIONS_PATH) + '.')
}

const plugin = {
  visitor: {
    Identifier: {
      exit: function exit (nodePath, state) {
        const name = nodePath.node.name
        if (!options.hasOwnProperty(name)) return

        const result = typeof options[name] === 'function'
          ? options[name]()
          : options[name]
        const replacement = template(result || '')()

        if (replacement) {
          nodePath.replaceWith(replacement)
        } else {
          nodePath.remove()
        }
      }
    }
  }
}

/**
 * Babel plugin that looks will replace variables with their exported value from a definitions file.
 */
module.exports = function babelPluginAsHtml (babel) {
  return plugin
}
