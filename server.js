//sudo netstat -lpn |grep:3000
//sudo kill -9 8047(PID)
var port=3000;
var express   =    require("express");
var logger = require('morgan');
var path = require('path');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var schedule = require('node-schedule');
//var _=require('lodash');



var app       =    express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

//app.use('/', require('./routes/index')); //added




function time(){
var now     = new Date(); 
 var epoch= Date.now();
 
 var year    = now.getFullYear();
 var month   = now.getMonth()+1;
 var day     = now.getDate(); 
 var hour    = now.getHours();
 var minute  = now.getMinutes();
 var second  = now.getSeconds(); 
 var millis  = now.getMilliseconds();

if(month.toString().length == 1) {
 month = '0'+month;
 }
 if(day.toString().length == 1) {
 day = '0'+day;
 }   
 if(hour.toString().length == 1) {
  hour = '0'+hour;
 }
 if(minute.toString().length == 1) {
  minute = '0'+minute;
 }
 if(second.toString().length == 1) {
  second = '0'+second;
 }
 //if(millis.toString().length == 1) {
 //var millis = '0'+millis;
 //}
return timestamp = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second; //+':'+millis;


};





app.get("/",function(req,res){
        
      res.sendFile(__dirname+'/public/index.html');
});




function redirectRouter(req,res){
  res.sendFile(__dirname+'/public/index.html');
}

app.use(redirectRouter);



app.listen(port);

console.log('Listening on localhost port '+port);


module.exports = app;//added

