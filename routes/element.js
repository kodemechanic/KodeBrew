var express = require('express');
var router = express.Router();
var rpio = require('rpio');

rpio.open(11, rpio.OUTPUT, rpio.LOW);
rpio.open(13, rpio.OUTPUT, rpio.LOW);
//rpio.open(15, rpio.OUTPUT, rpio.LOW);

// Array to save pin number for each element...  0=no pin, 1 = pin 11, 2 = pin 13, etc.
var arrPin = [0,11,13];
    
// Used to save the interval of element power.  % of 2 second pulse.
var intervalObject = {};

router.get('/', function(req, res, next) {
  // return pin status for the elements
  var pinStatus = [];

  arrPin.forEach( function(pin){
    var thispin = pin;
    if (pin == 0) {
        // no push
    } else {
        var state = rpio.read(pin);
        pinStatus.push({"pin":pin,"state":state});
    }
  }); 

  console.log('returned pin status' + JSON.stringify(pinStatus));

  // Return status as JSON string.
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(pinStatus));

});

router.get('/:element', function(req, res, next) {
    var pin = arrPin[req.params.element];
    var state = rpio.read(pin);

    var pinStatus = [{"pin":pin,"state":state}];

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(pinStatus));
});


// 
router.post('/:element/:power', function(req, res, next) {
	
    // TODO... validate PIN is in arr Pin.
    var pin = arrPin[req.params.element];
    var percent = req.params.power;


    // IF PIN NOT IN PIN ARR, send error response.

    


    // set time on and off based on 2 second cycle and percent on time.
    var pinOn = 2*percent*10;
    
    console.log('Pin ' + pin + ' set to ' + percent);

    // TURN OFF INTERVAL OBJECT
    clearInterval(intervalObject);
    intervalObject = {};

    // TURN OFF ALL ELEMENTS
    arrPin.forEach( function(pin){
        if (pin == 0) {
          // no use
        } else {
            // turn off pin
            rpio.write(pin, rpio.LOW);
        }
    });

    // turn off if power 0
    if (percent <= 0) {
        // turn off
        rpio.write(pin, rpio.LOW);
    } else if (percent >= 100) {
        // turn on full power

        // HAVE TO MAKE THIS TURN OFF WHEN ANOTHER ONE TURNS ON.
        console.log('setting pin to high');
        rpio.write(pin, rpio.HIGH);
    } else {
        // turn on with pulsing power as percent of 2 second interval.
        intervalObject = setInterval(function(iPin, iPinOn){
            // turn on Pin
            rpio.write(iPin, rpio.HIGH);
            // timeout then turn off.
            setTimeout(function(tPin){
                rpio.write(tPin, rpio.LOW);
            },iPinOn,iPin);
        },2000,pin,pinOn);

    }

    // return status or error


    res.send('elements working.  Turn on and off with REST POST commands.  Interval clear allows only one element at a time to fire.');

});


module.exports = router;
