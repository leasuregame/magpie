#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var loadtable = require("../app/common/loadtable");

var tryMkdir = function(file) {
  var tryCreate = file.split('/');
  var tryPath = '/';
  for (var i = 0, ii = tryCreate.length - 1; i < ii; i++) {
    tryPath += tryCreate[i];
    try {
      fs.mkdirSync(tryPath);
    } catch (e) {};
    tryPath += '/';
  };
}

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
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

var outputFiles = [
  '../../client/Client-v1.0.0-e2.1.5/Client-v1.0.0-e2.1.5/Resources/src/table/table.json',
  '../../gm/config/table/table.json'
];

for (var i = outputFiles.length - 1; i >= 0; i--) {
  outputFiles[i] = path.resolve(__dirname, outputFiles[i]);
  tryMkdir(outputFiles[i]);
};

console.log('start write to ', outputFiles);
process.chdir(__dirname);

var DATA_DIR = path.join(__dirname, '..', 'data');
walk(DATA_DIR, function(err, files) {
  if (err) {
    console.log('[ERROR] when read files, ', err);
  }
  files = files.filter(function(file) {
    return /.xml$/.test(file);
  });
  var tabledata = loadtable.apply(loadtable, files);

  outputFiles.forEach(function(filepath) {
    fs.writeFileSync(filepath, JSON.stringify(tabledata.client));
  });

  fs.writeFileSync('../data/table1.json', JSON.stringify(tabledata.exports));
  fs.writeFileSync('../../gm/config/table/table1.json', JSON.stringify(tabledata.exports));

  console.log('complete');


});