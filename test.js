let File = require('./index');
let utils = require('./lib/utils');
let path = require('path');
File.mkdir('./test').then(function(value){
	console.log(value)
})
// utils.pathWrapper('./aa/www').then(function(value){
// 	console.log(value)
// });
// console.log(File.copy('./index/js','./test/index.js'))