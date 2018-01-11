let File = require('./lib/interface/File');
let mixin = require('./lib/mixin');
let dir = require('./mixin/dir');
let file = require('./mixin/file');
let helper = require('./mixin/helper');
let url = require('./mixin/url');
let ReadStream = require('./lib/interface/ReadStream');
let WriteStream = require('./lib/interface/WriteStream');

mixin(File,dir);
mixin(File,file);
mixin(File,helper);
mixin(File,url);
File.ReadStream = ReadStream;
File.WriteStream = WriteStream;
module.exports = File;