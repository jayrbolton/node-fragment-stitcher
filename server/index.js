const http = require('http')
const port = 3737
const readline = require('readline')
const stitchStream = require('../lib/stitch-stream')

const requestHandler = (request, response) => {
  if (request.method === 'POST') {
    const inputStream = readline.createInterface({ input: request, terminal: false })
    stitchStream(inputStream, function (err, result) {
      if (err) {
        response.statusCode = 422
        response.write(err.toString() + '\n')
        response.end((result || '').toString())
      } else {
        response.end(result.toString())
      }
    })
  } else {
    response.write('Make a POST request with text fragment data.\n')
    response.end('Example: curl --data-binary "@path/file.txt" localhost:3737')
  }
}

const server = http.createServer(requestHandler)

server.listen(port, function (err) {
  if (err) {
    return console.log('Error starting server:', err)
  }
  console.log('Server listening on localhost:' + port)
  console.log('Make a POST request with text fragment data.')
})
