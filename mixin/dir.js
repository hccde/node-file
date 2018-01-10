let utils = require('../lib/utils');
let path = require('path');
let Path = require('../lib/interface/Path');
let _ = require('lodash');
let fs = require('fs');
let File = require('../lib/interface/File');

module.exports = {
    async delete(_path) { //delete file or dir
        let pathObj = new Path(_path);
        let absolutePath = pathObj.absolutePath;
        if (!pathObj.isDir) {
            //fileAll
            return await File.deleteFile(_path)
        } else {
            // dir
            return await File.rmdir(_path);
        }
    },
    deleteSync(_path) {
        let pathObj = new Path(_path);
        let absolutePath = pathObj.absolutePath;
        if (!pathObj.isDir) {
            //fileAll
            return File.deleteFileSync(_path)
        } else {
            // dir
            return File.rmdirSync(_path)
        }
    },
    async search(_path, factor) { //serach file or dir
        let {
            fileAll,
            dirAll,
            symbolLink
        } = await File.bfs(_path);
        if (typeof factor === "string") {
            let keys = Object.keys(fileAll);
            let e = '';
            for (let i = 0; i < keys.length; i++) {
                e = keys[i] ;
                if (fileAll[e]  === factor) {
                    let res = {};
                    res[e] = fileAll[e];
                    return res;
                }
            }
        } else {
            return factor(fileAll);
        }
    },
    searchSync(_path, factor) {
        let {
            fileAll,
            dirAll,
            symbolLink
        } = File.bfsSync(_path);
        if (typeof factor === "string") {
            let keys = Object.keys(fileAll);
            let e = '';
            for (let i = 0; i < keys.length; i++) {
                e = keys[i] ;
                if (fileAll[e]  === factor) {
                    let res = {};
                    res[e] = fileAll[e];
                    return res;
                }
            }
        } else {
            return factor(fileAll);
        }
    },
    //include path 
    async bfs(_path) {
        if (_path[_path.length - 1] != path.sep) {
            throw Error(`must be a dir,if you sure it's a dir,please add path.sep,in window:\\,unix:/`)
        }
        let fileAll = {};
        let dirAll = {};
        let symbolLink = {};
        let pathObj = await utils.findExistDir(new Path(_path));
        let existPath = pathObj.existPath;
        if (pathObj.absolutePath !== existPath) {
            throw Error(`incorrect path:${pathObj.absolutePath},function must accept a exist path`);
        }
        //include _path
        dirAll[existPath] = pathObj.pathInfo.name;
        let _list = fs.readdirSync(pathObj.absolutePath);
        let _listStat = _list.map((e, index) => {
            return File.lstat(existPath + e).catch(function(err) {
                throw err;
            })
        })
        _listStat = await Promise.all(_listStat);

        let _dirList = [];
        _list.forEach(function(e, index) {
            let _key = existPath + e;
            if (_listStat[index].isDirectory()) {
                _key += path.sep
                _dirList.push(_key);
            } else if (_listStat[index].isSymbolicLink()) {
                symbolLink[_key] = e;
            } else {
                fileAll[_key] = e;
            }
        });
        let resList = await Promise.all(_dirList.map((e) => {
            return File.bfs(e);
        }));
        resList.forEach(function(e) {
            fileAll = _.merge(fileAll, e.fileAll);
            dirAll = _.merge(dirAll, e.dirAll);
            symbolLink = _.merge(symbolLink, e.symbolLink)
        });
        return {
            fileAll,
            dirAll,
            symbolLink
        }

    },
    bfsSync(_path) {
        if (_path[_path.length - 1] != path.sep) {
            throw Error(`must be a dir,if you sure it's a dir,please add path.sep,in window:\\,unix:/`)
        }
        let fileAll = {};
        let dirAll = {};
        let symbolLink = {};
        let pathObj = new Path(_path);
        let existPath = pathObj.absolutePath;
        //include _path
        dirAll[existPath] = pathObj.pathInfo.name;

        let _list = fs.readdirSync(pathObj.absolutePath);
        let _listStat = _list.map((e, index) => {
            return File.lstatSync(existPath + e);
        })

        let _dirList = [];
        _list.forEach(function(e, index) {
            let _key = existPath + e;
            if (_listStat[index].isDirectory()) {
                _key += path.sep
                _dirList.push(_key);
            } else if (_listStat[index].isSymbolicLink()) {
                symbolLink[_key] = e;
            } else {
                fileAll[_key] = e;
            }
        });

        let resList = _dirList.map((e) => {
            return File.bfsSync(e);
        });

        resList.forEach(function(e) {
                fileAll = _.merge(fileAll, e.fileAll);
                dirAll = _.merge(dirAll, e.dirAll);
                symbolLink = _.merge(symbolLink, e.symbolLink)
            })
            //include _path
        dirAll[existPath] = pathObj.pathInfo.name;
        return {
            fileAll,
            dirAll,
            symbolLink
        }
    },
    async lstat(_path) {
        return new Promise(function(resolve, reject) {
            fs.lstat(_path, function(err, fstats) {
                if (err)
                    reject(err);
                resolve(fstats);
            })
        })
    },
    lstatSync: fs.lstatSync,
    async mkdir(_path, mode = 0o777) {
        if (typeof _path === "string") {
            _path = await utils.pathWrapper(_path)
        }
        if (_path instanceof Path) {
            let pathObj = await utils.findExistDir(_path);
            let existPath = pathObj.existPath;
            if (existPath.length == _path.dirSep.length) {
                return _path.absolutePath;
            }
            let index = _path.pathList.findIndex(function(e) {
                return e === existPath;
            });
            for (let i = index + 1; i < _path.pathList.length; i++) {
                fs.mkdirSync(_path.pathList[i], mode);
            }
            return _path.absolutePath;

        } else {
            await false;
            throw Error(`first param must be string or an instance of Path`)
        }
    },
    mkdirSync(_path, mode = 0o777) {
        if (typeof _path === "string") {
            _path = new Path(_path);
        }
        if (_path instanceof Path) {
            for (let i = 1; i < _path.pathList.length; i++) { //from index=1 because root path `/` can't be operated
                try {
                    fs.mkdirSync(_path.pathList[i], mode);
                } catch (e) {
                    if (e.toString().indexOf('exists') > -1)
                        continue;
                }
            }
            return _path.absolutePath;
        } else {
            throw Error(`first param must be string or an instance of Path`)
        }
    },
    rawmkdir(_path, mode = 0o777) {
        return new Promise(function(resolve, reject) {
            fs.mkdir(_path, mode, function(err) {
                if (err)
                    reject(err)
                resolve(true);
            })
        })
    },
    rawmkdirSync: fs.mkdirSync,
    // @test delete node_modules //maybe stackoverflow?
    async rmdir(_path) {
        let {
            fileAll,
            dirAll,
            symbolLink
        } = await File.bfs(_path);
        //delete file 
        let fileList = Object.keys(fileAll).concat(Object.keys(symbolLink)).map(function(e) {
            File.deleteFile(e);
        });
        fileList = await Promise.all(fileList);
        let dirList = Object.keys(dirAll);
        dirList = dirList.sort(function(a,b){//todo:async,if needed
            return a.length <= b.length;
        });
        dirList.map(function(e) {
            File.rawrmdirSync(e);
        });
        return true;
    },
    rmdirSync(_path) {
        let {
            fileAll,
            dirAll,
            symbolLink
        } = File.bfsSync(_path);
        let fileList = Object.keys(fileAll).concat(Object.keys(symbolLink)).map(function(e) {
            File.deleteFileSync(e);
        });
        let dirList = Object.keys(dirAll);
        dirList = dirList.sort(function(a,b){//todo:async,if needed
            return a.length <= b.length;
        });
        dirList.map(function(e) {
            File.rawrmdirSync(e);
        });
        return true;
    },
    async rawrmdir(_path) {
        return new Promise(function(resolve, reject) {
            fs.rmdir(_path, function(err) {
                if (err)
                    reject(err);
                resolve(true);
            })
        })
    },
    rawrmdirSync: fs.rmdirSync,
    async ls(_path, option) {
        return new Promise(function() {
            fs.readdir(_path, option, function(err, list) {
                if (err)
                    reject(err)
                resolve(list);
            })
        })
    },
    lsSync: fs.readdirSync,
    async ll(_path, option) {
        pathObj = new Path(_path);
        let list = rawList = File.lsSync(_path, option);
        list = list.map(function(e) {
            return File.lstat(pathObj.absolutePath + e);
        });
        list = await Promise.all(list);
        list = list.map(function(e, index) {
            e = {
                raw: e
            }
            e.name = rawList[index];
            e.createTime = e.raw.birthtime;
            e.modifTime = e.raw.mtime;
            e.isDir = e.raw.isDirectory();
            e.path = pathObj.absolutePath + rawList[index];
            e.path = e.isDir ? e.path + path.sep : e.path;
            return e;
        });

        return list;
    },
    llSync(_path, option) {
        pathObj = new Path(_path);
        let list = rawList = File.lsSync(_path, option);
        list = list.map(function(e) {
            return File.lstatSync(pathObj.absolutePath + e);
        });

        list = list.map(function(e, index) {
            e = {
                raw: e
            }
            e.name = rawList[index];
            e.createTime = e.raw.birthtime;
            e.modifTime = e.raw.mtime;
            e.isDir = e.raw.isDirectory();
            e.path = pathObj.absolutePath + rawList[index];
            e.path = e.isDir ? e.path + path.sep : e.path;
            return e;
        });

        return list;
    }
}