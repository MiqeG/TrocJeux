module.exports= function (res,httpcode, message) {
    let json = { message: message }
    res.writeHead(httpcode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(json));
  }