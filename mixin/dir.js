let utils = require('../lib/utils');
let path = require('path');
let Path = require('../lib/interface/Path');
let _ = require('lodash');
let fs = require('fs');

module.exports = {
	test(){
		console.log(1)
	}
	// delete(_path){//delete file or dir
	// 	let pathObj = new Path(_path);
	// 	let absolutePath = pathObj.absolutePath;
	// 	if(!pathObj.isDir){
	// 		//fileAll
	// 		return await File.deleteFile(_path)
	// 	}else{
	// 		// dir
	// 		return await File.rmdir(_path)
	// 	}
	// },
	// deleteSync (_path){
	// 	let pathObj = new Path(_path);
	// 	let absolutePath = pathObj.absolutePath;
	// 	if(!pathObj.isDir){
	// 		//fileAll
	// 		return File.deleteFileSync(_path)
	// 	}else{
	// 		// dir
	// 		return File.rmdirSync(_path)
	// 	}
	// }
}