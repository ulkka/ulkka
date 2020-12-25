import proxy from 'http-proxy';

const proxyServer = proxy.createProxyServer({target: process.env.API_SERVER});

export default function handler(req, res) {
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'application/json');
  // console.log(req.query);
  // res.end(JSON.stringify({name: 'John Doe', query: req.query}));

  const newUrl = process.env.API_SERVER + req.query.slug.join('/');
  return proxyServer.web(req, res, {target: process.env.API_SERVER});
  // console.log(newUrl);
}
