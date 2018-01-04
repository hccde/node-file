const glob = require('glob');
const fs = require('fs');
const path = require('path').posix;

function fsExist(_path){
	 return new Promise(function(resolve,reject){
	 		fs.access(_path,function(err){
	 			if(err){
	 				resolve(false);
	 			}
	 			resolve(true);
	 		});
	 	}).catch(function(e){
	 		reject(`utils::fsExist${e.toString()}`);
	 	});
}
module.exports = {
	async pathIsExist(_path){
		if( ( _path = path.normalize(_path.trim()) ) === '.' 
				|| !await fsExist(_path) )
			return false;
		_path = path.normalize(_path);
		return _path;
	}
}