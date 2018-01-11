let Stream = require('./Stream');
let fs = require('fs');

class ReadStream extends Stream{
	constructor(path,option){
		super(path,option);
		console.log(path)
		if(!(this.path && this.option)){
			this._Stream = fs.createReadStream(this.path?this.path:this.option);
		}else{
			this._Stream = fs.createReadStream(this.path,this.option);
		}
	}
};
module.exports = ReadStream;