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
   * Should the "latest" tag also included? Keep in mind that "latest" is not a version!
   *
   * @default false
   */
  readonly includeLatest?: boolean;

  /**
   * A regular expression which tags should be included.
   *
   * If excludeTags is also defined, excludeTags wins.
   * 
   * @default Emtpy. All tags are included
   */
  readonly includeTags?: string;

  /**
   * A regular expression which tags should be included.
   * 
   * If includeTags is also defined, excludeTags wins.
   *
   * @default Empty. No tags are excluded
   */
  readonly excludeTags?: string;
}
