'use strict'

const path = require('path')
const template = require('babel-template')
const findRoot = require('find-root')
const CWD = process.cwd()

/**
 * Babel plugin that looks for TemplateLiterals that are using the name `html` and minifies the contents.
 */
module.exports = function babelPluginAsHtml (babel) {
  return {
    pre: function pre (file, state) {
      const rootPath = findRoot(file.opts.filename === 'unknown'
        ? CWD
        : file.opts.filename
      )
      const defineFile = path.join(rootPath, '.babel-define')

      try {
        this.options = require(defineFile)
      } catch (err) {
        throw new Error('Babel-Plugin-Define-Function: Could not require definitions from ' + JSON.stringify(defineFile) + '.')
      }
    },
    visitor: {
      Identifier: {
        exit: function exit (nodePath, state) {
          const name = nodePath.node.name
          if (!this.options.hasOwnProperty(name)) return

          const result = typeof this.options[name] === 'function'
            ? this.options[name]()
            : this.options[name]
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
}
