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

var files = ['../../client/table/table.json', '../data/table.json'];

for (var i = files.length - 1; i >= 0; i--) {
  files[i] = path.resolve(__dirname, files[i]);
  tryMkdir(files[i]);
};

console.log('start write to ', files);
process.chdir(__dirname);
var tabledata = require("../lib/common/loadtable")(
  '../data/skills.xml', 
  '../data/cards.xml'
  );
fs.writeFileSync(files[1], JSON.stringify(tabledata.exports));
fs.writeFileSync(files[0], JSON.stringify(tabledata.client));

console.log('complete');