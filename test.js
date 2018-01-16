let File = require('./index');
let utils = require('./lib/utils');
let Path = require('./lib/interface/Path');
let path = require('path');
let process = require('process');
let fs = require('fs');

File.streamLargeFile('/Users/admos/Downloads/en_windows_xp_professional_64-bit_dvd.iso.zip',
	'/Users/admos/Downloads/en_windows_xp_professional_64-bit_dvds.iso.zip')