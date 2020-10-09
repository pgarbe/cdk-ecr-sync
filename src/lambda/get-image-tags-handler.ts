// eslint-disable-next-line import/no-extraneous-dependencies
import { env } from 'process';
import { Stream, PassThrough } from 'stream';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from 'aws-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { Image } from '../image';
import { getDockerImageTags } from './docker-adapter';
import { getEcrImageTags } from './ecr-adapter';

export interface ContainerImage {
  tag: string;
  digest?: string;
}

export async function handler(): Promise<void> {

  const accountId = env.AWS_ACCOUNT_ID;
  const region = env.REGION;

  let buildTriggerFile: string = '';
  const images: Image[] = JSON.parse(env.IMAGES ?? '[]');

  await Promise.all(images.map(async (image: Image) => {
    // List all image tags in ECR
    const ecrImageTags = (await getEcrImageTags(image.imageName));
    console.debug(`ECR images for ${image.imageName}: \n${ecrImageTags.map(t => `${t.tag} (${t.digest})`).join('\n')}`);

    // List all image tags in Docker
    const dockerImageTags = await getDockerImageTags(image.imageName);
    console.debug(`Docker images for ${image.imageName}: ${dockerImageTags.map(t => `${t.tag} (${t.digest})`).join('\n')}`);

    let missingImageTags = await filterTags(dockerImageTags, ecrImageTags, image);

    missingImageTags.forEach(t => {
      buildTriggerFile += `${image.imageName},${accountId}.dkr.ecr.${region}.amazonaws.com/${image.imageName},${t.tag}\n`;
    });
  }));

  console.info(`Images to sync:\n${buildTriggerFile}`);

  if (buildTriggerFile === '') return;

  const stream = await zipToFileStream(buildTriggerFile);
  await uploadToS3(env.BUCKET_NAME!, 'images.zip', stream);
}

export async function filterTags(dockerImageTags: ContainerImage[], ecrImageTags: ContainerImage[], image: Image) {

  let missingImageTags: ContainerImage[] = dockerImageTags.filter(dockerImage => {
    return ecrImageTags.filter(ecrImage => ecrImage.tag === dockerImage.tag && ecrImage.digest === dockerImage.digest).length === 0;
  });

  return missingImageTags.filter(t => {

    // If nothing is defined allow all
    if (image.includeTags === undefined && image.excludeTags === undefined) {
      return true;
    }

    // Deny if tag matches `excludeTags`
    if (image.excludeTags !== undefined) {
      if (image.excludeTags.some(excludeTag => t.tag.match(excludeTag))) {
        return false;
      };
    }

    // Allow if tag matches `includeTags`
    if (image.includeTags !== undefined) {
      if (image.includeTags.some(includeTag => t.tag.match(includeTag))) {
        return true;
      }
    }

    // If only excludeTags is defined all others should be included
    if (image.includeTags === undefined && image.excludeTags !== undefined) {
      return true;
    }

    return false;
  });
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports,import/no-extraneous-dependencies
  var JSZip = require('jszip');
  var zip = new JSZip();

  zip.file('images.csv', content);

  const streamPassThrough = new Stream.PassThrough();
  await zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(streamPassThrough);

  return streamPassThrough;
}
