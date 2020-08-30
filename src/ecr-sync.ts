import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr';
import * as evt from '@aws-cdk/aws-events';
import * as trgt from '@aws-cdk/aws-events-targets'
import * as iam from '@aws-cdk/aws-iam';
import * as cb from '@aws-cdk/aws-codebuild';
import * as cp from '@aws-cdk/aws-codepipeline';
import * as cpa from '@aws-cdk/aws-codepipeline-actions';
import * as s3 from '@aws-cdk/aws-s3';
import * as lnjs from '@aws-cdk/aws-lambda-nodejs';
import * as logs from '@aws-cdk/aws-logs';
import * as path from 'path';
// import * as fs from 'fs';
import { Image } from './image';

/**
 * Properties for EcrSync
 */
export interface EcrSyncProps {

  /**
   * Images from Docker Hub that should be pulled into ECR.
   *
   */
  readonly dockerImages: Image[];

  /**
   * An ECR lifecycle rule which is applied to all repositories.
   *
   * @default No lifecycle rules.
   */
  readonly lifcecyleRule?: ecr.LifecycleRule;

  /**
   * Optional. Schedule when images should be synchronized.
   *
   * @default is once a day.
   */
  readonly schedule?: evt.Schedule;
}

/**
 * Construct to sync Docker images from DockerHub into ECR Repos.
 */
export class EcrSync extends cdk.Construct {

  private ecrRepos: ecr.Repository[] = new Array;

  constructor(scope: cdk.Construct, id: string, props: EcrSyncProps) {
    super(scope, id);

    const artifactsBucket = new s3.Bucket(this, 'ArtifactBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
    });

    const buildRole = new iam.Role(this, 'buildRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });

    const isInstalledAsPackage = path.dirname(`${path.resolve(__dirname)}/..`) === 'node_modules';
    const entry = 'src/lambda/get-image-tags-handler' + (isInstalledAsPackage ? '.js' : '.ts');

    // const lambaFile = `${path.resolve(__dirname)}/lambda/get-image-tags-handler`;
    // const entry = lambaFile + (fs.existsSync(`${lambaFile}.ts`) ? '.ts' : '.js');
    console.log(entry);

    // const rel = path.relative(__dirname, entry);
    // console.log(rel);

    const lambda = new lnjs.NodejsFunction(this, 'lambda', {
      entry: entry,
      timeout: cdk.Duration.minutes(10),
      logRetention: logs.RetentionDays.ONE_WEEK,
      memorySize: 256,
      environment: {
        AWS_ACCOUNT_ID: cdk.Stack.of(this).account,
        REGION: cdk.Stack.of(this).region,
        IMAGES: JSON.stringify(props.dockerImages),
        BUCKET_NAME: artifactsBucket.bucketName,
      },
    });
    artifactsBucket.grantPut(lambda);

    new evt.Rule(this, 'ScheduleGetImageTags', {
      targets: [new trgt.LambdaFunction(lambda)],
      schedule: props.schedule ?? evt.Schedule.rate(cdk.Duration.days(1)),
    });

    props.dockerImages.forEach(element => {
      const repo = new ecr.Repository(this, element.imageName, {
        repositoryName: element.imageName,
      });
      repo.grantPullPush(buildRole);

      lambda.addToRolePolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ecr:ListImages'],
        resources: [repo.repositoryArn],
      }));

      if (props.lifcecyleRule !== undefined) {
        repo.addLifecycleRule(props.lifcecyleRule);
      }

      this.ecrRepos.push(repo);
    });

    // Get triggered by s3
    const triggerStageArtifact = new cp.Artifact();
    const triggerAction = new cpa.S3SourceAction({
      actionName: 'S3Source',
      bucket: artifactsBucket,
      bucketKey: 'images.zip',
      output: triggerStageArtifact,
    });

    const buildSpecBuild = new cb.PipelineProject(this, 'buildSpecBuild', {
      buildSpec: cb.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'runtime-versions': {
              docker: 18,
            },
            'commands':[
              'aws --version',
              'curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"',
              'unzip -q awscliv2.zip',
              './aws/install',
              'aws --version',
            ],
          },
          build: {
            commands:[
              ' set -e\n \
                while IFS=, read -r dockerImage ecrImage tag\n \
                do\n \
                  echo "$dockerImage:$tag"\n \
                  docker pull $dockerImage:$tag\n \
                  docker tag $dockerImage:$tag $ecrImage:$tag\n \
                  aws ecr get-login-password | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com\n \
                  docker push $ecrImage:$tag\n \
                done < images.csv\n',
            ],
          },
        },
      }),
      role: buildRole,
      // cache: cb.Cache.bucket(artifactsBucket, {prefix: 'cache/'}),
      environment: {
        privileged: true,
        buildImage: cb.LinuxBuildImage.AMAZON_LINUX_2,
        environmentVariables: {
          AWS_ACCOUNT_ID: { value: cdk.Stack.of(this).account },
        },
      },
    });

    const buildAction = new cpa.CodeBuildAction({
      actionName: 'Build',
      input: triggerStageArtifact,
      project: buildSpecBuild,
    });

    new cp.Pipeline(this, 'PullPushPipeline', {
      artifactBucket: artifactsBucket,
      stages: [
        { stageName: 'Trigger', actions: [triggerAction] },
        { stageName: 'PullPush', actions: [buildAction] },
      ],
    });
  }

  /**
   * Grant the given identity permissions to use the images in this repository
   */
  grantPull(grantee: iam.IGrantable) {
    this.ecrRepos.forEach(element => {
      element.grantPull(grantee);
    });
  }
}
