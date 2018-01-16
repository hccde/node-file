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
	async ftpGet(path,dest,option){//dir todo
		if(typeof dest === 'object'){
			option = dest;
			dest = void 0;
		}
		new Promise(function(reslove,reject){
			let c = new Client();
			let name = path.split('/').pop();
			c.on('ready', function() {
	    		c.get(path, function(err, stream){
	      			if (err){
	      				reject(err);
	      			}
	      			stream.once('close', function() { c.end(); });
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
	      			stream.pipe(fs.createWriteStream(dest));
	    		});
	  		});
  			c.connect(option);
		})
	},
	async ftpUpload(){//dir  unixtime modif

	}
}