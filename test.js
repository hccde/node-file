let File = require('./index');
let utils = require('./lib/utils');
let Path = require('./lib/interface/Path');
let path = require('path');
let process = require('process');
let fs = require('fs');
let stream = File.streamCopy('./example.txt','./examplewrite.txt');