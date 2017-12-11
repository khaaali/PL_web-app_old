/** 
This is a server application for handling the Plastic Logic web application to upload and drive the EPD display.

**/

/** Importing modules **/

var express = require("express"),
    app = express(),
    formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');
var http = require('http');
var server = http.createServer(app).listen(80);
var shell = require('shelljs');// executes system defined calls or scripts
var exec = require('child_process').exec;

app.use(bodyParser.urlencoded({ extended: false }))
/* Image directories used for uploding and retrieving images */

var imageDir = "/home/PL_web-app/src/assets/demo_images/";
var imageDir2 = "/home/PL_web-app/src/bootstrap/"; // black image for centring the image
//var imageDir = "C:\\Users\\sairam.vankamamidi\\Documents\\PL_web-app\\src\\assets\\demo_images\\"
var waveDir = "/mnt/data/override/"
//var waveDir = "C:\\Users\\sairam.vankamamidi\\Documents\\PL_web-app\\src\\assets\\wave\\"
/*if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}*/

// Arrays for hold ing vaules in the webpage
var current_WFmode = ['select']
var current_WaveFile = ['']
var current_Vcom = ['select']


/*
Routing application and rendering views 
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

app.get("/display_type", function(req, res) {
    res.sendFile(__dirname + '/src/display_type.html');
    //res.redirect('/upload_image');
});

app.get("/settings", function(req, res) {
    res.sendFile(__dirname + '/src/settings.html');
    //res.redirect('/upload_image');
});

app.get("/console", function(req, res) {
    //res.sendFile(__dirname + '/src/console.html');
    res.redirect('/upload_image');
});





// For initializing the display

app.get("/toInitiatization", function(req, res) {
    console.log('received Initiatization');
    var init_command = " BBepdcULD -start_epdc 0 1"
    shell.exec(init_command);
});



/*         
                     ******************Upload Image Start**************************

Routes to handle the upload images: 
- Uploads the images to the directory and converts jpeg to png
- Returns list of images from the directory and sends it to front-end application
- Execute the selected images 
- Delete the selected images
*/

app.post('/uploadImage', function(req, res) {
    var form = new formidable.IncomingForm();
    form.multiples = true
    form.keepExtensions = true
    files = [];
    //fields = [];
    form.parse(req, function(err, fields, files) {

    });
    form.on('end', function() {
        res.end('success');

    });

    form.on('file', function(field, file) {
        // Temporary location of uploaded file 

        //console.log(field, file);
        files.push(file);
        console.log(file.path);
        console.log('in upload')
        console.log(files.length)
        console.log(files)
        //for (var img = 0; img < files.length; img++) {
        var temp_path = file.path;
        console.log('here1')
        console.log(temp_path)
        //The file name of the uploaded file 
        console.log('here2')
        var file_name = file.name;
        console.log('here3')
        console.log(file_name)
        // Location where we want to copy the uploaded file
        var new_location = imageDir;
        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!", new_location + file_name)
                var extention = file_name.split('.').pop();
                console.log(extention)
                
                // image magik commands for conversion to JPG to PNG and scaling of images
                var convert_a = "convert -quality 100% -rotate '-90<' -adaptive-resize '1280x960' "
                var convert_b = "convert -quality 100% -rotate '-90<' "
                var convert_c = "convert -quality 100% -rotate '-90<' -adaptive-resize '640x480' ";
                var identify_1 = "identify -format '%P'"

                if (extention == 'jpg' || extention == 'jpeg') {
                    var ImgName = file_name.split('.jpg')[0] // spliting the file name
                    console.log(ImgName)
                    var command_1 = identify_1 + " " + imageDir + file_name
                    console.log(command_1);

                    // executing the command on linux termnial using shell.exec(...)

                    var resloution = shell.exec(command_1);
                    console.log(resloution.split('x'));
                    W = resloution.split('x')[0]; // parsing width of image
                    H = resloution.split('x')[1]; // parsing height of image
                    console.log(W, H);
                    if (W < 1023 || H < 767) {
                        // upon satisfining the condition, if necesary image is rotated and converted from JPG to PNG by scaling it down to 640x480
                        var command_2 = convert_c + imageDir + file_name + " " + imageDir + ImgName + ".png";
                        console.log(command_2);
                        shell.exec(command_2);
                        // uploaded image is overlayed with black image and centers are matched
                        scale = "convert" + " " + imageDir2 + "black_1280x960.png" + " " + imageDir + ImgName + ".png" + " -geometry +320+240 -composite " + imageDir + ImgName + ".png"
                        console.log(scale);
                        shell.exec(scale);
                        console.log('deleting files' + file_name);
                        fs.unlink(imageDir + file_name); // for deleting the files

                    } else {
                        // image is rotated if necesary and converted from JPG to PNG, resized to 1280x960
                        var command_3 = convert_a + imageDir + file_name + " " + imageDir + ImgName + ".png";
                        console.log(command_3);
                        shell.exec(command_3);
                        console.log('deleting files' + file_name);
                        fs.unlink(imageDir + file_name); // for deleting the files
                    }
                } else if (extention == 'png') {

                    var nameImg = file_name
                    var command_4 = identify_1 + " " + imageDir + nameImg
                    console.log(command_4);
                    var resloution = shell.exec(command_4);
                    console.log(resloution.split('x'));
                    W = resloution.split('x')[0];
                    H = resloution.split('x')[1];
                    console.log(W, H);
                    if (W < 1280 || H < 960) {
                        // upon satisfining the condition image is rotated if necesary and resized to 640x480
                        var command_5 = convert_c + imageDir + nameImg + " " + imageDir + nameImg;
                        console.log(command_5);
                        shell.exec(command_5);
                        // resized image is overlayed on top of black image and centers are alinged with W/2 and H/2
                        scale = "convert" + " " + imageDir2 + "black_1280x960.png" + " " + imageDir + nameImg + " -geometry +320+240 -composite " + imageDir + nameImg
                        console.log(scale);
                        shell.exec(scale);
                    }
                }


            }
        });
        // }
    });
    res.setHeader("Content-Type", "text/html");
    res.redirect('/upload_image');
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

app.delete("/deleteImage/:id", function(req, res) {
    var id = req.params.id;
    console.log("Got a DELETE request for", id);
    fs.unlink(imageDir + id);
    console.log(imageDir + id);
    res.send('Hello DELETEIMAGE');
});

                        /******************Upload Image End**************************/





/*         
                     ******************Upload Waveforms Start**************************

Routes to handle the upload waveforms: 
- Uploads the waveform to the directory
- Executes default waveform
- Returns list of waveforms from the directory and sends it to front-end application
- Execute the selected waveform 
- Delete the selected waveform
*/

// upload waveform implemented on route '/settings' view
app.post("/uploadWaveform", function(req, res) {
    console.log('received uploadWaveform');
    var form = new formidable.IncomingForm();
    form.multiples = true
    form.keepExtensions = true
    files = [];
    //fields = [];
    form.parse(req, function(err, fields, files) {

    });
    form.on('end', function() {
        res.end('success');

    });

    form.on('file', function(field, file) {
        // Temporary location of uploaded file 

        console.log(field, file);
        files.push(file);
        //for (var img = 0; img < files.length; img++) {
        var temp_path = file.path;
        //The file name of the uploaded file 
        var file_name = file.name;
        // Location where we want to copy the uploaded file
        var new_location = waveDir;
        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("success!", new_location + file_name);
            }
        });
        // }
    });
    res.setHeader("Content-Type", "text/html");
    res.redirect('/settings');
});


app.get("/default_waveform", function(req, res) {
    console.log('received default_waveform');
    var init_command = " BBepdcULD -set_waveform /mnt/data/override/waveform.wbf"
    console.log(init_command);
    shell.exec(init_command);
});



app.get("/upload_showWaveList", function(req, res, next) {
    getWaveFiles(waveDir, function(err, files) {
        var waveDirLists = [];
        for (var i = 0; i < files.length; i++) {
            waveDirLists.push(files[i]);
        }
        //console.log(files.length);
        console.log('upload_showwaveDirList');
        //console.log(waveDirLists);
        
        var FullData = []
            current_waveFile = current_WaveFile[current_WaveFile.length - 1]
            FullData.push(waveDirLists)
            FullData.push({
                "current_WaveFile": current_waveFile
            })
            console.log(FullData)
            res.send(FullData);
    });
});


app.get("/upload_wave/:waveId", function(req, res) {
    console.log(req.params.waveId);
    var id = req.params.waveId;
    current_WaveFile.push(id);
    var command = "BBepdcULD -update_image /home/PL_web-app/src/assets/demo_images/" + id
    var child = exec(command, { async: true });
    child.stdout.on('data', function(data) {
        //console.log(data)
    });
    shell.echo(command)
    res.setHeader("Content-Type", "text/html");
    res.redirect('/settings');
});


app.delete("/deleteWave/:id", function(req, res) {
    var id = req.params.id;
    console.log("Got a DELETE request for", id);
    fs.unlink(waveDir + id);
    console.log(waveDir + id);
    res.send('Hello DELETEWAVE');
});

                    /******************Upload Waveforms End**************************/





/*
                        ******************Waveform Mode Start**************************

Routes for handling waveform mode:
- Returns the json data from file and send it to the Settings view of the application
- Execute the selected mode 
*/

// Returns list of waveform modes from a file of json formatted data

app.get("/getWaveform_modesList", function(req, res) {
    console.log('received getWaveform_modes');
    //var wavelistdir = 'C:\\Users\\sairam.vankamamidi\\Documents\\PL_web-app\\waveform_modes\\'
    var wavelistdir='/home/PL_web-app/waveform_modes/'
    fs.readFile(wavelistdir + 'waveform_modes.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.setHeader("Content-Type", "text/html");
            //console.log(data)
            obj = JSON.parse(data)
            var FullData = []
            Current_WFmode = current_WFmode[current_WFmode.length - 1]
            current_vcom=current_Vcom[current_Vcom.length-1]
            FullData.push(obj)
            FullData.push({
                "current_mode": Current_WFmode
            })
            FullData.push({
                "current_vcom": current_vcom
            })
            console.log(FullData)
            res.send(FullData);
        }

    });
});


app.get("/setWaveform/:waveId", function(req, res) {
    var id = req.params.waveId;
    current_WFmode.push(id);
    var wave_command = " BBepdcULD -update_image /home/PL_web-app/src/bootstrap/01_eyes_1280x960.png"+" " +id
    shell.exec(wave_command);
    console.log('received waveId', id,wave_command);
    
   res.redirect('/settings');
});


                      /******************Waveform Mode End**************************/




/*
                        ******************Set Vcom Start**************************

Routes for handling set Vcom:
- Fetches ánd execute the set vcom
- Executes the default vcom
*/

app.post("/set_Vcom", function(req, res) {
    
    Vcom_value =req.body.vcom_number
    
    console.log('received set_Vcom', Vcom_value);
    current_Vcom.push(Vcom_value)
    
    var wave_command = " BBepdcULD -set_vcom "+" " +Vcom_value
    shell.exec(wave_command);
     console.log(wave_command);
    res.setHeader("Content-Type", "text/html");
   
    res.redirect('/settings');
});


app.get("/default_Vcom", function(req, res) {
    console.log('received default_Vcom');
    var vcom="6000"
     current_Vcom.push(vcom)
    
    var wave_command = " BBepdcULD -set_vcom  6000"
    shell.exec(wave_command);
    console.log(wave_command);
    res.setHeader("Content-Type", "text/html");
   
    res.redirect('/settings');
});

                                /******************Set Vcom End**************************/




app.get('*', function(req, res) {

    res.sendFile(__dirname + '/src/index.html');
});

console.log('Listening on localhost port 80');

module.exports = app;



// filter to retrieve png, jpeg, jpg images from ../demo_images  
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


// filter to retrieve .wbf files  
function getWaveFiles(imageDir, callback) {
    var fileType1 = '.wbf',
        files = [],
        i;
    fs.readdir(imageDir, function(err, list) {
        for (i = 0; i < list.length; i++) {
            if (path.extname(list[i]) === fileType1) {
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