let utils = require('../lib/utils');
let path = require('path');
let Path = require('../lib/interface/Path');
let _ = require('lodash');
let fs = require('fs');
let File = require('../lib/interface/File');
let request = require('request');
const { URL } = require('url');
var Client = require('ftp');

module.exports = {
	async httpGet(url,dest){
		let _url = new URL(url);
		let name = _url.pathname.split('/').pop();
		if(dest === void 0){
			dest = './' + name;
		}
		try{
			if(fs.lstatSync(dest).isDirectory()){
				dest +='/'+name;
			}
		}catch(e){
			//do nothing
		}
		await new Promise(function(reslove,reject){
			File.streamLargeFile(request.get(url).on('error',function(err){
				File.deleteSync(dest);
				console.log(err);
				reject(err)
				}).on('finish',function(){
					console.log('finish')
					reslove(true)
				})
			,dest);
		});
		return true;
	},
	async httpPost(url,formData){
		await new Promise(function(reslove,reject){
			request.post({
				url:url,
				formData:formData
			},function(err,res,body){
				if(err)
					reject(err)
				reslove(res);

			})
		})
	},
	async ftpIsDir(path,connect){
		let c;
		if(connect instanceof Client){
			c = connect
		}else{
			c = await File.ftpLogin(connect);
		}
		let isDir =  await new Promise(function(reslove,reject){
			c.list(path,function(err,list){
				if(err)
					reject(false)
				reslove(true);

			});
		});
		if(connect !== c)
			c.end();
		return isDir;
	},
	async ftpDir(path,connect){
		let c;
		if(connect instanceof Client){
			c = connect
		}else{
			c = await File.ftpLogin(connect);
		}
		let list =  await new Promise(function(reslove,reject){
			c.list(path,function(err,list){
				if(err)
					reject(err)
				reslove(list);

			});
		});
		if(connect !== c)
			c.end();
		return list;
	},
	async ftpBfs(_path,connect){
		_path = Path.rmTail(_path);
		let c,fileAll={},dirAll={},symbolLink={};
		if(connect instanceof Client){
			c = connect
		}else{
			c = await File.ftpLogin(connect);
		}
		let pathInfo = await File.ftpDir(_path,c);
		pathInfo.forEach(function(e){
			if(e.type === 'd'){
				dirAll[_path+'/'+e.name] = e.name;
			}else if(e.type === '-'){
				fileAll[_path+'/'+e.name] = e.name;
			}else{
				symbolLink[_path+'/'+e.name] = e.name;
			}
		});
		let infoList = []
		infoList = Object.keys(dirAll).map(function(e){
			return File.ftpBfs(e,c); 
		});
		infoList = await Promise.all(infoList);
		infoList.forEach(function(e){
			_.merge(fileAll,e.fileAll);
			_.merge(dirAll,e.dirAll);
			_.merge(symbolLink,e.symbolLink);
		});
		if(connect !== c)
			c.end();
		return {
			fileAll:fileAll,
			dirAll:dirAll,
			symbolLink:symbolLink
		}
	},
	async ftpLogin(option){
		return await new Promise(function(reslove,reject){
			let c = new Client();
			c.on('ready',function(){
				reslove(c);
			});
			c.on('error',function(err){
				reject(err);
			})
  			c.connect(option);
		});
	},
	async ftpGetFile(_path,dest,connect){
		_path = Path.rmTail(_path);
		let c;
		if(typeof dest === 'object'){
			connect = dest;
			dest = '.';
		}
		if(connect instanceof Client){
			c = connect;
		}else{
			c = await File.ftpLogin(connect);
		}
		await new Promise(function(reslove,reject){
			let name = _path.split('/').pop();
	    	c.get(_path, function(err, stream){
	      		if (err){
	      			reject(err);
	      		}
	      		stream.once('close', function() { c.end(); reslove(true)});
	      		if(dest === void 0){
					dest = './' + name;
				}
				try{
					if(fs.lstatSync(dest).isDirectory()){
						dest +='/'+name;
					}
				}catch(e){
					// do nothing
				}
	      		stream.pipe(fs.createWriteStream('ws_ftp/ws_ftple.exe'));
	    	});
		});

		if(connect !== c)
			c.end();
		return true;
	},
	async ftpGet(_path,dest,connect){//dir todo
		_path = Path.rmTail(_path);
		let c;
		if(typeof dest === 'object'){
			connect = dest;
			dest = '.';
		}
		if(connect instanceof Client){
			c = connect;
		}else{
			c = await File.ftpLogin(connect);
		}
		let {dirAll,fileAll,symbolLink} = await File.ftpBfs(_path,c);
		let name = '';
		if(await File.ftpIsDir(path,c)){
			name = _path.split('/').pop();
			console.log(name)
			File.mkdirSync(name+'/');
		}
		let dirList = Object.keys(dirAll);
		let fileList = Object.keys( _.merge(fileAll,symbolLink) );
		for(let i = 0;i<dirList.length;i++){
			let relative = Path.convToRelative(_path,dirList[i]);
			console.log(name+relative)
			File.mkdirSync(name+relative);//todo mkdir need to fixed
		}
		let promiseList = fileList.map(function(e){
			let relative = Path.convToRelative(_path,e);
			let d = name+relative;
			return File.ftpGetFile(e,d,c);
		});
		promiseList = await Promise.all(promiseList);
		if(connect !== c)
			c.end();
		return true;
	},
	async ftpMkdir(_path,connect){
		_path = Path.rmTail(_path);
		let c;
		if(typeof dest === 'object'){
			connect = dest;
			dest = '.';
		}
		if(connect instanceof Client){
			c = connect;
		}else{
			c = await File.ftpLogin(connect);
		}
		await new Promise(function(reslove,reject){
			c.mkdir(_path,true,function(err){
				if(err)
					reject(err)
				reslove(true);
			})
		})
		if(connect !== c)
			c.end();
		return true;
	},
	async ftpRmdir(_path,connect){
		_path = Path.rmTail(_path);
		let c;
		if(typeof dest === 'object'){
			connect = dest;
			dest = '.';
		}
		if(connect instanceof Client){
			c = connect;
		}else{
			c = await File.ftpLogin(connect);
		}
		await new Promise(function(reslove,reject){
			c.rmdir(_path,true,function(err){
				if(err)
					reject(err)
				reslove(true);
			})
		})
		if(connect !== c)
			c.end();
		return true;
	},
	//todo single file
	// async ftpHasFile(_path,connect){

	// },
	// async ftpUploadFileStream(){

	// },
	// async ftpGetFileStream(){

	// }
	async ftpUploadFile(src,dest,connect){
		let c;
		if(typeof dest === 'object'){
			connect = dest;
			dest = '.';
		}
		if(connect instanceof Client){
			c = connect;
		}else{
			c = await File.ftpLogin(connect);
		}
		await new Promise(function(reslove,reject){
			//do nothing
			c.put(src,dest,function(err){
				if(err)
					reject(err)
				reslove(true);
			})
		})
		if(connect !== c)
			c.end();
		return true;
	},
	async ftpUpload(src,dest,connect){//dir  unixtime modif
		let c;
		if(typeof dest === 'object'){
			connect = dest;
			dest = '.';
		}
		if(connect instanceof Client){
			c = connect;
		}else{
			c = await File.ftpLogin(connect);
		}
		let pathList = new Path(src).absolutePath.split(path.sep);
		let name = pathList.pop();
		if( !fs.lstatSync(src).isDirectory() ){
			await File.ftpUploadFile(src,dest+path.sep+name,c);
			if(connect !== c)
				c.end();
			return true;
		}
		let rootpath = pathList.join(path.sep);
		//rm dir bfs localfile 
		let resList = await Promise.all([File.bfs(src),
			File.ftpRmdir(dest+path.sep+rootpath,c).catch(function(e){
			//do nothing
			})]);
		let { dirAll,fileAll,symbolLink } = resList[0];
		let dirList = Object.keys(dirAll);
		for(let i = 0;i<dirList.length;i++){
			await File.ftpMkdir(dest+path.sep+Path.convToRelative(rootpath,dirList[i]),c);
		}
		let fileList = Object.keys(_.merge(fileAll,symbolLink));

		let fileListPro = fileList.map(function(e){
			File.ftpUploadFile(e,dest+path.sep+Path.convToRelative(rootpath,e),c);
		})
		await Promise.all(fileListPro);
		if(connect !== c)
			c.end();
		return true;
	}
}