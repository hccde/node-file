let utils = require('../lib/utils');
let path = require('path');
let Path = require('../lib/interface/Path');
let _ = require('lodash');
let fs = require('fs');
let File = require('../lib/interface/File');

module.exports = {
    watch() {
        //todo
    },
    async merge(dest, source) {
        let destPathObj = new Path(dest);
        if (!destPathObj.isDir) {
            throw Error(`merge target must be dir`);
        }
        return await File.copy(source, dest, false);
    },
    mergeSync(dest, source) {
        let destPathObj = new Path(dest);
        if (!destPathObj.isDir) {
            throw Error(`merge target must be dir`);
        }
        return File.copySync(source, dest, false);
    },
    async copy(source, dest, force = true) { //if has existed,will delete
        let pathObj = new Path(dest);
        if (force == true) { //dir has existed,delete it
            try {
                await File.rmdir(dest);
            } catch (e) {
                // do nothing
            }
        }
        if (source[source.length - 1] !== path.sep) {
            let sourcePathObj = new Path(source);
            let name = sourcePathObj.pathInfo.name + sourcePathObj.pathInfo.ext;
            await File.mkdir(dest)
            pathObj.isDir ? dest += name : void 0;
            return await File.rawcopyFile(source, dest);
        }
        let rootstr = '';
        let {
            fileAll,
            dirAll,
            symbolLink
        } = await File.bfs(source);
        let dirList = Object.keys(dirAll)
        dirList.map(function(e, index) {
            if (index === 0) {
                rootstr = e;
            }
            if (force) {
                fs.mkdirSync(pathObj.absolutePath + Path.convToRelative(rootstr, e));
            } else {
                File.mkdirSync(pathObj.absolutePath + Path.convToRelative(rootstr, e))
            }
        });

        //cp file
        _.merge(fileAll, symbolLink);

        let fileList = Object.keys(fileAll).map(function(e) {
            File.rawcopyFile(e, pathObj.absolutePath + Path.convToRelative(rootstr, e));
        });
        await Promise.all(fileList);
        return true;
    },
    copySync(source, dest, force = true) {
        let pathObj = new Path(dest);
        if (force == true) { //dir has existed,delete it
            try {
                File.rmdirSync(dest);
            } catch (e) {
                // do nothing
            }
        }
        if (source[source.length - 1] !== path.sep) {
            let sourcePathObj = new Path(source);
            let name = sourcePathObj.pathInfo.name + sourcePathObj.pathInfo.ext;
            File.mkdirSync(dest)
            pathObj.isDir ? dest += name : void 0;
            return File.rawcopyFileSync(source, dest);
        }
        let rootstr = '';
        let {
            fileAll,
            dirAll,
            symbolLink
        } = File.bfsSync(source);
        let dirList = Object.keys(dirAll)
        dirList.map(function(e, index) {
            if (index === 0) {
                rootstr = e;
            }
            if (force) {
                fs.mkdirSync(pathObj.absolutePath + Path.convToRelative(rootstr, e));
            } else {
                File.mkdirSync(pathObj.absolutePath + Path.convToRelative(rootstr, e))
            }
        });

        //cp file
        _.merge(fileAll, symbolLink);

        let fileList = Object.keys(fileAll).map(function(e) {
            File.rawcopyFileSync(e, pathObj.absolutePath + Path.convToRelative(rootstr, e));
        });
        return true;
    },
    async rawcopyFile(src, dest, flags = 0) {
        return new Promise(function(resolve, reject) {
            fs.copyFile(src, dest, flags, function(err) {
                if (err)
                    reject(err)
                resolve(true);
            })
        })
    },
    rawcopyFileSync: fs.copyFile,
    async move(source, dest) {
        await File.copy(source, dest);
        return await File.delete(source);
    },
    async moveSync(source, dest) {
        File.copySync(source, dest);
        File.deleteSync(source);
        return true;
    },
    async flat(_path) {
        let flatList = [];
        let pathObj = await utils.findExistDir(new Path(_path));
        if (pathObj.absolutePath !== pathObj.existPath) {
            throw Error(`incorrect path:${pathObj.absolutePath},flat must accept a exist path`);
        }
        let {
            fileAll,
            dirAll,
            symbolLink
        } = await File.bfs(_path);
        fileAll = _.merge(fileAll, symbolLink)
        let fileList = Object.keys(fileAll);
        let res = [];
        fileList.map(function(e, index) {
            let flag = res.find(function(el) {
                return el === fileAll[e];
            });
            flag !== void 0 ? res.push(e) : res.push(fileAll[e]);
        });
        return res;
    },
    flatSync(_path) {
        let flatList = [];
        // let pathObj = await utils.findExistDir(new Path(_path));
        // if(pathObj.absolutePath !== pathObj.existPath){
        // 	throw Error(`incorrect path:${pathObj.absolutePath},flat must accept a exist path`);	
        // }
        let {
            fileAll,
            dirAll,
            symbolLink
        } = File.bfsSync(_path);
        fileAll = _.merge(fileAll, symbolLink)
        let fileList = Object.keys(fileAll);
        let res = [];
        fileList.map(function(e, index) {
            let flag = res.find(function(el) {
                return el === fileAll[e];
            });
            flag !== void 0 ? res.push(e) : res.push(fileAll[e]);
        });
        return res;
    },
    async search(_path, factor) { //serach file or dir
        let {
            fileAll,
            dirAll,
            symbolLink
        } = await File.bfs(_path);
        if (typeof factor === "string") {
            let keys = Object.keys(fileAll);
            for (let i = 0; i < keys.length; i++) {
                if (fileAll[e] === name) {
                    return {
                        e: fileAll[e]
                    }
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
            for (let i = 0; i < keys.length; i++) {
                if (fileAll[e] === name) {
                    return {
                        e: fileAll[e]
                    }
                }
            }
        } else {
            return factor(fileAll);
        }
    }
}