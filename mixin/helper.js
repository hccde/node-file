let utils = require('../lib/utils');
let path = require('path');
let Path = require('../lib/interface/Path');
let _ = require('lodash');
let fs = require('fs');
let File = require('../lib/interface/File');
let chokidar = require('chokidar');
let express = require('express');
module.exports = {
    watch:chokidar.watch,
    server:function(dir){
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
    //todo  dest should be parent dir important 
    async copy(source, dest, force = true) { //if has existed,will delete
        let sourcePathObj = new Path(source);
        let pathObj = new Path(dest);
        if(sourcePathObj.absolutePath === pathObj.absolutePath){
            await true;
            return true;
        }
        if (force == true) { //dir has existed,delete it
            try {
                await File.rmdir(dest);
            } catch (e) {
                // do nothing
            }
        }
        if (source[source.length - 1] !== path.sep) {
            
            let name = sourcePathObj.pathInfo.name + sourcePathObj.pathInfo.ext;
            await File.mkdir(dest)
            pathObj.isDir ? dest += name : void 0;
            return File.rawcopyFile(source, dest);
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
        let sourcePathObj = new Path(source);
        let pathObj = new Path(dest);
        if(sourcePathObj.absolutePath === pathObj.absolutePath){
            return true;
        }
        if (force == true) { //dir has existed,delete it
            try {
                File.rmdirSync(dest);
            } catch (e) {
                // do nothing
            }
        }
        if (source[source.length - 1] !== path.sep) {
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
    rawcopyFileSync: fs.copyFileSync,
    async move(source, dest) {
        if(new Path(source).absolutePath === 
            new Path(dest).absolutePath ){
            await true;
            return true
        }
        await File.copy(source, dest);
        let value = await File.delete(source);
        return value;
    },
    moveSync(source, dest) {
        if(new Path(source).absolutePath === 
            new Path(dest).absolutePath ){
            return true
        }
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
    }
}