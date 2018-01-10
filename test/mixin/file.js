let File = require('../../index');
let assert = require('assert');
let fs = require('fs');
function fileTest(){
	describe('fileTest',function(){
		describe('File.write',async function(){
			let correctRes = {
				written: 7, string: 'test me'
			};
			it('write file correctly,if have no dir ,create it',async function(){
				let res = await File.write('./test/testdir/writetest/test/a.txt','test me');
				assert.deepEqual(res,correctRes);
			});
			it('writeSync file correctly,if have no dir ,create it',function(){
				let value = File.writeSync('./test/testdir/writetest/test/a.txt','test me');
				assert.equal(value,7);
			});

			it('write dir should throw error', function(){
				assert.throws(function(){
					let res = File.writeSync('./test/testdir/writetest/test/','test me');
				},Error)
			});

			it('write buffer data',async function(){
				let value = await File.write('./test/testdir/writetest/test/a.txt',new Buffer('test me'));
				assert.equal(value,7);
			});

			it('writeSync buffer data',function(){
				let value = File.writeSync('./test/testdir/writetest/test/a.txt','test me');
				assert.equal(value,7);
			});

			it('write file by using fd',async function(){
				let fd = File.openSync('./test/testdir/writetest/test/a.txt','w');
				let value = await File.write(fd,new Buffer('test me'));
				assert.equal(value,7);
			});
		});

		describe('File.writeFile',function(){
			it('write files correctly',async function(){
				let value = await File.writeFile('./test/testdir/writetest/test/b.txt','test me');
				assert.equal(value,true);
			});

			it('writeSync file correctly',function(){
				let value = File.writeFileSync('./test/testdir/writetest/test/b.txt','test me');
				let str = fs.readFileSync('./test/testdir/writetest/test/b.txt');
				assert.equal(value,true);
				assert.equal(str.toString(),'test me');
			});

			it('write file by using buffer',async function(){
				let value = await File.writeFile('./test/testdir/writetest/test/b.txt',new Buffer('test me'));
				assert.equal(value,true);
			})
		})
	})
}
module.exports = fileTest