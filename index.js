let utils = require('./lib/utils');
let path = require('path');
let Path = require('./lib/interface/Path');
let _ = require('lodash');
let fs = require('fs');
class File {
	constructor(){

	}
	//local
	static copy(){}
	static move(){}
	static flat(){}
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
	static deleteFile(){}
	static deleteFileSync(){}
	static readFile(){}
	static readFileSync(){}
	//dir
	static mkdirSync(){}
	static mkdir(){}
	static rmdir(){}
	static rmdirSync(){}
	static rawrmdirSync(){}
	static rawrmdir(){}
	static ls(){}
	static lsSync(){}
	static ll(){}
	static llSync(){}

	static server(){}
	static watch(){}
	static append(){}
	//http
	static get(){}
	static post(){}
}

File.copy = function(source,dest){

}
//include path 
File.bfs = async function(_path){
	if(_path[_path.length-1] != path.sep){
		throw Error(`must be a dir,if you sure it's a dir,please add path.sep,in window:\\,unix:/`)
	}
	let fileAll ={};
	let dirAll = {};
	let symbolLink = {};
	let pathObj = await utils.findExistDir(new Path(_path));
	let existPath = pathObj.existPath;
	if(pathObj.absolutePath !== existPath){
		throw Error(`incorrect path:${pathObj.absolutePath},dfs must accept a exist path`);
	}
	let _list = fs.readdirSync(pathObj.absolutePath);
	let _listStat = _list.map((e,index)=>{
		return File.lstat(existPath+e).catch(function(err){
			throw err;
		})
	})
	_listStat = await Promise.all(_listStat);

	let _dirList = [];
	_list.forEach(function(e,index){
		let _key = existPath+e;
		if(_listStat[index].isDirectory()){
			_key+=path.sep
			dirAll[_key] = _list[index];
			_dirList.push(_key);
		}else if(_listStat[index].isSymbolicLink()){
			symbolLink[_key] = e;
		}else{
			fileAll[_key] = e;
		}
	});

	let resList = await Promise.all(_dirList.map((e)=>{
		return File.bfs(e);
	}));
	resList.forEach(function(e){
		fileAll = _.merge(fileAll,e.fileAll);
		dirAll = _.merge(dirAll,e.dirAll);
		symbolLink = _.merge(symbolLink,e.symbolLink)
	})
	//include _path
	dirAll[existPath] = pathObj.pathInfo.name
	return {
		fileAll,
		dirAll,
		symbolLink
	}

}

File.bfsSync = function(_path){
	if(_path[_path.length-1] != path.sep){
		throw Error(`must be a dir,if you sure it's a dir,please add path.sep,in window:\\,unix:/`)
	}
	let fileAll ={};
	let dirAll = {};
	let symbolLink = {};
	let pathObj = new Path(_path);
	let existPath = pathObj.absolutePath;
	let _list = fs.readdirSync(pathObj.absolutePath);
	let _listStat = _list.map((e,index)=>{
		return File.lstatSync(existPath+e);
	})

	let _dirList = [];
	_list.forEach(function(e,index){
		let _key = existPath+e;
		if(_listStat[index].isDirectory()){
			_key+=path.sep
			dirAll[_key] = _list[index];
			_dirList.push(_key);
		}else if(_listStat[index].isSymbolicLink()){
			symbolLink[_key] = e;
		}else{
			fileAll[_key] = e;
		}
	});

	let resList = _dirList.map((e)=>{
		return File.bfsSync(e);
	});

	resList.forEach(function(e){
		fileAll = _.merge(fileAll,e.fileAll);
		dirAll = _.merge(dirAll,e.dirAll);
		symbolLink = _.merge(symbolLink,e.symbolLink)
	})
	//include _path
	dirAll[existPath] = pathObj.pathInfo.name;
	return {
		fileAll,
		dirAll,
		symbolLink
	}
}

File.lstat = async function(_path){
	return  new Promise(function(resolve,reject){
		fs.lstat(_path,function(err,fstats){
			if(err)
				reject(err);
			resolve(fstats);
		})
	})
}

File.lstatSync = fs.lstatSync;

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

// @test delete node_modules //maybe stackoverflow?
File.rmdir = async function(_path){
	let {fileAll,dirAll,symbolLink} = await File.bfs(_path);
	//delete file 
	let fileList = Object.keys(fileAll).concat(Object.keys(symbolLink)).map(function(e){
		File.deleteFile(e);
	});
	fileList = await Promise.all(fileList);
	let dirList = Object.keys(dirAll);
	dirList.map(function(e){
		File.rawrmdir(e);
	});
	await Promise.all(dirList);
	return true;
}

File.rmdirSync = function(_path){
	let {fileAll,dirAll,symbolLink} = File.bfsSync(_path);
	let fileList = Object.keys(fileAll).concat(Object.keys(symbolLink)).map(function(e){
		File.deleteFileSync(e);
	});
	let dirList = Object.keys(dirAll);
	dirList.map(function(e){
		File.rawrmdirSync(e);
	});
	return true;
}

File.rawrmdir = async function(_path){
	return new Promise(function(resolve,reject){
		fs.rmdir(_path,function(err){
			if(err)
				reject(err);
			resolve(true);
		})
	})
}

File.rawrmdirSync = fs.rmdirSync;

File.ls = async function(_path,option){
	return new Promise(function(){
		fs.readdir(_path,option,function(err,list){
			if(err)
				reject(err)
			resolve(list);
		})
	})
}
File.lsSync = fs.readdirSync;

File.ll = async function(_path,option){
	pathObj = new Path(_path);
	let list = rawList = File.lsSync(_path,option);
	list = list.map(function(e){
		return File.lstat(pathObj.absolutePath+e);
	});
	list = await Promise.all(list);
   	list = list.map(function(e,index){
   		e = {raw:e}
   		e.name = rawList[index];
   		e.createTime = e.raw.birthtime;
   		e.modifTime = e.raw.mtime;
   		e.isDir = e.raw.isDirectory();
   		e.path = pathObj.absolutePath+rawList[index];
   		e.path = e.isDir?e.path+path.sep:e.path;
   		return e;
   	});

   	return list;
}
File.llSync = function(_path,option){
	pathObj = new Path(_path);
	let list = rawList = File.lsSync(_path,option);
	list = list.map(function(e){
		return File.lstatSync(pathObj.absolutePath+e);
	});
	
   	list = list.map(function(e,index){
   		e = {raw:e}
   		e.name = rawList[index];
   		e.createTime = e.raw.birthtime;
   		e.modifTime = e.raw.mtime;
   		e.isDir = e.raw.isDirectory();
   		e.path = pathObj.absolutePath+rawList[index];
   		e.path = e.isDir?e.path+path.sep:e.path;
   		return e;
   	});
   	
   	return list;
}

File.deleteFile = async function(_path){
	return new Promise(function(resolve,reject){
		fs.unlink(_path,function(err){
			if(err)
				reject(err);
			resolve(true);
		})
	})
}

File.deleteFileSync = fs.unlinkSync
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