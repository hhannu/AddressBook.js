var express = require('express');
var router = express.Router();

var db = require('../db').getUser;


/* GET home page. */
router.get('/', function(req, res) {
    if(req.session.login === true)
        db(req,res);
        //res.redirect('/names');
    else
        res.render('index', {});
});

/* GET register page. */
router.get('/register', function(req, res) {
    if(req.session.login === true)
        res.redirect('/');
    else
        res.render('register', {});
});

/* GET add address page. */
router.get('/add_new', function(req, res) {
    if(req.session.login === true)
        res.render('address', {});
    else
        res.redirect('/');
});

/* GET logout. */
router.get('/logout', function(req, res) {
    if(req.session.login === true){
        delete req.session.login;
        delete req.session.name;
    }
    res.redirect('/');
});

module.exports = router;
