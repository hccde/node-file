let File = require('./index');
let utils = require('./lib/utils');
let Path = require('./lib/interface/Path');
let path = require('path');
let process = require('process');
let fs = require('fs');
// File.ftpGet('pub/index.html',{
// 	host:'ftp.cuhk.hk'
// })

// File.ftpGet('pub/pc/windows/ws_ftp/',{
// 	host:'ftp.cuhk.hk'
// }).then(function(e){
// 	console.log(e)
// })
// File.ftpUpload('./node_modules','.',{
// 	port:2121,
// 	user:'user',
// 	password:12345
// })


// File.ftpRmdir('./a',{
// 	port:2121,
// 	user:'user',
// 	password:12345
// });
// File.copy('./mixin','./server');
// utils.findExistDir(new Path('./mixin'))
// utils.findExistDir(new Path('./mixin')).then(function(val){
	// console.log(val)
// });