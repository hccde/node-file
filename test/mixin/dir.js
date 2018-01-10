let File = require('../../index');
let fs = require('fs');
let assert = require('assert');

function dirTest() {
    describe('dirTest', function() {

        describe('File.bfs', function() {
            let correctRes = {
                fileAll: {
                    '/Users/admos/Documents/github/node-file/test/testdir/bfs/a.txt': 'a.txt',
                    '/Users/admos/Documents/github/node-file/test/testdir/bfs/one/b.txt': 'b.txt'
                },
                dirAll: {
                    '/Users/admos/Documents/github/node-file/test/testdir/bfs/': 'bfs',
                    '/Users/admos/Documents/github/node-file/test/testdir/bfs/one/': 'one',
                    '/Users/admos/Documents/github/node-file/test/testdir/bfs/one/b/': 'b'
                },
                symbolLink: {}
            };
            it('bfs dir correctly', async function() {
                let res = await File.bfs('./test/testdir/bfs/');
                assert.deepEqual(res, correctRes);
            });
            it('bfsSync dir correctly', function() {
                let res = File.bfsSync('./test/testdir/bfs/');
                assert.deepEqual(res, correctRes);
            });
        });

        describe('File.delete', function() {
            it('delete dir', async function() {
                fs.mkdirSync('./test/testdir/newdirfortest/');
                let value = await File.delete('./test/testdir/newdirfortest/');
                assert.equal(value, true);
            });

            it('delete file', async function() {
                fs.writeFileSync('./test/testdir/newfilefortest');
                let value = await File.delete('./test/testdir/newfilefortest');
                assert.equal(value, true);
            });

            it('delete no-existing dir', async function() {
                try {
                    let value = await File.delete('./test/testdir/no-existing/');
                    assert.notEqual(value, true);
                } catch (e) {

                }
            });

            it('delete no-existing file', async function() {
                try {
                    let value = await File.delete('./test/testdir/no-existing');
                    assert.notEqual(value, true);
                } catch (e) {}
            });
        });

        describe('File.search', function() {
        	let correctRes = {};
        	correctRes[process.cwd() +'/test/testdir/bfs/a.txt'] = 'a.txt';

        	it('search name',async function(){
			let res = await File.search('./test/testdir/','a.txt');

			assert.deepEqual(res,correctRes);
        	});

        	it('searchSync name ',function(){
        		let res = File.searchSync('./test/testdir/','a.txt');
				assert.deepEqual(res,correctRes);
        	});

        	it('search by using functor',async function(){
        		let res = await File.search('./test/testdir/',function(obj){
        			let allfiles = obj;
        			let keys = Object.keys(allfiles);
        			for(let i = 0;i<keys.length;i++){
        				if(keys[i].indexOf('a')){
        					let res = {};
        					return res[keys[i]] = allfiles[keys[i]];
        				}
        			}
        		});
        	});

        	it('searchSync by using functor',function(){
        		let res = File.search('./test/testdir/',function(obj){
        			let allfiles = obj;
        			let keys = Object.keys(allfiles);
        			for(let i = 0;i<keys.length;i++){
        				if(keys[i].indexOf('a')){
        					let res = {};
        					return res[keys[i]] = allfiles[keys[i]];
        				}
        			}
        		});
        	})
        });

        describe('File.mkdir',function(){
        	let correctValue = process.cwd()+'/test/testdir/mkdir/dir/'
        	it('mkdir correctly',async function(){
        		let value = await File.mkdir('./test/testdir/mkdir/dir/');
        		assert.equal(value,correctValue);
        	});
        	it('mkdirSync correctly',function(){
        		let value = File.mkdirSync('./test/testdir/mkdir/dir/');
        		assert.equal(value,correctValue);
        	});
        });

        describe('File.rmdir',function(){
        	it('rm dir correctly',async function(){
        		File.mkdirSync('./test/testdir/rmdir/dir/one/');
        		let value = await File.rmdir('./test/testdir/rmdir/');
        		assert.equal(value,true);
        	});

        	it('rmdirSync correctly ',function(){
        		File.mkdirSync('./test/testdir/rmdir/dir/one/');
        		let value = File.rmdirSync('./test/testdir/rmdir/');
        		assert.equal(value,true);
        	});
        });

        describe('File.ll',function(){
        	let correctRes = {
        		name:'one',
        		isDir:true
        	}
        	it('show file info correctly',async function(){
        		let res = await File.ll('./test/testdir/bfs/');
        		assert.deepEqual({name:res[1].name,isDir:res[1].isDir},
        			correctRes);
        		assert.equal(res.length,2);
        	});

        	it('showcorrect file info correctly',function(){
        		let res = File.llSync('./test/testdir/bfs/');
        		assert.deepEqual({name:res[1].name,isDir:res[1].isDir},
        			correctRes);
        		assert.equal(res.length,2);
        	});
        })
    });
}
module.exports = dirTest