let str = " 41"
let num = '';
let flag = 0;
let map = ['0','1','2','3','4','5','6','7','8','9'];
let i = 0;

while (flag !== 2 && i < str.length){
    console.log(0);
    if (str[i] in map){
        num += str[i];
        flag = 1;
        console.log(1);
    }
    if (!(str[i] in map) && str[i] != ' '){
        flag = 2;
        console.log(2);
    }
    if (str[i] == ' ' && flag == 1){
        flag = 2;
        console.log(3);
    }
    i++;
}

console.log(+num);