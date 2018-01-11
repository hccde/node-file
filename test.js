let File = require('./index');
let utils = require('./lib/utils');
let Path = require('./lib/interface/Path');
let path = require('path');
let process = require('process');
let fs = require('fs');
let stream = new File.ReadStream('./example.txt',{
	fd:null
});
let writeStream = new File.WriteStream('./examplewrite.txt');
/
// console.log(stream)
stream.pipe(writeStream);