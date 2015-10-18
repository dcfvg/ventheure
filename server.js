var request = require("request");
var fs = require('fs');
var config = require('./config.json');

request({
    url: config.url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {

      var cur = body.current_observation;

      var data =
        cur.observation_time + config.separator +
        cur.wind_degrees + config.separator +
        new Date() + '\n'
        ;

      console.log(data)

      fs.appendFile(config.filename, data, function (err) {
        console.log(err)
      });
    }
})
