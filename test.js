let File = require('./index');
let utils = require('./lib/utils');
let Path = require('./lib/interface/Path');
let path = require('path');
// File.writeSync('./my/softlink/a.js','44444')
// File.mkdir('./my/hcc/cong/de/').then(function(value){
// 	console.log(value)
// })
utils.findExistDir(new Path('./my/softlink/a.js',true)).then(function(value){
	// console.log(value)
})
// File.mkdir('./test').then(function(value){
// 	console.log(value)
// })
// utils.pathWrapper('./aa/www').then(function(value){
// 	console.log(value)
// });
// console.log(File.copy('./index/js','./test/index.js'))