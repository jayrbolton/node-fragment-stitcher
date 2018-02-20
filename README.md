# text-fragment-stitch

> Given a set of randomly ordered, url-encoded text fragments with prefix/suffix overlap, stitch them back together in the right order without overlap

This includes a command line app and a web server to stitch text fragments together.

## Usage

First make sure you have the latest versions of `node` and `npm` installed. Then run:

```js
npm install
```

To run the command-line app, you can either use stdin or pass in a file path

```js
node index.js test/samples/IpsumLorem-short-frags.txt
cat test/samples/IpsumLorem-short-frags.txt | node index.js
```

To run the small web server, simply run 

```js
npm start
```

You will have a server running on port 3737, where you can make a POST request with a set of text fragments.

Simply post any text as binary data to the server and you will get the resulting repaired text in the response. For example:

```js
curl --data-binary "@test/samples/IpsumLorem-short-frags.txt" localhost:3737 
```

If the app is unable to stitch the text together correctly, you will get a 422 response with error information about the fragments.

## Approach

### Ambiguity

## See Also

## License

MIT

