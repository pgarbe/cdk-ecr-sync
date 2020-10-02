// eslint-disable-next-line import/no-extraneous-dependencies
import * as aws from 'aws-sdk';
import { ContainerImage } from './get-image-tags-handler';

export async function getEcrImageTags(image: string): Promise<ContainerImage[]> {

  let hostedZoneList: ContainerImage[] = []

  return new Promise((resolve, _) => {
    const ecr = new aws.ECR();

    ecr.listImages({ repositoryName: image})
      .eachPage((_, data) => {
        if (data === null) {
          resolve(hostedZoneList)
          return false
        }

        const mapped: ContainerImage[] = data.imageIds!.map(x => { return { tag: x.imageTag!, digest: x.imageDigest! }});
        hostedZoneList = [...hostedZoneList,  ...mapped];

        return true
      })
  })
}
