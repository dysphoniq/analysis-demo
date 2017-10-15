var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['localhost']});
client.connect(function (err, result) {
  console.log('index: cassandra connected');
});

var getAllSubscribers = 'SELECT * FROM people.subscribers';

/* GET home page. */
router.get('/', function(req, res, next) {
  client.execute(getAllSubscribers, [], function (err, result) {
    if (err) {
      console.log(err)
      res.status(404).send({msg: err});
    } else {
      console.log(result.rows[0].email);
      res.render('index',
          {title: 'Cassandra Test',
            subscribers: result.rows}
      );
    }
  });
  // res.render('index', { title: 'Express' });
});

module.exports = router;
