require('dotenv').config()
const { EleventyServerless } = require("@11ty/eleventy");
const ConsoleLogger = require('@11ty/eleventy/src/Util/ConsoleLogger');

module.exports = function(configData) {
    let coreid = "";
    for (const property in configData.eleventy.serverless) {
        for (const p1 in configData.eleventy.serverless[property]) {
            coreid = configData.eleventy.serverless[property][p1];
        }
    }
    if (coreid == "") {
        return
    }
    coreid = coreid + '.json';
    console.log("getting ", coreid);


    var params = {Bucket: process.env.S3BUCKETNAME, Key: coreid};

    return downloadFile(params);
}

const downloadFile = (params) => {
    return new Promise((resolve, reject) => {
        var AWS = require('aws-sdk');

        var s3  = new AWS.S3({
                accessKeyId: process.env.S3ACCESSKEY ,
                secretAccessKey: process.env.S3SECRET ,
                endpoint: process.env.S3ENDPOINT ,
                signatureVersion: 'v4'
        });
        s3.getObject(params, function(err, data) {
            // Handle any error 
            if (err)
            {
                console.log(err);
                reject(err);
            }
            let objectData = data.Body.toString('utf-8'); // Use the encoding necessary
            let retVal = JSON.parse(objectData);
            console.log(retVal.id);
            resolve(retVal);
        });
    });
}