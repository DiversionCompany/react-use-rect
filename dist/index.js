
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react-use-rect.cjs.production.min.js')
} else {
  module.exports = require('./react-use-rect.cjs.development.js')
}
