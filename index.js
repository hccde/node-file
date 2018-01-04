let utils = require('./lib/utils');
let path = require('path');
let Path = require('./lib/interface/Path');
let fs = require('fs');
class File {
	constructor(){
	}
	//local
	static copy(){}
	static move(){}
	static delete(){}
	static write(){}
	static mkdirSync(){}
	static mkdir(){}
	static server(){}
	static watch(){}
	static append(){}
	//http
	static get(){}
	static post(){}
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
		let index = _path.pathList.findIndex(function(e){
			return e === existPath;
		});
		for(let i = index+1;i<_path.pathList.length;i++){
			fs.mkdirSync(_path.pathList[i],mode);
		}
		return _path.absolutePath;

	}else{
		await true;
		throw Error(`first param must be string or an instance of Path`)
	}
}
//todo
File.mkdirSync = function(_path,mode = 0o777){
	if(typeof _path === "string"){
		_path = new Path(_path);
	}
	if(_path instanceof Path){
		console.log(_path.pathList)
		for(let i = 1;i<_path.pathList.length;i++){//from index=1 because root path `/` can't be operated
			try{
				fs.mkdirSync(_path.pathList[i],mode);	
			}catch(e){
				if(e.toString().indexOf('exists')>-1)
					continue;
			}
		}
		return _path.absolutePath;
	}else{
		throw Error(`first param must be string or an instance of Path`)
	}
}

File.write = function(dest,str){
	fs.writeFileSync(dest,str);
}
module.exports = File