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
		this.pathList = [];
		this.dirSep.reduce((one,theother)=>{
			this.pathList.push(one+path.sep);
			return one+path.sep+theother;
		});
		console.log(this.pathList)
		// todo
	}
	convToAbsoulte(pathstr){
		//append path.seq in the absolute path!
		return path.resolve(pathstr)+path.sep;
	}
}

module.exports = Path;