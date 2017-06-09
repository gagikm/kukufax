//Copyright 2013-2014 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//Licensed under the Apache License, Version 2.0 (the "License"). 
//You may not use this file except in compliance with the License. 
//A copy of the License is located at
//
//    http://aws.amazon.com/apache2.0/
//
//or in the "license" file accompanying this file. This file is distributed 
//on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
//either express or implied. See the License for the specific language 
//governing permissions and limitations under the License.

//Get modules.
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var AWS = require('aws-sdk');
var readChunk = require('read-chunk');
var fileType = require('file-type');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.locals.theme = process.env.THEME; //Make the THEME environment variable available to the app. 

//Read config values from a JSON file.
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);

//Create DynamoDB client and pass in region.
var docClient = new AWS.DynamoDB.DocumentClient({ region: config.AWS_REGION, credentials: {accessKeyId: config.AWS_ACCESS_KEY_ID, secretAccessKey: config.AWS_SECRET_ACCESS_KEY}});

// Create S3 service object
s3 = new AWS.S3({ apiVersion: '2006-03-01', accessKeyId: config.AWS_ACCESS_KEY_ID, secretAccessKey: config.AWS_SECRET_ACCESS_KEY});

//Create SNS client and pass in region.
var sns = new AWS.SNS({ region: config.AWS_REGION });

//GET home page.
app.get('/', routes.index);

app.get('/getPublicKukucodes', function(req, res) {
  var params = {
    TableName: "kukufiles",
    ProjectionExpression: "#kc, #pub, #yt",
    FilterExpression: "#pub = :true",
    ExpressionAttributeNames: {
        "#kc": "kukucode",
        "#pub": "public",
        "#yt": "youtubeVid"
    },
    ExpressionAttributeValues: {
         ":true": true
    }
  };

  console.log("Scanning kukufiles table.");
  docClient.scan(params, onScan);
  function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Scan succeeded.");
        res.send(data.Items);
        data.Items.forEach(function(item) {
           console.log(item.kukucode + " " + item.public + " " + item.youtubeVid);
        });

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}

});

//POST signup form.
app.post('/signup', function(req, res) {
  
  var file = req.files.uploadedFile;
  var kukucode = req.body.sendKukucode.toLowerCase();
  var fileExtension = path.extname(file.name);
  var newFileName = kukucode + fileExtension;
  if (req.body.sendPin) {
    newFileName = req.body.sendPin + newFileName;
  }

  var uploadParams = {Bucket: 's3-kukufiles', Key: newFileName, Body: '', ContentType: '' };

  var fileStream = fs.createReadStream(file.path);
    fileStream.on('error', function(err) {
    console.log('File Error', err);
  });

  uploadParams.Body = fileStream;

  const buffer = readChunk.sync(file.path, 0, 4100);

  var contentType = fileType(buffer);
  
  uploadParams.ContentType = contentType.mime;

  s3.upload (uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
      res.send("Error");
    } if (data) {
      console.log("Upload Success", data.Location);
      var kukucodeField = kukucode,
        pinField = req.body.sendPin,
        youtubeField = req.body.youtubeLink,
        bgImageField = req.body.bgLink,
        nameField = req.body.sendName,
        dateField = req.body.sendDate,
        locationField = req.body.sendLocation,
        fileNameField = newFileName,
        senderNameField = req.body.fromName,
        senderAddressField = req.body.fromAddress,
        senderLocationField = req.body.fromLocation;

      signup(kukucodeField, pinField, youtubeField, bgImageField, nameField, dateField, locationField, senderNameField, senderAddressField, senderLocationField, fileNameField, res);
    }
  });




});


//Add signup form data to database.
var signup = function (kukucodeSubmitted, pinSubmitted, youtubeLinkSubmitted, bgImageLinkSubmitted, RecipientLineOneSubmitted, RecipientLineTwoSubmitted, RecipientLineThreeSubmitted, SenderLineOneSubmitted, SenderLineTwoSubmitted, SenderLineThreeSubmitted, fileNameSubmitted, res) {

  var formData;

  formData = {
    TableName: config.STARTUP_SIGNUP_TABLE,
    Item: {
      kukucode: kukucodeSubmitted,
      name: RecipientLineOneSubmitted,
      senderName: SenderLineOneSubmitted,
      fileName: fileNameSubmitted
    }
  };
  
  if (SenderLineTwoSubmitted) {
    formData.Item['senderDateOrAddress'] = SenderLineTwoSubmitted;
  }
  if (SenderLineThreeSubmitted) {
    formData.Item['senderLocation'] = SenderLineThreeSubmitted;
  }
  if (RecipientLineTwoSubmitted) {
    formData.Item['date'] = RecipientLineTwoSubmitted;
  }
  if (RecipientLineThreeSubmitted) {
    formData.Item['location'] = RecipientLineThreeSubmitted;
  }
  if (pinSubmitted) {
    formData.Item['pin'] = pinSubmitted;
  }

  if (youtubeLinkSubmitted) {

    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = youtubeLinkSubmitted.match(regExp);
    var youtubeId;

    if (match && match[2].length == 11) {
      youtubeId = match[2];
      formData.Item['youtubeVid'] = youtubeId;
    } 
    
  }

  if (bgImageLinkSubmitted) {
    formData.Item['bgImageLink'] = bgImageLinkSubmitted;
  }

  console.log(formData);

  docClient.put(formData, function(err, data) {
    if (err) {
      console.log(formData);
      console.log('Error adding item to database: ', err);
      res.send(err.statusCode);
    } else {
      console.log('Form data added to database.');
      res.send(200); 
    }
  });
};

// Used by send side to verify unique kukucode
app.post('/verifyUniqueKukucode', function(req, res) {
  console.log(req.body);
  var params = {
    TableName : config.STARTUP_SIGNUP_TABLE,
    Key: {
      kukucode: req.body.sendKukucode.toLowerCase()
    }
  };

  docClient.get(params, function(err, data) {
    console.log(data);
    if (err) {
      console.log(err);
    } else {
      if (data.Item) {
        res.send("kukucodeTaken");
      } else {
        res.send(200);
      }
    }
  });
});


//POST retrieve letter.
app.post('/retrieve', function(req, res) {
  console.log(req.body);
  var codeProvided = (req.body.receiveKukucode != null ? req.body.receiveKukucode : req.body.sendKukucode);
  var params = {
    TableName : config.STARTUP_SIGNUP_TABLE,
    Key: {
      kukucode: codeProvided.toLowerCase()
    }
  };

  docClient.get(params, function(err, data) {
    console.log(data);
    if (err) {
      console.log(err);
    } else {
      if (!data.Item) {
        res.send("unassignedKukucode");
      } else if (data.Item && data.Item.pin && !req.body.receivePin) {
        res.send("pinProtected");
      } else if (data.Item && data.Item.pin && (data.Item.pin != req.body.receivePin)) {
        res.send("incorrectPin");
      } else if (!data.Item.pin || (data.Item.pin === req.body.receivePin)) {
        res.send(data);
      } 
    }
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
