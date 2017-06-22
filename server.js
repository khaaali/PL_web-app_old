//sudo netstat -lpn |grep:3000
//sudo kill -9 8047(PID)

var express = require("express"),
    app = express(),
    formidable = require('formidable'),
    util = require('util'),
    fs   = require('fs-extra'),
    qt   = require('quickthumb'),
    path = require('path'),
    port=3003;
var imageDir = "C:\\Users\\sairam.vankamamidi\\Documents\\PL_web-app\\new\\src\\assets\\demo_images\\";

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src')));


//app.use('/', require('./routes/index')); //added



app.get("/",function(req,res){
        
      res.sendFile(__dirname+'/src/index.html');
});

app.get("/home",function(req,res){
        
      res.sendFile(__dirname+'/src/index.html');
});

app.get("/upload_image",function(req,res){
  res.sendFile(__dirname+'/src/upload_image.html');
});


app.get("/displayimagee",function(req,res){
  res.sendFile(__dirname+'/src/display_img.html');
    
});


app.post('/upload', function (req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
  //  res.writeHead(200, {'content-type': 'text/plain'});
  //  res.write('received upload:\n\n');
  //  res.end(util.inspect({fields: fields, files: files}));
//
  });

  form.on('end', function(fields, files) {
    /* Temporary location of our uploaded file */
    var temp_path = this.openedFiles[0].path;
    /* The file name of the uploaded file */
    console.log(temp_path)

    var file_name = this.openedFiles[0].name;
    /* Location where we want to copy the uploaded file */
    var new_location = imageDir ;

    fs.copy(temp_path, new_location + file_name, function(err) {  
      if (err) {
        console.error(err);
      } else {
        console.log("success!")
      }
    });
  });
});


app.get("/display_image",function(req,res){
    getImages(imageDir, function (err, files) {
            var imageLists = '<ul>';
            for (var i=0; i<files.length; i++) {
                imageLists += '<li><a href="/display_image/' + files[i] + '">' + files[i] + '</li>';
            }
            imageLists += '</ul>';
            imageLists += '<ul><li><a href="/' + 'home' + '">' + 'HOME' + '</li></ul>';

            res.writeHead(200, {'Content-type':'text/html'});
            res.end(imageLists);

});

});


app.get("/displayimage",function(req,res,next){
    getImages(imageDir, function (err, files) {
            var imageLists;
            for (var i=0; i<files.length; i++) {
                imageLists +=  files[i] ;
            }
            res.end(imageLists);

});

});




 
app.get("/display_image/:imageId",function(req,res){
    console.log(req.params.imageId);
});






















//function redirectRouter(req,res){
//  res.sendFile(__dirname+'/src/index.html');
//}

//app.use(redirectRouter);

app.listen(port);

console.log('Listening on localhost port '+port);

module.exports = app;//added


function getImages(imageDir, callback) {
    var fileType = '.png',
        files = [], i;
    fs.readdir(imageDir, function (err, list) {
        for(i=0; i<list.length; i++) {
            if(path.extname(list[i]) === fileType) {
                files.push(list[i]); //store the file name into the array files
            }
        }
        callback(err, files);
    });
}