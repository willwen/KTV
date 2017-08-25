var express = require('express')

var app = express();

app.use(express.static('webpage'))
app.use(express.static('content'))

app.listen(process.env.PORT || 8081, function() {
    console.log('Listening on port 8081!')
})