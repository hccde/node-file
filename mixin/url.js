let utils = require('../lib/utils');
let path = require('path');
let Path = require('../lib/interface/Path');
let _ = require('lodash');
let fs = require('fs');
let File = require('../lib/interface/File');
let request = require('request');
const { URL } = require('url');

module.exports = {
	async get(url,dest){
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
				console.log(err);
				reject(err)
				}).on('finish',function(){
					console.log('finish')
					reslove(true)
				})
			,dest);
		});
		return true;
	}
}