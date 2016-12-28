'use strict'

const template = require('babel-template')
const plugin = {
  name: 'define-template',
  visitor: {
    Identifier: {
      exit: function exit (nodePath, state) {
        const name = nodePath.node.name

        if (typeof this.opts === 'string') this.opts = require(this.opts)
        if (!this.opts.hasOwnProperty(name)) return

        const result = typeof this.opts[name] === 'function'
          ? this.opts[name]()
          : this.opts[name]
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
 * Babel plugin that looks will replace variables with their exported value from the provided options.
 */
module.exports = function babelPluginDefineTemplate () {
  return plugin
}
