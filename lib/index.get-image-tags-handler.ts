import * as aws from 'aws-sdk';
import { env } from 'process';
import { ImageIdentifierList, ListImagesResponse } from 'aws-sdk/clients/ecr';
import { Stream, PassThrough } from 'stream';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { Request, AWSError } from 'aws-sdk';
import { Image } from './image';

const ecr = new aws.ECR();

export async function handler(): Promise<void> {

  const accountId = env['AWS_ACCOUNT_ID'];
  const region = env['REGION'];

  let buildTriggerFile: string = '';
  const images: Image[] = JSON.parse(env['IMAGES'] ?? "[]");

  await Promise.all(images.map(async (image: Image) => {
    // List all image tags in ECR
    const ecrImageTags = (await getEcrImageTags(image.imageName)).map(i => i.imageTag);
    console.debug((ecrImageTags).join(','));

    // List all image tags in Docker
    const dockerImageTags = await getDockerImageTags(image.imageName);
    console.debug(dockerImageTags.join(','));

    let missingImageTags: string[] = dockerImageTags.filter(item => ecrImageTags.indexOf(item) < 0);
    if (!image.includeLatest) {
      missingImageTags = missingImageTags.filter(x => !x.includes('latest'));
    }

    missingImageTags.forEach(t => {
      buildTriggerFile += `${image},${accountId}.dkr.ecr.${region}.amazonaws.com/${image},${t}\n`;
    });
  }));

  console.log(`Uploading:\n${buildTriggerFile}`);

  const stream = await zipToFileStream(buildTriggerFile);

  await uploadToS3(env['BUCKET_NAME']!, 'images.zip', stream);
}

async function uploadToS3(bucket: string, key: string, stream: PassThrough) {

  let params: PutObjectRequest = {
    ACL: 'private',
    Body: stream,
    Bucket: bucket,
    ContentType: 'application/zip',
    Key: key,
    StorageClass: 'STANDARD_IA',
  };

  return new aws.S3().upload(params, (error: Error): void => {
    if (error) {
        console.error(`Got error creating stream to s3 ${error.name} ${error.message} ${error.stack}`);
        throw error;
    }
  }).promise();
}

async function zipToFileStream(content: string): Promise<PassThrough> {
  var JSZip = require("jszip");
  var zip = new JSZip();

  zip.file("images.csv", content);

  const streamPassThrough = new Stream.PassThrough();
  await zip.generateNodeStream({type:'nodebuffer',streamFiles:true}).pipe(streamPassThrough);

  return streamPassThrough;
}

async function getEcrImageTags(image: string): Promise<ImageIdentifierList> {

  const imageList = [] as ImageIdentifierList;
  await (ecr.listImages({ repositoryName: image})).on('success', function handlePage(response) {

    if (response.data === undefined) {
      return; // TODO: Not sure how to handle this...
    }
    response.data.imageIds!.forEach( id => {imageList.push(id); });

    if (response.hasNextPage()) {
      // tslint:disable-next-line: no-floating-promises
      (response.nextPage() as Request<ListImagesResponse, AWSError>).on('success', handlePage).promise();
    }
  }).promise();

  return imageList;
}

async function getDockerImageTags(image: string): Promise<string[]> {

  const page_size = 50;
  const dockerHubAPI = require('docker-hub-api');
  const tags: any = await dockerHubAPI.tags('', image, { perPage: page_size });

  console.debug(tags);

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

function isTagsResult(_toBeDetermined: any): _toBeDetermined is tagsResult[] { return true; } 

interface tagsResponse {
  count: number,
  next: string,
  results: tagsResult[]
}

interface tagsResult {
  name: string
}