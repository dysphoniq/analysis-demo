var express = require('express');
var router = express.Router();

const NodeCouchDb = require('node-couchdb');

const couch = new NodeCouchDb({
  auth: {
      user: 'admin',
      password: '123456'
  }
});

const dbName = 'mydatabase';
const viewUrl = '_design/all_customers/_view/all';


couch.listDatabases().then(function (dbs) {
  console.log(dbs);
});

router.get('/', function (req, res) {
  couch.get(dbName, viewUrl)
      .then(
      function (data, headers, status) {
          console.log(data.data.rows);
          res.render('couch', {
              customers: data.data.rows
          });
      },
      function (err) {
          res.send(err);
      });
});

router.post('/customer/add', function(req, res) {
  const name = req.body.name;
  const email = req.body.email;

  couch.uniqid().then(function(ids) {
      const id = ids[0];
      couch.insert(dbName, {
          _id: id,
          name: name,
          email: email
      }).then(function(data, headers, status) {
          res.redirect('/couch');
      }, 
      function (err) {
          res.send(err);
      })
  });
});

router.post('/customer/delete/:id', function (req, res) {
  const id = req.params.id;
  const rev = req.body.rev;

  couch.del(dbName, id, rev).then(
      function(data, headers, status) {
          res.redirect('/couch');
      },
      function(err) {
          res.send(err);
      }
  );
});

router.post('/customer/update/:id', function (req, res) {
  const name = req.body.name;
  const email = req.body.email;

  couch.update(dbName, {
      _id: req.params.id,
      _rev: req.body.rev,
      name: name,
      email: email
  }).then(({ data, headers, status }) => {
      res.redirect('/couch');
  }, err => {
      res.send(err);
  });
});

module.exports = router;
