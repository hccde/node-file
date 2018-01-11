let fs = require('fs');
let nativeStream = fs.ReadStream;

class ReadStream extends nativeStream{
	constructor(path,option){
		super(path,option);
	}
};
module.exports = ReadStream;