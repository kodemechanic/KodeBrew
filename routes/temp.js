var express = require('express');
var router = express.Router();
var ds18b20 = require('ds18b20');


// Initialize all sensors at startup
var tempList = [];

// get sensors list from rpi
ds18b20.sensors(function(err, ids){
  console.log("retrieved sensors:  " + ids);
  if (err) {
    console.log("error encountered retrieving sensor data");
  } else {
    tempList = ids;
    console.log("created list of sensors on startup:  " + tempList);  
  }
})

// get sensor list from DB and match to ports/serial...
  // database should have {id, sensorcode, name, number, state}

// Flag anything that isn't marked.
  // if no sensors, create new.  if new, enter and flag new, if old, just return as 'removed', but leave in DB.
// Check internal logging file for rotation or deletion due to space limitations.


router.get('/', function(req, res, next) {
  // return a list of sensors and temps for each sensor

  var sensors = [];
        
  tempList.forEach(function(sensor){
    //try to get temp from ds18b20 lib.
    var sensorTemp = ds18b20.temperatureSync(sensor);
    
// TODO:   before pushing data add stored tags/ports/whatever from the the config DB.


    // will show temp as 'false' if sensor not connected.
    sensors.push({"sensor":sensor,"temp":sensorTemp});
    
  })

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(sensors));
});

router.get('/:sensor', function(req, res, next) {
  // Retrieve temp for individual sensor
  var temp = ds18b20.temperatureSync(req.params.sensor);
  var result = {"sensor":req.params.sensor,"temp":temp};
  
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(result));
});

router.post('/log/:state', function(req, res, next){
  // Start or stop logging with 1 or 0

  if (req.params.state == 1) {
    // Start logging by calling some logging function????
  } else {
    // Stop logging by calling a logging function???
  }

})

module.exports = router;