let utils = require('./lib/utils');
let path = require('path');
let Path = require('./lib/interface/Path');
let fs = require('fs');
class File {
	constructor(){
	}
	static copy(){}
	static write(){}
	static mkdirSync(){}
	static mkdir(){}
}

File.copy = function(source,dest){

}
File.mkdir = async function(_path,mode = 0o777){ // loop itself
	if(typeof _path === "string"){
		_path = await utils.pathWrapper(_path)	
	}
	if(_path instanceof Path){
		let existPath = await utils.findExistDir(_path);

		if(existPath.length == _path.dirSep.length){
			return _path.absolutePath;
		}
		//todo
		let index = _path.pathList.findIndex(function(e){
			return e === existPath;
		});
		for(let i = index+1;i<_path.pathList.length;i++){
			fs.mkdirSync(_path.pathList[i],mode);
		}
		return _path.absolutePath;

	}else{
		await true;
		throw Error(`first param must be instance of Path`)
	}
}
//todo
File.mkdirSync = fs.mkdirSync;
File.write = function(dest,str){
	fs.writeFileSync(dest,str);
}
module.exports = File