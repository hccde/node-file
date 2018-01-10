let utils = require('../lib/utils');
let path = require('path');
let Path = require('../lib/interface/Path');
let _ = require('lodash');
let fs = require('fs');
let File = require('../lib/interface/File');

module.exports = {
async deleteFile(_path){
	return new Promise(function(resolve,reject){
		fs.unlink(_path,function(err){
			if(err)
				reject(err);
			resolve(true);
		})
	})
},
deleteFileSync : fs.unlinkSync,
async open(_path,flag,mode=0o666){ //open file will not create dir automatally
	return await new Promise(function(resolve,reject){
		fs.open(_path,flag,mode,function(err,fd){
			if(err)
				reject(err)
			resolve(fd)
		})
	})
},
openSync: fs.openSync,
async close(fd){
	return new Promise(function(resolve,reject){
		fs.close(fs,function(err){
			if(err)
				reject(err)
			resolve(true);
		})
	})
},
closeSync:fs.closeSync,
async write(dest,buffer,offset,length,position){
	let fd;
	if(typeof dest === 'string'){
		let pathObj = new Path(dest.toString());
		if(pathObj.isDir){
			throw Error(`given path is a dir,cant write,if want to create dir ,please use File.mkdir`)
		}
		await File.mkdir(pathObj);
		fd = await File.open(pathObj.absolutePath,'w');
	}else if(typeof dest === 'number'){
		fd = dest;
	}
	if(buffer instanceof Buffer){
		return await File.rawWrite(fd,buffer,offset,length,position);
	}else{//write string  rename params
		let string = buffer,positionStr = offset,encoding = length;
		return await File.writeStr(fd,string,positionStr,encoding)
	}
},
writeSync(dest,buffer,offset,length,position){
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
		return fs.writeSync(fd,buffer,offset,length,position);
	}else{//write string  rename params
		let string = buffer,positionStr = offset,encoding = length;
		return File.writeStrSync(fd,string,positionStr,encoding)
	}
},
async writeStr(fd,string,position,encoding){
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
},
writeStrSync(fd,string,position,encoding){
		return fs.writeSync(fd,string,position,encoding);
},
async rawWrite(fd,buffer,offset,length,position){
	return await new Promise(function(resolve,reject){
		fs.write(fd,buffer,offset,length,position,function(err,fd){
			if(err)
				reject(err)
			resolve(fd)
		})
	})
},
async writeFile(_path,_data,option){
	let fd;
	if(typeof _path === 'string'){
		let pathObj = new Path(_path.toString());
		if(pathObj.isDir){
			throw Error(`given path is a dir,cant write,if want to create dir ,please use File.mkdir`)
		}
		await File.mkdir(pathObj);
		fd = await File.open(pathObj.absolutePath,'w');
	}else if(typeof fd  === 'number'){
		fd = dest;
	}
	return await File.rawWriteFile(fd,_data,option);
},
async rawWriteFile(_path,_data,option){
	return new Promise(function(resolve,reject){
		fs.writeFile(_path,_data,option,function(err){
			if(err)
				reject(err);
			resolve(true);
		})
	})
},
writeFileSync(_path,_data,option){
	let fd;
	if(typeof _path === 'string'){
		let pathObj = new Path(_path.toString());
		if(pathObj.isDir){
			throw Error(`given path is a dir,cant write,if want to create dir ,please use File.mkdir`)
		}
		File.mkdirSync(pathObj);
		fd = File.openSync(pathObj.absolutePath,'w');
	}else if(typeof _path === 'number'){
		fd = dest;
	}
	fs.writeFileSync(fd,_data,option);
	return true;
},
async readFile(_path,option){
	return await new Promise(function(resolve,reject){
		fs.readFile(_path,option,function(err,data){
			if(err)
				reject(err)
			resolve(data);
		})
	})
},
readFileSync:fs.readFileSync
}