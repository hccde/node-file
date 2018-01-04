let File = require('./index');
let utils = require('./lib/utils');
let Path = require('./lib/interface/Path');
let path = require('path');
File.mkdir('./my/hcc/de/hcc/cong/cong/hao/a.txt').then(function(value){
	console.log(value)
})
// utils.findExistDir(new Path('/Users/admos/Documents/github/tt/a.txt',false)).then(function(value){
// 	console.log(value)
// })
// File.mkdir('./test').then(function(value){
// 	console.log(value)
// })
// utils.pathWrapper('./aa/www').then(function(value){
// 	console.log(value)
// });
// console.log(File.copy('./index/js','./test/index.js'))