var _ = require("underscore");
var fs = require("fs");
var loadtable = require("./loadtable");
var path = require('path');
var util = require('./utility');

DATA_DIR = path.join(__dirname, '..', '..', 'data');

module.exports = {
  _tables: {}, //下划线表示不应该直接访问
  //获取数据表格

  cacheTables: function() {
    var self = this;
    var jsontable = path.join(DATA_DIR, 'table.json');
    if (fs.existsSync(jsontable)){
      this.loadTableData(JSON.parse(fs.readFileSync(jsontable)));
      fs.watchFile(jsontable, function(curr, prev) {
        console.log(jsontable, 'is changed, reload tables data');
        self.loadTableData(JSON.parse(fs.readFileSync(jsontable)));
      });
    } else {
      var files = util.walkSync(DATA_DIR).filter(function(file) {
        return /.xml$/.test(file);
      });
      
      var data = this._readTables.apply(this, files);
      this.loadTableData(data.exports);
    }
  },
  _readTables: function() {
    return loadtable.apply(loadtable, arguments);
  },
  clear: function() {
    this._tables = {};
  },
  reloadTables: function() {
    this.clear();
    data = this._readTables.apply(this, arguments).exports;
    this.loadTableData(data);
  },
  getTable: function(tablename) {
    if (_.isEmpty(this._tables)) {
      this.cacheTables();
    }
    //console.log(tablename);
    var tab = this._tables[tablename];
    //console.log(tab);
    if (!tab) return null;
    return {
      _data: tab.data,
      _index: tab.index,
      getItem: function(id) {
        return this._data ? this._data[id] : null;
      },
      getCount: function() {
        return this._index ? this._index.length : 0;
      },
      //id不连续，属于稀疏，这个是用于枚举所有数据的借口。
      getByIndex: function(index) {
        var data = this._data[this._index[index]];
        return data ? data : null;
      },
      forEach: function(fn) {
        var dat = this._data;
        for (var src in dat) {
          fn(src, dat[src]);
        };
        return this;
      },
      filter: function(filter) {
        var items = [];
        for (var id in this._data) {
          if (filter(id, this._data[id])) items.push(this._data[id]);
        };
        return items;
      },
      findOne: function(filter) {
        var find = null;
        for (var id in this._data) {
          if (filter(id, this._data[id])) {
            find = id;
            break;
          }
        };
        return find ? this._data[find] : find;
      },
      find: function(field, value) {
        var filter = function(id, row) {
          return row[field] == value;
        };
        return this.findOne(filter);
      },
      map: function(fn) {
        var _res = [];
        for (var id in this._data) {
          _res.push(fn(this._data[id]));
        }
        return _res;
      }
    };
  },
  //获取某行数据
  getTableItem: function(tablename, id) {
    var table = this.getTable(tablename);
    return table ? table.getItem(id) : null;
  },
  loadTableData: function(datas) {
    this._tables = {};
    for (var tab in datas) {
      var index = [];
      for (var id in datas[tab]) {
        index.push(id);
      };
      this._tables[tab] = {
        data: datas[tab],
        index: index
      }
    };
  },
  loadDataFile: function(file) {
    var g = this._readJsonFile(file, {});
    this._trans(g);
  },
  //加载数据，在server启动服务器应该先调用。
  load: function(datapath) {
    var g = this._loadAllData(datapath);
    this._trans(g);
  },
  /*output: null,
  _revertComboBoxRaw : function(g,param,value,id) {
    if (!param.type_arg_value) {
      return '异常';
    }
    var combomodelattr = g.modelattr[param.type];
    var combomodeldata = g.modeldata[param.type];
    
    var valueKeyName = param.type_arg.toLowerCase();
    //获得combomodelattr中，valueKeyName所在的行的guid
    var attrindex = combomodelattr.index;
    var attrguid = '';
    var type = '';
    for (var i = attrindex.length - 1; i >= 0; i--) {
      var attr = combomodelattr[attrindex[i]];
      if (attr && attr.id.toLowerCase() === valueKeyName) {
        attrguid = attr.guid;
        type = attr.type;
        break;
      }
    };

    if (!attrguid || attrguid === '') {
      return '';
    }
      
    return combomodeldata[value][attrguid];
  },
  _transTypeRaw : function(g,attr,value) {
    var type = attr.type || 'string';
    type = (type==='') ? 'string' : type;
    type = type.toLowerCase();

    if (type === 'number') {
      return value;
    } else if ( type === 'string') {
      return value;
    } else if (type ==='function') {
      return value;
    } else if (type === 'array' || type ==='object') {
      return value;
    } else if (type === 'bool') {
      return value;
    } else if (type === 'image') {
      return value;
    } else
    {
      if (!value || value.length==0) {
        return '';
      }
      return this._revertComboBoxRaw(g,attr,value,attr.id);
    }
  },*/
  _transType: function(g, attr, value) {
    var type = attr.type || 'string';
    type = (type === '') ? 'string' : type;
    type = type.toLowerCase();

    if (type === 'number') {
      try {
        var num = parseFloat(value);
        if (isNaN(num)) {
          return Number.NEGATIVE_INFINITY;
        }
        return num;
      } catch (e) {
        return Number.NEGATIVE_INFINITY;
      }
    } else if (type === 'string') {
      return value;
    } else if (type === 'function') {
      try {
        eval("var fn = " + value);
        return fn;
      } catch (e) {
        return null;
      }
    } else if (type === 'array' || type === 'object') {
      return value;
    } else if (type === 'bool') {
      return (value === true) || (value === 'true');
    } else if (type === 'image') {
      return value;
    } else {
      if (!value || value.length == 0) {
        return '';
      }
      return this._revertComboBox(g, attr, value, attr.id);
    }

  },
  _transData: function(g, model, rowdata) {
    var attrList = g.modelattr[model.guid] || {};
    var arealdata = {
      guid: rowdata.guid
    };
    delete rowdata.guid;
    /*
    var ot = "";
    if(this.output == "")
    {
      for(var attrGuid in rowdata) {
        var attr = attrList[attrGuid];
        if (!attr)
          continue;
        if(attr.name)
          ot += attr.name;
        else ot += attr.id;
        ot += "\t";
      }
      ot += "\n";
    }
    */
    //console.warn(this.output);
    for (var attrGuid in rowdata) {
      var attr = attrList[attrGuid];

      if (attr && attr.id && attr.id.length > 0) {
        arealdata[attr.id] = this._transType(g, attr, rowdata[attrGuid]);

        var tmp_str = attr.type == 'Function' ? '\"' + rowdata[attrGuid] + '\"' : arealdata[attr.id] + '';
        //ot += ('' + this._transTypeRaw(g, attr, rowdata[attrGuid])).replace(/[\n,\t]/g, ' ')+'\t';
      } else {
        //console.log(model.id + "   " + attrGuid + "    "+ rowdata[attrGuid]);
      }
    }
    /*
    ot += "\n";
    this.output +=ot;*/
    return arealdata;
  },
  _transModel: function(g, model) {
    var dataList = g.modeldata[model.guid] || {};
    var data = {}; //输出的数据。
    for (var i = 0, ii = dataList.index.length; i < ii; i++) {
      var rowGuid = dataList.index[i];
      var aRowData = dataList[rowGuid];
      if (aRowData) {
        var aRealRowData = this._transData(g, model, aRowData);

        if (aRealRowData && (
          ((typeof(aRealRowData.id) === 'string') && (aRealRowData.id.length > 0)) || ((typeof(aRealRowData.id) === 'number')))) {
          data[aRealRowData.id] = aRealRowData;
        }
      }
    }
    return data;
  },
  _trans: function(g) { //翻译数据，转换类型
    var table = this._tables;
    var modellist = g.modellist.index;
    for (var i = 0, ii = modellist.length; i < ii; i++) {
      var modelGuid = modellist[i];
      var model = g.modellist[modelGuid];
      if (model.leaf && model.id && model.id.length > 0) {
        //console.log(model.id);
        //this.output = "";
        var datas = this._transModel(g, model);
        table[model.id.toLowerCase()] = {
          data: datas,
          index: this._buildIndex(datas)
        };
        //var file = fs.openSync("./export/"+model.id.toLowerCase()+".csv", "w");
        //console.log(file);
        //按cvs格式输出

        //fs.writeFileSync("./export/"+model.id.toLowerCase()+".csv", this.output);
      }
    }
  },
  _buildIndex: function(datas) {
    var index = [];
    for (var key in datas) {
      index.push(key);
    };
    return index;
  },
  _readJsonFile: function(filepath, defaultvalue) {
    var data = null;
    var jspath = filepath + '.json';
    try {
      data = fs.readFileSync(jspath, 'utf8');
    } catch (e) {
      // console.log('readFileSync "'+jspath+'" fail.');
      return defaultvalue;
    }
    if (!data || data.length == 0) {
      //     console.log('readFileSync "'+jspath+'" return empty data.');
      return defaultvalue;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      //          console.log('JSON.parse "'+jspath+'" fail.');
      return defaultvalue;
    }
  },
  _loadByIndex: function(indexfile, obj) {
    obj.index = this._readJsonFile(indexfile, []);
    for (var i = 0; i < obj.index.length; i++) {
      var guid = obj.index[i];
      var data = this.readJsonFile(datapath + guid, null);
      if (data == null) {
        obj.index.splice(i, 1);
        i--;
      } else {
        obj[guid] = data;
        if (data.guid !== guid) {
          data.guid = guid;
        }
      }
    };
  },
  //从文件夹加载数据。//下划线表示不应该直接访问
  _loadAllData: function(datapath) {
    var modellist = {},
      modelattr = {},
      modeldata = {};

    this._loadByIndex(datapath + 'index', modellist);
    var index = modellist.index;
    for (var j = 0; j < index.length; j++) {
      var modelguid = index[j];
      var attrs = modelattr[modelguid] = {};
      this._loadByIndex(datapath + modelguid + '_attr_index', attrs);

      var datas = modeldata[modelguid] = {};
      this._loadByIndex(datapath + modelguid + '_data_index', datas);
    };
    return {
      modellist: modellist,
      modelattr: modelattr,
      modeldata: modeldata
    };
  },
  //加载关联数值//下划线表示不应该直接访问
  _revertComboBox: function(g, param, value, id) {
    if (!param.type_arg_value) {
      return '异常';
    }
    var combomodelattr = g.modelattr[param.type];
    var combomodeldata = g.modeldata[param.type];

    var valueKeyName = param.type_arg_value.toLowerCase();
    //获得combomodelattr中，valueKeyName所在的行的guid
    var attrindex = combomodelattr.index;
    var attrguid = '';
    var type = '';
    for (var i = attrindex.length - 1; i >= 0; i--) {
      var attr = combomodelattr[attrindex[i]];
      if (attr && attr.id.toLowerCase() === valueKeyName) {
        attrguid = attr.guid;
        type = attr.type;
        break;
      }
    };

    if (!attrguid || attrguid === '') {
      return '';
    }

    try {
      type = type.toLowerCase();
      var ret = combomodeldata[value][attrguid];
      if (type === 'number') {

        try {
          return parseFloat(ret);

          if (isNaN(ret)) {
            return Number.NEGATIVE_INFINITY;
          }
        } catch (e) {
          return Number.NEGATIVE_INFINITY;
        }
      } else if (type === 'string') {
        return ret;
      } else if (type === 'function') {
        try {
          eval("ret = " + ret);
        } catch (e) {}
        return ret;
      } else if (type === 'array' && type === 'object') {
        return ret;
      } else if (type === 'bool') {
        return ret == true;
      }
    } catch (e) {}
    return '';
  },

};