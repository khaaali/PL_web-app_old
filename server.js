//sudo netstat -lpn |grep:3000
//sudo kill -9 8047(PID)
//with formidable
var express = require("express"),
    app = express(),
    formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra'),
    util = require('util'),
    //qt   = require('quickthumb'),
    path = require('path'),
    multer = require('multer'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');
var http = require('http');
var server = http.createServer(app).listen(3003)
var io = require('socket.io')(server);
//var pty = require('pty.js');

var shell = require('shelljs');
const exec = require('child_process').exec;


if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}


/*
var term2 = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
});

term2.on('data', function(data) {
    console.log(data);
});

io.on('connection', function(socket) {
    // Create terminal
    var term = pty.spawn('sh', [], {
        name: 'xterm-color',
        cols: 80,
        rows: 60,
        cwd: process.env.HOME,
        env: process.env
    });
    // Listen on the terminal for output and send it to the client
    term.on('data', function(data) {
        socket.emit('output', data);
    });
    // Listen on the client and send any input to the terminal
    socket.on('message', function(data) {
        console.log(data);
    });
    // When socket disconnects, destroy the terminal
    socket.on("disconnect", function() {
        term.destroy();
        console.log("bye");
    });
});


*/

// When a new socket connects
io.on('connection', function(socket) {
    // Create terminal
    
    // Listen on the terminal for output and send it to the client
    
    // Listen on the client and send any input to the terminal
    socket.on('data', function(data) {
    	console.log('im here')
        console.log(data);
        shell.exec(data)



    });
    // When socket disconnects, destroy the terminal
    socket.on("disconnect", function() {
        console.log("bye");
    });
});



app.use(express.static(path.join(__dirname, 'src')));

var imageDir = "C:\\Users\\sairam.vankamamidi\\Documents\\app\\src\\assets\\demo_images\\";
//var imageDir = "/home/sairam/Desktop/pl/PL_web-app/src/assets/demo_images/"
//var imageDir = "/home/PL_web-app/src/assets/demo_images/"

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "src/assets/demo_images/");
    },
    filename: function(req, file, callback) {
        console.log(file.mimetype)
         if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg') {
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


app.get("/display_img2", function(req, res) {
    res.sendFile(__dirname + '/src/display_img2.html');
    //res.redirect('/upload_image');
});

app.get("/console", function(req, res) {
    res.sendFile(__dirname + '/src/console.html');
    //res.redirect('/upload_image');
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
        //console.log(files.length);
        console.log('upload_showImageList')
        console.log(imageLists);
        res.json(imageLists);
    });
});


app.get("/upload_image/:imageId", function(req, res) {
    console.log(req.params.imageId);
    var id = req.params.imageId;
    var command="BBepdcULD -update_image /home/PL_web-app/src/assets/demo_images/"+id
    //console.log(t);
    //var t= "dir"
    var child = exec(command, { async: true });
    child.stdout.on('data', function(data) {
       //console.log(data)
        
    });
    
    //root*/
    shell.echo(command)
    res.setHeader("Content-Type", "text/html");
   res.redirect('/upload_image');
    //shell.exec(command,{ silent: true })
});



app.post('/upload', function (req, res){
  var form = new formidable.IncomingForm();
  form.multiples = true
  form.keepExtensions = true
  form.parse(req, function(err, fields, files) {
   // res.writeHead(200, {'content-type': 'text/plain'});
   // res.write('received upload:\n\n');
   // res.end(util.inspect({fields: fields, files: files}));
   // res.setHeader("Content-Type", "text/html");
  });

  form.on('end', function(fields, files) {
   // Temporary location of our uploaded file 
   console.log('in upload')
    console.log(this.openedFiles)

    
    for (var img in this.openedFiles){
    var temp_path = this.openedFiles[img].path;
    //The file name of the uploaded file 
    var file_name = this.openedFiles[img].name;
   // Location where we want to copy the uploaded file
    var new_location = imageDir ;
    fs.copy(temp_path, new_location + file_name, function(err) {  
      if (err) {
        console.error(err);
      } else {
        console.log("success!")
        
      }
    });
}
  });
 res.redirect('/upload_image');
});


app.get("/displayimage/:Id", function(req, res) {
    //res.setHeader("Content-Type", "text/html");
    console.log(req.params.Id);
    var id = req.params.Id;
    res.json(id);
});



app.get("/shell", function(req, res) {
    //res.setHeader("Content-Type", "text/html");
    console.log("received shell");
    //shell.exec('ls -l\r');

    //console.log();

});


app.get("/toInitiatization", function(req, res) {
    //res.setHeader("Content-Type", "text/html");
    console.log("received slideshow");

  /*   getImages(imageDir, function(err, files) {
       // console.log(files)
        for (var i = 0; i < files.length; i++) {
             //console.log(files[i]);
            CurrentImage=imageDir+files[i];
            console.log('CurrentImage');
            console.log(CurrentImage);
           var command="BBepdcULD -update_image /home/PL_web-app/src/assets/demo_images/"+CurrentImage
           var child = exec(command, { async: true });
        child.stdout.on('data', function(data) {
         console.log(data)

         });
    }
}); */
});


app.get('*', function(req, res) {

    res.sendFile(__dirname + '/src/index.html');
});

//app.listen(port);

console.log('Listening on localhost port 3003');

module.exports = app; //added





// filter to show only png from demo_images folder in html page
function getImages(imageDir, callback) {
    var fileType1 = '.png',
	fileType2 = '.jpeg',
	fileType3 = '.jpg',
        files = [],
        i;
    fs.readdir(imageDir, function(err, list) {
        for (i = 0; i < list.length; i++) {
           if (path.extname(list[i]) === fileType1 || path.extname(list[i]) === fileType3 || path.extname(list[i]) === fileType2) {
                files.push(list[i]); //store the file name into the array files
            }
        }
        callback(err, files);
    });
}


function redirectRouterUploadPage(req, res) {
    res.sendFile(__dirname + '/src/upload_image.html');
}

