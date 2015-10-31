var piblaster = require('pi-blaster.js');
var _ = require('lodash');
var request = require("request");
var fs = require('fs');
var config = require('./config.json');

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
  console.log('go to',pwmToDeg(curPos),' to ', angle, curGoal);
  next(); // lanch mouvement
}

function next(){
  piblaster.setPwm(4, curPos, function(err){
    if(err) console.log(pwm);

    var dist = Math.abs(curGoal - curPos)
    // console.log('\t',curPos,'->',curGoal,':',dist);

    // check if move has ended
    if(dist > pwmStep){

      // check direction
      if(curGoal > curPos) curPos += pwmStep;
      else if(curGoal < curPos) curPos -= pwmStep;

      // start next step of the move
      setTimeout(next, speed);
    } else {
      console.log('DONE !', curPos,'->',curGoal,':',dist);
    }
  });
}

function test(){
  setInterval(function(){
    goTo(_.random(10,300)},
    3000
  );
}

function init(){

  // check last saved value
  if(fs.existsSync(config.log.lastValue)){
    lastWindDegrees = parseInt(fs.readFileSync(config.log.lastValue, 'utf8'));
    console.log('last recorded wind value : ', lastWindDegrees);
  }

  // connect to API and get weather forecast
  updateData();
}


init();
