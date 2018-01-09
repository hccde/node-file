let File = require('./lib/interface/File');
let mixin = require('./lib/mixin');
let dir = require('./mixin/dir');
let file = require('./mixin/file');
let helper = require('./mixin/helper');
let url = require('./mixin/url');
mixin(File,dir);
mixin(File,file);
mixin(File,helper);
mixin(File,url);

module.exports = File;