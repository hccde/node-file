let fs = require('fs');
let nativeStream = fs.WriteStream;

class WriteStream extends nativeStream{
	constructor(path,option){
		super(path,option);
	}
};
module.exports = WriteStream;