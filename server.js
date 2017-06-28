//sudo netstat -lpn |grep:3000
//sudo kill -9 8047(PID)

var express = require("express"),
    app = express(),
    //formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra'),
    //qt   = require('quickthumb'),
    path = require('path'),
    multer = require('multer'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    port = 3003;

const exec = require('child_process').exec;


app.use(express.static(path.join(__dirname, 'src')));

var imageDir = "C:\\Users\\sairam.vankamamidi\\Documents\\PL_web-app\\new\\src\\assets\\demo_images\\";

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "src/assets/demo_images/");
    },
    filename: function(req, file, callback) {
        console.log(file.mimetype)
        if (file.mimetype == 'image/png') {
            callback(null, file.originalname);
        } else {
            callback(new Error('I don\'t have a clue!'));
        }
    }
});

var upload = multer({ storage: storage }).any();



//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use('/', require('./routes/index')); //added



app.get("/", function(req, res) {

    res.sendFile(__dirname + '/src/index.html');
});

app.get("/home", function(req, res) {

    res.sendFile(__dirname + '/src/index.html');
});

app.get("/upload_image", function(req, res) {
    res.sendFile(__dirname + '/src/upload_image.html');
});


app.get("/displayimage", function(req, res) {
    res.sendFile(__dirname + '/src/display_img2.html');

});


app.delete("/delete/:id", function(req, res) {

    var id = req.params.id
    console.log("Got a DELETE request for", id);
    fs.unlink(imageDir + id)
    console.log(imageDir + id);
    res.send('Hello DELETE');
});


app.get("/upload_showImageList", function(req, res, next) {
    //res.setHeader("Content-Type", "text/html");
    getImages(imageDir, function(err, files) {
        var imageLists = [];
        for (var i = 0; i < files.length; i++) {
            imageLists.push(files[i]);
        }
        console.log(files.length);
        console.log(imageLists);
        res.json(imageLists);
    });
});



app.get("/upload_image/:imageId", function(req, res) {
    //res.setHeader("Content-Type", "text/html");
    console.log(req.params.imageId);
    var id = req.params.imageId;
    res.end(id);
});



app.post('/upload', function(req, res, next) {
    res.setHeader("Content-Type", "text/html");
    upload(req, res, function(err) {
        console.log(req.files);
        if (err) {
            res.sendFile(__dirname + '/src/upload_image.html');
            console.log('not supported format')
        }
        res.sendFile(__dirname + '/src/upload_image.html');
        console.log('supported format')
    });
    res.sendFile(__dirname + '/src/upload_image.html');
})




app.get("/displayimage/:Id", function(req, res) {
    //res.setHeader("Content-Type", "text/html");
    console.log(req.params.Id);
    var id = req.params.Id;
    res.json(id);
});

app.get("/shell", function(req, res) {
    //res.setHeader("Content-Type", "text/html");
    console.log("received shell");
   function puts(error, stdout, stderr) { console.log(stdout) }
exec("DIR", puts);
});









app.get("*", function(req, res) {

    res.sendFile(__dirname + '/src/index.html');
});

app.listen(port);

console.log('Listening on localhost port ' + port);

module.exports = app; //added





// filter to show only png from demo_images folder in html page
function getImages(imageDir, callback) {
    var fileType = '.png',
        files = [],
        i;
    fs.readdir(imageDir, function(err, list) {
        for (i = 0; i < list.length; i++) {
            if (path.extname(list[i]) === fileType) {
                files.push(list[i]); //store the file name into the array files
            }
        }
        callback(err, files);
    });
}


function redirectRouterUploadPage(req, res) {
    res.sendFile(__dirname + '/src/upload_image.html');
}














/*

app.post('/uploads', function (req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
  //  res.writeHead(200, {'content-type': 'text/plain'});
  //  res.write('received upload:\n\n');
  //  res.end(util.inspect({fields: fields, files: files}));
//
  });

  form.on('end', function(fields, files) {
    Temporary location of our uploaded file 
    var temp_path = this.openedFiles[0].path;
    The file name of the uploaded file 
    console.log(temp_path)

    var file_name = this.openedFiles[0].name;
    Location where we want to copy the uploaded file
    var new_location = imageDir ;

    fs.copy(temp_path, new_location + file_name, function(err) {  
      if (err) {
        console.error(err);
      } else {
        console.log("success!")
        res.sendFile(__dirname+'/src/upload_image.html');
      }
    });
  });

});


app.post('/uploaad',function(req,res){
    upload(req,res,function(err) {
        console.log(req.body);
        console.log(req.files);
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
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


app.get("/displayimagee",function(req,res){
  res.sendFile(__dirname+'/src/display_img.html');
    
});




*/
