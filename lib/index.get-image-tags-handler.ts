import * as aws from 'aws-sdk';
import { env } from 'process';
import { ImageIdentifierList } from 'aws-sdk/clients/ecr';
import { Stream } from 'stream';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

const ecr = new aws.ECR();

export async function handler(): Promise<void> {

  const accountId = env['AWS_ACCOUNT_ID'];
  const region = env['REGION'];

  let buildTriggerFile: string = '';
  const images = env['IMAGES']?.split(',') ?? [];

  await Promise.all(images.map(async (image: string) => {
    // List all image tags in ECR
    const ecrImageTags = (await getEcrImageTags(image)).map(i => i.imageTag);
    console.log((ecrImageTags).join(','));

    // List all image tags in Docker
    const dockerImageTags = await getDockerImageTags(image);
    console.log(dockerImageTags.join(','));

    var missingImageTags: string[] = dockerImageTags.filter(item => ecrImageTags.indexOf(item) < 0);
    missingImageTags = missingImageTags.filter(x => !x.includes('latest'));

    missingImageTags.forEach(t => {
      buildTriggerFile += `${image},${accountId}.dkr.ecr.${region}.amazonaws.com/${image},${t}\n`;
    });
  }));

  console.log(`Uploading:\n${buildTriggerFile}`);

  var JSZip = require("jszip");
  var zip = new JSZip();

  zip.file("images.csv", buildTriggerFile);

  const streamPassThrough = new Stream.PassThrough();
  await zip.generateNodeStream({type:'nodebuffer',streamFiles:true}).pipe(streamPassThrough);

  let params: PutObjectRequest = {
      ACL: 'private',
      Body: streamPassThrough,
      Bucket: env['BUCKET_NAME']!,
      ContentType: 'application/zip',
      Key: 'images.zip',
      StorageClass: 'STANDARD_IA', // Or as appropriate
  };

  const s3 = new aws.S3();
  const s3Upload = s3.upload(params, (error: Error): void => {
    if (error) {
        console.error(`Got error creating stream to s3 ${error.name} ${error.message} ${error.stack}`);
        throw error;
    }
  });

  await s3Upload.promise();
}

async function getEcrImageTags(image: string): Promise<ImageIdentifierList> {
  const imageList = [] as ImageIdentifierList;

  ecr.listImages({ repositoryName: image}).eachPage((err, data) => {
    if (err) {
      throw err;
    }
    if (data && data.imageIds) {
      data.imageIds!.forEach( id => { imageList.push(id); });
    }
    return true;
  });

  return imageList;
}

function isTagsResult(_toBeDetermined: any): _toBeDetermined is tagsResult[] { return true; } 

async function getDockerImageTags(image: string): Promise<string[]> {

  const page_size = 50;
  const dockerHubAPI = require('docker-hub-api');
  const tags: any = await dockerHubAPI.tags('', image, { perPage: page_size });

  console.log(tags);

  if (isTagsResult(tags)) {
    return (tags as tagsResult[]).map(x => x.name);
  } else {
    return (tags as tagsResponse).results.map(x => x.name);
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

interface tagsResponse {
  count: number,
  next: string,
  results: tagsResult[]
}

interface tagsResult {
  name: string
}