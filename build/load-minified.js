'use strict'

const fs       = require('fs')
const uglifyJS = require('uglify-es')

module.exports = function(filePath) {
    const code   = fs.readFileSync(filePath, 'utf-8')
    const result = uglifyJS.minify(code)

    if (result.error) {
        return ''
    }

    return result.code
}