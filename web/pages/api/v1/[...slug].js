import proxy from 'next-http-proxy-middleware';

export default async function handler(req, res) {
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'application/json');
  // console.log(req.query);
  // res.end(JSON.stringify({name: 'John Doe', query: req.query}));
  try {
    await proxy(req, res, {
      target: process.env.API_SERVER,
    });
  } catch (e) {
    console.log(e);
  }
  // console.log(newUrl);
}
