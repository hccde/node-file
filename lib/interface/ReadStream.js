let fs = require('fs');
let nativeStream = fs.ReadStream;

class ReadStream extends nativeStream{
	constructor(path,option){
		super(path,option);
		this._count = 0;
		this.total = null;
		this.progress = 0;
		this.chunkSize = this._readableState.highWaterMark;
		if(typeof path === 'string'){
			this.total = fs.lstatSync(path).size;
			this.on('data',function(){
				this._count += 1;
				this.progress = this.chunkSize*this._count/stream.total;
			});
		}
	}
};
module.exports = ReadStream;