const http = require("http")
const https = require("https")

function tracker() {
  override(http)
  override(https)
}

function override(module) {
  let original = module.request
  function wrapper(outgoing) {
    let req = original.apply(this, arguments)
    let emit = req.emit
    let body = ""

    req.emit = function (eventName, response) {
      switch (eventName) {
        case "response": {
          response.on("data", (d) => {
            body += d
          })

          response.on("end", () => {
            let res = {
              statusCode: response.statusCode,
              headers: response.headers,
              message: response.statusMessage,
              body,
            }
            console.log(res)
          })
        }
      }
      return emit.apply(this, arguments)
    }

    logger(outgoing)
    return req
  }

  function logger(req,res,next) {
    let log = {
      method: req.method || "GET",
      host: req.host || req.hostname || "localhost",
      port: req.port || "443",
      path: req.pathname || req.path || "/",
      headers: req.headers || {},
    }
    console.log(log)
   
  }

  module.request = wrapper
}

module.exports = tracker