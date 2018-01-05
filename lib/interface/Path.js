const path = require('path');
const utils = require('../utils');
class Path {
	constructor(pathstr,exist){
		this.pathInfo = path.parse(pathstr);
		this.pathInfo.dir+=path.sep
		this.rawPath = pathstr;
		this.exist = exist;
		this.isAbsolute = path.isAbsolute(pathstr);
		this.absolutePath = this.isAbsolute?pathstr:this.convToAbsoulte(pathstr);
		this.isDir = this.rawPath[this.rawPath.length-1] === path.sep;
		this.absolutePath = this.isDir?this.absolutePath+path.sep:this.absolutePath;
		this.dirSep =  this.absolutePath.split(path.sep);
		this.pathList = [];
		this.existPath = '';
		this.softlinkList = [];
		this.linkFilePath ='';
		this.isSoftlink = false;
		this.dirSep.reduce((one,theother)=>{
			this.pathList.push(one+path.sep);
			return one+path.sep+theother;
		});
	}
	convToAbsoulte(pathstr){
		return path.resolve(pathstr);
	}
}

module.exports = Path;