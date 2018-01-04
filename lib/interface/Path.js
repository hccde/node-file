const path = require('path');
const utils = require('../utils');
class Path {
	constructor(pathstr,exist){
		this.pathInfo = path.parse(pathstr);
		this.rawPath = pathstr;
		this.exist = exist;
		this.isAbsolute = path.isAbsolute(pathstr);
		this.absolutePath = this.isAbsolute?pathstr:this.convToAbsoulte(pathstr);
		this.dirSep =  this.absolutePath.split(path.sep);
		// todo
	}
	convToAbsoulte(pathstr){
		return path.resolve(pathstr);
	}
}

module.exports = Path;