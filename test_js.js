var a = [ 1, 2, 3 ];
var b = a;
a.push(5);
console.log(b)

console.log(typeof [1,2,3]);

console.log(NaN == NaN);

if(1) function foo(){ return 'a'}
else function foo(){ return 'b'}
console.log( foo() )

var quu ;
if(1) {
	quu = function(){ return 'a'}
}
else {
	quu = function(){ return 'b'}
}
console.log( quu() )


function bar(){
   return this;
}
console.log( bar )
console.log( bar.call( bar ) )
