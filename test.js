let File = require('./index');
let utils = require('./lib/utils');
let Path = require('./lib/interface/Path');
let path = require('path');
let fs = require('fs');
let stream = new File.ReadStream('./util.js');
stream.on('data',function(){
	console.log(1)
});
stream.read();
console.log(global.streamList);