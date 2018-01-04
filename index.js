let utils = require('./lib/utils');
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
	let pathObj = await utils.pathWrapper(_path);
	console.log(pathObj instanceof Path)

	//if path exist
	return new Promise(function(reslove,reject){
		fs.mkdir(_path,mode,function(err){
			if(err){
				reject(`File::mkdir${err.toString()}`);
			}
			reslove(_path);
		})
	})
}
File.mkdirSync = fs.mkdirSync;
File.write = function(dest,str){
	fs.writeFileSync(dest,str);
}
module.exports = File