const express = require('express')
const config = require('./config')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = config.PORT || 3000

// Enable cors origin
app.use(cors({
    origin: config.WEBAPP_URL,
    optionsSuccessStatus: 200
}))

// Create application/json parser
app.use(bodyParser.json({limit: '200mb'}))

// Endpoints
app.use('/analysis', require("./routes/analysis"))
app.use('/compile', require("./routes/compile"))
app.use('/flatten', require("./routes/flatten"))

app.listen(port, () => console.log(`Server running at http://localhost:${port}`))