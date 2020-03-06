"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const aws = require("aws-sdk");
const process = require("process");
const stream_1 = require("stream");

const ecr = new aws.ECR();

async function handler() {

    const accountId = process.env['AWS_ACCOUNT_ID'];
    const region = process.env['REGION'];
    let buildTriggerFile = '';

    const images = process.env['IMAGES'].split(',');

    await Promise.all(images.map(async (image) => {
        // List all image tags in ECR
        const ecrImageTags = (await getEcrImageTags(image)).map(i => i.imageTag);
        console.log((ecrImageTags).join(','));

        // List all image tags in Docker
        const dockerImageTags = await getDockerImageTags(image);
        console.log(dockerImageTags.join(','));

        var missingImageTags = dockerImageTags.filter(item => ecrImageTags.indexOf(item) < 0);
        missingImageTags = missingImageTags.filter(x => !x.includes('latest'));

        missingImageTags.forEach(t => {
            buildTriggerFile += `${image},${accountId}.dkr.ecr.${region}.amazonaws.com/${image},${t}\n`;
        });
    }));

    console.log(`Uploading:\n${buildTriggerFile}`);

    var JSZip = require("jszip");
    var zip = new JSZip();
    zip.file("images.csv", buildTriggerFile);

    const streamPassThrough = new stream_1.Stream.PassThrough();
    await zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(streamPassThrough);
    let params = {
        ACL: 'private',
        Body: streamPassThrough,
        Bucket: process_1.env['BUCKET_NAME'],
        ContentType: 'application/zip',
        Key: 'images.zip',
        StorageClass: 'STANDARD_IA',
    };

    const s3 = new aws.S3();
    const s3Upload = s3.upload(params, (error) => {
        if (error) {
            console.error(`Got error creating stream to s3 ${error.name} ${error.message} ${error.stack}`);
            throw error;
        }
    });
    await s3Upload.promise();
}

exports.handler = handler;

async function getEcrImageTags(image) {
    const imageList = [];
    ecr.listImages({ repositoryName: image }).eachPage((err, data) => {
        if (err) {
            throw err;
        }
        if (data && data.imageIds) {
            data.imageIds.forEach(id => { imageList.push(id); });
        }
        return true;
    });
    return imageList;
}

function isTagsResult(_toBeDetermined) { return true; }

async function getDockerImageTags(image) {

    const page_size = 50;
    const dockerHubAPI = require('docker-hub-api');
    const tags = await dockerHubAPI.tags('', image, { perPage: page_size });

    console.log(tags);
    if (tags.results) {
        return tags.results.map(x => x.name);
    }
    else {
        return tags.map(x => x.name);
    }
    // const total = tags.count;
    // let page = 1;
    // while (total > page * page_size)
    // {
    //   count: 511,
    //   next: 'https://hub.docker.com/v2/repositories/datadog/agent/tags?page=2&page_size=2',
    //   previous: null,
    //   results: [ [Object], [Object] ]
    // }
}
