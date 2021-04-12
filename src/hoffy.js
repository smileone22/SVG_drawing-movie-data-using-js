/**
 * hoffy.js
 * write and export higher order functions below
 */
/*
Implement functions that use JavaScript features such as:

the rest operator
the spread operator
functions as arguments
functions as return values
decorators
optionally call/apply/bind
optionally arrow functions
Array methods: 'filter', 'map', 'reduce'

Do not use:
    while loops
    for loops
    for ... in loops
    for ... of loops
    forEach method
*/


function makeSet(num1, ... numN){
    const arr= [num1, ...numN];
    const s= [... new Set(arr)];
    return s;
}


function findIndex(arr, num, compareFunc){
    let i=0;
    const arr2=[];
    arr.map((ele)=>{ 
    if(compareFunc(num,ele)){
        arr2.push(i);}i++;
    });
    if(arr2.length===0){
        return [-1];
    }
    return arr2;
}

function filterWith(fn){
    function filter(arr) { return arr.filter(fn);}
    return filter;
}

function intersection(arr1, arr2){
    const set1= new Set(arr1);
    return [... new Set(arr2)].filter( x=> set1.has(x));
}

function repeatCall(fn, n, arg){
    const count = n;
    fn(arg);
    if (count > 1){
        repeatCall(fn,n-1,arg);
    }
}

function constrainDecorator(fn, min, max){
    function decorate(...args){
        const res = fn(args);
        if (max===undefined || min===undefined){
             return res;
        }
        else if (res < min){
            return min;
        }
        else if (res > max){
            return max;
        }
        else{
            return res;
        }
    }
    return decorate; 
}

function limitCallsDecorator(fn, n){
    let count= n;
    function decorator (a){
        if (count>0){
            count=count-1;
            return fn(a);
        }
        else{
            return undefined;
        }
    }
    return decorator;
}

function compose( ... fnN){
    function sumfunc(arg){
        const allfunc= fnN.reduce(function(a,b){
            return b(a);
        },arg);
    return allfunc; 
    } 
    
    return sumfunc;
}

module.exports = {
    makeSet: makeSet,
    findIndex: findIndex,
    filterWith: filterWith,
    intersection: intersection,
    repeatCall: repeatCall,
    constrainDecorator: constrainDecorator,
    limitCallsDecorator: limitCallsDecorator,
    compose: compose
  };