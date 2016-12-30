var express = require('express');
var router = express.Router();
var rpio = require('rpio');

rpio.open(16, rpio.OUTPUT, rpio.LOW);
rpio.open(18, rpio.OUTPUT, rpio.LOW);


/* get api instructions */
router.get('/', function(req, res, next) {
  // return pin status for the pumps
  var pin1 = rpio.read(16);
  var pin2 = rpio.read(18);

// UPDATE TO RETURN JSON WITH PIN INFORMATION AND STATUSes.
  res.send('Pump 1: ' + pin1 + '    Pump 2: ' + pin2);

});

router.get('/:pump', function(req, res, next) {
    var pin = (req.params.pump == 1) ? 16 : 18;
    var state = rpio.read(pin);

    // UPDATED TO SEND JSON DATA
    res.send('PUMP ' + req.params.pump + ' is ' + state);
});

router.post('/:pump/:power', function(req, res, next) {
	
    // TODO... validate PIN is either 1 or 2 before setting.
    var pin = (req.params.pump == 1) ? 16 : 18;
    var pState = req.params.power;  //power is 0 or 1

    // if one, turn on pump
    if (pState == 1){
        rpio.write(pin, rpio.HIGH);        
    } else {
        rpio.write(pin, rpio.LOW);        
    }

    // TODO make JSON response 
    res.send('Pump ' + req.params.pump + ' set to ' + req.params.power);
});


module.exports = router;
