/**
 * 
 */
var pattern = 'c,a';
var myPattern = ',,,,C,A';


var myRe = new RegExp(pattern, 'gi');
var commaPattern = /,/g;
var match = myRe.exec(myPattern);
if (match == null) {
  alert("Not Match");
} else {


  var temp = myPattern.substring(0, match.index);
  if (temp == "")
    alert(0);
  else
    alert(temp.match(commaPattern).length);
}
