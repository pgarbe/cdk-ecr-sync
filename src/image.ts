import * as ecr from '@aws-cdk/aws-ecr';

/**
 * Properties of a EcrSync image.
 */
export interface Image {

  /**
   * The name of the image that should be proxied by ECR
   *
   */
  readonly imageName: string;

  /**
   * A list of regular expression which tags should be included.
   * Only one of the defined tags must match.
   *
   * If excludeTags is also defined, excludeTags wins.
   *
   * @default Emtpy. All tags are included
   */
  readonly includeTags?: string[];

  /**
   * A list of regular expression which tags should be included.
   * Only one of the defined tags must match.
   *
   * If includeTags is also defined, excludeTags wins.
   *
   * @default Empty. No tags are excluded
   */
  readonly excludeTags?: string[];

  /**
   * A list of lifecycle rules to apply to this
   * repository.
   *
   * If lifecycle rules are defined at the EcrSync
   * level, this wins.
   */
  readonly lifecycleRules?: ecr.LifecycleRule[];
}
