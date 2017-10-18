var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['localhost']});
client.connect(function (err, result) {
  if (err) {
    console.log(err);
  }
});

const getAllPersons = 'SELECT * FROM contacts.emails';
const addPerson = 'INSERT INTO contacts.emails(id, first_name, last_name, email) VALUES (?, ?, ?, ?)';
const removePerson = 'DELETE FROM contacts.emails WHERE id=?';
const updatePerson = 'UPDATE contacts.emails SET first_name=?, last_name=?, email=? WHERE id=?';

/* GET home page. */
router.get('/', function(req, res, next) {
  client.execute(getAllPersons, [], function (err, result) {
    if (err) {
      console.log(err)
      res.status(404).send({msg: err});
    } else {
      res.render('Cassandra',
          {title: 'Cassandra Test',
            entries: result.rows}
      );
    }
  });
});

router.post('/insert', function(req, res, next) {
  var values = [req.body.id, req.body.first_name, req.body.last_name, req.body.email];
  client.execute(addPerson, values, {prepare : true}, function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send({msg: err});
    } else {
      res.status(200).send('success');
    }
  });
});

router.post('/update', function (req, res, next) {
  var values = [req.body.first_name, req.body.last_name, req.body.email, req.body.id];
  client.execute(updatePerson, values, {prepare : true}, function (err, result) {
    if (err) {
      console.log(err);
      res.status(404).send({msg: err});
    } else {
      res.status(200).send('success');
    }
  });

});

router.post('/delete', function (req, res, next) {
  var value = [req.body.id];
  console.log(value[0]);
  client.execute(removePerson, value, {prepare : true}, function (err, results) {
    if (err) {
      console.log(err);
      res.status(404).send({msg: err});
    } else {
      res.status(200).send('success');
    }
  });
});


module.exports = router;
