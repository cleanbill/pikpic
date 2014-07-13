'use strict';

var fs = require('fs');
var gm = require('gm').subClass({ imageMagick: true });
var q = require('q');
var ncp = require('ncp').ncp;
var spawn = require('child_process').spawn;

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var unpicked = function(dir, done) {
    var noPicked = true;
    var picked = function(file){
	    if (fs.statSync(file).isDirectory()) {
		    //console.log(file+' ends with picked '+file.endsWith('_picked'));
		    if (file.endsWith('_picked')){
			return true;
		    }	
		
	    }
	return false;
    };
    var list = fs.readdirSync(dir);
    for(var x=0;x < list.length;x++){
        var file = dir + '/' + list[x];
	if (picked(file)){
	    return false;
	}    
    }
    return true;
};

var getPictures = function(dir,pics){
    var list = fs.readdirSync(dir); 
    for(var x=0;x < list.length;x++){
        var file = dir + '/' + list[x];
	if (fs.statSync(file).isDirectory()) {
	    getPictures(file,pics);
	} else if (file.endsWith('JPG') || file.endsWith('jpg') 
	       //|| file.endsWith('WAV') || file.endsWith('wav') 
               //|| file.endsWith('AVI') || file.endsWith('avi')
               ){	   
	    pics.push({file:file,link:file.substring(30,file.length),name:list[x]});
	}    
    }
};



var unpicks = function(dir,todo) {
    var check = function(file,filename,todo){
	if (fs.statSync(file).isDirectory()) {
	    if (unpicked(file)){
		var pics = [];
		getPictures(file,pics);
		//console.log('pics are '+pics);
		todo[filename] = {file:file,pictures:pics,name:filename};
	    } else {    
		console.log(file+' has been done');
	    }
    
	} else {
            console.log(file+' is a file');
        }		
    };  
    var list = fs.readdirSync(dir); 
    for(var x=0;x < list.length;x++){
        var file = dir + '/' + list[x];
	check(file,list[x],todo);
    }
};

// Rotate all images
var doRotation = function(file,angle){
    var deferred = q.defer();
    try {
	gm(file).rotate('black', angle)
	    .write('/tmp/boom.jpg', function (err) {
		if (err) {
		    console.log('write rotate error "'+err+'"');
		    deferred.reject(err);
		    exit(-1);
		} else {
		    fs.renameSync('/tmp/boom.jpg',file);
		    console.log('Rotated '+file+' '+angle+' degrees');
		    deferred.resolve('done');
		}	
	    });
    } catch(err){
	console.log('rotate error "'+err+'"');
	deferred.reject(err);
	exit(-1);
    }
    return deferred.promise;
};
 
var rotate = function(keys,at){
    if (at > keys.length){
	return;
    }
    var key = keys[at];
    console.log('About to rotate ');
    console.log(at+'. key is '+key);
    console.log(' which is... ');
    console.log(req.body.rotate[key]);
    if (req.body.rotate[key] !== undefined) {
	console.log(req.body.rotate[key].file);
	console.log(req.body.rotate[key].angle);
	doRotation(req.body.rotate[key].file,req.body.rotate[key].angle).then(function(d){	    
	    return rotate(keys,at+1);
	},function(err){exit(-1);});
    }    
};

var debugData = function(req){
    //console.log(req); 
    console.log('req.body.name');
    console.log(req.body.name);
    console.log('req.body.root');
    console.log(req.body.root);
    console.log('req.body.pick');
    console.log(req.body.pick);
    console.log('req.body.print');
    console.log(req.body.print);
    console.log('req.body.rotateAngle');
    console.log(req.body.rotate);
};

exports.done = function(req,res){
    
    debugData(req);
    
    var keys = [];
    for(var k in req.body.rotate) keys.push(k);
    rotate(keys,0);

    // Make picked directory
    var pickedDir = req.body.root+'/'+req.body.name+'_picked';
    fs.mkdirSync(pickedDir);
    console.log('created '+pickedDir);

    // Create links to wall
    var rootDir = '/usr/share/backup/pictures/';
    for(var key in req.body.print){
	// first move it picked
	var picked = pickedDir+'/'+req.body.pick[key].name;
	fs.renameSync(req.body.print[key].file, picked);
	// symlink it to wall
	var wall = rootDir+'/wall/'+req.body.print[key].name;
	fs.symlinkSync(picked, wall);
	console.log(picked+' linked to '+wall);
    }

    // Move to picked directory
    for(key in req.body.pick){
	var pickedFile = pickedDir+'/'+req.body.pick[key].name;
	fs.renameSync(req.body.pick[key].file, pickedFile);
    }
    res.end('OK');
};

var getData = function(){
    var data ={};
    for(var y=2006;y < 2015;y++){
	var imgDir = process.cwd()+'/public/modules/core/years/'+y+'/';
	//console.log('Image dir is '+imgDir);
	var todo = {};
	unpicks(imgDir,todo);
	data[y] = todo;
	//console.log('data is...');
	//console.log(data);
    }
    return data;
};

exports.unpicked = function(req,res){
    res.jsonp(getData());
};

var cpDir = function(source,dest){
    ncp(source, dest, function (err) {
	if (err) {
	    console.error(err);
	} else {
	    console.log('done '+source+' to '+dest);
        }
    });
};

var deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
	fs.readdirSync(path).forEach(function(file,index){
	    var curPath = path + '/' + file;
	    if(fs.lstatSync(curPath).isDirectory()) { // recurse
		deleteFolderRecursive(curPath);
	    } else { // delete file
		fs.unlinkSync(curPath);
	    }
	});
	fs.rmdirSync(path);
    }
};

var dozip = function(zipthis) {
    // Options -r recursive -j ignore directory info - redirect to stdout
    var zip = spawn('zip', ['-r', 'unpicks.zip', zipthis]);

    // Keep writing stdout to res
    zip.stdout.on('data', function (data) {
        console.log(data);
    });

    zip.stderr.on('data', function (data) {
        // Uncomment to see the files being added
        console.log('zip stderr: ' + data);
    });

    // End the response on zip exit
    zip.on('exit', function (code) {
        if(code !== 0) {
            console.log('zip process exited with code ' + code);
        }
    });
};

exports.zipit = function(req, res){
    var tozip = [];
    var dirName = 'zipdir';
    var years = getData();
    deleteFolderRecursive(dirName);
    fs.mkdirSync(dirName);
    for (var year in years){
        fs.mkdirSync(dirName+'/'+year);
	for (var name in years[year]){
	    var source = years[year][name].file;
            var target = dirName+'/'+year+'/'+name;
            var x=2;	
            while(fs.existsSync(target) ) {
                target = dirName+'/'+name+x;
            }
	    tozip.push(source);
            console.log(source);
            fs.mkdirSync(target);
	    cpDir(source,target);
	}
    }   
    dozip(dirName); 	
    res.jsonp(tozip);				   
};

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
    res.render('index', {
	user: req.user || null
    });
};
