let File = require('./index');
let utils = require('./lib/utils');
let Path = require('./lib/interface/Path');
let path = require('path');
let fs = require('fs');
File.rmdir('./my/files/a.js').then(function(value){
	console.log(value)
})
// File.readFile('./my/file/a.js').then(function(value){
// 	console.log(value.toString())
// })
// File.writeFileSync('./my/file/a.js','aa');
// File.writeFile('./my/file/a.js','aa').then(function(value){
// 	console.log(value)
// })
// File.writeSync('./my/softlink/a.js','44444')
// File.mkdir('./my/hcc/cong/de/').then(function(value){
// 	console.log(value)
// })
// utils.findExistDir(new Path('./my/softlink/a.js',true)).then(function(value){
	// console.log(value)
// })
// File.mkdir('./test').then(function(value){
// 	console.log(value)
// })
// utils.pathWrapper('./aa/www').then(function(value){
// 	console.log(value)
// });
// console.log(File.copy('./index/js','./test/index.js'))