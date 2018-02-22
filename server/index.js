const http = require('http')
const port = 3737
const stitchStream = require('../lib/stitch-stream')

const welcomeText = `
  Make a POST request with text fragment data.
  Example: curl --data-binary "@path/file.txt" localhost:3737
`

const requestHandler = (request, response) => {
  if (request.method === 'POST') {
    stitchStream(request, function (err, result) {
      if (err) {
        response.statusCode = 422
        response.write(err.toString() + '\n')
        response.end((result || '').toString())
      } else {
        response.end(result.toString())
      }
    })
  } else {
    response.end(welcomeText)
  }
}

const server = http.createServer(requestHandler)

server.listen(port, function (err) {
  if (err) {
    return console.log('Error starting server:', err)
  }
  console.log('Server listening on localhost:' + port)
  console.log(welcomeText)
})
