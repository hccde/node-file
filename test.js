let File = require('./index');
let utils = require('./lib/utils');
utils.pathIsExist('/Users/admos/Documents/github/node-file').then(function(value){
	console.log(value)
});

// console.log(File.copy('./index/js','./test/index.js'))