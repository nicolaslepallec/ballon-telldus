var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport, ballonManager){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/ballon',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});

	/*get Ballon page*/
	router.get('/ballon', isAuthenticated, function(req, res) {
	    ballonManager.setState("", function(ballon) {
	        res.render('ballon', {
	            user: req.user,
	            ballon: ballon
	        });

	    });
	});

	/*set Ballon ON ECO page*/
	router.get('/on-eco', isAuthenticated, function(req, res){
		 ballonManager.setState(ballonManager.ON_ECO, function(ballon) {
	        res.render('ballon', {
	            user: req.user,
	            ballon: ballon
	        });

	    });

		//res.render('ballon', { user: req.user, ballon: ballonManager.setState(ballonManager.ON_ECO)});
	});

	/*set Ballon ON ECO page*/
	router.get('/force-on', isAuthenticated, function(req, res){
		 ballonManager.setState(ballonManager.FORCE_ON, function(ballon) {
	        res.render('ballon', {
	            user: req.user,
	            ballon: ballon
	        });

	    });
		//res.render('ballon', { user: req.user, ballon: ballonManager.setState(ballonManager.FORCE_ON)});
	});

	/*set Ballon OFF page*/
	router.get('/off', isAuthenticated, function(req, res){
		 ballonManager.setState(ballonManager.OFF, function(ballon) {
	        res.render('ballon', {
	            user: req.user,
	            ballon: ballon
	        });

	    });
		//res.render('ballon', { user: req.user, ballon: ballonManager.setState(ballonManager.OFF)});
	});

	/*device state API*/
	router.get('/devicestate', isAuthenticated, function(req, res){
		ballonManager.getBallonRealState( function(state){
			res.send('{ "state": '+state+'}');
		});
		
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// route for facebook authentication and login
	// different scopes while logging in
	router.get('/login/facebook', 
		passport.authenticate('facebook', { scope : 'email' }
	));

	// handle the callback after facebook has authenticated the user
	router.get('/login/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/ballon',
			failureRedirect : '/'
		})
	);

	// route for twitter authentication and login
	// different scopes while logging in
	router.get('/login/twitter', 
		passport.authenticate('twitter'));

	// handle the callback after facebook has authenticated the user
	router.get('/login/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/twitter',
			failureRedirect : '/'
		})
	);

	/* GET Twitter View Page */
	router.get('/twitter', isAuthenticated, function(req, res){
		res.render('twitter', { user: req.user });
	});

	return router;
}





