'use strict';

var fs = require('fs');

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var unpicked = function(dir, done) {
    var noPicked = true;
    var check = function(file,done){
	    if (fs.statSync(file).isDirectory()) {
		    //console.log(file+' ends with picked '+file.endsWith('_picked'));
		    if (file.endsWith('_picked')){
			done(false);
		    }	
		
	    }
    };
    var list = fs.readdirSync(dir);
    for(var x=0;x < list.length;x++){
        var file = dir + '/' + list[x];
	check(file,done);
    }
    return done(true);
};

var getPictures = function(dir,pics){
    var list = fs.readdirSync(dir); 
    for(var x=0;x < list.length;x++){
        var file = dir + '/' + list[x];
	if (fs.statSync(file).isDirectory()) {
	    getPictures(file,pics);
	} else if (file.endsWith('JPG') || file.endsWith('jpg') || file.endsWith('WAV') || file.endsWith('wav') || file.endsWith('AVI') || file.endsWith('avi')){	   
	    pics.push({file:file,link:file.substring(30,file.length)});
	}    
    }
};

var unpicks = function(dir,todo) {
    var check = function(file,filename,todo){
	if (fs.statSync(file).isDirectory()) {
	    unpicked(file,function(d){
		if (d){
		    var pics = [];
		    getPictures(file,pics);
		    //console.log('pics are '+pics);
		    todo.push({file:file,name:filename,pictures:pics});
		} else {    
		    console.log(file+' has been done');
		}    
	    });	
	}
    };  
    var list = fs.readdirSync(dir); 
    for(var x=0;x < list.length;x++){
        var file = dir + '/' + list[x];
	check(file,list[x],todo);
    }
};

exports.unpicked = function(req,res){
    var fs = require('fs');
    var imgDir = process.cwd()+'/public/modules/core/years/'+req.params.year+'/';
//    var imgDir = process.cwd()+'/public/modules/core/years/2014/water/';
    console.log('Image dir is '+imgDir);
    var todo = [];
    unpicks(imgDir,todo);
    var data = {links:todo,year:req.params.year};
    console.log('data is...');
    console.log(data);
    res.jsonp(data);

//    walk(imgDir, function(nowt,list){
//	console.log(lixxxxst);
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
