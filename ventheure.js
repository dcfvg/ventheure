var piblaster = require('pi-blaster.js');
var _ = require('lodash');
var request = require("request");
var fs = require('fs');
var config = require('./config.json');
var argv = require('yargs').argv;

// settings
var pwmMin = config.servo.pwmMin,
    pwmMax = config.servo.pwmMax,
    pwmStep = config.servo.step,
    speed = config.servo.speed,
    curPos = pwmMin,
    curGoal = curPos,
    lastWindDegrees = 0;

// conversion
var scaleBetween =  function(minAllowed, maxAllowed, min, max, unscaledNum){
    return (maxAllowed-minAllowed)*(unscaledNum-min)/(max - min) + minAllowed;
}
var degToPwm = scaleBetween.bind(null,pwmMin, pwmMax ,0,360);
var pwmToDeg = scaleBetween.bind(null,0,360,pwmMin, pwmMax);

// get data
function updateData(){

  console.log('looking for data …');

  request({
      url: config.api.route,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {

        var newWindDegrees = parseInt(body.current_observation.wind_degrees);
        console.log('wind direction from API : ', newWindDegrees, 'last value :', lastWindDegrees);

        // check if wind direction has changed
        if(newWindDegrees !== lastWindDegrees){
          fs.writeFile(config.log.lastValue, newWindDegrees, 'utf8', function (err) {
            goTo(newWindDegrees);
          });
        }
      }else{
        console.error('ERROR LOADING DATA : next try in 3 min');
        setTimeout(updateData, 3 * 60 * 1000);
      }
  })
}

// moves
function goTo(angle){

  // angle to PVm
  curGoal = degToPwm(angle);
  console.log('from',pwmToDeg(curPos),' to ', angle, curGoal);

  // start move
  next();
}

function next(){
  piblaster.setPwm(config.servo.pwmId, curPos, function(err){

    var dist = Math.abs(curGoal - curPos);

    if(dist > pwmStep/2){

      // check direction
      if(curGoal > curPos) curPos += pwmStep;
      else if(curGoal < curPos) curPos -= pwmStep;

      // start next step of the move
      setTimeout(next, speed);

    } else {

      // release after move
      piblaster.setPwm(config.servo.pwmId, 0, function(){
        console.log('\t DONE ! @', pwmToDeg(curPos));
      })

    }
  });
}

function test(){

  console.log('test/boot MODE');
  var timer = 5000;

  setTimeout(function(){ goTo(0)   }, 1*timer);
  setTimeout(function(){ goTo(270) }, 2*timer);
  setTimeout(function(){ goTo(180) }, 3*timer);
  setTimeout(function(){ goTo(90) },  4*timer);
  setTimeout(function(){ goTo(0) },   5*timer);
  setTimeout(function(){ goTo(360) }, 6*timer);

}

function init(){

  // check last saved value
  if(fs.existsSync(config.log.lastValue)){
    lastWindDegrees = parseInt(fs.readFileSync(config.log.lastValue, 'utf8'));
    console.log('last recorded wind value : ', lastWindDegrees);
  }

  // connect to API and get weather forecast
  updateData()

}


// begin here
typeof argv.test !== 'undefined' ?  test() : init()
