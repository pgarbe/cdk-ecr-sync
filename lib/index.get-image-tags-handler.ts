import * as aws from 'aws-sdk';
import { env } from 'process';
import { ImageIdentifierList, ListImagesResponse } from 'aws-sdk/clients/ecr';
import { Stream, PassThrough } from 'stream';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { Request, AWSError } from 'aws-sdk';
import { Image } from './image';
import { request, RequestOptions } from 'https';
import { URL } from 'url';

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
      buildTriggerFile += `${image.imageName},${accountId}.dkr.ecr.${region}.amazonaws.com/${image.imageName},${t}\n`;
    });
  }));

  console.log(`Images to sync:\n${buildTriggerFile}`);

  if (buildTriggerFile === "") return;

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

export async function getDockerImageTags(image: string): Promise<string[]> {

  const pageSize = 100;
  let url = new URL(`https://hub.docker.com/v2/repositories/${image}/tags?page_size=${pageSize}`);

  let results: tagResult[] = [];
  let response: tagsResponse;

  do {
    response = await performRequest({
      host: url.host,
      path: url.pathname + url.search,
      method: 'GET',
    }) as tagsResponse;

    results.push(...response.results);

    if (response.next !== null) {
      url = new URL(response.next)
    }
  } while (response !== undefined && response.next !== null) 

  return results.map(x => x.name);
}

interface tagResult {
  name: string
}
interface tagsResponse {
  next: string
  results: tagResult[]
}

function performRequest(options: RequestOptions) {
  return new Promise((resolve, reject) => {
    request(
      options,
      function(response) {
        const { statusCode } = response;
        if (statusCode === undefined || statusCode >= 300) {
          reject(
            new Error(response.statusMessage)
          )
        }
        const chunks: any[] = [];
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        response.on('end', () => {
          const result = Buffer.concat(chunks).toString();
          resolve(JSON.parse(result));
        });
      }
    )
      .end();
  })
}