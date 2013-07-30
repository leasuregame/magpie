#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

function tryMkdir(file) {
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

var files = ['../data/table.json', '../../client/Client/Client/Resources/src/table/table.json'];

for (var i = files.length - 1; i >= 0; i--) {
  files[i] = path.resolve(__dirname, files[i]);
  tryMkdir(files[i]);
};

console.log('start write to ', files);
process.chdir(__dirname);
var tabledata = require("../app/common/loadtable")(
  '../data/skills.xml',
  '../data/cards.xml',
  '../data/tasks.xml'
);

files.forEach(function(filepath){
  fs.writeFileSync(filepath, JSON.stringify(tabledata.client));
});

console.log('complete');