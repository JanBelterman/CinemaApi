const express = require('express')
const app = express()

require('./startup/config')()
require('./startup/database')
require('./startup/routes')(app)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}..`))

module.exports = app