var express = require('express');
var router = express.Router();
var rpio = require('rpio');

var pinList = {
    1:22,
    2:29,
    3:31,
    4:36,
    5:37
};



rpio.open(22, rpio.OUTPUT, rpio.LOW);
rpio.open(29, rpio.OUTPUT, rpio.LOW);
rpio.open(31, rpio.OUTPUT, rpio.LOW);
rpio.open(36, rpio.OUTPUT, rpio.LOW);
rpio.open(37, rpio.OUTPUT, rpio.LOW);

/* get api instructions */
router.get('/', function(req, res, next) {
  // return pin status for the pumps
  var pin1 = rpio.read(22);
  var pin2 = rpio.read(29);
  var pin3 = rpio.read(31);
  var pin4 = rpio.read(36);
  var pin5 = rpio.read(37);   /// NOT WORKING??????

// UPDATE TO RETURN JSON WITH PIN INFORMATION AND STATUSes.
  res.send('Indicator 1: ' + pin1 + '    indicator 2: ' + pin2);

});

router.get('/:indicator', function(req, res, next) {
    var iPin = pinList[req.params.indicator];        
    var state = rpio.read(iPin);

    // UPDATED TO SEND JSON DATA
    res.send('indicator ' + iPin + ' is ' + state);
});

router.post('/:indicator/:state', function(req, res, next) {
    
    // TODO... validate PIN is either 1 or 2 before setting.
    var iPin = pinList[req.params.indicator];
    var pState = req.params.state;  //power is 0 or 1

    // if one, turn on pump
    if (pState == 1){
        rpio.write(iPin, rpio.HIGH);        
    } else {
        rpio.write(iPin, rpio.LOW);        
    }

    // TODO make JSON response 
    res.send('indicator ' + iPin + ' set to ' + req.params.state);
});


module.exports = router;