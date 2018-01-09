let File = require('../../index');
let assert = require('assert');
function dirTest(){
	describe('dirTest',function(){
		describe('test init',function(){
			console.log('test init');
			it('should return -1', function() {
		      assert.equal(-1, -1);
		    });
		})
	})
}
module.exports = dirTest