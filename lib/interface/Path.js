const path = require('path');
const utils = require('../utils');
class Path {
	constructor(pathstr,exist){
		this.pathInfo = path.parse(pathstr);
		this.pathInfo.dir+=path.sep
		this.rawPath = pathstr;
		this.exist = exist;
		this.isAbsolute = path.isAbsolute(pathstr);
		this.absolutePath = this.isAbsolute?pathstr:Path.convToAbsoulte(pathstr);
		this.isDir = this.rawPath[this.rawPath.length-1] === path.sep;
		this.absolutePath = this.isDir&&this.absolutePath[this.absolutePath.length-1] !== path.sep
							?this.absolutePath+path.sep:this.absolutePath;
		this.dirSep =  this.absolutePath.split(path.sep);
		this.pathList = [];
		this.existPath = '';
		// this.softlinkList = [];
		// this.linkFilePath ='';
		// this.isSoftlink = false;
		this.dirSep.reduce((one,theother)=>{
			this.pathList.push(one+path.sep);
			return one+path.sep+theother;
		});
	}
	static convToAbsoulte(pathstr){
		return path.resolve(pathstr);
	}
	static convToRelative(rootstr,pathstr){
		if(pathstr.indexOf(rootstr) === -1){
			throw Error('cant convert');
		}
		pathstr = pathstr.replace(rootstr,'');
		return pathstr
	}
	static rmTail(_path){
		_path = _path.trim();
		if(_path[_path.length-1] === '/' || _path[_path.length-1] === '\\'){
			let patharr = _path.split('');
			patharr.pop();
			_path = patharr.join('');
		}
		return _path;
	}
}

module.exports = Path;