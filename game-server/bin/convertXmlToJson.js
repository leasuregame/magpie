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
};

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

var mergeXmlFile = function(files, dir, cb) {
  var filepath = function(val) {
    return val.split('/').slice(-2).join('/');
  };

  var replace = function(target) {
    var find;
    fpath = filepath(target);

    for (var i = 0; i < files.length; i++) {
      f = files[i];
      if (filepath(f) == fpath) {
        find = i;
        break;
      }
    }

    if (find != null) {
      files.splice(find, 1);
      files.push(target);
    }
  };

  walk(dir, function(err, items) {
    items.forEach(function(item) {
      replace(item);
    });
    cb(files);
  });
};

var outputFiles = {
  default: ['../../client/cocos2d-x-2.2.1/projects/Magpie/Resources/src/table/table.json'],
  YY: ['../../client/cocos2d-x-2.2.1/projects/Magpie/Resources/IOS/YY/table.json']
};

for (var k in outputFiles) {
  outputFiles[k].forEach(function(p) {
    p = path.resolve(__dirname, p);
    tryMkdir(p);
  });
};

console.log('start write to ', outputFiles);
process.chdir(__dirname);

var DATA_DIR = path.join(__dirname, '..', 'data', 'share');

var platform = process.argv[2] || null;

walk(DATA_DIR, function(err, files) {
  if (err) {
    console.log('[ERROR] when read files, ', err);
  }

  function loadXmlFileData(files) {
    console.log(files);
    files = files.filter(function(file) {
      return /.xml$/.test(file);
    });
    var tabledata = loadtable.apply(loadtable, files);

    var ofiles = outputFiles[platform];
    if (!ofiles) {
      ofiles = outputFiles['default'];
    }
    ofiles.forEach(function(filepath) {
      fs.writeFileSync(filepath, JSON.stringify(tabledata.client));
    });

    fs.writeFileSync('../../gm/config/table/table.json', JSON.stringify(tabledata.exports));
    fs.writeFileSync('../../game-server/data/table.json', JSON.stringify(tabledata.exports));

    console.log('complete');
  };

  if (platform) {
    mergeXmlFile(files, path.join(DATA_DIR, '..', platform), function(files) {
      loadXmlFileData(files);
    });
  } else {
    loadXmlFileData(files);
  }
});