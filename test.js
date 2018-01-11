let File = require('./index');
let utils = require('./lib/utils');
let Path = require('./lib/interface/Path');
let path = require('path');
let fs = require('fs');
let stream = new File.WriteStream('./util.js');
console.log(global.streamList);