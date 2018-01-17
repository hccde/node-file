let File = require('./index');
let utils = require('./lib/utils');
let Path = require('./lib/interface/Path');
let path = require('path');
let process = require('process');
let fs = require('fs');
// File.ftpGet('pub/index.html',{
// 	host:'ftp.cuhk.hk'
// })

File.ftpGet('pub/pc/windows/ws_ftp/',{
	host:'ftp.cuhk.hk'
}).then(function(e){
	console.log(e)
})