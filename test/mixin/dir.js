let File = require('../../index');
let fs = require('fs');
let assert = require('assert');
function dirTest(){
	describe('dirTest',function(){
		describe('File.delete',function(){
			it('delete dir',async function(){
				fs.mkdirSync('./test/testdir/newdirfortest/');
				let value = await File.delete('./test/testdir/newdirfortest/');
				assert.equal(value,true);
			});

			it('delete file',async function(){
				fs.writeFileSync('./test/testdir/newfilefortest');
				let value = await File.delete('./test/testdir/newfilefortest');
				assert.equal(value,true);
			});

			it('delete no-existing dir',async function(){
				try{
					let value = await File.delete('./test/testdir/no-existing/');
					assert.notEqual(value,true);
				}catch(e){

				}
			});

			it('delete no-existing file',async function(){
				try{
					let value = await File.delete('./test/testdir/no-existing');
					assert.notEqual(value,true);
				}catch(e){
				}
			});
		});

		describe('File.write',function(){
			File.write()
		})
	});
}
module.exports = dirTest