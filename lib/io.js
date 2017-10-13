const fse = require('fs-extra')
const serial = require('./serial')

const readFiles = (filenames) => {
  return serial(filenames, filename => {
    return fse.readFile(filename, 'utf8')
  })
}

module.exports = {readFiles}
