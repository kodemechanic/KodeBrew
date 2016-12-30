var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var options = {
  	root:  'public/',
  	headers: {
  		'x-timestamp': Date.now(),
  		'x-sent': true
  	}
  };

  res.sendFile('index.html', options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent: index.html');
    }
  });

});


module.exports = router;
 