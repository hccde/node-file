
let fs = require('fs');
let index = 0;
let streamList = [];
//debug
global.streamList = streamList
class Stream {
	constructor(_path,option){
		if(_path&&option&&option.fd !== null){
			throw Error('its not a good idea to have path and fd at the same time');
		}
		this.option = option;
		if(typeof _path === 'string'){
			let fileInfo = fs.lstatSync(_path);
			this.path = _path;
			this.lastModif = fileInfo.mtimeMs;
			this.size = fileInfo.size/1024;
		}else{
			this.fd = _path.fd;
		}
		//child-class will init it
		this._Stream = void 0;
		streamList.push({
			content:this,
			count:index++
		});
	}

	on(type,cb){
		this._Stream.on(type,cb);
	}
}

module.exports = Stream