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
var imgDir = process.cwd()+'/public/modules/core/years/2006/';
console.log("Image dir is "+imgDir);
walk(imgDir, function(nowt,list){
   console.log(list);
});
