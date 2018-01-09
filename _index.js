let utils = require('./lib/utils');
let path = require('path');
let mixin = require('./lib/mixin.js');
let Path = require('./lib/interface/Path');
let _ = require('lodash');
let fs = require('fs');
class File {
	constructor(){

	}
	//local
	static copy(){}
	static copySync(){}
	static rawcopyFile(){}
	static rawcopyFileSync(){}
	static merge(){}
	static move(){}
	static flat(){}
	static bfs(){}
	static delete(){}
	static mergeSync(){}
	static moveSync(){}
	static flatSync(){}
	static bfsSync(){}
	static deleteSync(){}

	//todo softlink circle
	//when search file
	static search(){}
	static searchSync(){}
	
	//file
	static write(){}
	static writeSync(){}
	static open(){} 
	static openSync(){}
	static close(){}
	static closeSync(){}
	static writeFile(){}
	static writeFileSync(){}
	static rawWriteFile(){}
	static deleteFile(){}
	static deleteFileSync(){}
	static readFile(){}
	static readFileSync(){}
	static appendFile(){}
	static appendFileSync(){}
	// static write
	//dir
	static mkdirSync(){}
	static mkdir(){}
	static rmdir(){}
	static rmdirSync(){}
	static rawrmdirSync(){}
	static rawrmdir(){}
	static rawmkdir(){}
	static rawrmdirSync(){}
	static ls(){}
	static lsSync(){}
	static ll(){}
	static llSync(){}

	static server(){}
	static watch(){}
	//http
	static get(){}
	static post(){}
}
//merge tow files
File.merge = async function(dest,source){
	let destPathObj = new Path(dest);
	if(!destPathObj.isDir){
		throw Error(`merge target must be dir`);
	}
	return await File.copy(source,dest,false);
}
File.mergeSync = function(dest,source){

}
//todo sigle file 
File.copy = async function(source,dest,force = true){//if has existed,will delete
	let pathObj = new Path(dest);
	if(force == true){//dir has existed,delete it
		try{
			await File.rmdir(dest);
		}catch(e){
			// do nothing
		}
	}
	if(source[source.length-1] !== path.sep){
		let sourcePathObj = new Path(source);
		let name = sourcePathObj.pathInfo.name+sourcePathObj.pathInfo.ext;
		await File.mkdir(dest)
		pathObj.isDir?dest += name:void 0;
		return await File.rawcopyFile(source,dest);
	}
	let rootstr = '';
	let {fileAll,dirAll,symbolLink} = await File.bfs(source);
	let dirList = Object.keys(dirAll)
	dirList.map(function(e,index){
		if(index === 0){
			rootstr = e;
		}
		if(force){
			fs.mkdirSync(pathObj.absolutePath + Path.convToRelative(rootstr,e));
		}else{
			File.mkdirSync(pathObj.absolutePath + Path.convToRelative(rootstr,e))
		}
	});

	//cp file
	_.merge(fileAll,symbolLink);

	let fileList = Object.keys(fileAll).map(function(e){
		File.rawcopyFile(e,pathObj.absolutePath + Path.convToRelative(rootstr,e));
	});
	await Promise.all(fileList);
	return true;
}
File.copySync = function(source,dest,force = true){
	let pathObj = new Path(dest);
	if(force == true){//dir has existed,delete it
		try{
			File.rmdirSync(dest);
		}catch(e){
			// do nothing
		}
	}
	if(source[source.length-1] !== path.sep){
		let sourcePathObj = new Path(source);
		let name = sourcePathObj.pathInfo.name+sourcePathObj.pathInfo.ext;
		File.mkdirSync(dest)
		pathObj.isDir?dest += name:void 0;
		return File.rawcopyFileSync(source,dest);
	}
	let rootstr = '';
	let {fileAll,dirAll,symbolLink} = File.bfsSync(source);
	let dirList = Object.keys(dirAll)
	dirList.map(function(e,index){
		if(index === 0){
			rootstr = e;
		}
		if(force){
			fs.mkdirSync(pathObj.absolutePath + Path.convToRelative(rootstr,e));
		}else{
			File.mkdirSync(pathObj.absolutePath + Path.convToRelative(rootstr,e))
		}
	});

	//cp file
	_.merge(fileAll,symbolLink);

	let fileList = Object.keys(fileAll).map(function(e){
		File.rawcopyFileSync(e,pathObj.absolutePath + Path.convToRelative(rootstr,e));
	});
	return true;
}

File.rawcopyFile = async function(src,dest,flags=0){
	return new Promise(function(resolve,reject){
		fs.copyFile(src,dest,flags,function(err){
			if(err)
				reject(err)
			resolve(true);
		})
	})
}

File.rawcopyFileSync = fs.copyFile;

File.move = async function(source,dest){
	await File.copy(source,dest);
	return await File.delete(source);
}

File.moveSync = async function(source,dest){
	File.copySync(source,dest);
	File.deleteSync(source);
	return true;
}

File.flat = async function(_path){
	let flatList = [];
	let pathObj = await utils.findExistDir(new Path(_path));
	if(pathObj.absolutePath !== pathObj.existPath){
		throw Error(`incorrect path:${pathObj.absolutePath},flat must accept a exist path`);	
	}
	let {fileAll,dirAll,symbolLink} = await File.bfs(_path);
	fileAll = _.merge(fileAll,symbolLink)
	let fileList = Object.keys(fileAll);
	let res = [];
	fileList.map(function(e,index){
		let flag = res.find(function(el){
			return el === fileAll[e];
		});
		flag !== void 0 ?res.push(e):res.push(fileAll[e]);
	});
	return res;
}
File.flatSync = function(_path){
	let flatList = [];
	// let pathObj = await utils.findExistDir(new Path(_path));
	// if(pathObj.absolutePath !== pathObj.existPath){
	// 	throw Error(`incorrect path:${pathObj.absolutePath},flat must accept a exist path`);	
	// }
	let {fileAll,dirAll,symbolLink} = File.bfsSync(_path);
	fileAll = _.merge(fileAll,symbolLink)
	let fileList = Object.keys(fileAll);
	let res = [];
	fileList.map(function(e,index){
		let flag = res.find(function(el){
			return el === fileAll[e];
		});
		flag !== void 0 ?res.push(e):res.push(fileAll[e]);
	});
	return res;
}
File.search = async function(_path,factor){//serach file or dir
	let {fileAll,dirAll,symbolLink} = await File.bfs(_path);
	if(typeof factor === "string"){
		let keys = Object.keys(fileAll);
		for(let i = 0;i<keys.length;i++){
			if(fileAll[e] === name){
				return {
					e:fileAll[e]
				}
			}
		}
	}else{
		return factor(fileAll);
	}
}

File.searchSync = function(_path,factor){
	let {fileAll,dirAll,symbolLink} = File.bfsSync(_path);
	if(typeof factor === "string"){
		let keys = Object.keys(fileAll);
		for(let i = 0;i<keys.length;i++){
			if(fileAll[e] === name){
				return {
					e:fileAll[e]
				}
			}
		}
	}else{
		return factor(fileAll);
	}
}
/////////////
File.delete = async function(_path){//delete file or dir
	let pathObj = new Path(_path);
	let absolutePath = pathObj.absolutePath;
	if(!pathObj.isDir){
		//fileAll
		return await File.deleteFile(_path)
	}else{
		// dir
		return await File.rmdir(_path)
	}
}
File.deleteSync = function(_path){
	let pathObj = new Path(_path);
	let absolutePath = pathObj.absolutePath;
	if(!pathObj.isDir){
		//fileAll
		return File.deleteFileSync(_path)
	}else{
		// dir
		return File.rmdirSync(_path)
	}
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
		throw Error(`incorrect path:${pathObj.absolutePath},bfs must accept a exist path`);
	}
	//include _path
	dirAll[existPath] = pathObj.pathInfo.name;
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
	});
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
	//include _path
	dirAll[existPath] = pathObj.pathInfo.name;

	let _list = fs.readdirSync(pathObj.absolutePath);
	let _listStat = _list.map((e,index)=>{
		return File.lstatSync(existPath+e);
	})

	let _dirList = [];
	_list.forEach(function(e,index){
		let _key = existPath+e;
		if(_listStat[index].isDirectory()){
			_key+=path.sep
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
File.rawmkdir = function(_path,mode=0o777){
	return new Promise(function(resolve,reject){
		fs.mkdir(_path,mode,function(err){
			if(err)
				reject(err)
			resolve(true);
		})
	})
}
File.rawmkdirSync = fs.mkdirSync;
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
File.close = async function(fd){
	return new Promise(function(resolve,reject){
		fs.close(fs,function(err){
			if(err)
				reject(err)
			resolve(true);
		})
	})
}
File.closeSync = fs.closeSync;
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

File.watch = function(){
	//todo
}
let dir = require('./mixin/dir.js');
mixin(File,dir)
module.exports = File