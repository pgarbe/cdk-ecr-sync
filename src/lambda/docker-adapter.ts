import { request, RequestOptions } from 'https';
import { URL } from 'url';
import { ContainerImage } from './get-image-tags-handler';

export async function getDockerImageTags(
  image: string,
  excludeArmArch?: boolean,
  excludeAmdArch?: boolean,
): Promise<ContainerImage[]> {
  const pageSize = 100;

  if (!image.includes('/')) {
    image = 'library/' + image;
  }

  let url = new URL(
    `https://hub.docker.com/v2/repositories/${image}/tags?page_size=${pageSize}`,
  );

  let results: dockerTag[] = [];
  let response: dockerGetTagsResponse;

  do {
    response = (await performRequest({
      host: url.host,
      path: url.pathname + url.search,
      method: 'GET',
    })) as dockerGetTagsResponse;

    results.push(...response.results);

    if (response.next !== null) {
      url = new URL(response.next);
    }
  } while (response !== undefined && response.next !== null);

  // Return tags when there's at least one amd64/linux or arm64/linux image
  let amdLinuxresults = results.filter(
    (result) =>
      result.images.filter(
        (i) =>
          (i.architecture === 'amd64' || i.architecture.startsWith('arm64')) &&
          i.os === 'linux',
      ).length > 0,
  );

  return amdLinuxresults.flatMap((result) => {
    const taggedDigests: ContainerImage[] = [];
    if (!excludeAmdArch) {
      taggedDigests.push({
        tag: result.name,
        lastUpdated: result.last_updated,
        digest: getDigestForAmd64Linux(result),
      });
    }
    if (!excludeArmArch) {
      taggedDigests.push({
        tag: result.name,
        lastUpdated: result.last_updated,
        digest: getDigestForArm64Linux(result),
      });
    }
    return taggedDigests;
  });
}

function getDigestForAmd64Linux(result: dockerTag) {
  return result.images.filter(
    (i) => i.architecture === 'amd64' && i.os === 'linux',
  )[0]?.digest;
}
function getDigestForArm64Linux(result: dockerTag) {
  return result.images.filter(
    (i) => i.architecture.startsWith('arm64') && i.os === 'linux',
  )[0]?.digest;
}

interface dockerTagImage {
  architecture: string;
  os: string;
  digest: string;
}
interface dockerTag {
  name: string;
  last_updated: string;
  images: dockerTagImage[];
}
interface dockerGetTagsResponse {
  next: string;
  results: dockerTag[];
}

function performRequest(options: RequestOptions) {
  return new Promise((resolve, reject) => {
    request(options, function (response) {
      const { statusCode } = response;
      if (statusCode === undefined || statusCode >= 300) {
        reject(new Error(response.statusMessage));
      }
      const chunks: any[] = [];
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      response.on('end', () => {
        const result = Buffer.concat(chunks).toString();
        resolve(JSON.parse(result));
      });
    }).end();
  });
}
