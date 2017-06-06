//sudo netstat -lpn |grep:3000
//sudo kill -9 8047(PID)
var port=3003;
var express   =    require("express");
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./routes');

var app       =    express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src')));

//app.use('/', require('./routes/index')); //added



app.get("/",function(req,res){
        
      res.sendFile(__dirname+'/src/index.html');
});

app.get("/home",function(req,res){
        
      res.sendFile(__dirname+'/src/index.html');
});

app.get("/display_img",function(req,res){
        
      res.sendFile(__dirname+'/src/display_img.html');
});


function redirectRouter(req,res){
  res.sendFile(__dirname+'/src/index.html');
}

app.use(redirectRouter);



app.listen(port);

console.log('Listening on localhost port '+port);


module.exports = app;//added

