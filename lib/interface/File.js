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

	//todo softlink circle
	//when search file
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

	static server(){}
	static watch(){}
	//http
	static get(){}
	static post(){}
}

module.exports = File;