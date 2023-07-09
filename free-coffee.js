//if you can read this code, you could probably use a free cup of coffee

var your_drink = '';

var reverse = function(s){
    return s.split("").reverse().join("");
}

var barista = {
    str1: "",
    str2: reverse ("rcne"),
    str3: "ypt",
    request:  function(preference){
        return preference  + 'Secret word:' + this.str2 + this.str3 + this.str1;
    }
}

barista.request(your_drink);