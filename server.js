/** 
This is a server application for handling the Plastic Logic web application 
to upload and drive the display and includes routing.

**/

/** Importing modules **/

var express = require("express"),
    app = express(),
    formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra'),
    util = require('util'),
    path = require('path'),
    multer = require('multer'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');
var http = require('http');
var server = http.createServer(app).listen(3003);
var io = require('socket.io')(server);
var shell = require('shelljs');
const exec = require('child_process').exec;


/* Image directories for uploding and retrieving images */

var imageDir = "/home/PL_web-app/src/assets/demo_images/";
var imageDir2 = "/home/PL_web-app/src/bootstrap/";


if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}

/*
Sockets are used in console view of the application to communicate with the termial  
*/

// When a new socket connects
io.on('connection', function(socket) {

    /*
     Create terminal
     Listen on the terminal for output and send it to the client
     Listen on the client and send any input to the terminal 
     */

    socket.on('data', function(data) {
        console.log('im here');
        console.log(data);
        shell.exec(data);
    });
    // When socket disconnects, destroy the terminal
    socket.on("disconnect", function() {
        console.log("bye");
    });
});


/*
Routes to render views in application
*/

app.use(express.static(path.join(__dirname, 'src')));

app.get("/", function(req, res) {

    res.sendFile(__dirname + '/src/index.html');
});

app.get("/home", function(req, res) {

    res.sendFile(__dirname + '/src/index.html');
});

app.get("/upload_image", function(req, res) {
    res.sendFile(__dirname + '/src/upload_image.html');
});

app.get("/display", function(req, res) {
    //res.sendFile(__dirname + '/src/display.html');
    res.redirect('/upload_image');
});

app.get("/console", function(req, res) {
    //res.sendFile(__dirname + '/src/console.html');
    res.redirect('/upload_image');
});

app.delete("/delete/:id", function(req, res) {
    var id = req.params.id;
    console.log("Got a DELETE request for", id);
    fs.unlink(imageDir + id);
    console.log(imageDir + id);
    res.send('Hello DELETE');
});


app.get("/upload_showImageList", function(req, res, next) {
    getImages(imageDir, function(err, files) {
        var imageLists = [];
        for (var i = 0; i < files.length; i++) {
            imageLists.push(files[i]);
        }
        //console.log(files.length);
        console.log('upload_showImageList');
        console.log(imageLists);
        res.json(imageLists);
    });
});


app.get("/upload_image/:imageId", function(req, res) {
    console.log(req.params.imageId);
    var id = req.params.imageId;
    var command = "BBepdcULD -update_image /home/PL_web-app/src/assets/demo_images/" + id
    var child = exec(command, { async: true });
    child.stdout.on('data', function(data) {
    //console.log(data)
        });
    shell.echo(command)
    res.setHeader("Content-Type", "text/html");
    res.redirect('/upload_image');
});



app.post('/upload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.multiples = true
    form.keepExtensions = true
    form.parse(req, function(err, fields, files) {
        
    });

    form.on('end', function(fields, files) {
        // Temporary location of uploaded file 
        console.log('in upload')
        console.log(this.openedFiles)
        for (var img in this.openedFiles) {
            var temp_path = this.openedFiles[img].path;
            //The file name of the uploaded file 
            var file_name = this.openedFiles[img].name;
            // Location where we want to copy the uploaded file
            var new_location = imageDir;
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
    console.log(req.params.Id);
    var id = req.params.Id;
    res.json(id);
});


app.get("/JpgToPng", function(req, res) {
    console.log("received JpgToPng");

/*
conversions to JPG to PNG, rotation and scaling methods work with imageImagik library on linux 
*/
    var convert_a = "convert -quality 100% -rotate '-90<' -adaptive-resize '1280x960' "
    var convert_b = "convert -quality 100% -rotate '-90<' "
    var identify_1 = "identify -format '%P'"

    getJpg(imageDir, function(err, files) {
        for (var i = 0; i < files.length; i++) {
            console.log(files[i]);
            var nameImg = files[i]
            var ImgName = nameImg.split('.jpg')[0] // spliting the file name
            console.log(ImgName)
            var command_1 = identify_1 + " " + imageDir + nameImg
            console.log(command_1);

            // executing the command on linux termnial using shell.exec(...)
            
            var resloution = shell.exec(command_1);
            console.log(resloution.split('x'));
            W = resloution.split('x')[0]; // parsing width of image
            H = resloution.split('x')[1]; // parsing height of image
            console.log(W, H);


            if (W < 1023 && H < 767) {
                // upon satisfining the condition image is rotated if necesary and converted from JPG to PNG
                var command_2 = convert_b + imageDir + files[i] + " " + imageDir + ImgName + ".png";
                console.log(command_2);
                shell.exec(command_2);
                console.log(files.length + 'im here');
                console.log('deleting files' + files[i]);
                fs.unlink(imageDir + files[i]); // for deleting the files
            } 

            else {
                // upon satisfining the condition image is rotated if necesary and converted from JPG to PNG, resized to 1280x960
                var command_3 = convert_a + imageDir + files[i] + " " + imageDir + ImgName + ".png";
                console.log(command_3);
                shell.exec(command_3);
                console.log(files.length + 'im here');
                console.log('deleting files' + files[i]);
                fs.unlink(imageDir + files[i]); // for deleting the files
            }
        }

    });
    res.setHeader("Content-Type", "text/html");
    res.redirect('/upload_image');
});


app.get("/Scaling", function(req, res) {
    console.log("received Scaling");
    
    var identify = "identify -format '%P'" // uses imagemagik to determine the Width and Height of image

    getImages(imageDir, function(err, files) {
        for (var i = 0; i < files.length; i++) {
            console.log(files[i]);
            var nameImg = files[i]
            var command = identify + " " + imageDir + nameImg
            console.log(command);
            var resloution = shell.exec(command);
            console.log(resloution.split('x'));
            W = resloution.split('x')[0];
            H = resloution.split('x')[1];
            console.log(W, H);
            if (W < 1280 || H < 960 ) {
                // upon satisfining the condition image is rotated if necesary and resized to 640x480
                var convert = "convert -quality 100% -rotate '-90<' -adaptive-resize '640x480' ";
                var command = convert + imageDir + nameImg + " " + imageDir + nameImg;
                console.log(command);
                shell.exec(command);
                // resized image is overlayed on top of black image and centers are alinged with W/2 and H/2
                scale = "convert" + " " + imageDir2 + "black_1280x960.png" + " " + imageDir + nameImg + " -geometry +320+240 -composite " + imageDir + nameImg
                console.log(scale);
                shell.exec(scale);
            }
        }
    });
    res.setHeader("Content-Type", "text/html");
    res.redirect('/upload_image');
});

app.get('*', function(req, res) {

    res.sendFile(__dirname + '/src/index.html');
});

console.log('Listening on localhost port 3003');

module.exports = app; //added

// filter to retrieve png,jpeg,jpg images from /demo_images folder 
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


// filter to retrieve JPG, JPEG images from /demo_images folder 
function getJpg(imageDir, callback) {
    var fileType2 = '.jpeg',
        fileType3 = '.jpg',
        files = [],
        i;
    fs.readdir(imageDir, function(err, list) {
        for (i = 0; i < list.length; i++) {
            if (path.extname(list[i]) === fileType3 || path.extname(list[i]) === fileType2) {
                files.push(list[i]); //store the file name into the array files
            }
        }
        callback(err, files);
    });
}


// redirects page to upload_image.html
function redirectRouterUploadPage(req, res) {
    res.sendFile(__dirname + '/src/upload_image.html');
}