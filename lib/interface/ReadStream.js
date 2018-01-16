let fs = require('fs');
let nativeStream = fs.ReadStream;

class ReadStream extends nativeStream{
	constructor(path,option,base = 0){
		super(path,option);
		this._count = 0;
		this.total = null;
		this.base = base;
		this.progress = 0;
		this.chunkSize = this._readableState.highWaterMark;
		if(typeof path === 'string'){
			this.total = fs.lstatSync(path).size;
			this.on('data',function(){
				this._count += 1;
				this.progress = ((this.chunkSize*this._count+this.base)/this.total).toFixed(2);
				this.progress = this.progress>1.00?1:this.progress;
			});
		}
	}
};
module.exports = ReadStream;