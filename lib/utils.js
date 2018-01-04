const glob = require('glob');
const fs = require('fs');
const path = require('path').posix;
const Path = require('./interface/Path');

function pathIsExist(_path){
	return new Promise(function(resolve,reject){
	 		fs.access(_path,function(err){
	 			if(err){
	 				resolve(false);
	 			}
	 			resolve(true);
	 		});
	 	}).catch(function(e){
	 		reject(`utils::pathIsExist${e.toString()}`);
	 	});
}

function normalize(_path){
		_path = path.normalize(_path.trim());
		return  _path === '.'?'':_path;
}

module.exports = {
	async pathWrapper(_path){
		let exist = true;
		_path = normalize(_path);
		if( _path === '' || !await pathIsExist(_path) )
			exist = false;
		return new Path(_path,exist);

	},
	normalize
}