let json = {'"1"':2,'"3"':4};
let str = JSON.stringify(json);
console.log(str);
let re = JSON.parse(str);
console.log(re);


