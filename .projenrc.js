const { AwsCdkConstructLibrary } = require('projen');

const project = new AwsCdkConstructLibrary({
  name: '@pgarbe/cdk-ecr-sync',
  description:
    'An CDK Construct to synchronizes Docker images from Docker Hub to ECR.',
  authorName: 'Philipp Garbe',
  authorUrl: 'https://garbe.io',
  repository: 'https://github.com/pgarbe/cdk-ecr-sync.git',
  keywords: ['cdk', 'ecr'],
  defaultReleaseBranch: 'main',

  releaseEveryCommit: false,

  catalog: {
    twitter: 'pgarbe',
  },

  // creates PRs for projen upgrades
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',

  cdkVersion: '1.92.0',
  cdkDependencies: [
    '@aws-cdk/aws-cloudformation',
    '@aws-cdk/aws-codebuild',
    '@aws-cdk/aws-codepipeline',
    '@aws-cdk/aws-codepipeline-actions',
    '@aws-cdk/aws-ecr',
    '@aws-cdk/aws-ecs',
    '@aws-cdk/aws-events',
    '@aws-cdk/aws-events-targets',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-nodejs',
    '@aws-cdk/aws-logs',
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-ssm',
    '@aws-cdk/core',
    '@aws-cdk/custom-resources',
  ],
  devDeps: ['esbuild', 'pre-commit'],
  deps: ['aws-sdk', 'jszip'],
  bundledDeps: ['aws-sdk', 'jszip'],

  // jsii publishing

  // java: {
  //   javaPackage: 'com.github.pgarbe.cdk-ecr-sync',
  //   mavenGroupId: 'com.github.pgarbe',
  //   mavenArtifactId: 'cdk-ecr-sync'
  // },
  // python: {
  //   distName: 'cdk-ecr-sync',
  //   module: 'cdk_ecr_sync'
  // }
});

project.gitignore.exclude('cdk.out');
project.npmignore.exclude('examples');
project.synth();
