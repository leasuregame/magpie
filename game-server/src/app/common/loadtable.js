var fs = require('fs'),
  xml2js = require('xml2js');
  _ = require('underscore');

var parser = new xml2js.Parser();

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function clone(myObj) {
  if (myObj === null || myObj === undefined)
    return myObj;

  if (isObject(myObj)) {
    var myNewObj = {};
    for (var i in myObj)
      myNewObj[i] = clone(myObj[i]);
    return myNewObj;
  } else if (isArray(myObj)) {
    var len = myObj.length;
    var myNewArr = new Array(len);
    for (var i = 0; i < len; i++) {
      myNewArr[i] = clone(myObj[i]);
    };
    return myNewArr;
  }
  return myObj;
}

function analyzeTable(alltable, tablename) {
  var table = alltable[tablename];
  if (table === undefined) {
    console.log(tablename + "表不存在");
  }
    
  var outputTable = {};
  var columns = table.Row[1]['Cell']; //第2行
  var colNames = [];
  var colComment = {};
  var uniCol = null;
  for (var i = 0; i < columns.length; i++) {
    var name = columns[i].Data['#'] || (columns[i].Data['Font'] && columns[i].Data['Font']['#']);
    //console.log(name,tablename,columns[i]);
    var withPound = (name[0] == '!');
    name = withPound ? name.substring(1) : name;
    colNames.push(name);

    if (columns[i].Data['#'] === 'id') {
      uniCol = 'id';
    }
    if (columns[i].Comment) {
      var ssdata = columns[i].Comment['ss:Data'] || columns[i].Comment['Data'];
      var cmt = ssdata['#'];
      //var cmt = columns[i].Comment['Data']['#'];

      if (!cmt && ssdata['Font'])
        cmt = ssdata['Font']['#'];

      if (!cmt && ssdata['B'] && ssdata['B']['Font'])
        cmt = ssdata['B']['Font']['#'];

      if (!cmt && ssdata) {
        cmt = ssdata;
      }
      //console.log(cmt);
      if (cmt) {
        var params = cmt.split('|');
        if (params.length == 3) {
          colComment[name] = {
            table: params[0],
            key_index: params[1],
            value_index: params[2],
            withPound: withPound,
            //twice : (params[1][0] == '{' || params[2][0] == '{')
          }
        } else {
          //console.log('批注参数错误，表：'+tablename);
        }

      }
    }
  };
  if (uniCol == null) {
    //console.log('没有唯一id列，表：'+tablename);
    return;
  }
  outputTable['colComment'] = colComment;
  var rows = outputTable['rows'] = {};
  var colIndex = 0;
  var aRowData = null;
  for (var i = 2; i < table.Row.length; i++) {
    var row = table.Row[i]['Cell'];
    if (!row) continue;
    if (isObject(row)) row = [row];
    colIndex = 0;
    aRowData = {};
    for (var j = 0; j < row.length; j++) {
      if (row[j]['@'] && row[j]['@']['ss:Index']) {
        colIndex = parseInt(row[j]['@']['ss:Index']) - 1;
      }

      if (row[j]['Data'] && row[j]['Data']['@'] && row[j]['Data']['@']['ss:Type']) {
        var text = null;
        if (row[j]['Data']['#'])
          text = row[j]['Data']['#'];
        if (!text && row[j]['Data']['Font']) {
          text = row[j]['Data']['Font']['#'];
        }
        if (!text) {
          //console.log(text, row[j]['Data']);
          text = row[j]['Data']['Font']['#'];
        }

        if (row[j]['Data']['@']['ss:Type'] == 'Number') {
          var fl = parseFloat(text);
          var integ = parseInt(text);
          if (fl == integ && colNames[colIndex]) {
            if (aRowData[colNames[colIndex]] !== undefined) {
              if (isArray(aRowData[colNames[colIndex]])) {
                aRowData[colNames[colIndex]].push(integ);
              } else {
                aRowData[colNames[colIndex]] = [aRowData[colNames[colIndex]], integ];
              }
            } else {
              aRowData[colNames[colIndex]] = integ;
            }
          } else if (colNames[colIndex]) {
            if (aRowData[colNames[colIndex]] !== undefined) {
              if (isArray(aRowData[colNames[colIndex]])) {
                aRowData[colNames[colIndex]].push(fl);
              } else {
                aRowData[colNames[colIndex]] = [aRowData[colNames[colIndex]], fl];
              }
            } else {
              aRowData[colNames[colIndex]] = fl;
            }
          }
          colIndex++;
          continue;
        }
      }
      if (row[j]['Data'] && colNames[colIndex]) {
        var text = null; // = row[j]['Data']['#'] || row[j]['Data']['Font']['#'];
        if (row[j]['Data']['#'])
          text = row[j]['Data']['#'];
        if (!text && row[j]['Data']['Font']) {
          text = row[j]['Data']['Font']['#'];
        }
        if (!text) {
          //console.log(text, row[j]['Data']);
          text = row[j]['Data']['Font']['#'];
        }

        if (aRowData[colNames[colIndex]] !== undefined) {
          if (isArray(aRowData[colNames[colIndex]])) {
            aRowData[colNames[colIndex]].push(text);
          } else {
            aRowData[colNames[colIndex]] = [aRowData[colNames[colIndex]], text];
          }
        } else {
          aRowData[colNames[colIndex]] = text;
        }
      }
      //兼容2003的xml
      if (row[j]['ss:Data'] && row[j]['ss:Data']['@'] && row[j]['ss:Data']['@']['ss:Type']) {
        var text = row[j]['ss:Data']['#'] || row[j]['ss:Data']['Font']['#'];
        if (row[j]['ss:Data']['@']['ss:Type'] == 'Number') {
          var fl = parseFloat(text);
          var integ = parseInt(text);
          if (fl == integ && colNames[colIndex]) {
            if (aRowData[colNames[colIndex]] !== undefined) {
              if (isArray(aRowData[colNames[colIndex]])) {
                aRowData[colNames[colIndex]].push(integ);
              } else {
                aRowData[colNames[colIndex]] = [aRowData[colNames[colIndex]], integ];
              }
            } else {
              aRowData[colNames[colIndex]] = integ;
            }
          } else if (colNames[colIndex]) {
            if (aRowData[colNames[colIndex]] !== undefined) {
              if (isArray(aRowData[colNames[colIndex]])) {
                aRowData[colNames[colIndex]].push(fl);
              } else {
                aRowData[colNames[colIndex]] = [aRowData[colNames[colIndex]], fl];
              }
            } else {
              aRowData[colNames[colIndex]] = fl;
            }

          }
          colIndex++;
          continue;
        }
      }
      if (row[j]['ss:Data'] && colNames[colIndex]) {
        var text = row[j]['ss:Data']['#'] || row[j]['ss:Data']['Font']['#'];
        if (aRowData[colNames[colIndex]] !== undefined) {
          if (isArray(aRowData[colNames[colIndex]])) {
            aRowData[colNames[colIndex]].push(text);
          } else {
            aRowData[colNames[colIndex]] = [aRowData[colNames[colIndex]], text];
          }
        } else {
          aRowData[colNames[colIndex]] = text;
        }
      }
      colIndex++;
    };
    if (aRowData[uniCol] === '' || aRowData[uniCol] === null || aRowData[uniCol] === undefined) {
      //console.log('唯一列中某些行唯一id不存在，表:' + tablename);
    } else {
      rows[aRowData[uniCol]] = aRowData;
    }

  };
  return outputTable;
}

function getValueByValue(outputTables, nameChanged, table_name, key, key_value) {

  //console.log(nameChanged[table_name]);
  //console.log(table_name);
  //console.log(key, key_value)
  var table = outputTables[nameChanged[table_name]]['rows'];
  if (isArray(key_value)) {
    var output = [];
    for (var i = key_value.length - 1; i >= 0; i--) {
      var value = key_value[i];
      var len = output.length;
      for (var id in table) {
        if (table[id][key] === value) {
          output.push(table[id]);
          break;
        }
      };
      if (len == output.length) {
        console.log('关联失败,表', table_name, ' 不存在', key, '列为', value, '的行')
        output.push(null);
      }
    };
    return output.reverse();
  } else {
    for (var id in table) {
      if (table[id][key] === key_value) {
        return table[id];
      }
    };
  }
  //console.log('没有找到关联项：');
  //console.log(comboInfo);
  //console.log(key_value);
  return null;
}

function analyzeCombo(outputTables, nameChanged) {
  for (var tableName in outputTables) {
    var table = outputTables[tableName];
    if (table === undefined) {
      throw "表数据出错，" + tableName;
    }
    //判断是否存在combo
    var comboInfo = table['colComment'];
    var datas = table['rows'];
    for (var key in comboInfo) {

      for (var id in datas) {
        if (datas[id][key]) {
          //传唤：
          //if (datas === undefined) {
          //console.log(comboInfo[key]);
          //console.log(datas[id][key]);
          //console.log(tableName);
          //}
          var value = datas[id][key];
          var valueArray = ('' + value).split('/');
          var combo = comboInfo[key];
          var value_index = combo.value_index,
            key_index = combo.key_index,
            table_name = combo.table;

          if (value_index[0] == '{') {
            value_index = datas[id][value_index.substring(1, value_index.length - 1)];
          }
          if (key_index[0] == '{') {
            key_index = datas[id][key_index.substring(1, key_index.length - 1)];
          }
          if (table_name[0] == '{') {
            table_name = datas[id][table_name.substring(1, table_name.length - 1)];
          }
          /*
          if (combo.withPound) {
            console.log(combo);
            console.log(table_name);
            console.log(key_index);
            console.log(value_index);
          }*/



          if (valueArray.length == 1) {
            var pound = false,
              sub = false;
            if (combo.withPound) {
              //＃－得特殊处理
              if (value[0] == '#') {
                pound = true;
                if (value[1] == '-') {
                  sub = true;
                  value_index = '#-' + value_index;
                  value = value.substring(2);
                } else {
                  value_index = '#' + value_index;
                  value = value.substring(1);
                }
              } else if (value[0] == '-') {
                sub = true;
                value_index = '-' + value_index;
                value = value.substring(1);
              }
            }

            datas[id][key + '_linktarget'] = getValueByValue(outputTables, nameChanged, table_name, key_index, value);

            if (datas[id][key + '_linktarget']) {
              if (isArray(value)) {
                var output = [];
                for (var i = value.length - 1; i >= 0; i--) {
                  var tmp = datas[id][key + '_linktarget'][i];
                  if (!tmp) {
                    output.push(value[i]);
                    continue;
                  }
                  tmp = tmp[value_index];
                  if (tmp === null || tmp === undefined) {
                    output.push(datas[id][key]);
                  } else if (combo.withPound) {
                    output.push([pound ? '#' : null, sub ? (-1 * tmp) : tmp]);
                  } else
                    output.push(tmp);
                };
                datas[id][key] = output;
              } else {
                var tmp = datas[id][key + '_linktarget'][value_index];
                if (tmp === null || tmp === undefined) {
                  //output.push(datas[id][key]);
                } else if (combo.withPound) {
                  datas[id][key] = [pound ? '#' : null, sub ? (-1 * tmp) : tmp];
                } else
                  datas[id][key] = tmp;
              }
            } else {
              console.log('关联失败：', '表：', tableName, 'id:', id, 'col:', key, 'value:', datas[id][key]);
              console.log('table_name', table_name, 'key_index', key_index, 'value', value);
            }

          } else {
            //console.log(valueArray);
            //console.log(valueArray[0]);
            //console.log(valueArray[1]);
            datas[id][key + '_linktarget'] = [];
            datas[id][key] = [];
            for (var i = 0, ii = valueArray.length; i < ii; i++) {
              var pound = false,
                sub = false;
              if (combo.withPound) {
                //＃－得特殊处理
                if (valueArray[i][0] == '#') {
                  pound = true;
                  if (value[1] == '-') {
                    sub = true;
                    key_index = '#-' + key_index;
                    valueArray[i].splice(0, 2);
                  } else {
                    key_index = '#' + key_index;
                    valueArray[i].splice(0, 1);
                  }
                } else if (valueArray[i][0] == '-') {
                  sub = true;
                  key_index = '-' + key_index;
                  valueArray[i].splice(0, 1);
                }
              }
              var tar = getValueByValue(outputTables, nameChanged, table_name, key_index, valueArray[i]);
              datas[id][key + '_linktarget'].push(tar);
              if (tar) {
                var tmp = tar[value_index];
                if (tmp === null || tmp === undefined) {
                  //output.push(valueArray[i]);
                } else if (combo.withPound) {
                  datas[id][key].push([pound ? '#' : null, sub ? (-1 * tmp) : tmp]);
                } else
                  datas[id][key].push(tmp);
              } else
                datas[id][key].push(valueArray[i]);
            };
          }
        }
      };
    };
  };
}
var outputTables = null;
var exports = null;
module.exports = function() {
  if (arguments.length == 0 && outputTables && exports) {
    return {
      client: outputTables,
      exports: exports
    };
  }
  outputTables = {};
  exports = {};
  var nameChanged = {};
  var allTables = {};
  var needMergeTables = []

  for (var i = 0; i < arguments.length; i++) {
    var file = arguments[i];
    var data = fs.readFileSync(file);
    parser.parseString(data, function(err, result) {
      var sheets = result.Worksheet;
      for (var i = sheets.length - 1; i >= 0; i--) {
        var tabName = sheets[i]['@']['ss:Name'];
        if (tabName === 'export') {
          if (allTables['export']) {
            //row 合并
            var newrows = sheets[i]['Table'].Row;
            for (var j = newrows.length - 1; j > 0; j--) {
              //console.log(newrows[j]['Cell'][0].Data['#']);
              //console.log(newrows[j]['Cell'][1].Data['#']);
              allTables['export'].Row.push(newrows[j]);
            };
          } else {
            allTables[tabName] = sheets[i]['Table'];
          }
          continue;
        } else if (allTables[tabName]) {
          throw '表重名了：' + tabName;
        }
        allTables[tabName] = sheets[i]['Table'];
      };
    });
  };

  //找export
  var exportTab = allTables['export'];
  if (!exportTab) {
    throw '缺少export sheet :' + file;
  }
  //console.log(exportTab);
  for (var i = 1; i < exportTab.Row.length; i++) {

    var row = exportTab.Row[i]['Cell'];
    if (outputTables[row[1].Data['#']]) {
      //console.log(outputTables);
      throw '导出表重名了：' + row[1].Data['#'];
    }
    
    // 需要合并的表
    if (typeof row[2] != 'undefined' && typeof row[2].Data != 'undefined') {
      needMergeTables.push({
        from: row[1].Data['#'], 
        to: row[2].Data['#']
      });
    }

    outputTables[row[1].Data['#']] = analyzeTable(allTables, row[0].Data['#']);
    nameChanged[row[1].Data['#']] = row[0].Data['#'];
    nameChanged[row[0].Data['#']] = row[1].Data['#'];
  };

  //下发到客户端outputTables
  var new_outputTables = clone(outputTables);

  analyzeCombo(new_outputTables, nameChanged);

  for (var tableName in new_outputTables) {
    exports[tableName] = new_outputTables[tableName]['rows'];
  };

  //console.log(exports['skill_settings']);
  mergeTables(needMergeTables, exports, nameChanged, outputTables);
  return {
    exports: exports,
    client: {
      nameChanged: nameChanged,
      outputTables: outputTables
    }
  };
}

function mergeTables(tabs, tables, nameChanged, outputTables){
  tabs.forEach(function(tab) {
    var from = tab.from;
    _.extend(tables[tab.to], tables[from]);
    _.extend(outputTables[tab.to].rows, outputTables[from].rows);
    delete tables[from];
    delete outputTables[from];

    var _from = nameChanged[from];
    delete nameChanged[from];
    delete nameChanged[_from];
  });
};



//支持 {key}|{val}  支持#magic_eff