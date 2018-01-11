let Stream = require('./Stream');
let fs = require('fs');

class WriteStream extends Stream{
	constructor(path,option){
		super(path,option);
		if(!(this.path && this.option)){
			this._Stream = fs.createWriteStream(this.path?this.path:this.option);
		}else{
			this._Stream = fs.createWriteStream(this.path,this.option);
		}
	}
};
module.exports = WriteStream;