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
        setInterval(updateData, 3 * 60 * 1000);
      }
  })
}

// moves
function goTo(angle){
  curGoal = degToPwm(angle); // convert angle into Pwm value
  console.log('from',pwmToDeg(curPos),' to ', angle, curGoal);
  next(); // lanch mouvement
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
      console.log('\t DONE ! @', pwmToDeg(curPos));
    }
  });
}

function test(){

  console.log('test/boot MODE');

  goTo(90);
  setTimeout(function(){ goTo(0) },  10000);
  setTimeout(function(){ goTo(270) }, 20000);
  setTimeout(function(){ goTo(180) }, 30000);
  setTimeout(function(){ goTo(360) }, 40000);
  setTimeout(function(){ goTo(320) }, 60000);
  setTimeout(function(){ goTo(135) }, 70000);

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
