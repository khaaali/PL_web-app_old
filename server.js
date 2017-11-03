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
var shell = require('shelljs'); // executes system defined calls or scripts
var exec = require('child_process').exec;
var _ = require('lodash');
app.use(bodyParser.urlencoded({ extended: false }))




/* Image directories used for uploding and retrieving images */

var imageDir = "/home/PL_web-app/src/assets/default/";
var imageDir_a1 = "/boot/uboot/"
var imageDir_a2 = "/img/"

var black_image = "/home/PL_web-app/src/bootstrap/"; // black image for centring the image
//var imageDir = "C:\\Users\\sairam.vankamamidi\\Documents\\PL_web-app\\src\\assets\\demo_images\\"

var waveDir = "/home/PL_web-app/src/assets/default/"
var waveDir_a1 = "/boot/uboot/"
var waveDir_a2 = "/display/"

//var waveDir = "C:\\Users\\sairam.vankamamidi\\Documents\\PL_web-app\\src\\assets\\wave\\"

// Arrays for hold ing vaules in the webpage
var current_WFmode = ['select']
var current_WaveFile = ['']
var current_Vcom = ['select']
var current_displayType = ['select']

/*
configuration file for the display type
*/
var configsFilePath = "/boot/uboot/config.txt"

/*
set display type command, utilizes display type defined in the configsFilePath
*/
var set_Display_Command = " epdc-app " + " " + "-start_epdc"



function between(x, min, max) {
    return x >= min && x <= max;
}



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
    var init_command = " epdc-app -start_epdc 0 1"
    shell.exec(init_command);
});


/**
 Set display type
*/


app.get("/S115_T1.1", function(req, res) {
    var type = 'S115_T1.1'
    var displayTypeString = 'display_type' + ' ' + type
    //imageDir="C:\\Users\\sairam.vankamamidi\\Documents\\PL_web-app\\src\\assets\\S115_T1.1\\"

    // assigning image and wave directories to the display type
    imageDir = imageDir_a1 + type + imageDir_a2
    waveDir = waveDir_a1 + type + waveDir_a2

    //defining display type in the configsFilePath 
    fs.writeFile(configsFilePath, displayTypeString, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        if (true) {
            var child = exec(set_Display_Command, { async: false });
            child.stdout.on('data', function(data) {
                console.log(typeof(data), data)
                var error = _.includes(data, 'error')
                var configParserError = _.includes(data, 'No register settings specified in the configuration file.')
                console.log(error,configParserError)
                if (error == true || configParserError == true) {
                    console.log(error)
                    current_displayType.push('Error_setting_display')
                    console.log(current_displayType[current_displayType.length - 1], displayTypeString);
                    console.log('received display type', type);
                    res.redirect('/display_type');
                } else {
                    current_displayType.push('11.5in');
                    console.log(current_displayType[current_displayType.length - 1], displayTypeString);
                    console.log('received display type', type);
                    res.redirect('/display_type');
                }
            })
        }
    });

});



app.get("/D107_T3.1", function(req, res) {
    var type = 'D107_T3.1'
    var displayTypeString = 'display_type' + ' ' + type
    //imageDir="C:\\Users\\sairam.vankamamidi\\Documents\\PL_web-app\\src\\assets\\D107_T3.1\\"
    // imageDir = "/boot/uboot/D107_T3.1/img/"

    // assigning image and wave directories to the display type
    imageDir = imageDir_a1 + type + imageDir_a2
    waveDir = waveDir_a1 + type + waveDir_a2

    //defining display type in the configsFilePath
    fs.writeFile(configsFilePath, displayTypeString, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        if (true) {
            var child = exec(set_Display_Command, { async: false });
            child.stdout.on('data', function(data) {
                console.log(typeof(data), data)
                var error = _.includes(data, 'error')
                var configParserError = _.includes(data, 'No register settings specified in the configuration file.')
                console.log(error,configParserError)
                if (error == true || configParserError == true) {
                    console.log(error)
                    current_displayType.push('Error_setting_display')
                    console.log(current_displayType[current_displayType.length - 1], displayTypeString);
                    console.log('received display type', type);
                    res.redirect('/display_type');
                } else {
                    current_displayType.push('10.7in');
                    console.log(current_displayType[current_displayType.length - 1], displayTypeString);
                    console.log('received display type', type);
                    res.redirect('/display_type');
                }
            })
        }

    });

});

app.get("/S079_T1.1", function(req, res) {
    var type = 'S079_T1.1'
    var displayTypeString = 'display_type' + ' ' + type
    //imageDir="C:\\Users\\sairam.vankamamidi\\Documents\\PL_web-app\\src\\assets\\S079_T1.1\\"

    // assigning image and wave directories to the display type
    imageDir = imageDir_a1 + type + imageDir_a2
    waveDir = waveDir_a1 + type + waveDir_a2

    //defining display type in the configsFilePath
    fs.writeFile(configsFilePath, displayTypeString, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        if (true) {
            var child = exec(set_Display_Command, { async: false });
            child.stdout.on('data', function(data) {
                console.log(typeof(data), data)
                var error = _.includes(data, 'error')
                var configParserError = _.includes(data, 'No register settings specified in the configuration file.')
                console.log(error,configParserError)
                if (error == true || configParserError == true) {
                    console.log(error)
                    current_displayType.push('Error_setting_display')
                    console.log(current_displayType[current_displayType.length - 1], displayTypeString);
                    console.log('received display type', type);
                    res.redirect('/display_type');
                } else {
                    current_displayType.push('7.9in');
                    console.log(current_displayType[current_displayType.length - 1], displayTypeString);
                    console.log('received display type', type);
                    res.redirect('/display_type');
                }
            })
        }
    });
 
});

app.get("/S049_T1.1", function(req, res) {
    var type = 'S049_T1.1'
    var displayTypeString = 'display_type' + ' ' + type
    //imageDir="C:\\Users\\sairam.vankamamidi\\Documents\\PL_web-app\\src\\assets\\S049_T1.1\\"

    // assigning image and wave directories to the display type
    imageDir = imageDir_a1 + type + imageDir_a2
    waveDir = waveDir_a1 + type + waveDir_a2

    //defining display type in the configsFilePath
    fs.writeFile(configsFilePath, displayTypeString, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        if (true) {
            var child = exec(set_Display_Command, { async: false });
            child.stdout.on('data', function(data) {
                console.log(typeof(data), data)
                var error = _.includes(data, 'error')
                var configParserError = _.includes(data, 'No register settings specified in the configuration file.')
                console.log(error,configParserError)
                if (error == true || configParserError == true) {
                    console.log(error)
                    current_displayType.push('Error_setting_display')
                    console.log(current_displayType[current_displayType.length - 1], displayTypeString);
                    console.log('received display type', type);
                    res.redirect('/display_type');
                } 
                else {
                    current_displayType.push('4.9in');
                    console.log(current_displayType[current_displayType.length - 1], displayTypeString);
                    console.log('received display type', type);
                    res.redirect('/display_type');
                }
            })
        }
    });
  
});

app.get("/S047_T2.1", function(req, res) {
    var type = 'S047_T2.1'
    var displayTypeString = 'display_type' + ' ' + type
    //imageDir="C:\\Users\\sairam.vankamamidi\\Documents\\PL_web-app\\src\\assets\\S047_T2.1\\"

    // assigning image and wave directories to the display type
    imageDir = imageDir_a1 + type + imageDir_a2
    waveDir = waveDir_a1 + type + waveDir_a2

    //defining display type in the configsFilePath
    fs.writeFile(configsFilePath, displayTypeString, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        if (true) {
            var child = exec(set_Display_Command, { async: false });
            child.stdout.on('data', function(data) {
                console.log(typeof(data), data)
                var error = _.includes(data, 'error')
                var configParserError = _.includes(data, 'No register settings specified in the configuration file.')
                console.log(error,configParserError)
                if (error == true || configParserError == true) {
                    console.log(error)
                    current_displayType.push('Error_setting_display')
                    console.log(current_displayType[current_displayType.length - 1], displayTypeString);
                    console.log('received display type', type);
                    res.redirect('/display_type');
                } else {
                    current_displayType.push('4.7in');
                    console.log(current_displayType[current_displayType.length - 1], displayTypeString);
                    console.log('received display type', type);
                    res.redirect('/display_type');
                }
            })
        }
    });
   
});


app.get("/S040_T1.1", function(req, res) {
    var type = 'S040_T1.1'
    var displayTypeString = 'display_type' + ' ' + type
    //imageDir="C:\\Users\\sairam.vankamamidi\\Documents\\PL_web-app\\src\\assets\\S040_T1.1\\"

    // assigning image and wave directories to the display type
    imageDir = imageDir_a1 + type + imageDir_a2
    waveDir = waveDir_a1 + type + waveDir_a2

    //defining display type in the configsFilePath
    fs.writeFile(configsFilePath, displayTypeString, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
        if (true) {
            var child = exec(set_Display_Command, { async: false });
            child.stdout.on('data', function(data) {
                console.log(typeof(data), data)
                var error = _.includes(data, 'error')
                var configParserError = _.includes(data, 'No register settings specified in the configuration file.')
                console.log(error,configParserError)
                if (error == true || configParserError == true) {
                    console.log(error)
                    current_displayType.push('Error_setting_display')
                    console.log(current_displayType[current_displayType.length - 1], displayTypeString);
                    console.log('received display type', type);
                    res.redirect('/display_type');
                } else {
                    current_displayType.push('4.0in');
                    console.log(current_displayType[current_displayType.length - 1], displayTypeString);
                    console.log('received display type', type);
                    res.redirect('/display_type');
                }
            })
        }
    });
  
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
            } else

            {
                console.log("success!", new_location + file_name)
                var extention = file_name.split('.').pop();
                console.log(extention)
                currentDisplayType = current_displayType[current_displayType.length - 1]
                console.log(currentDisplayType)
                // image magik commands for conversion to JPG to PNG and scaling of images
                //sudo apt-get install imagemagick

                var identify = "identify -format '%P'"
                var convert_b = "convert -quality 100% -rotate '-90<' "

                if (currentDisplayType == '10.7in') {
                    console.log(currentDisplayType)
                    var convertTenIn = "convert -quality 100% -rotate '-90<' -adaptive-resize '1280x960' ";

                    if (extention == 'jpg' || extention == 'jpeg') {
                        var ImgName = file_name.split('.jpg')[0] // spliting the file name
                        console.log(ImgName)
                        var command_1 = identify + " " + imageDir + file_name
                        console.log(command_1);

                        // executing the command on linux termnial using shell.exec(...)

                        var resloution = shell.exec(command_1);
                        console.log(resloution.split('x'));
                        var W = resloution.split('x')[0]; // parsing width of image
                        var H = resloution.split('x')[1]; // parsing height of image
                        console.log(W, H);
                        if (W < 1023 || H < 767) {
                            // upon satisfining the condition, image is rotated and converted from JPG to PNG 
                            var command_2 = convertTenIn + imageDir + file_name + " " + imageDir + ImgName + ".png";
                            console.log(command_2);
                            shell.exec(command_2);
                            var w = Math.floor(W / 4)
                            var h = Math.floor(H / 4)
                            // blackimage is overlayed by uploaded image and centred on the display
                            scale = "convert" + " " + black_image + "black_1280x960.png" + " " + imageDir + ImgName + ".png" + " -geometry +" + w + h + "+ -composite " + imageDir + ImgName + ".png"
                            console.log(scale);
                            shell.exec(scale);
                            console.log('deleting files' + file_name);
                            fs.unlink(imageDir + file_name); // for deleting the files

                        } else {
                            // upon satisfining the condition, image is rotated and converted from JPG to PNG 
                            var command_3 = convertTenIn + imageDir + file_name + " " + imageDir + ImgName + ".png";
                            console.log(command_3);
                            shell.exec(command_3);
                            console.log('deleting files' + file_name);
                            fs.unlink(imageDir + file_name); // for deleting the files

                        }
                    } else if (extention == 'png') {

                        var nameImg = file_name
                        var command_4 = identify + " " + imageDir + nameImg
                        console.log(command_4);
                        var resloution = shell.exec(command_4);
                        console.log(resloution.split('x'));
                        var W = resloution.split('x')[0];
                        var H = resloution.split('x')[1];
                        console.log(W, H);
                        if (W < 1023 || H < 767) {
                            // upon satisfining the condition image is rotated if necesary and resized to W/4xH/4
                            var command_5 = convertTenIn + imageDir + nameImg + " " + imageDir + nameImg;
                            console.log(command_5);
                            shell.exec(command_5);
                            var w = Math.floor(W / 4)
                            var h = Math.floor(H / 4)
                            // resized image is overlayed on top of black image and centers are alinged with W/4xH/4
                            scale = "convert" + " " + black_image + "black_1280x960.png" + " " + imageDir + nameImg + " -geometry +" + w + "+" + h + " -composite " + imageDir + nameImg
                            console.log(scale);
                            shell.exec(scale);
                        } else {
                            // image is rotated if necesary and converted from JPG to PNG, resized to 1280x960
                            var command_6 = convertTenIn + imageDir + file_name + " " + imageDir + nameImg;
                            console.log(command_6);
                            shell.exec(command_6);

                        }
                    }
                } else if (currentDisplayType == '11.5in') {
                    // works when selected display is 11.5in
                    console.log(currentDisplayType)
                    // converting image to specific resolution
                    var convertElevenIn = "convert -quality 100% -rotate '-90<' -adaptive-resize '1380x96' "
                    // -90 anticlockwise '<' rotates if width is less than height


                    if (extention == 'jpg' || extention == 'jpeg') {
                        var ImgName = file_name.split('.jpg')[0] // spliting the file name
                        console.log(ImgName)
                        var command_1 = identify + " " + imageDir + file_name
                        console.log(command_1);

                        // executing the command on linux termnial using shell.exec(...)

                        var resloution = shell.exec(command_1);
                        console.log(resloution.split('x'));
                        var W = resloution.split('x')[0]; // parsing width of image
                        var H = resloution.split('x')[1]; // parsing height of image
                        console.log(W, H);
                        var w = 1380 / 2
                        var h = 0
                        if (W < 1320 || H < 80) {
                            // upon satisfining the condition, image is rotated and converted from JPG to PNG 
                            var command_2 = convertElevenIn + imageDir + file_name + " " + imageDir + ImgName + ".png";
                            console.log(command_2);
                            shell.exec(command_2);
                            // blackimage is overlayed by uploaded image and centred on the display
                            scale = "convert" + " " + black_image + "black_1380x96.png" + " " + imageDir + ImgName + ".png" + " -geometry +" + w + "+" + h + " -composite " + imageDir + ImgName + ".png"
                            console.log(scale);
                            shell.exec(scale);
                            console.log('deleting files' + file_name);
                            fs.unlink(imageDir + file_name); // for deleting the files

                        } else {
                            // upon satisfining the condition, image is rotated and converted from JPG to PNG 

                            var command_3 = convertElevenIn + imageDir + file_name + " " + imageDir + ImgName + ".png";
                            console.log(command_3);
                            shell.exec(command_3);
                            console.log('deleting files' + file_name);
                            fs.unlink(imageDir + file_name); // for deleting the files

                        }
                    } else if (extention == 'png') {

                        var nameImg = file_name
                        var command_4 = identify + " " + imageDir + nameImg
                        console.log(command_4);
                        var resloution = shell.exec(command_4);
                        console.log(resloution.split('x'));
                        var W = resloution.split('x')[0];
                        var H = resloution.split('x')[1];
                        console.log(W, H);
                        var w = 1380 / 2
                        var h = 0
                        if (W < 1320 || H < 80) {
                            // upon satisfining the condition image is rotated
                            var command_5 = convertElevenIn + imageDir + nameImg + " " + imageDir + nameImg;
                            console.log(command_5);
                            shell.exec(command_5);
                            // blackimage is overlayed by uploaded image and centred on the display
                            scale = "convert" + " " + black_image + "black_1380x96.png" + " " + imageDir + nameImg + " -geometry +" + w + "+" + h + " -composite " + imageDir + nameImg
                            console.log(scale);
                            shell.exec(scale);
                        } else {
                            // upon satisfining the condition, image is rotated 
                            var command_6 = convertElevenIn + imageDir + file_name + " " + imageDir + nameImg;
                            console.log(command_6);
                            shell.exec(command_6);

                        }
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
    var command = "epdc-app -update_image" + " " + imageDir + id
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
    var command = " epdc-app -start_epdc"
    console.log(command);

    if (true) {
        var child = exec(command, { async: false });
        child.stdout.on('data', function(data) {
            console.log(typeof(data), data)

            var error = _.includes(data, 'error')

            console.log(error)
            if (error == true) {
                console.log(error)
                current_WaveFile.push('Error_check_wavefile')


            } else {
                console.log('null')
                console.log(data.length)
                //regex expression for replacing space and newlines from the std-output(console)
                var splitData = data.match(/[^\s]+/g);
                //console.log(splitData, typeof(splitData), splitData.length)

                var waveIndex = _.findIndex(splitData, function(o) { return o == 'wflib:'; });
                var wavePath = splitData[waveIndex + 1]
                var waveNameArray = wavePath.split('/')
                var waveName = waveNameArray[waveNameArray.length - 1]
                current_WaveFile.push(waveName)

                var wave_command = " epdc-app -set_waveform" + " " + wavePath
                shell.exec(wave_command);

                console.log(wave_command);
            }
        })
    }

    res.setHeader("Content-Type", "text/html");
    res.redirect('/settings');
});


app.get("/detect_waveform", function(req, res) {
    console.log('received detect_waveform');
    var command = " epdc-app -start_epdc"
    console.log(command);
    if (true) {
        var child = exec(command, { async: false });
        child.stdout.on('data', function(data) {
            console.log(typeof(data), data)

            var error = _.includes(data, 'error')

            console.log(error)
            if (error == true) {
                console.log(error)
                current_WaveFile.push('Error_check_display')


            } else {
                console.log('null')
                console.log(data.length)



            }
        })
    }
    res.setHeader("Content-Type", "text/html");
    res.redirect('/settings');
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
    var command = "epdc-app -update_image " + " " + waveDir + id
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
    var wavelistdir = '/home/PL_web-app/waveform_modes/'
    fs.readFile(wavelistdir + 'waveform_modes.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            res.setHeader("Content-Type", "text/html");
            //console.log(data)
            obj = JSON.parse(data)
            var FullData = []
            Current_WFmode = current_WFmode[current_WFmode.length - 1]
            current_vcom = current_Vcom[current_Vcom.length - 1]
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
    var wave_command = " epdc-app -update_image /home/PL_web-app/src/bootstrap/01_eyes_1280x960.png" + " " + id
    shell.exec(wave_command);
    console.log('received waveId', id, wave_command);

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

    Vcom_value = req.body.vcom_number

    console.log('received set_Vcom', Vcom_value);
    current_Vcom.push(Vcom_value)

    var wave_command = " epdc-app -set_vcom " + " " + Vcom_value
    shell.exec(wave_command);
    console.log(wave_command);
    res.setHeader("Content-Type", "text/html");

    res.redirect('/settings');
});


app.get("/default_Vcom", function(req, res) {
    console.log('received default_Vcom');
    var command = " epdc-app -start_epdc"
    console.log(command);

    if (true) {
        var child = exec(command, { async: false });
        child.stdout.on('data', function(data) {
            console.log(typeof(data), data)

            var error = _.includes(data, 'error')

            console.log(error)
            if (error == true) {
                console.log(error)
                current_Vcom.push('Error_check_Vcom')


            } else {
                console.log('null')
                console.log(data.length)
                //regex expression for replacing space and newlines from the std-output(console)
                var splitData = data.match(/[^\s]+/g);
                //console.log(splitData, typeof(splitData), splitData.length)

                var VcomIndex = _.findIndex(splitData, function(o) { return o == 'vcom:'; });
                var vcomValue = splitData[VcomIndex + 1]
                current_Vcom.push(vcomValue)
                var vcom_command = " epdc-app -set_vcom" + " " + vcomValue
                shell.exec(vcom_command);

                console.log(vcom_command);
            }
        })
    }

    res.setHeader("Content-Type", "text/html");
    res.redirect('/settings');
});



app.get("/detect_Vcom", function(req, res) {
    console.log('received detect_Vcom');

    var wave_command = " epdc-app -start_epdc"
    shell.exec(wave_command);
    console.log(wave_command);

    current_Vcom.push()

    res.setHeader("Content-Type", "text/html");
    res.redirect('/settings');
});

/****************** Vcom End**************************/





/*
                        ******************Autodetect screen type Start**************************

Routes for handling Autodetect:
- Executes the Autodetect script
*/




app.get("/toAutoDetect", function(req, res) {
    console.log('received toAutoDetect');
    var wave_command = " epdc-app -------"
    //shell.exec(wave_command);
    console.log(wave_command);
    res.setHeader("Content-Type", "text/html");
    res.redirect('/display_type');
});

/******************Autodetect End**************************/





app.get("/sendCurrentDisplayType", function(req, res) {

    currentdisplayType = current_displayType[current_displayType.length - 1];
    console.log('received sendCurrentDisplayType', currentdisplayType);
    var FullData = []
    FullData.push({
        "currentdisplayType": currentdisplayType
    })
    console.log(FullData)
    res.send(FullData);
});




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
function getWaveFiles(waveDir, callback) {
    var fileType1 = '.wbf',
        files = [],
        i;
    fs.readdir(waveDir, function(err, list) {
        for (i = 0; i < list.length; i++) {
            if (path.extname(list[i]) === fileType1) {
                files.push(list[i]); //store the file name into the array files
            }
        }
        callback(err, files);
    });
}




function removeBlackFields(array) {
    return array.filter((item) => item != '');
}


// redirects page to upload_image.html
function redirectRouterUploadPage(req, res) {
    res.sendFile(__dirname + '/src/upload_image.html');
}