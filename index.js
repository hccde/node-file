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
	static flat(){}
	static dfs(){}
	static bfs(){}
	static delete(){}
	//todo softlink circle
	//when search file
	static search(){}
	
	//file
	static write(){}
	static writeSync(){}
	static open(){} 
	static openSync(){}
	static writeFile(){}
	static writeFileSync(){}
	static rawWriteFile(){}
	static readFile(){}
	static readFileSync(){}
	//dir
	static mkdirSync(){}
	static mkdir(){}
	static rmdir(){}
	static rmdirSync(){}
	static ls(){}//readdir ll

	static server(){}
	static watch(){}
	static append(){}
	//http
	static get(){}
	static post(){}
}

File.copy = function(source,dest){//softlink todo

}
//todo
File.dfs = async function(){

}
File.mkdir = async function(_path,mode = 0o777){
	if(typeof _path === "string"){
		_path = await utils.pathWrapper(_path)	
	}
	if(_path instanceof Path){
		let pathObj = await utils.findExistDir(_path);
		let existPath = pathObj.existPath;
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

File.mkdirSync = function(_path,mode = 0o777){
	if(typeof _path === "string"){
		_path = new Path(_path);
	}
	if(_path instanceof Path){
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

// todo
File.rmdir = async function(_path){
	let pathObj = await utils.findExistDir(new Path(_path));
	let existPath = pathObj.existPath;
	if(pathObj.absolutePath === existPath){
		throw Error('incorrect path,rmdir must accept a exist path');
	}
	if(pathObj.isDir){
		// rmdir
	}else{
		//is file rm file
	}

}

File.open = async function(_path,flag,mode=0o666){ //open file will not create dir automatally
	return await new Promise(function(resolve,reject){
		fs.open(_path,flag,mode,function(err,fd){
			if(err)
				reject(err)
			resolve(fd)
		})
	})
}
File.openSync = fs.openSync;
// @test
File.write = async function(dest,buffer,offset,length,position){
	let fd;
	if(typeof dest === 'string'){
		let pathObj = new Path(dest.toString());
		if(pathObj.isDir){
			throw Error(`given path is a dir,cant write,if want to create dir ,please use File.mkdir`)
		}
		await File.mkdir(pathObj);
		fd = await File.open(pathObj.absolutePath,'w');
	}else if(dest instanceof Number){
		fd = dest;
	}

	if(buffer instanceof Buffer){
		return await File.rawWrite(fd,buffer,offset,length,position);
	}else{//write string  rename params
		let string = buffer,positionStr = offset,encoding = length;
		return await File.writeStr(fd,string,positionStr,encoding)
	}
}

File.writeSync = function(dest,buffer,offset,length,position){
	let fd;
	if(typeof dest === 'string'){
		let pathObj = new Path(dest.toString());
		if(pathObj.isDir){
			throw Error(`given path is a dir,cant write,if want to create dir ,please use File.mkdir`)
		}
		File.mkdirSync(pathObj);
		fd = File.openSync(pathObj.absolutePath,'w');
	}else if(dest instanceof Number){
		fd = dest;
	}

	if(buffer instanceof Buffer){
		return File.writeSync(fd,buffer,offset,length,position);
	}else{//write string  rename params
		let string = buffer,positionStr = offset,encoding = length;
		return File.writeStrSync(fd,string,positionStr,encoding)
	}
}

File.writeStr = async function(fd,string,position,encoding){
	return await new Promise(function(resolve,reject){
		fs.write(fd,string,position,encoding,function(err,written,string){
			if(err)
				reject(err)
			resolve({
				written:written,
				string:string
			})
		});
	})
}
File.writeStrSync = function(fd,string,position,encoding){
		return fs.writeSync(fd,string,position,encoding);
}

File.rawWrite = async function(fd,buffer,offset,length,position){
	return await new Promise(function(resolve,reject){
		fs.write(fd,buffer,offset,length,position,function(err,fd){
			if(err)
				reject(err)
			resolve(fd)
		})
	})
}

File.writeFile = async function(_path,_data,option){
	let fd;
	if(typeof _path === 'string'){
		let pathObj = new Path(_path.toString());
		if(pathObj.isDir){
			throw Error(`given path is a dir,cant write,if want to create dir ,please use File.mkdir`)
		}
		await File.mkdir(pathObj);
		fd = await File.open(pathObj.absolutePath,'w');
	}else if(_path instanceof Number){
		fd = dest;
	}
	return await File.rawWriteFile(_path,_data,option);
}
File.rawWriteFile = async function(_path,_data,option){
	return await new Promise(function(resolve,reject){
		fs.writeFile(_path,option,function(err){
			if(err)
				reject(err);
			resolve();
		})
	})
}

File.writeFileSync = function(_path,_data,option){
	let fd;
	if(typeof _path === 'string'){
		let pathObj = new Path(_path.toString());
		if(pathObj.isDir){
			throw Error(`given path is a dir,cant write,if want to create dir ,please use File.mkdir`)
		}
		File.mkdirSync(pathObj);
		fd = File.openSync(pathObj.absolutePath,'w');
	}else if(_path instanceof Number){
		fd = dest;
	}
	return fs.writeFileSync(_path,_data,option)
}
File.readFile= async function(_path,option){
	return await new Promise(function(resolve,reject){
		fs.readFile(_path,option,function(err,data){
			if(err)
				reject(err)
			resolve(data);
		})
	})
}
File.readFileSync = fs.readFileSync;
module.exports = File