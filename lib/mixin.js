function mixin(prototype,mixed){
	Object.keys(mixed).forEach(function(e){
		prototype[e] = mixed[e]; 
	})
}

module.exports = mixin;