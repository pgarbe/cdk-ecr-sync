const { ConstructLibraryAws, Semver } = require('projen');

const LAST_AWSCDK_VERSION = '1.61.1';

const project = new ConstructLibraryAws({
  name: '@pgarbe/cdk-ecr-sync',
  description: 'An CDK Construct to synchronizes Docker images from Docker Hub to ECR.',
  jsiiVersion: Semver.caret('1.12.0'),
  projenVersion: Semver.pinned('0.3.47'),
  authorName: 'Philipp Garbe',
  authorUrl: 'https://garbe.io',
  repository: 'https://github.com/pgarbe/cdk-ecr-sync.git',
  keywords: [
    "cdk",
    "ecr"
  ],

  releaseEveryCommit: false,
  antitamper: false,

  catalog: {
    twitter: 'pgarbe'
  },

  // creates PRs for projen upgrades
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',

  cdkVersion: LAST_AWSCDK_VERSION,
  cdkDependencies: [
    "@aws-cdk/aws-cloudformation",
    "@aws-cdk/aws-codebuild",
    "@aws-cdk/aws-codepipeline",
    "@aws-cdk/aws-codepipeline-actions",
    "@aws-cdk/aws-ecr",
    "@aws-cdk/aws-ecs",
    "@aws-cdk/aws-events",
    "@aws-cdk/aws-events-targets",
    "@aws-cdk/aws-iam",
    "@aws-cdk/aws-lambda",
    "@aws-cdk/aws-lambda-nodejs",
    "@aws-cdk/aws-logs",
    "@aws-cdk/aws-s3",
    "@aws-cdk/aws-ssm",
    "@aws-cdk/core",
    "@aws-cdk/custom-resources",
  ],
  devDependencies: {
    'parcel': Semver.pinned('2.0.0-beta.1'),
    'pre-commit': Semver.caret('1.2.2')
  },
  dependencies: {
    "aws-sdk": Semver.caret("2.708.0"),
    'jszip': Semver.caret("3.5.0")
  },
  bundledDependencies: [
    'aws-sdk',
    'jszip'
  ]

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

project.jest.config.time
project.gitignore.exclude('.parcel-cache');
project.synth();
