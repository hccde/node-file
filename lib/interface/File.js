let ReadStream = require('./ReadStream');
let WriteStream = require('./WriteStream');
class File {
	constructor(){
	}
	//local
	static copy(){}
	static copySync(){}
	static rawcopyFile(){}
	static rawcopyFileSync(){}
	static merge(){}
	static move(){}
	static flat(){}
	static bfs(){}
	static delete(){}
	static mergeSync(){}
	static moveSync(){}
	static flatSync(){}
	static bfsSync(){}
	static deleteSync(){}
	static search(){}
	static searchSync(){}
	
	//file
	static write(){}
	static writeSync(){}
	static open(){} 
	static openSync(){}
	static close(){}
	static closeSync(){}
	static writeFile(){}
	static writeFileSync(){}
	static rawWriteFile(){}
	static deleteFile(){}
	static deleteFileSync(){}
	static readFile(){}
	static readFileSync(){}
	static appendFile(){}
	static appendFileSync(){}
	static streamCopy(){}
	static streamLargeFile(){} 
	static splitFile(){}//todo
	//dir
	static mkdirSync(){}
	static mkdir(){}
	static rmdir(){}
	static rmdirSync(){}
	static rawrmdirSync(){}
	static rawrmdir(){}
	static rawmkdir(){}
	static rawrmdirSync(){}
	static ls(){}
	static lsSync(){}
	static ll(){}
	static llSync(){}
	//stream
	// readStream
	//filewatcher
	static server(){}
	static watch(){}
	//http
	static httpGet(){}
	static httpPost(){}
	//ftp
	static ftpUploadFile(){}
	static ftpGet(){}
	static ftpUpload(){}
	static ftpRmdir(){}
	static ftpMkdir(){}
	static ftpGetFile(){}
	static ftpLogin(){}
	static ftpIsDir(){}
	static ftpDir(){}
	static ftpBfs(){}
	static ftpLogin(){}
	static ftpLogin(){}
}
File.ReadStream = ReadStream;
module.exports = File;