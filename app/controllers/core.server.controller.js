'use strict';

var fs = require('fs');

var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
	if (err) done(err);
	var pending = list.length;
	if (!pending)  done(null, results);
	list.forEach(function(file) {
	    file = dir + '/' + file;
	    fs.stat(file, function(err, stat) {
		if (stat && stat.isDirectory()) {
		    walk(file, function(err, res) {
			results = results.concat(res);
			if (!--pending) done(null, results);
		    });
		} else {
		    results.push(file);
		    if (!--pending) done(null, results);
		}
	    });
	});
    });
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var unpicked = function(dir, done) {
    var noPicked = true;
    fs.readdir(dir, function(err, list) {
	if (err) done(err);
	list.forEach(function(file) {
	    file = dir + '/' + file;
	    fs.stat(file, function(err, stat) {
		if (stat && stat.isDirectory()) {
		    console.log(file+' ends with picked '+file.endsWith('_picked'));
		    if (file.endsWith('_picked')){
			done(false);
		    }	
		}
	    });
	});
    });
    return done(true);
};

exports.unpicked = function(req,res){
    var fs = require('fs');
    var imgDir = process.cwd()+'/public/modules/core/years/2006/';
//    var imgDir = process.cwd()+'/public/modules/core/years/2014/water/';
    console.log('Image dir is '+imgDir);
    var unpick = unpicked(imgDir,function(unpick){
	console.log('is unpicked '+unpick);
	if (unpick){
	    res.end(imgDir+' has no picked');
	} else { 
	    res.end(imgDir+' has already got a picked directory');
	}	
    });
//    walk(imgDir, function(nowt,list){
//	console.log(list);
//	res.jsonp(list);
//    });

};

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
    res.render('index', {
	user: req.user || null
    });
};
