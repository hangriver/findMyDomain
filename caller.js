const fs = require('fs');
const fetch = require('node-fetch');

const api = "https://apidatav2.chinaz.com/single/whois";
const key = "Your Key";
let text = fs.readFileSync('./passage.txt', 'utf-8');

const reg = new RegExp(/[a-z]+[\-\']?[a-z]*/ig)
let words = text.match(reg);
let dict = [];
words.forEach(w => {
  if(dict.indexOf(w) == -1 && w.length > 6 && w.length < 15){
    dict.push(w);
  }
})

console.log(dict);
fs.writeFileSync('./result2.txt', JSON.stringify(dict) + ' \n ', {flag: 'w+'});
dict.splice(100, dict.length-500);

dict.forEach(async d => {
  let res = await fetch(api + '?key=' + key + '&domain=' + d + '.net');
  //console.log(res);
  res = await res.json();
  //console.log(res);
  if(res["Result"]){
    if(res["Result"]["DomainStatus"] == "" || res["Result"]["DomainStatus"] == null){
      console.log('Find available: ', d, '.net');
    }else{
      console.log("Not available: ", d, '.net');
    }
  }
  fs.appendFile('./result.txt', JSON.stringify(res)+ ' \n ', err => {
    if(err){
      console.error(err);
    }
  })
})