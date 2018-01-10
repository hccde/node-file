let File = require('../../index');
let utils = require('../../lib/utils');
let assert = require('assert');
let fs = require('fs');

function helperTest(){
	describe('helperTest',function(){
		let correctRes = File.bfsSync('./test/testdir/copydir/');
		let correctList = Object.keys(correctRes.fileAll).map(function(e){
			return correctRes.fileAll[e];
		});
		describe('File.copy',function(){
			it('copy correctly',function(){
				let value = File.copy('./test/testdir/copydir/',
				'./test/testdir/copyeddir/').then(function(){
					let res = File.bfsSync('./test/testdir/copyeddir/');
					let list = Object.keys(res.fileAll).map(function(e){
						return res.fileAll[e];
					})
					assert.deepEqual(correctList,list);
				})
			});

			it('copySync correctly', function(){
				let value =  File.copySync('./test/testdir/copydir/',
				'./test/testdir/copyedSyncdir/');
				let res = File.bfsSync('./test/testdir/copyedSyncdir/');
				assert.equal(value,true);
			});

			it('copy single file',async function(){
				let value = await File.copy('./test/testdir/copydir/a.txt',
				'./test/testdir/copy/');
				assert.equal(value,true);
			});
			it('copy source and dest are same',async function(){
				let value = await File.copy('./test/testdir/copydir/a.txt',
				'./test/testdir/copydir/a.txt');
				assert.equal(value,true);
			})
		});

		describe('File.move',function(){
				it('move correctly',async function(){
					fs.mkdirSync('./test/testdir/moveddir/');
					let value = await File.move('./test/testdir/moveddir/','./test/testdir/movedir/');
					let isExist = await utils.pathIsExist('./test/testdir/moveddir/');
					assert.equal(value,true);
					assert.equal(isExist,false);
				});

				it('moveSync correctly',async function(){
					fs.mkdirSync('./test/testdir/movedSyncdir/');
					let value =  File.moveSync('./test/testdir/movedSyncdir/','./test/testdir/movedir/');
					let isExist = await utils.pathIsExist('./test/testdir/movedSyncdir/');
					assert.equal(value,true);
					assert.equal(isExist,false);
				});

				it('move to the same path',async function(){
					let value = await File.move('./test/testdir/movedir/','./test/testdir/movedir/');
					assert.equal(value,true);
				})
		});

		describe('File.merge',function(){
			it('merge files correctly',async function(){
				fs.writeFileSync('./test/testdir/merge/a.txt',"test me");
				let res = await File.merge('./test/testdir/merged/','./test/testdir/merge/');
				assert.equal(res,true);
				fs.unlinkSync('./test/testdir/merged/a.txt');
			});

			it('mergeSync files correctly',function(){
				fs.writeFileSync('./test/testdir/merge/a.txt',"test me");
				let res = File.mergeSync('./test/testdir/merged/','./test/testdir/merge/');
				assert.equal(res,true);
				fs.unlinkSync('./test/testdir/merged/a.txt');
			})

			it('merge same file',async function(){
				fs.writeFileSync('./test/testdir/merged/a.txt',"test me");
				let res = File.mergeSync('./test/testdir/merged/','./test/testdir/merged/');
				assert.equal(res,true);
			})
		});

		describe('File.flat',function(){
			let correctRes = [ 'a.txt', 't.txt' ];
			it('flat file correctly',async function(){
				let res = await File.flat('./test/testdir/flat/');
				assert.deepEqual(res,correctRes);
			});

			it('flatSync file correctly',function(){
				let res = File.flatSync('./test/testdir/flat/');
				assert.deepEqual(res,correctRes);
			});
		})
	})
}
module.exports = helperTest;