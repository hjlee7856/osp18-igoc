'use strict'

const chalk         = require('chalk')
const semver        = require('semver')
const packageConfig = require('../package.json')
const shell         = require('shelljs')

const versionRequirements = [
    {
        name: 'node',
        currentVersion: semver.clean(process.version),
        versionRequirement: packageConfig.engines.node
    }
]

if (shell.which('npm')) {
    versionRequirements.push({
        name: 'npm',
        currentVersion: exec('npm --version'),
        versionRequirement: packageConfig.engines.npm
    })
}

function exec(command) {
    return require('child_process').execSync(command).toString().trim()
}

module.exports = function () {
    const warnings = []

    for (let index = 0; index < versionRequirements.length; index++) {
        const mod = versionRequirements[index]

        if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
            warnings.push(mod.name + ': ' + chalk.red(mod.currentVersion) + ' should be ' + chalk.green(mod.versionRequirement))
        }
    }

    if (warnings.length > 0) {
        console.log('')
        console.log(chalk.yellow('To use this template, you must update following to modules:'))
        console.log()

        for (let index = 0; index < warnings.length; index++) {
            console.log('    ' + warnings[index])
        }

        console.log()
        process.exit(1)
    }
}