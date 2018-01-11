let File = require('./index');
let utils = require('./lib/utils');
let Path = require('./lib/interface/Path');
let path = require('path');
let process = require('process');
let fs = require('fs');
let stream = new File.WriteStream('./util.js',{
	fd:null
});
stream.on('data',function(data){
	console.log(1)
});
// console.log(stream)
stream.write('aa');