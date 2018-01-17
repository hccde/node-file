const glob = require('glob');
const fs = require('fs');
const path = require('path');
const Path = require('./interface/Path');
const shortPathDeepth = 20;
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
async function findExistDir(pathObj){
	let pathList = pathObj.pathList,existPath = '',index = 0;
	let length = pathList.length;
	if( length < shortPathDeepth ){//less than 20
		//if path is short ,use promise.all 
		let pathPromiseList = await Promise.all(pathList.map(pathIsExist));
		index = pathPromiseList.findIndex(function(e){return !e;});
		index = index === -1?length:index;
		index = index - 1;
	}else{//more than 20  then Binary-Search
		let begin = 0,middle = length>>1,end = length,flag = false;
		while(!flag){
			if(await  pathIsExist(pathList[middle])){
				begin = middle;
				middle = begin + ((end - begin)>>1);
			}else{
				end = middle;
				middle = middle>>1;
			}
			if(middle>=1){
				let pathPromiseTwo = await Promise.all([pathIsExist(pathList[middle-1]),
														pathIsExist(pathList[middle])]);
				flag = pathPromiseTwo[0]&&!pathPromiseTwo[1];
				middle = flag?middle-1:middle;
			}else{
				//which means '/'  the root path
				flag = true;
				index = middle;
			}

		}
	}
	pathObj.existPath = pathList[index];
	return pathObj;
}

module.exports = {
	async pathWrapper(_path){
		let exist = true;
		_path = normalize(_path);
		if( _path === '' || !await pathIsExist(_path) )
			exist = false;
		return new Path(_path,exist);

	},
	normalize,
	findExistDir,
	pathIsExist
}