var express = require('express');
var mongoose = require('mongoose');
var moment = require('moment');
var _ = require('underscore');
var app = express();
mongoose.connect('mongodb://localhost/imooc');
var Movie = require('./models/movies.js');
console.log(typeof Movie);
var handlebars = require('express3-handlebars').create({
	defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());
app.get('/', function(req, res) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		res.render('index', {
			movies: movies
		});
	});

});
app.get('/movie/:id', function(req, res) {
	var id = req.params.id;
	console.log(id);
	Movie.findById(id,function(err, movie) {
		res.render('detail', {
			title: 'imooc 详情页',
			movie: movie
		});
	});
});
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
		title: 'imooc 后台录入页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	});
});
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id;
	if (id) {
		Movie.findById(id, function(err, movie) {
			res.render('admin', {
				title: 'imooc 后台更新页',
				movie: movie
			})
		});
	}
});
app.post('/admin/movie/new', function(req, res) {
	console.log(req.body.movie.title);
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	console.log(movieObj.country);
	var _movie;
	if (id) {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err);
			}
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err)
				}
				res.redirect('/movie/' + movie._id);
			});
		});
	} else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});
		console.log(_movie);
		_movie.save(function(err, movie) {
			if (err) {
				console.log(err)
			}
			res.redirect(303,'/movie/' + movie._id);
		})
	}
});

app.get('/admin/list', function(req, res) {

	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		movies.map(function(a){
			a.meta.createAt=moment().format()
		});
		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		});
	});
});
app.delete('/admin/list',function(req,res){
	var id=req.query.id;
	console.log(req.query);
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
});
app.use(function(req, res, next) {
	res.status(404);
	res.render('404')
});
app.use(function(err, req, res, next) {
	res.status(500);
	res.render('404');
});
app.listen(app.get('port'));
console.log('start');