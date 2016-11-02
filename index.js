'use strict'

const path = require('path')
const template = require('babel-template')
const findBabelConfig = require('find-babel-config')

/**
 * Babel plugin that looks for TemplateLiterals that are using the name `html` and minifies the contents.
 */
module.exports = function babelPluginAsHtml (babel) {
  return {
    pre: function pre (file, state) {
      const startPath = (file.opts.filename === 'unknown') ? './' : file.opts.filename
      const { file: babelFile = process.cwd() + '/' } = findBabelConfig.sync(startPath)
      const defineFile = path.join(path.dirname(babelFile), '.babel-define')

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
